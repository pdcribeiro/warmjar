from rest_framework.parsers import JSONParser

class PlainTextJSONParser(JSONParser):
    media_type = 'text/plain'
