from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_test_data(apps, schema_editor):
    User = apps.get_model(settings.AUTH_USER_MODEL)
    User.objects.create(username='admin', password=make_password('admin'),
                        is_staff=True, is_superuser=True)
    user = User.objects.create(username='user', password=make_password('user'))

    Site = apps.get_model('core', 'Site')
    Site.objects.create(url='127.0.0.1:8001', owner=user)


class Migration(migrations.Migration):
    dependencies = [('core', '0001_initial')]
    operations = [migrations.RunPython(create_test_data)]
