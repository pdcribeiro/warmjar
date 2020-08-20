from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import models

User = get_user_model()


class FieldsFilterMixin:
    def __init__(self, *args, exclude=[], fields=[], **kwargs):
        super().__init__(*args, **kwargs)
        fields_to_exclude = set(exclude)
        if fields:
            fields_to_exclude |= set(self.fields) - set(fields)
        for field in fields_to_exclude:
            self.fields.pop(field)


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Action
        fields = ['id', 'type', 'x', 'y', 'performed', 'visit']
        read_only_fields = ['id']


class VisitSerializer(FieldsFilterMixin, serializers.HyperlinkedModelSerializer):
    previous = serializers.HyperlinkedRelatedField(
        view_name='visit-detail', read_only=True)
    next = serializers.HyperlinkedRelatedField(
        view_name='visit-detail', read_only=True)

    class Meta:
        model = models.Visit
        fields = ['url', 'id', 'started', 'page', 'previous', 'next']
        read_only_fields = ['url', 'id', 'next']


class PageSerializer(FieldsFilterMixin, serializers.ModelSerializer):
    visits = VisitSerializer(many=True, fields=['id', 'started'])

    class Meta:
        model = models.Page
        fields = ['id', 'path', 'visits']
        read_only_fields = ['id', 'visits']


class SiteSerializer(FieldsFilterMixin, serializers.ModelSerializer):
    # owner = serializers.ReadOnlyField(source='owner.username')
    pages = PageSerializer(many=True, fields=['id', 'path'])
    visits = VisitSerializer(many=True, source='get_visits',
                             fields=['id', 'started'])

    class Meta:
        model = models.Site
        fields = ['id', 'url', 'pages', 'visits']
        read_only_fields = ['id', 'pages', 'visits']


class UserSerializer(serializers.ModelSerializer):
    sites = SiteSerializer(many=True, fields=['id', 'url'])

    class Meta:
        model = User
        fields = ['id', 'username', 'sites']
        read_only_fields = ['id', 'sites']
