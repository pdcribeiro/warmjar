from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'sites', views.SiteViewSet)
router.register(r'pages', views.PageViewSet)

urlpatterns = [
    path('', views.index),
    path('', include(router.urls)),
    path('visits/', views.VisitList.as_view()),
    path('visits/<int:pk>/', views.VisitDelete.as_view(), name='visit-detail'),
    path('actions/', views.ActionList.as_view()),
]
