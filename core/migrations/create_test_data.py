import sys

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_test_data(apps, schema_editor):
    if 'test' in sys.argv:
        return

    User = apps.get_model(settings.AUTH_USER_MODEL)
    admin = User.objects.create(username='admin', password=make_password('admin'),
                                is_staff=True, is_superuser=True)
    user = User.objects.create(username='user', password=make_password('user'))

    Site = apps.get_model('core', 'Site')
    Site.objects.create(url='locallibrary.ddns.net', owner=user)
    #Site.objects.create(url='127.0.0.1:8002', owner=admin)


class Migration(migrations.Migration):
    dependencies = [('core', '0001_initial')]
    operations = [migrations.RunPython(create_test_data)]
