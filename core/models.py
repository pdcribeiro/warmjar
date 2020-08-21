import re

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
    url = models.CharField(max_length=100, unique=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE, related_name='sites')

    class Meta:
        ordering = ['owner__username', 'url']

    def __str__(self):
        return self.url

    def get_visits(self):
        return Visit.objects.filter(page__site=self, previous=None)

    @staticmethod
    def parse_url(url):
        match = re.search('(https?://)?(www.)?([^/]+)/', url)
        return match and match.group(3)


class Page(models.Model):
    path = models.CharField(max_length=200, unique=True)
    site = models.ForeignKey(
        Site, on_delete=models.CASCADE, related_name='pages')

    class Meta:
        ordering = ['site', 'path']

    def __str__(self):
        return self.path

    @staticmethod
    def parse_path(url):
        match = re.search('(https?://)?(www.)?[^/]+/([^\?]+)\??', url)
        return match and match.group(3).rstrip('/')


class Visit(models.Model):
    started = models.DateTimeField(auto_now_add=True)
    page = models.ForeignKey(
        Page, on_delete=models.CASCADE, related_name='visits')
    previous = models.OneToOneField(
        'self', on_delete=models.CASCADE, null=True, related_name='next')

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
