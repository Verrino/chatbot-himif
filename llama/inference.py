from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
from langchain import hub
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.document_loaders import PyPDFLoader
import os
import logging

data_files = os.listdir('./documents')
data = []

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

for data_file in data_files:
    data_file = './documents/' + data_file
    if data_file.endswith('.pdf'):
        loader = PyPDFLoader(data_file)
        documents = loader.load()
        data.extend(documents)
    else:
        with open(data_file, 'r') as file:
            content = file.read()
            chunks = text_splitter.split_text(content)
            data.extend(chunks)

texts = []
for doc in data:
    if hasattr(doc, 'page_content'):
        texts.append(doc.page_content)
    else:
        texts.append(doc)

embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

vectorstore = FAISS.from_texts(texts=texts, embedding=embeddings)

llm = Ollama(model="llama3.2:3b")
prompt = hub.pull("rlm/rag-prompt")
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt}
)

app = Flask(__name__)

CORS(app)

logging.basicConfig(level=logging.ERROR)

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.json
        query = data.get('query').strip()

        response = qa_chain.invoke({"query": query})

        return jsonify({'answer': response['result']})

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({'answer': 'error'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)