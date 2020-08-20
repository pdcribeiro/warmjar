import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Action, Page, Site, Visit

User = get_user_model()


def login(test_case, user):
    return test_case.client.post(
        '/api/auth/login/', {'username': user.username, 'password': 'password'})


class CoreTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user1 = User.objects.create_user(
            username='test_user_1', password='password')
        cls.user2 = User.objects.create_user(
            username='test_user_2', password='password')

        cls.site1 = Site.objects.create(name='site1', owner=cls.user1)
        cls.site2 = Site.objects.create(name='site2', owner=cls.user1)
        cls.site3 = Site.objects.create(name='site3', owner=cls.user2)

        cls.page1 = Page.objects.create(
            page_url='https://site1.com/page1/', site=cls.site1)
        cls.page2 = Page.objects.create(
            page_url='https://site1.com/page2/', site=cls.site1)
        cls.page3 = Page.objects.create(
            page_url='https://site2.com/page1/', site=cls.site2)

        cls.visit1 = Visit.objects.create(page=cls.page1)
        cls.visit2 = Visit.objects.create(page=cls.page2, previous=cls.visit1)
        cls.visit3 = Visit.objects.create(page=cls.page3)

        cls.action1 = Action.objects.create(
            type='mm', x=10, y=10, performed=100, visit=cls.visit1)
        cls.action2 = Action.objects.create(
            type='mm', x=20, y=10, performed=200, visit=cls.visit1)
        cls.action3 = Action.objects.create(
            type='mm', x=20, y=20, performed=300, visit=cls.visit1)
        cls.action4 = Action.objects.create(
            type='mm', x=10, y=10, performed=100, visit=cls.visit2)
        cls.action5 = Action.objects.create(
            type='mm', x=20, y=10, performed=100, visit=cls.visit2)
        cls.action6 = Action.objects.create(
            type='mm', x=20, y=20, performed=100, visit=cls.visit2)
        cls.action7 = Action.objects.create(
            type='mm', x=10, y=10, performed=100, visit=cls.visit3)

    def test_get_or_none_custom_manager_method(self):
        site1 = Site.objects.get(name='site1')
        site1_from_method = Site.objects.get_or_none(name='site1')
        self.assertEqual(site1, site1_from_method)
        
        site_not_found = Site.objects.get_or_none(name='site999')
        self.assertEqual(site_not_found, None)
    
    def test_get_site_list(self):
        response = self.client.get(reverse('site-list'))
        self.assertEqual(response.status_code, 403)
        
        response = login(self, self.user1)
        self.assertEqual(response.status_code, 302)
        
        response = self.client.get(reverse('site-list'))
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertEqual(content['count'], 2)

    def test_create_site(self):
        response = self.client.post(reverse('site-list'), {'name': 'new site'})
        self.assertEqual(response.status_code, 403)
        
        response = login(self, self.user1)
        response = self.client.post(reverse('site-list'), {'name': 'new site'})
        self.assertEqual(response.status_code, 201)
        
        response = self.client.get(reverse('site-list'))
        content = json.loads(response.content)
        self.assertEqual(content['count'], 3)

    def test_get_page_list(self):
        response = self.client.get(reverse('page-list'))
        self.assertEqual(response.status_code, 403)
        
        response = login(self, self.user1)
        self.assertEqual(response.status_code, 302)
        
        response = self.client.get(reverse('page-list'))
        self.assertEqual(response.status_code, 400)
        
        response = self.client.get(reverse('page-list') + '?site=1')
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertEqual(content['count'], 2)

    def test_create_page(self):
        response = self.client.post(reverse('site-list'), {'page_url': 'https://site1.com/page1/'})
        self.assertEqual(response.status_code, 403)
        
        response = login(self, self.user1)
        response = self.client.post(reverse('site-list'), {'name': 'new site'})
        self.assertEqual(response.status_code, 201)
        
        response = self.client.get(reverse('site-list'))
        content = json.loads(response.content)
        self.assertEqual(content['count'], 3)
        