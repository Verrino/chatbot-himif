const AskService = {
  async askQuestion(question) {
    try {
      const responseInformation = await fetch(
        "http://localhost:3001/api/information",
        {
          method: "GET",
        }
      );

      const data = await responseInformation.json();

      const assistantContent = data.information;

      const content = {
        messages: [
          {
            role: "assistant",
            content: assistantContent,
          },
          {
            role: "user",
            content: question,
          },
        ],
      };

      const chatResponse = await fetch(
        "http://localhost:1234/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        }
      );

      const chatData = await chatResponse.json();

      const message = chatData.choices[0].message.content;
      return message || message.length === 0
        ? message
        : "Terjadi kesalahan dalam proses.";
    } catch (error) {
      return error.message;
    }
  },
};

export default AskService;
