from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'sites', views.SiteViewSet, basename='site')

urlpatterns = [
    path('', views.index),
    path('', include(router.urls)),
    path('pages/<int:pk>/', views.PageDetail.as_view()),
    path('visits/', views.VisitCreate.as_view()),
    path('visits/<int:pk>/', views.VisitDetail.as_view()),
    path('visits/<int:visit_id>/actions/', views.ActionList.as_view()),
]
