# qa_app/urls.py
from django.urls import path
from .views import QASessionView # Import the new view

urlpatterns = [
    # Use .as_view() for class-based views
    path('query/', QASessionView.as_view(), name='qa_session'),
]