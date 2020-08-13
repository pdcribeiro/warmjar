from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, status, viewsets
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAdminUser
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

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


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SiteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSiteOwner]
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

    def get_queryset(self):
        return self.request.user.sites.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSiteOwner]
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    def get_queryset(self):
        site_id = self.request.query_params.get('site')
        if site_id is not None:
            return Page.objects.filter(site=site_id)

        raise ParseError()


class VisitList(generics.ListAPIView):
    permission_classes = [IsSiteOwner]
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer

    def get_queryset(self):
        page_id = self.request.query_params.get('page')
        if page_id is not None:
            return Visit.objects.filter(page=page_id)

        site_id = self.request.query_params.get('site')
        if site_id is not None:
            return Visit.objects.filter(page__site=site_id, previous=None)

        raise ParseError()


class VisitDelete(generics.DestroyAPIView):
    permission_classes = [IsSiteOwner]
    pass


class ActionList(generics.ListAPIView):
    permission_classes = [POSTOrIsSiteOwner]
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    pagination_class = ActionsPagination

    def get_queryset(self):
        visit_id = self.request.query_params.get('visit')
        if visit_id is not None:
            return Action.objects.filter(visit=visit_id)

        raise ParseError()

    def post(self, request):
        actions = request.data.get('actions')
        if actions is None:
            raise ParseError()

        visit_id = actions[0].get('visit')
        if visit_id is None:
            page_url = request.data.get('url')
            if page_url is None:
                raise ParseError()

            page = Page.objects.get(page_url=page_url)
            prev_visit_id = request.data.get('previous')
            prev_visit = Visit.objects.get_or_none(id=prev_visit_id)
            visit_id = Visit.objects.create(page=page, previous=prev_visit).id
            actions = [{**a, 'visit': visit_id} for a in actions]

        serializer = ActionSerializer(data=actions, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'visit': visit_id}, status=status.HTTP_201_CREATED)

        raise ValidationError(serializer.errors[0])
