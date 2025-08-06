import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
chunk_texts = ["LangChain is a framework for developing applications powered by language models.",
               "FAISS is a library for efficient similarity search.",
               "You can save a FAISS index to disk.",
               "Loading the index avoids re-computing embeddings."]

embedding_model = OpenAIEmbeddings()
local_folder = "faiss_index" # The folder where the index will be saved

# --- CREATE AND SAVE THE VECTORSTORE (Run this once) ---
print("Creating and saving the vectorstore...")
# This is the line from your question
vectorstore = FAISS.from_texts(texts=chunk_texts, embedding=embedding_model)

# Save the vectorstore to a local folder 💾
vectorstore.save_local(local_folder)
print(f"Vectorstore saved to {local_folder}")


# --- LOAD THE VECTORSTORE FROM DISK (Use this in your application) ---
print("\nLoading the vectorstore from disk...")
# You must provide the same embedding model used to create the store
loaded_vectorstore = FAISS.load_local(local_folder, embedding_model, allow_dangerous_deserialization=True)
print("Vectorstore loaded successfully!")


# --- VERIFY IT WORKS ---
print("\nPerforming a similarity search with the loaded vectorstore...")
query = "What is FAISS?"
results = loaded_vectorstore.similarity_search(query)

print(f"Query: '{query}'")
print("Top result:", results[0].page_content)
