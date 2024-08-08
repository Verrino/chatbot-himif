// src/Chatbox.js
import React from "react";
import { marked } from "marked";
import styles from "./BotChat.module.css"; // Import CSS for styling

const UserChat = ({ message }) => {
  return (
    <div className={styles.botChat}>
      <div
        className={styles.botMessage}
        dangerouslySetInnerHTML={{ __html: marked(message) }}
      ></div>
    </div>
  );
};

export default UserChat;
