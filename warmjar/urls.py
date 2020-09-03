from django.contrib import admin
from django.urls import path, include

from core.views import Index

urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('api/', include('core.urls')),
    path('api/auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
]
