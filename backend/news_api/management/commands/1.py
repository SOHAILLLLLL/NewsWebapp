import pandas as pd
import numpy as np
import json
from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import torch

# This is a popular, high-quality model for general-purpose sentence embeddings.
# It offers a good balance between performance and speed.
MODEL_NAME = 'all-MiniLM-L6-v2'

class Command(BaseCommand):
    """
    A Django management command to process a CSV file of news articles.
    It reads the articles, generates sentence embeddings for their content using
    a transformer model, and saves the results for fast lookup during
    recommendation requests.

    Outputs:
    - news_embeddings.npy: A NumPy array containing the vector embeddings.
    - article_ids.json: A JSON file mapping each article's original ID to its
                        row index in the embeddings array.
    """
    help = 'Generates sentence embeddings for news articles from a CSV file.'

    def add_arguments(self, parser):
        """
        Adds a command-line argument to accept the path to the CSV file.
        """
        parser.add_argument('csv_file', type=str, help='The path to the input CSV file containing news data.')

    def handle(self, *args, **options):
        """
        The main logic of the command.
        """
        csv_file_path = options['csv_file']
        self.stdout.write(self.style.SUCCESS(f"Starting news processing from: {csv_file_path}"))

        # --- 1. Load Data from CSV ---
        try:
            df = pd.read_csv(csv_file_path)
            # Basic validation to ensure the CSV has the necessary structure.
            # ADJUST 'id' and 'content' if your column names are different.
            if 'id' not in df.columns or 'content' not in df.columns:
                self.stderr.write(self.style.ERROR("Error: The CSV file must have 'id' and 'content' columns."))
                return
            
            # Drop rows with missing content as they cannot be processed.
            df.dropna(subset=['content'], inplace=True)
            # Fill any missing titles just in case, though they aren't used for embeddings.
            df['title'] = df['title'].fillna('No Title')

            self.stdout.write(f"Successfully loaded and validated {len(df)} articles from the CSV.")
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f"Error: The file was not found at the specified path: {csv_file_path}"))
            return
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An error occurred while reading the CSV: {e}"))
            return

        # --- 2. Load the Sentence Transformer Model ---
        self.stdout.write(f"Loading the sentence-transformer model: '{MODEL_NAME}'...")
        # Check for GPU availability for faster processing
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.stdout.write(f"Using device: {device.upper()}")
        
        try:
            model = SentenceTransformer(MODEL_NAME, device=device)
            self.stdout.write(self.style.SUCCESS("Model loaded successfully."))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Could not load the model. Ensure 'sentence-transformers' and 'torch' are installed. Error: {e}"))
            return

        # --- 3. Generate Embeddings ---
        # Get the list of text content to be encoded.
        corpus = df['content'].tolist()
        
        self.stdout.write("Generating embeddings for all articles. This may take a while depending on the dataset size and your hardware...")
        
        # The model's encode function is highly optimized for batch processing.
        # It will automatically use the GPU if available.
        all_embeddings = model.encode(corpus, show_progress_bar=True, convert_to_numpy=True)
        
        self.stdout.write(f"Embeddings generated. The final matrix has shape: {all_embeddings.shape}")

        # --- 4. Create the ID-to-Index Mapping ---
        # The order of IDs must exactly match the order of the 'corpus' list that was
        # fed to the model. We convert all IDs to strings to ensure they are valid JSON keys.
        article_ids = df['id'].astype(str).tolist()
        id_to_index = {article_id: i for i, article_id in enumerate(article_ids)}
        
        # --- 5. Save the Output Files ---
        output_embeddings_file = 'news_embeddings.npy'
        output_map_file = 'article_ids.json'

        try:
            self.stdout.write(f"Saving embeddings to '{output_embeddings_file}'...")
            np.save(output_embeddings_file, all_embeddings)

            self.stdout.write(f"Saving article ID map to '{output_map_file}'...")
            with open(output_map_file, 'w') as f:
                json.dump(id_to_index, f, indent=4)

            self.stdout.write(self.style.SUCCESS("\n🚀 Processing complete! The following files have been created:"))
            self.stdout.write(f"- {output_embeddings_file}")
            self.stdout.write(f"- {output_map_file}")
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An error occurred while saving the files: {e}"))

