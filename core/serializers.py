from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from rest_framework.exceptions import NotFound, ParseError, ValidationError

from .models import Action, Page, Site, Visit

User = get_user_model()


class FieldsFilterMixin:
    def __init__(self, *args, exclude=[], fields=[], **kwargs):
        super().__init__(*args, **kwargs)
        fields_to_exclude = set(exclude)
        if fields:
            fields_to_exclude |= set(self.fields) - set(fields)
        for field in fields_to_exclude:
            self.fields.pop(field)


# class UserFilteredPrimaryKeyRelatedField(PrimaryKeyRelatedField):
#     def get_queryset(self):
#         request = self.context.get('request', None)
#         queryset = super().get_queryset()
#         if not request or not queryset:
#             return None
#         return queryset.filter(user=request.user)


class ActionSerializer(ModelSerializer):
    class Meta:
        model = Action
        fields = ['id', 'type', 'x', 'y', 'performed']
        read_only_fields = ['id']


class VisitSerializer(FieldsFilterMixin, ModelSerializer):
    page = PrimaryKeyRelatedField(queryset=Page.objects.all(), required=False)
    previous = PrimaryKeyRelatedField(
        queryset=Visit.objects.all(), allow_null=True)  # TODO filter by same user as current visit
    next = PrimaryKeyRelatedField(read_only=True)
    actions = ActionSerializer(many=True)

    class Meta:
        model = Visit
        fields = ['id', 'started', 'page', 'previous', 'next', 'actions']
        read_only_fields = ['id', 'next']

    def create(self, validated_data):
        visit_data = {k: validated_data[k] for k in ['page', 'previous']}
        instance = Visit.objects.create(**visit_data)
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        actions = [Action(**data) for data in validated_data['actions']]
        instance.actions.add(*actions, bulk=False)
        return instance


class PageSerializer(FieldsFilterMixin, ModelSerializer):
    visits = VisitSerializer(many=True, fields=['id', 'started'])

    class Meta:
        model = Page
        fields = ['id', 'path', 'visits']
        read_only_fields = ['id', 'visits']


class SiteSerializer(FieldsFilterMixin, ModelSerializer):
    pages = PageSerializer(many=True, fields=['id', 'path'])
    visits = VisitSerializer(many=True, source='get_visits',
                             fields=['id', 'started'])

    class Meta:
        model = Site
        fields = ['id', 'url', 'pages', 'visits']
        read_only_fields = ['id', 'pages', 'visits']


class UserSerializer(ModelSerializer):
    sites = SiteSerializer(many=True, fields=['id', 'url'])

    class Meta:
        model = User
        fields = ['id', 'username', 'sites']
        read_only_fields = ['id', 'sites']
