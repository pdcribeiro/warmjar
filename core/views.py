from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework import generics, mixins  # TMP
from rest_framework.exceptions import NotFound, ParseError, ValidationError
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Action, Page, Site, Visit
from .pagination import ActionsPagination
from .permissions import ActionsOrIsAuthenticated
from .serializers import (ActionSerializer, PageSerializer, SiteSerializer,
                          UserSerializer, VisitSerializer)

User = get_user_model()


@ensure_csrf_cookie
def index(request):
    """Provides frontend or CSRF token."""
    if request.path == '/api/':
        return HttpResponse()
    return render(request, 'build/index.html')


class UserViewSet(ReadOnlyModelViewSet):
    """Users read-only API."""
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SiteViewSet(ModelViewSet):
    """Sites read/write API."""
    serializer_class = SiteSerializer

    def get_queryset(self):
        return self.request.user.sites.all()

    def get_serializer(self, *args, **kwargs):
        """Provide only id and url on list view."""
        if self.action == 'list':
            kwargs['fields'] = ['id', 'url']
        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PageDetail(RetrieveUpdateDestroyAPIView):
    """Pages read/write API."""
    serializer_class = PageSerializer

    def get_queryset(self):
        return Page.objects.filter(site__owner=self.request.user)


class VisitCreate(CreateAPIView):
    """Creates a visit with actions."""
    permission_classes = [ActionsOrIsAuthenticated]
    serializer_class = VisitSerializer

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        response.data = {'visit': response.data['id']}
        return response

    def perform_create(self, serializer):
        url = self.request.data.get('url')
        if url is None:
            raise ParseError()

        page = VisitCreate.get_page(url)
        serializer.save(page=page)

    @staticmethod
    def get_page(url):
        """Retrieves or creates a page that matches url."""
        site_url = Site.parse_url(url)
        path = Page.parse_path(url)
        if None in [site_url, path]:
            raise ParseError()

        print(f"searching page '{site_url}/{path}'...")
        page = Page.objects.get_or_none(site__url=site_url, path=path)
        if page is not None:
            return page

        print(f"searching site '{site_url}'...")
        site = Site.objects.get_or_404(url=site_url)
        return Page.objects.create(path=path, site=site)


class VisitDetail(mixins.UpdateModelMixin, generics.DestroyAPIView):
    """Adds actions to or deletes a visit."""
    permission_classes = [ActionsOrIsAuthenticated]
    serializer_class = VisitSerializer

    def get_queryset(self):
        if self.request.method in ['POST', 'PATCH']:
            return Visit.objects.all()
        return Visit.objects.filter(page__site__owner=self.request.user)

    def patch(self, request, *args, **kwargs):
        response = self.partial_update(request, *args, **kwargs)
        response.data = {'visit': response.data['id']}
        return response


class ActionList(ListAPIView):
    """Lists actions related to a visit."""
    serializer_class = ActionSerializer
    pagination_class = ActionsPagination

    def get_queryset(self):
        return Action.objects.filter(
            visit=self.kwargs['visit_id'],
            visit__page__site__owner=self.request.user)
