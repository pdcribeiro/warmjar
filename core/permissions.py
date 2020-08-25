from rest_framework.permissions import IsAuthenticated


class ActionsOrIsAuthenticated(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method in ['POST', 'PATCH']:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return True
