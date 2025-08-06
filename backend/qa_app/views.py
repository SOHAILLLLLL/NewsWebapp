# qa_app/views.py
import nest_asyncio
nest_asyncio.apply()

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import QuerySerializer # Import the new serializer

# --- This entire RAG setup section remains unchanged ---
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

INDEX_PATH = settings.BASE_DIR / "faiss_index"
embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vectorstore = FAISS.load_local(
    INDEX_PATH,
    embedding_model,
    allow_dangerous_deserialization=True
)
retriever = vectorstore.as_retriever()
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
template = """
Answer the question based only on the following context:
{context}

Question: {question}

Answer:
"""
prompt = PromptTemplate.from_template(template)
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
# --- End of unchanged section ---


# --- DRF API View ---
class QASessionView(APIView):
    """
    An API endpoint that receives a question and returns a generated answer.
    """
    def post(self, request, *args, **kwargs):
        # 1. Validate the incoming data using the serializer
        serializer = QuerySerializer(data=request.data)
        if serializer.is_valid():
            question = serializer.validated_data['question']
            
            # 2. Invoke the RAG chain to get the answer
            answer = rag_chain.invoke(question)
            
            # 3. Return a JSON response
            response_data = {
                "question": question,
                "answer": answer
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Return validation errors if the data is bad
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)