from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    """Serializer for the Article model."""
    class Meta:
        model = Article
        fields = ['id', 'title', 'content']

