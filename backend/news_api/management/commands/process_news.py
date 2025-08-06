import os
import numpy as np
from django.core.management.base import BaseCommand
from django.conf import settings
from news_api.models import Article  # Make sure to use your actual app name
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import time

class Command(BaseCommand):
    """
    Django management command to process all articles and generate embeddings
    using the Google Generative AI model.
    
    Saves the embeddings to 'news_embeddings.npy' in the project's base directory.
    
    How to run:
    python manage.py process_news
    """
    help = 'Generates and saves embeddings for all articles using Google GenAI model.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting the embedding generation process..."))

        # --- 1. Initialize the Google Embeddings Model ---
        try:
            google_api_key = getattr(settings, 'GOOGLE_API_KEY', None)
            if not google_api_key:
                self.stdout.write(self.style.ERROR("GOOGLE_API_KEY is not configured in Django settings."))
                return
            
            # Use the same model as in your views.py
            embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=google_api_key)
            self.stdout.write(self.style.SUCCESS("Successfully initialized Google Embeddings model."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to initialize model: {e}"))
            return

        # --- 2. Fetch All Articles from the Database ---
        articles = Article.objects.all()
        if not articles:
            self.stdout.write(self.style.WARNING("No articles found in the database."))
            return
            
        self.stdout.write(f"Found {len(articles)} articles to process.")

        # Create a list of texts to be embedded.
        # Here we combine the title and content for a richer embedding.
        documents_to_embed = [f"{article.title}: {article.content}" for article in articles]

        # --- 3. Generate Embeddings in Batches ---
        # Google's API has a limit on requests per minute. Processing in batches
        # with a small delay helps avoid hitting these limits.
        batch_size = 50  # You can adjust this based on your needs and API limits
        all_embeddings = []
        
        self.stdout.write(f"Generating embeddings in batches of {batch_size}...")

        for i in range(0, len(documents_to_embed), batch_size):
            batch = documents_to_embed[i:i + batch_size]
            try:
                # The 'embed_documents' method takes a list of texts
                batch_embeddings = embeddings_model.embed_documents(batch)
                all_embeddings.extend(batch_embeddings)
                
                # Progress indicator
                self.stdout.write(self.style.SUCCESS(f"Processed batch {i//batch_size + 1}/{(len(documents_to_embed) + batch_size - 1)//batch_size}..."))

                # A small delay to respect API rate limits
                time.sleep(1) 

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"An error occurred during batch {i//batch_size + 1}: {e}"))
                self.stdout.write(self.style.WARNING("Stopping the process. Please check the error."))
                return

        # --- 4. Save the Embeddings to a File ---
        # Convert the list of lists into a 2D NumPy array
        embeddings_array = np.array(all_embeddings)
        
        # Define the output path
        output_path = os.path.join(settings.BASE_DIR, 'news_embeddings.npy')
        
        # Save the array to the .npy file
        np.save(output_path, embeddings_array)

        self.stdout.write(self.style.SUCCESS("-" * 50))
        self.stdout.write(self.style.SUCCESS(f"Successfully generated and saved {len(all_embeddings)} embeddings."))
        self.stdout.write(self.style.SUCCESS(f"Embeddings shape: {embeddings_array.shape}"))
        self.stdout.write(self.style.SUCCESS(f"File saved to: {output_path}"))

