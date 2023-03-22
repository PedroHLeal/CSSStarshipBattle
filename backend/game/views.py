from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class StatusView(APIView):
    def get(self, request, format=None):
        return Response('Service seems to be up!')