
from django.urls import path
from .views import RecommendationView, SemanticSearchView ,RandomNewsView, ArticleTypeListView

urlpatterns = [
    # Example: /api/articles/1/recommend/
    path('articles/<int:article_id>/recommend/', RecommendationView.as_view(), name='article-recommendations'),
    path('search/', SemanticSearchView.as_view(), name='api_semantic_search'),
    path('news/random/', RandomNewsView.as_view(), name='random-news'),
    path('news/type/<str:article_type>/', ArticleTypeListView.as_view(), name='news-by-type'),
]
