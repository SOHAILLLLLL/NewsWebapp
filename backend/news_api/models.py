from django.db import models

class Article(models.Model):
    """Represents a news article in the database."""
    # We use the 'id' from the CSV as the primary key.
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    article_type = models.CharField(max_length=100,default='news')  # Default to 'news' if not specified
    subtitle = models.CharField(max_length=400)
    content = models.TextField()
    summary = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
