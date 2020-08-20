from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.generics import DestroyAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import Action, Page, Site, Visit
from .pagination import ActionsPagination
from .permissions import IsSiteOwner, POSTOrIsSiteOwner
from .serializers import (ActionSerializer, PageSerializer,
                          SiteSerializer, UserSerializer, VisitSerializer)

User = get_user_model()


@ensure_csrf_cookie
def index(request):
    if request.path == '/api/':
        return HttpResponse()
    return render(request, 'build/index.html')


class UserViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SiteViewSet(ModelViewSet):
    permission_classes = [IsSiteOwner]
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
    permission_classes = [IsSiteOwner]
    serializer_class = PageSerializer

    def get_queryset(self):
        return Page.objects.filter(site__owner=self.request.user)


class VisitDelete(DestroyAPIView):
    permission_classes = [IsSiteOwner]

    def get_queryset(self):
        return Visit.objects.filter(page__site__owner=self.request.user)


class ActionList(ListCreateAPIView):
    permission_classes = [POSTOrIsSiteOwner]
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    pagination_class = ActionsPagination

    def get_queryset(self):
        visit_id = self.request.query_params.get('visit')
        if visit_id is None:
            raise ParseError()

        return Action.objects.filter(visit=visit_id)

    def post(self, request):
        actions = ActionList.get_actions(request)

        serializer = ActionSerializer(data=actions, many=True)
        if not serializer.is_valid():
            raise ValidationError(serializer.errors[0:5])

        serializer.save()
        data = {'visit': actions[0]['visit']}
        return Response(data, status=status.HTTP_201_CREATED)

    @staticmethod
    def get_actions(request):
        actions = request.data.get('actions')
        if actions is None:
            raise ParseError()

        visit_id = actions[0].get('visit')
        if visit_id is not None:
            return actions

        url = request.data.get('url')
        if url is None:
            raise ParseError()

        page = ActionList.get_page(url)

        previous_id = request.data.get('previous')
        previous = previous_id and Visit.objects.get_or_none(id=previous_id)

        visit_id = Visit.objects.create(page=page, previous=previous).id
        return [{**a, 'visit': visit_id} for a in actions]

    @staticmethod
    def get_page(url):
        parsed_url = Page.parse_url(url)
        if parsed_url is None:
            raise ParseError()

        print(f"searching page '{parsed_url}'...")
        page = Page.objects.get_or_none(url=parsed_url)
        if page is not None:
            return page

        site_url = Site.parse_url(url)
        if site_url is None:
            raise ParseError()

        print(f"searching site '{site_url}'...")
        site = Site.objects.get_or_none(url=site_url)
        if site is None:
            raise ParseError()

        return Page.objects.create(url=parsed_url, site=site)
