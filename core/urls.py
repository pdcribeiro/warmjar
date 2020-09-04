from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'sites', views.SiteViewSet, basename='site')

urlpatterns = [
    path('auth/login/', views.Login.as_view(), name='login'),
    path('auth/', include('rest_framework.urls')),
    
    path('', include(router.urls)),
    path('pages/<int:pk>/', views.PageDetail.as_view(), name='page-detail'),
    path('visits/', views.VisitCreate.as_view(), name='visit-list'),
    path('visits/<int:pk>/', views.VisitDetail.as_view(), name='visit-detail'),
    path('visits/<int:visit_id>/actions/', views.ActionList.as_view(), name='action-list'),
]
