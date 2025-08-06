import numpy as np
import random
from rest_framework.pagination import PageNumberPagination # Import for pagination
import json
import os
from django.http import Http404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer
from sklearn.metrics.pairwise import cosine_similarity
# New import for Google's embedding model via LangChain
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# --- Load pre-computed data and model when the server starts ---
# This is more efficient than loading on every request.
try:
    # Define paths for the files
    embeddings_path = os.path.join(settings.BASE_DIR, 'news_embeddings.npy')
    
    # Load the entire embeddings matrix
    # IMPORTANT: This file MUST be generated using the same Google model.
    all_embeddings = np.load(embeddings_path)
    
    # --- Initialize the Google Generative AI Embeddings model ---
    # It will automatically use the GOOGLE_API_KEY from your environment/settings.
    google_api_key = getattr(settings, 'GOOGLE_API_KEY', None)
    # print(f"GOOGLE_API_KEY: {google_api_key}")  # Debugging line to check if the key is loaded
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY is not configured in Django settings.")
    
    # Initialize the embeddings model client
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=google_api_key)

    print("Successfully loaded pre-computed Google embeddings and GenAI model.")

except (FileNotFoundError, OSError):
    print("WARNING: Embeddings file 'news_embeddings.npy' not found.")
    print("Please run your processing script to generate embeddings using Google's model.")
    all_embeddings = None
    embeddings_model = None
except Exception as e:
    print(f"ERROR during initialization: {e}")
    all_embeddings = None
    embeddings_model = None

"""
just like semantic serch class endpoint it returns the same datatype the list of objects of top 6 articles.
you will show this list below the articles you are reading.
"""
class RecommendationView(APIView):
    """
    API view to get news recommendations for a given article ID.
    (This view remains unchanged as it relies solely on the pre-computed embeddings)
    """
    def get(self, request, article_id, format=None):
        if all_embeddings is None:
            return Response(
                {"error": "Recommendation model not loaded. Run the processing script."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        try:
            source_index = int(article_id)
            source_vector = all_embeddings[source_index].reshape(1, -1)
        except (ValueError, IndexError):
            raise Http404("Article not found or its ID is invalid.")

        similarity_scores = cosine_similarity(source_vector, all_embeddings)[0]
        top_indices = np.argsort(similarity_scores)[::-1]
        
        num_recommendations = 6
        recommended_ids = []
        for index in top_indices:
            if index == source_index:
                continue
            recommended_ids.append(int(index))
            if len(recommended_ids) >= num_recommendations - 1:
                break

        recommended_articles = Article.objects.filter(id__in=recommended_ids)
        ordered_articles = sorted(recommended_articles, key=lambda x: recommended_ids.index(x.id))
        serializer = ArticleSerializer(ordered_articles, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

"""
you take queary from you frontend search box and do the request as below example url.
it will return the list of objects of top 5 articles matching you queary.
[{'id': 1, 'title': 'Impact of AI on Jobs', 'subtitle': 'How AI is changing the job market', 'article_type': 'technology', 'content': 'AI is transforming industries...', 'summary': 'A brief overview of AI\'s impact on employment.'}, ...]
so on but 5 articles
"""
class SemanticSearchView(APIView):
    """
    API view for performing semantic search using Google Generative AI embeddings.
    Example URL: /api/search/?q=impact+of+ai+on+jobs
    """
    def get(self, request, format=None):
        if all_embeddings is None or embeddings_model is None:
            return Response(
                {"error": "Search model not loaded. Please generate embeddings with the Google model."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        query_text = request.query_params.get('q', None)
        if not query_text:
            return Response(
                {"error": "A search query is required. Use the 'q' parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Generate an Embedding for the Query using Google's Model ---
        print(f"Searching for: '{query_text}'")
        # The `embed_query` method returns a list of floats.
        query_vector_list = embeddings_model.embed_query(query_text)
        # Convert it to a NumPy array and reshape for cosine_similarity.
        query_vector = np.array(query_vector_list).reshape(1, -1)

        # --- Calculate Cosine Similarity ---
        similarity_scores = cosine_similarity(query_vector, all_embeddings)[0]

        # --- Find Top N Most Similar Articles ---
        num_results = 5
        top_indices = np.argsort(similarity_scores)[::-1][:num_results]
        result_ids = [int(idx) for idx in top_indices]

        # --- Fetch and Serialize the Resulting Articles ---
        result_articles = Article.objects.filter(id__in=result_ids)
        ordered_articles = sorted(result_articles, key=lambda x: result_ids.index(x.id))
        serializer = ArticleSerializer(ordered_articles, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
"""
Yes, your thinking is absolutely correct! That is the standard and most effective way to implement an "infinite scroll" feature on the frontend using React.

Here's a breakdown of why your approach is right:

State for Page (page): You correctly identified the need to keep track of the current page number. Starting at 1 is perfect.

State for Articles (articles): Storing the list of articles in state is essential. Your idea to append new articles to this list (setArticles(prevArticles => [...prevArticles, ...newlyFetchedArticles])) is the key to making the scroll feel infinite, rather than replacing the content on each fetch.

useEffect for Fetching: Using a useEffect hook that runs whenever the page state changes is the right way to trigger the API call to your backend.

Scroll Event Listener: You'll need to add an event listener that checks if the user has scrolled to or near the bottom of the page. When they do, you'll increment the page state, which in turn triggers the useEffect to fetch the next page of data.

The backend endpoint you selected, /api/news/type/<str:article_type>/, is designed perfectly for this frontend logic because it uses Django REST Framework's PageNumberPagination. Your frontend can simply request ?page=1, then ?page=2, and so on, to get the next set of 20 articles each time.
You are on the right track!
"""
class RandomNewsView(APIView):
    """
    API view to get a specified number of random news articles.
    Example URL: /api/news/random/?count=5
    """
    def get(self, request, format=None):
        try:
            # Get the 'count' from query params, default to 5 if not provided
            count = int(request.query_params.get('count', 5))
        except ValueError:
            return Response({"error": "Invalid 'count' parameter. Must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch all primary keys from the Article table for efficiency
        all_ids = list(Article.objects.values_list('id', flat=True))

        if not all_ids:
            return Response({"error": "No articles found in the database."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure we don't request more articles than exist
        count = min(count, len(all_ids))

        # Select random IDs from the list of all IDs
        random_ids = random.sample(all_ids, count)

        # Fetch the articles with the selected random IDs
        random_articles = Article.objects.filter(id__in=random_ids)

        serializer = ArticleSerializer(random_articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class to set the page size.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class ArticleTypeListView(APIView):
    """
    API view to list articles of a specific type with pagination (20 per page).
    Example URL: /api/news/type/technology/
    """
    pagination_class = StandardResultsSetPagination

    @property
    def paginator(self):
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def get(self, request, article_type, format=None):
        """
        Return a paginated list of articles filtered by their type.
        """
        # Filter articles by the type provided in the URL (case-insensitive)
        queryset = Article.objects.filter(article_type__iexact=article_type).order_by('-id')

        if not queryset.exists():
            return Response(
                {"detail": f"No articles found for type '{article_type}'."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Paginate the queryset
        page = self.paginator.paginate_queryset(queryset, request, view=self)
        if page is not None:
            serializer = ArticleSerializer(page, many=True)
            return self.paginator.get_paginated_response(serializer.data)

        serializer = ArticleSerializer(queryset, many=True)
        return Response(serializer.data)
