# qa_app/serializers.py
from rest_framework import serializers

class QuerySerializer(serializers.Serializer):
    """
    Serializer to validate the incoming question.
    """
    question = serializers.CharField(max_length=500, required=True)