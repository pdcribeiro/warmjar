from rest_framework import permissions

from .models import Action, Page, Site, Visit
# from .views import ActionList, PageViewSet, VisitList


class IsSiteOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        view_name = view.__class__.__name__

        if view_name == 'VisitList':
            page_id = request.query_params.get('page')
            if page_id is not None:
                page = Page.objects.get(id=page_id)
                return request.user == page.site.owner

        if view_name in ['PageViewSet', 'VisitList']:
            site_id = request.query_params.get('site')
            if site_id is not None:
                site = Site.objects.get(id=site_id)
                return request.user == site.owner

        if view_name == 'ActionList':
            visit_id = request.query_params.get('visit')
            if visit_id is not None:
                visit = Visit.objects.get(id=visit_id)
                return request.user == visit.page.site.owner

        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Site):
            return request.user == obj.owner

        if isinstance(obj, Page):
            return request.user == obj.site.owner

        if isinstance(obj, Visit):
            return request.user == obj.page.site.owner

        if isinstance(obj, Action):
            return request.user == obj.visit.page.site.owner

        return False


class POSTOrIsSiteOwner(IsSiteOwner):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return super().has_permission(request, view)
