import React, { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import UserChat from "../Chatbox/UserChat";
import BotChat from "../Chatbox/BotChat";
import AskService from "../../services/AskService";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef(null);
  const endOfChatRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

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

      setIsProcessing(true);

      try {
        const responseData = await AskService.askQuestion(question);
        setChatHistory([
          ...newChatHistory,
          { type: "bot", text: responseData },
        ]);
      } catch (err) {
        setChatHistory([...newChatHistory, { type: "bot", text: err.message }]);
      }

      setIsProcessing(false);
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
          <div ref={endOfChatRef} />
        </div>
        <div className={styles.inputArea}>
          <textarea
            ref={textareaRef}
            className={styles.inputField}
            placeholder="Tanyakan seputar HIMIF"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
