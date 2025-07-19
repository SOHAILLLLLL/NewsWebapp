# myapp/views.py (Conceptual Example)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests as re
# from rest_framework.permissions import IsAuthenticated # If you want to protect the endpoint
globalapi="https://699cb87f3c97.ngrok-free.app/"
class ChatbotView(APIView):
    # permission_classes = [IsAuthenticated] # Uncomment if only authenticated users can use the chatbot

    def get(self, request, *args, **kwargs):
        # Get the 'message' query parameter from the request
        user_query = request.query_params.get('message', '')
        response = re.get(globalapi+"chatme?question="+user_query)
        return Response(
            {"query": user_query, "response": response},
            status=status.HTTP_200_OK
        )
