// src/Chatbox.js
import React from "react";
import { marked } from "marked";
import styles from "./UserChat.module.css"; // Import CSS for styling

const UserChat = ({ message }) => {
  return (
    <div className={styles.userChat}>
      <div
        className={styles.userMessage}
        dangerouslySetInnerHTML={{ __html: marked(message) }}
      ></div>
    </div>
  );
};

export default UserChat;
