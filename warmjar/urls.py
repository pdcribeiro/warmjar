from django.contrib import admin
from django.urls import path, include

from core.views import Frontend

urlpatterns = [
    path('api/', include('core.urls')),
    path('admin/', admin.site.urls),
    path('', Frontend.as_view(), name='index'),
    path('<path:path>', Frontend.as_view()),
]
