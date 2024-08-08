// FormRender.js
import React, { useState } from "react";
import AskService from "../services/AskService";

const FormRender = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const responseData = await AskService.askQuestion(question);
      setResponse(responseData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {/* <form onSubmit={handleSubmit}>
        <label>
          Ask a question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {response && <div>Response: {response}</div>}
      {error && <div>Error: {error}</div>} */}
    </div>
  );
};

export default FormRender;
