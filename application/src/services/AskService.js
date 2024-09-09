const AskService = {
  requestQueue: [],
  isProcessing: false,

  async askQuestion(question) {
    return new Promise((resolve, reject) => {
      // Add the request to the queue
      this.requestQueue.push({ question, resolve, reject });
      this.processQueue();
    });
  },

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    // Mark as processing
    this.isProcessing = true;

    // Get the next request from the queue
    const { question, resolve, reject } = this.requestQueue.shift();

    try {
      const content = {
        query: question,
      };

      const chatResponse = await fetch("http://192.168.31.40:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const chatData = await chatResponse.json();

      const message = chatData.answer;
      resolve(message || "Terjadi kesalahan dalam proses.");
    } catch (error) {
      reject(error.message);
    } finally {
      // Mark as not processing
      this.isProcessing = false;
      // Process the next request in the queue
      this.processQueue();
    }
  },
};

export default AskService;
