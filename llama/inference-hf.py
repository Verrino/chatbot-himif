from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader, TextLoader

# Inisialisasi model dan tokenizer
model_name = "meta-llama/Llama-3.2-1B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Fungsi untuk memuat dan memproses dokumen
def load_documents(directory_path):
    loader = DirectoryLoader(directory_path, glob="**/*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    texts = text_splitter.split_documents(documents)
    return texts

# Fungsi untuk membuat vectorstore
def create_vectorstore(texts):
    embeddings = HuggingFaceEmbeddings()
    vectorstore = FAISS.from_documents(texts, embeddings)
    return vectorstore

# Fungsi untuk generate response dengan RAG
def generate_rag_response(query, vectorstore, k=3):
    # Retrieve relevant documents
    relevant_docs = vectorstore.similarity_search(query, k=k)
    
    # Membuat prompt dengan konteks
    context = "\n".join([doc.page_content for doc in relevant_docs])
    rag_prompt = f"""Context: {context}\n\nQuestion: {query}\n\nAnswer:"""
    
    # Tokenisasi dan generate response
    inputs = tokenizer(rag_prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_length=512,
        temperature=0.7,
        num_return_sequences=1
    )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    documents_path = "./documents"
    
    # Load dan proses dokumen
    texts = load_documents(documents_path)
    vectorstore = create_vectorstore(texts)
    
    # Contoh query
    query = "Siapa ketua HIMIF?"
    response = generate_rag_response(query, vectorstore)
    print("Query:", query)
    print("Response:", response)