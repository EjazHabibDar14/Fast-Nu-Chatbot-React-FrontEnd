import React, { useState } from 'react';
//import axios from 'axios';
import './Chatbox.css';
import Bot from './bot.JPG';
import ChatboxIcon from './chatbox-icon.svg';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [showChatBox, setShowChatBox] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: '',
    name: '',
  });

  const toggleChatBox = () => {
    if (!showChatBox) {
      // Check if ID and name are provided
      if (!userInfo.id || !userInfo.name) {
        const id = prompt('Please enter your ID:');
        const name = prompt('Please enter your name:');
        if (!id || !name) {
          return; // If ID or name is not provided, do nothing
        }
        setUserInfo({ id, name });
      }
    }
    setShowChatBox((prev) => !prev);
  };
  
  const onSendButton = async () => {
    const textField = document.querySelector('.chatbox__footer input');
    const text1 = textField.value;
    if (text1 === '') {
      return;
    }
    
    // Assuming you have user_id, name, and question available here
    const response = await fetch("http://localhost:8000/Chat_me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userInfo.id,
        name: userInfo.name,
        question: text1
      })
    });
  
    if (response.ok) {
      const data = await response.json();
      const answer = data.response;
  
      const newMessage = { name: userInfo.name, message: text1 };
      const newAnswer = { name: 'Bot', message: answer };
      setMessages((prevMessages) => [...prevMessages, newMessage, newAnswer]);
    } else {
      console.error("Error sending message:", response.status, response.statusText);
    }
  
    textField.value = '';
  };

  return (
    <div className="chatbox">
      <div className={`chatbox__support ${showChatBox ? 'chatbox--active' : ''}`}>
        {showChatBox ? (
          <>
             <div className="chatbox__header">
      <div className="chatbox__image--header">
        <button id="bttn">
          <img className="cmr" src={Bot} alt="Camera" width="70" height="65" />
        </button>
      </div>
      <div className="chatbox__content--header">
        <h4 className="chatbox__heading--header">FAST NU ChatBot</h4>
        <p className="chatbox__userinfo">
          Your ID: {userInfo.id}
          <br />
          Your Name: {userInfo.name}
        </p>
      </div>
    </div>
            <div className="chatbox__messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`messages__item ${
                    msg.name === userInfo.name ? 'messages__item--visitor' : 'messages__item--operator'
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="chatbox__footer">
              <input type="text" placeholder="Write a message..." />
              <button className="chatbox__send--footer send__button" onClick={onSendButton}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chatbox__intro">
            <p>Welcome! Please provide your ID and name to start the chat.</p>
            <input
              type="text"
              placeholder="Enter your ID"
              value={userInfo.id}
              onChange={(e) => setUserInfo({ ...userInfo, id: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter your name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <button onClick={toggleChatBox}>Start Chat</button>
          </div>
        )}
      </div>
      <div className="chatbox__button">
        <button onClick={toggleChatBox}>
          <img src={ChatboxIcon} alt="Chat Icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
