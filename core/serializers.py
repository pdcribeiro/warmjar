from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import models

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    sites = serializers.HyperlinkedRelatedField(
        many=True, view_name='site-detail', read_only=True)

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'sites']


class SiteSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    pages = serializers.HyperlinkedRelatedField(
        many=True, view_name='page-detail', read_only=True)

    class Meta:
        model = models.Site
        fields = ['url', 'id', 'name', 'owner', 'pages']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PageSerializer(serializers.HyperlinkedModelSerializer):
    # site = serializers.ReadOnlyField(source='site.name')
    visits = serializers.HyperlinkedRelatedField(
        many=True, view_name='visit-detail', read_only=True)

    class Meta:
        model = models.Page
        fields = ['url', 'id', 'page_url', 'site', 'visits']


class VisitSerializer(serializers.HyperlinkedModelSerializer):
    # page = serializers.ReadOnlyField(source='page.page_url')
    next = serializers.HyperlinkedRelatedField(
        view_name='visit-detail', read_only=True)
    previous = serializers.HyperlinkedRelatedField(
        view_name='visit-detail', read_only=True)

    class Meta:
        model = models.Visit
        fields = ['url', 'id', 'started', 'page', 'next', 'previous']


class ActionSerializer(serializers.ModelSerializer):
    # visit = serializers.ReadOnlyField(source='visit')

    class Meta:
        model = models.Action
        fields = ['type', 'x', 'y', 'performed', 'visit']
        read_only_fields = ['id']


''' TODO
* Make some fields read-only?
'''
