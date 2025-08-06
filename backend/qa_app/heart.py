from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
import json
try:
    df = pd.read_csv('news_navi.csv')
except FileNotFoundError:
  print("bro")

model = SentenceTransformer('all-MiniLM-L6-v2')

sentences = df['summary'].tolist()
embeddings = model.encode(sentences, show_progress_bar=True)

# --- 3. Save Embeddings and ID Mapping ---
# Save the embeddings matrix to a file for fast loading.
np.save('news_embeddings.npy', embeddings)

# Save a mapping from our article IDs to the row index in the numpy array.
article_ids = df['id'].tolist()
id_to_index = {article_id: i for i, article_id in enumerate(article_ids)}
print(id_to_index)
with open('article_ids.json', 'w') as f:
    json.dump(id_to_index, f)