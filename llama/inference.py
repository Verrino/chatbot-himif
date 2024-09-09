from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain.chains import RetrievalQA
from langchain import hub
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch

data_files = ['information.txt']
data = []

for data_file in data_files:
    with open(data_file, 'r') as file:
        data.extend(file.read().split('/n'))

vectorstore = Chroma.from_texts(texts=data, embedding=GPT4AllEmbeddings())

llm = ChatOllama(model="llama3.1")
prompt = hub.pull("rlm/rag-prompt")

qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": prompt}
)

app = Flask(__name__)

CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.json
        query = data.get('query').strip()

        with torch.no_grad():
            response = qa_chain({"query": query})

        return jsonify({'answer': response['result']})

    except:
        return jsonify({'answer': 'error'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)