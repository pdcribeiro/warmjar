from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from rest_framework.exceptions import NotFound, ParseError, ValidationError

from .models import Action, Page, Site, Visit

User = get_user_model()


class FieldsFilterMixin:
    def __init__(self, *args, fields=None, exclude=None, **kwargs):
        super().__init__(*args, **kwargs)

        fields_to_exclude = set()
        if fields:
            fields_to_exclude |= set(self.fields) - set(fields)
        if exclude:
            fields_to_exclude |= set(exclude)

        for field in fields_to_exclude:
            self.fields.pop(field)


# class UserFilteredPrimaryKeyRelatedField(PrimaryKeyRelatedField):
#     def get_queryset(self):
#         request = self.context.get('request', None)
#         queryset = super().get_queryset()
#         if not request or not queryset:
#             return None
#         return queryset.filter(user=request.user)


class ActionSerializer(FieldsFilterMixin, ModelSerializer):
    class Meta:
        model = Action
        fields = ['id', 'type', 'x', 'y', 'performed']


class VisitSerializer(FieldsFilterMixin, ModelSerializer):
    page = PrimaryKeyRelatedField(
        queryset=Page.objects.all(), required=False)  # read_only=True instead?
    previous = PrimaryKeyRelatedField(
        queryset=Visit.objects.all(), allow_null=True, required=False)  # TODO filter by same user as current visit
    next = PrimaryKeyRelatedField(read_only=True)
    actions = ActionSerializer(many=True, required=False)

    class Meta:
        model = Visit
        fields = ['id', 'started', 'page', 'previous', 'next', 'actions']

    def update(self, instance, validated_data):
        actions = [Action(**data) for data in validated_data['actions']]
        instance.actions.add(*actions, bulk=False)
        return instance


class PageSerializer(FieldsFilterMixin, ModelSerializer):
    visits = VisitSerializer(
        many=True, fields=['id', 'started'], read_only=True)

    class Meta:
        model = Page
        fields = ['id', 'path', 'visits']


class SiteSerializer(FieldsFilterMixin, ModelSerializer):
    pages = PageSerializer(many=True, fields=['id', 'path'], read_only=True)
    visits = VisitSerializer(many=True, source='get_visits',
                             fields=['id', 'started'], read_only=True)

    class Meta:
        model = Site
        fields = ['id', 'url', 'pages', 'visits']


class UserSerializer(ModelSerializer):
    sites = SiteSerializer(many=True, fields=['id', 'url'], read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'sites']
