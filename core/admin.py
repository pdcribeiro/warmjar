from django.contrib import admin

from .models import Action, Page, Site, Visit

admin.site.register(Action)
admin.site.register(Page)
admin.site.register(Site)
admin.site.register(Visit)
