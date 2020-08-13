from datetime import datetime
from django.conf import settings
from django.db import models


def get_or_none(self, **kwargs):
    try:
        return self.model.objects.get(**kwargs)
    except self.model.DoesNotExist:
        return None


models.Manager.get_or_none = get_or_none


class Site(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE, related_name='sites')

    class Meta:
        ordering = ['owner__username', 'name']

    def __str__(self):
        return self.name


class Page(models.Model):
    page_url = models.URLField(unique=True)
    site = models.ForeignKey(
        Site, on_delete=models.CASCADE, related_name='pages')

    class Meta:
        ordering = ['site', 'page_url']

    def __str__(self):
        return self.page_url


class Visit(models.Model):
    started = models.DateTimeField(auto_now_add=True)
    page = models.ForeignKey(
        Page, on_delete=models.CASCADE, related_name='visits')
    next = models.OneToOneField(
        'self', on_delete=models.CASCADE, null=True, related_name='previous')

    class Meta:
        ordering = ['page', '-started']

    def __str__(self):
        return f'{self.started}'


class Action(models.Model):
    TYPES = (
        ('mm', 'Mouse move'),
        ('md', 'Mouse down'),
        ('mu', 'Mouse up'),
        ('sc', 'Scroll'),
    )
    type = models.CharField(max_length=2, choices=TYPES)
    x = models.IntegerField(null=True)
    y = models.IntegerField()
    performed = models.IntegerField()
    visit = models.ForeignKey(
        Visit, on_delete=models.CASCADE, related_name='actions')

    class Meta:
        ordering = ['visit', '-performed']

    def __str__(self):
        return f'{self.get_type_display()} on {self.performed}'
