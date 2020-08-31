import os
import re
import sys

from datetime import datetime, timedelta
from django.core.management.base import BaseCommand, CommandError
from watchdog.events import RegexMatchingEventHandler
from watchdog.observers import Observer

PATH_REGEX = '.+\.(py|js|html|css|scss)$'
DEBOUNCE_TIME_SECS = 2
DEBOUNCE_TIMEDELTA = timedelta(seconds=DEBOUNCE_TIME_SECS)


class CustomEventHandler(RegexMatchingEventHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.last_event_src_path = ''
        self.last_event_time = datetime.now()
        CustomEventHandler.clear()
        CustomEventHandler.test()

    def on_any_event(self, event):
        path_matches = re.match(PATH_REGEX, event.src_path)
        different_src_path = event.src_path != self.last_event_src_path
        debounce_time_over = datetime.now() > self.last_event_time + DEBOUNCE_TIMEDELTA
        if path_matches and (different_src_path or debounce_time_over):
            CustomEventHandler.clear()
            print(f"Change detected in '{event.src_path}'.\nTesting...\n")
            CustomEventHandler.test()
            self.last_event_src_path = event.src_path
            self.last_event_time = datetime.now()

    @staticmethod
    def clear():
        os.system('clear')

    @staticmethod
    def test():
        os.system('./manage.py test core')


class Command(BaseCommand):
    help = 'Reruns core tests when project changes.'

    def handle(self, *args, **options):
        path = sys.argv[1] if len(sys.argv) > 2 else '.'
        event_handler = CustomEventHandler(regexes=[PATH_REGEX])
        observer = Observer()
        observer.schedule(event_handler, path, recursive=True)
        observer.start()
        try:
            while observer.isAlive():
                observer.join(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()
