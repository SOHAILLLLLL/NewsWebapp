# Django News Recommendation API
#
# This single file contains a complete Django project to demonstrate
# a news recommendation API.
#
# PROJECT STRUCTURE:
# ------------------
# myproject/
# |- myproject/
# |   |- __init__.py
# |   |- settings.py  <-- (Included below)
# |   |- urls.py      <-- (Included below)
# |   |- wsgi.py
# |- news_api/
# |   |- __init__.py
# |   |- models.py      <-- (Included below)
# |   |- serializers.py <-- (Included below)
# |   |- views.py       <-- (Included below)
# |   |- urls.py        <-- (Included below)
# |   |- management/
# |   |   |- commands/
# |   |   |   |- process_news.py <-- (Included below)
# |- manage.py          <-- (Included below)
# |- db.sqlite3         (Will be created automatically)
# |- article_data.csv   (You need to create this)
# |- news_embeddings.npy(Will be created by the script)
# |- article_ids.json   (Will be created by the script)
#
# --- SETUP INSTRUCTIONS ---
#
# 1. Install Dependencies:
#    pip install django djangorestframework pandas torch sentence-transformers scikit-learn
#
# 2. Create Project and App folders:
#    django-admin startproject myproject
#    cd myproject
#    python manage.py startapp news_api
#
# 3. Create `article_data.csv`:
#    In the root `myproject` directory, create a CSV file named `article_data.csv`
#    with 'id', 'title', and 'content' columns.
#
#    Example `article_data.csv`:
#    id,title,content
#    1,"Global Markets Rally on Tech Sector News","The technology sector saw a significant surge today, leading to a widespread rally in global stock markets. Investors are optimistic about future growth."
#    2,"New Breakthrough in Renewable Energy Storage","Scientists have announced a new battery technology that could revolutionize how we store solar and wind power, making renewables more reliable."
#    3,"FC Barcelona Secures La Liga Title","With a stunning victory in their final match, FC Barcelona has been crowned the champion of Spain's top football league, La Liga."
#    4,"The Future of Artificial Intelligence in Healthcare","AI is poised to transform healthcare, from diagnosing diseases earlier to personalizing treatment plans for patients."
#    5,"Real Madrid Announces Major Summer Signing","Football giant Real Madrid has confirmed the transfer of a star striker, bolstering their squad for the upcoming season."
#    6,"Advancements in AI Chip Manufacturing","A leading tech company has unveiled a new generation of processors designed specifically for artificial intelligence tasks, promising a leap in performance."
#    7,"Understanding the Nuances of European Stock Fluctuations","European markets experienced volatility this week, driven by complex economic factors and policy changes from the central bank."
#    8,"How Green Tech is Powering a Sustainable Future","Innovations in green technology are paving the way for a cleaner planet, with new solutions for energy, waste, and transportation emerging daily."
#
# 4. Replace the generated files with the code provided below.
#
# 5. Run Migrations:
#    python manage.py makemigrations news_api
#    python manage.py migrate
#
# 6. Process News Data (This is the crucial step!):
#    This command will read your CSV, generate embeddings, and save them.
#    It might take a few minutes to download the ML model the first time.
#    python manage.py process_news
#
# 7. Run the Development Server:
#    python manage.py runserver
#
# 8. Test the API Endpoint:
#    Open your browser or a tool like Postman and go to:
#    http://127.0.0.1:8000/api/articles/1/recommend/
#
#    This should return articles similar to article with ID 1 (e.g., articles 7 and 6).
#
#    Try another one, like for the football article:
#    http://127.0.0.1:8000/api/articles/3/recommend/
#    This should recommend article 5.
#
#----------------------------------------------------------------

# === File: myproject/myproject/settings.py ===

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-dummy-key-for-demonstration'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 3rd Party Apps
    'rest_framework',
    # Local Apps
    'news_api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# === File: myproject/news_api/models.py ===

from django.db import models

class Article(models.Model):
    """Represents a news article in the database."""
    # We use the 'id' from the CSV as the primary key.
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return self.title


# === File: myproject/news_api/serializers.py ===

from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    """Serializer for the Article model."""
    class Meta:
        model = Article
        fields = ['id', 'title', 'content']


# === File: myproject/news_api/management/commands/process_news.py ===
# NOTE: Create the folders: news_api/management/commands/

import pandas as pd
import numpy as np
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from news_api.models import Article
from sentence_transformers import SentenceTransformer

# This is the core of the recommendation logic (offline part)
class Command(BaseCommand):
    help = 'Processes news articles from a CSV, generates embeddings, and saves them.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting news processing...")

        # --- 1. Load Data from CSV and Populate Database ---
        try:
            df = pd.read_csv('article_data.csv')
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR("Error: `article_data.csv` not found."))
            self.stdout.write(self.style.WARNING("Please create it in the project root directory."))
            return

        # Clear existing articles and add new ones
        Article.objects.all().delete()
        articles_to_create = [
            Article(id=row['id'], title=row['title'], content=row['content'])
            for index, row in df.iterrows()
        ]
        Article.objects.bulk_create(articles_to_create)
        self.stdout.write(self.style.SUCCESS(f"Successfully loaded {len(df)} articles into the database."))

        # --- 2. Generate Sentence Embeddings ---
        # We use a pre-trained model designed for semantic similarity.
        # The model will be downloaded on the first run.
        self.stdout.write("Loading SentenceTransformer model...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        self.stdout.write("Model loaded. Generating embeddings...")

        # We'll create embeddings based on the article content.
        # You could also use title or a combination of both.
        sentences = df['content'].tolist()
        embeddings = model.encode(sentences, show_progress_bar=True)
        self.stdout.write(self.style.SUCCESS("Embeddings generated successfully."))

        # --- 3. Save Embeddings and ID Mapping ---
        # Save the embeddings matrix to a file for fast loading.
        np.save('news_embeddings.npy', embeddings)
        self.stdout.write(self.style.SUCCESS("Embeddings saved to news_embeddings.npy"))

        # Save a mapping from our article IDs to the row index in the numpy array.
        article_ids = df['id'].tolist()
        id_to_index = {article_id: i for i, article_id in enumerate(article_ids)}
        with open('article_ids.json', 'w') as f:
            json.dump(id_to_index, f)
        self.stdout.write(self.style.SUCCESS("Article ID mapping saved to article_ids.json"))
        self.stdout.write(self.style.SUCCESS("Processing complete."))


# === File: myproject/news_api/views.py ===

import numpy as np
import json
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer
from sklearn.metrics.pairwise import cosine_similarity

# --- Load pre-computed data when the server starts ---
# This is more efficient than loading it on every request.
try:
    # Load the entire embeddings matrix
    all_embeddings = np.load('news_embeddings.npy')
    # Load the mapping from article_id to its index in the matrix
    with open('article_ids.json', 'r') as f:
        id_to_index = json.load(f)
    # Create a reverse mapping from index to article_id
    index_to_id = {i: article_id for article_id, i in id_to_index.items()}
    print("Successfully loaded pre-computed embeddings and ID maps.")
except FileNotFoundError:
    print("WARNING: Embeddings files not found. Please run 'python manage.py process_news'")
    all_embeddings = None
    id_to_index = None
    index_to_id = None


class RecommendationView(APIView):
    """
    API view to get news recommendations for a given article.
    """
    def get(self, request, article_id, format=None):
        # Check if the necessary files were loaded
        if all_embeddings is None:
            return Response(
                {"error": "Recommendation model not loaded. Run the processing script."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # --- 1. Find the vector for the source article ---
        try:
            # Convert article_id (from URL) to string to match JSON keys
            source_index = id_to_index[str(article_id)]
            source_vector = all_embeddings[source_index].reshape(1, -1)
        except (KeyError, IndexError):
            raise Http404("Article not found or not processed.")

        # --- 2. Calculate Cosine Similarity ---
        # Calculate the similarity between the source article and ALL other articles
        similarity_scores = cosine_similarity(source_vector, all_embeddings)[0]

        # --- 3. Find Top N Similar Articles ---
        # Get the indices of the articles sorted by similarity (highest first)
        # We use `argsort` which returns indices, and `[::-1]` to reverse the order
        top_indices = np.argsort(similarity_scores)[::-1]

        # Get the top 6 results (1 will be the article itself, so we get 5 others)
        num_recommendations = 6
        recommended_ids = []
        for index in top_indices:
            # Skip the source article itself
            if index == source_index:
                continue
            
            # Get the original article ID from the index
            recommended_ids.append(int(index_to_id[index]))

            if len(recommended_ids) >= num_recommendations - 1:
                break

        # --- 4. Fetch and Serialize the Articles ---
        recommended_articles = Article.objects.filter(id__in=recommended_ids)
        
        # Preserve the order from the similarity ranking
        ordered_articles = sorted(recommended_articles, key=lambda x: recommended_ids.index(x.id))
        
        serializer = ArticleSerializer(ordered_articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# === File: myproject/news_api/urls.py ===

from django.urls import path
from .views import RecommendationView

urlpatterns = [
    # Example: /api/articles/1/recommend/
    path('articles/<int:article_id>/recommend/', RecommendationView.as_view(), name='article-recommendations'),
]


# === File: myproject/myproject/urls.py ===

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('news_api.urls')),
]


# === File: myproject/manage.py ===
# This file is generated automatically by `django-admin startproject`.
# You can use the one that was created for you.
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()

