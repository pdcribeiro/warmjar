from rest_framework.pagination import CursorPagination


class ActionsPagination(CursorPagination):
    page_size = 1000
    ordering = 'performed'
