
from django.urls import path, include
from .views import RecommendationView, SemanticSearchView ,RandomNewsView, ArticleTypeListView,ArticleDetailView

urlpatterns = [
    # Example: /api/articles/1/recommend/
    path('articles/<int:article_id>/recommend/', RecommendationView.as_view(), name='article-recommendations'),
    path('search/', SemanticSearchView.as_view(), name='api_semantic_search'),
    path('news/random/', RandomNewsView.as_view(), name='random-news'),
    path('news/type/<str:article_type>/', ArticleTypeListView.as_view(), name='news-by-type'),
    path('auth/', include('djoser.urls')),          # Djoser user management
    path('auth/', include('djoser.urls.authtoken')), # Djoser token endpoints
        path('news/<int:article_id>/', ArticleDetailView.as_view(), name='article-detail'),

]
