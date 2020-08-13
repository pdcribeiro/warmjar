from django.conf import settings
from django.contrib.auth.hashers import make_password


def create(apps, schema_editor):
    User = apps.get_model(settings.AUTH_USER_MODEL)
    password = make_password('useruser')
    user1 = User.objects.create(username='user1', password=password)
    user2 = User.objects.create(username='user2', password=password)

    Site = apps.get_model('core', 'Site')
    site1 = Site.objects.create(name='Google', owner=user1)
    site2 = Site.objects.create(name='Youtube', owner=user1)
    site3 = Site.objects.create(name='Amazon', owner=user2)
    site4 = Site.objects.create(name='Local library', owner=user1)

    Page = apps.get_model('core', 'Page')
    page1 = Page.objects.create(page_url='https://google.com', site=site1)
    page2 = Page.objects.create(
        page_url='https://google.com?q=stuff', site=site1)
    page3 = Page.objects.create(page_url='https://youtube.com', site=site2)
    page4 = Page.objects.create(page_url='http://127.0.0.1:8001/catalog/', site=site4)

    Visit = apps.get_model('core', 'Visit')
    visit1 = Visit.objects.create(page=page1)
    visit2 = Visit.objects.create(page=page1, previous=visit1)
    visit3 = Visit.objects.create(page=page2)

    Action = apps.get_model('core', 'Action')
    action1 = Action.objects.create(type='mm', x=0, y=0, visit=visit1)
    action2 = Action.objects.create(type='mm', x=0, y=1, visit=visit1)
    action3 = Action.objects.create(type='md', x=1, y=0, visit=visit1)
    action4 = Action.objects.create(type='mu', x=1, y=1, visit=visit1)


# from core import test_data

        # migrations.RunPython(test_data.create),
