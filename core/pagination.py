import re

from rest_framework.pagination import CursorPagination


class ActionsPagination(CursorPagination):
    page_size = 100#0
    ordering = 'performed'

    def encode_cursor(self, cursor):
        url = super().encode_cursor(cursor)
        return re.search('cursor=(\w+)', url).group(1)
