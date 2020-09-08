from django.urls import resolve
from rest_framework.permissions import IsAuthenticated


class ActionsOrIsAuthenticated(IsAuthenticated):
    def has_permission(self, request, view):
        url_name = resolve(request.path_info).url_name
        if url_name in ['visit-list', 'visit-detail'] and request.method == 'POST':
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return True
