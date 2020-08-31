import json

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import NotFound, ParseError, ValidationError
from rest_framework.test import APITestCase

from core.models import Action, Page, Site, Visit
from core.serializers import VisitSerializer


User = get_user_model()


def create_test_data(cls):
    cls.user1 = User.objects.create_user(
        username='user1', password='password')
    cls.user2 = User.objects.create_user(
        username='user2', password='password')

    cls.site1 = Site.objects.create(url='site1.com', owner=cls.user1)
    cls.site2 = Site.objects.create(url='site2.com', owner=cls.user1)
    cls.site3 = Site.objects.create(url='site3.com', owner=cls.user2)

    cls.page1 = Page.objects.create(path='page1', site=cls.site1)
    cls.page2 = Page.objects.create(path='page1/subpage1', site=cls.site1)
    cls.page3 = Page.objects.create(path='page1', site=cls.site2)

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


def login(client, user):
    data = {'username': user.username, 'password': 'password'}
    response = client.post('/api/auth/login/', data, format='multipart')
    # client.get(reverse('csrf-token'))
    return response


class CoreTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        create_test_data(cls)

    def test_get_or_none_custom_manager_method(self):
        site1 = Site.objects.get(url='site1.com')
        site1_from_method = Site.objects.get_or_none(url='site1.com')
        self.assertEqual(site1, site1_from_method)

        site_not_found = Site.objects.get_or_none(url='site999.com')
        self.assertEqual(site_not_found, None)

    def test_get_or_404_custom_manager_method(self):
        site1 = Site.objects.get(url='site1.com')
        site1_from_method = Site.objects.get_or_404(url='site1.com')
        self.assertEqual(site1, site1_from_method)

        with self.assertRaisesMessage(NotFound, ''):
            Site.objects.get_or_404(url='site999.com')

    def test_site_parse_url_method(self):
        TEST_DATA = (
            ((
                'http://site.com',
                'https://site.com',
                'https://site.com/',
                'https://site.com/?f=foo',
                'https://site.com/?f=foo&bar=foobar',
                'http://site.com/api',
                'https://site.com/api',
                'https://site.com/api/',
                'https://site.com/api/?f=foo',
                'https://site.com/api/?f=foo&bar=foobar',
            ), 'site.com'),
        )
        for urls, site_url in TEST_DATA:
            for url in urls:
                self.assertEqual(Site.parse_url(url), site_url)

    def test_page_parse_path_method(self):
        TEST_DATA = (
            # ((
            #     'http://site.com',
            #     'https://site.com',
            #     'https://site.com/',
            #     'https://site.com/?f=foo',
            #     'https://site.com/?f=foo&bar=foobar',

            # ), ''),
            ((
                'http://site.com/api',
                'https://site.com/api',
                'https://site.com/api/',
                'https://site.com/api/?f=foo',
                'https://site.com/api/?f=foo&bar=foobar',
            ), 'api'),
        )
        for urls, page_path in TEST_DATA:
            for url in urls:
                self.assertEqual(Page.parse_path(url), page_path)

    def test_login(self):
        # TODO try login without csrf token

        response = login(self.client, self.user1)
        self.assertEqual(response.status_code, 302)

    def test_field_filter_mixin(self):
        pass

    def test_visit_serializer_create(self):
        pass

    def test_visit_serializer_update(self):
        pass


class AnonymousTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        create_test_data(cls)

    def test_get_site_list(self):
        api_url = reverse('site-list')
        response = self.client.get(api_url)
        self.assertEqual(response.status_code, 403)

    def test_create_site(self):
        api_url = reverse('site-list')
        response = self.client.post(api_url, SiteTests.NEW_DATA)
        self.assertEqual(response.status_code, 403)

    def test_get_site(self):
        api_url = reverse('site-detail', args=[self.site1.id])
        response = self.client.get(api_url)
        self.assertEqual(response.status_code, 403)

    def test_update_site(self):
        api_url = reverse('site-detail', args=[self.site1.id])
        response = self.client.put(api_url, SiteTests.NEW_DATA)
        self.assertEqual(response.status_code, 403)

    def test_partial_update_site(self):
        api_url = reverse('site-detail', args=[self.site1.id])
        response = self.client.patch(api_url, SiteTests.NEW_DATA)
        self.assertEqual(response.status_code, 403)

    def test_delete_site(self):
        api_url = reverse('site-detail', args=[self.site1.id])
        response = self.client.delete(api_url)
        self.assertEqual(response.status_code, 403)


class SiteTests(APITestCase):
    LIST_API_URL = reverse('site-list')
    DETAIL_API_URL = None
    NEW_DATA = {'url': 'newsite.com'}

    @classmethod
    def setUpTestData(cls):
        create_test_data(cls)

    def setUp(self):
        self.DETAIL_API_URL = reverse('site-detail', args=[self.site1.id])
        login(self.client, self.user1)

    def test_get_list(self):
        response = self.client.get(self.LIST_API_URL)
        self.assertEqual(response.status_code, 200)
        expected_count = self.user1.sites.count()
        self.assertEqual(response.data['count'], expected_count)
        # TODO test content

        # Confirm change after creating site.
        Site.objects.create(url='newsite.com', owner=self.user1)
        response = self.client.get(self.LIST_API_URL)
        self.assertEqual(response.data['count'], 3)

    def test_create(self):
        response = self.client.post(self.LIST_API_URL, self.NEW_DATA)
        self.assertEqual(response.status_code, 201)

        # Confirm site has been created.
        new_site_url = Site.objects.get(id=response.data['id']).url
        self.assertEqual(new_site_url, self.NEW_DATA['url'])

    def test_update_list_not_allowed(self):
        response = self.client.put(self.LIST_API_URL, self.NEW_DATA)
        expected_code = status.HTTP_405_METHOD_NOT_ALLOWED
        self.assertEqual(response.status_code, expected_code)

    def test_partial_update_list_not_allowed(self):
        response = self.client.patch(self.LIST_API_URL, self.NEW_DATA)
        expected_code = status.HTTP_405_METHOD_NOT_ALLOWED
        self.assertEqual(response.status_code, expected_code)

    def test_delete_list_not_allowed(self):
        response = self.client.delete(self.LIST_API_URL, self.NEW_DATA)
        expected_code = status.HTTP_405_METHOD_NOT_ALLOWED
        self.assertEqual(response.status_code, expected_code)

    def test_get(self):
        response = self.client.get(self.DETAIL_API_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['url'], self.site1.url)

    def test_update(self):
        response = self.client.put(self.DETAIL_API_URL, self.NEW_DATA)
        self.assertEqual(response.status_code, 200)

        # Confirm site has changed.
        new_url = Site.objects.get(id=self.site1.id).url
        self.assertEqual(new_url, self.NEW_DATA['url'])

    def test_partial_update(self):
        response = self.client.patch(self.DETAIL_API_URL, self.NEW_DATA)
        self.assertEqual(response.status_code, 200)

        # Confirm site has changed.
        new_url = Site.objects.get(id=self.site1.id).url
        self.assertEqual(new_url, self.NEW_DATA['url'])

    def test_delete(self):
        response = self.client.delete(self.DETAIL_API_URL)
        self.assertEqual(response.status_code, 204)

        # Confirm site has been deleted.
        with self.assertRaisesMessage(Site.DoesNotExist, ''):
            Site.objects.get(id=self.site1.id)


class PageTests(APITestCase):
    LIST_API_URL = '/api/pages/'
    DETAIL_API_URL = None
    NEW_DATA = {'path': 'newpage'}

    @classmethod
    def setUpTestData(cls):
        create_test_data(cls)

    def setUp(self):
        self.DETAIL_API_URL = reverse('page-detail', args=[self.page1.id])
        login(self.client, self.user1)

    def test_get_list_not_found(self):
        response = self.client.get(self.LIST_API_URL)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_not_found(self):
        response = self.client.post(self.LIST_API_URL)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_list_not_found(self):
        response = self.client.put(self.LIST_API_URL)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_list_not_found(self):
        response = self.client.patch(self.LIST_API_URL)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_list_not_found(self):
        response = self.client.delete(self.LIST_API_URL)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get(self):
        response = self.client.get(self.DETAIL_API_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['path'], self.page1.path)

    def test_update(self):
        response = self.client.put(self.DETAIL_API_URL, self.NEW_DATA)
        self.assertEqual(response.status_code, 200)

        # Confirm page has changed.
        new_path = Page.objects.get(id=self.page1.id).path
        self.assertEqual(new_path, self.NEW_DATA['path'])

    def test_partial_update(self):
        response = self.client.patch(self.DETAIL_API_URL, self.NEW_DATA)
        self.assertEqual(response.status_code, 200)

        # Confirm page has changed.
        new_path = Page.objects.get(id=self.page1.id).path
        self.assertEqual(new_path, self.NEW_DATA['path'])

    def test_delete(self):
        response = self.client.delete(self.DETAIL_API_URL)
        self.assertEqual(response.status_code, 204)

        # Confirm page has been deleted.
        with self.assertRaisesMessage(Page.DoesNotExist, ''):
            Page.objects.get(id=self.page1.id)
