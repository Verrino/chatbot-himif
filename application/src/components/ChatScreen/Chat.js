import React, { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import UserChat from "../Chatbox/UserChat";
import BotChat from "../Chatbox/BotChat"; // New component to handle bot responses
import AskService from "../../services/AskService";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Combined state for both messages and responses
  const [isProcessing, setIsProcessing] = useState(false); // State to track bot processing
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      } else {
        event.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (message.trim()) {
      const newChatHistory = [...chatHistory, { type: "user", text: message }];
      setChatHistory(newChatHistory);
      const question = message;
      setMessage("");

      setIsProcessing(true); // Set processing state to true

      try {
        const responseData = await AskService.askQuestion(question);
        setChatHistory([
          ...newChatHistory,
          { type: "bot", text: responseData },
        ]);
      } catch (err) {
        setChatHistory([...newChatHistory, { type: "bot", text: err.message }]);
      }

      setIsProcessing(false); // Set processing state to false
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className={styles.background}>
      <div className={styles.chatBackground}>
        <div className={styles.botName}>
          <h1>Virtual Assistant HIMIF</h1>
        </div>
        <div className={styles.chatArea}>
          {chatHistory.map((msg, index) =>
            msg.type === "user" ? (
              <UserChat key={index} message={msg.text} />
            ) : (
              <BotChat key={index} message={msg.text} />
            )
          )}
        </div>
        <div className={styles.inputArea}>
          <textarea
            ref={textareaRef}
            className={styles.inputField}
            placeholder="Tanyakan seputar HIMIF"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isProcessing} // Disable textarea while processing
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
