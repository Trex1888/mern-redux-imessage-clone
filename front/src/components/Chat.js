import React, { useEffect, useState } from "react";
import "../styles/Chat.css";
import Message from "../components/Message";
import { MicNone } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectChatId, selectChatName } from "../features/chatSlice";
import { selectUser } from "../features/userSlice";
import FlipMove from "react-flip-move";
import axios from "../axios";
import Pusher from "pusher-js";

const pusher = new Pusher("831e70f6b3faba550351", {
  cluster: "us2",
});

function Chat() {
  const [input, setInput] = useState("");
  const chatName = useSelector(selectChatName);
  const chatId = useSelector(selectChatId);
  const [messages, setMessages] = useState([]);
  const user = useSelector(selectUser);

  const getConversation = (chatId) => {
    if (chatId) {
      axios.get(`/get/conversation?id=${chatId}`).then((res) => {
        setMessages(res.data[0].conversation);
      });
    }
  };

  useEffect(() => {
    pusher.unsubscribe("messages");
    getConversation(chatId);

    const channel = pusher.subscribe("messages");
    channel.bind("newMessage", function (data) {
      getConversation(chatId);
    });
  }, [chatId]);

  const sendMessage = (e) => {
    e.preventDefault();

    axios.post(`new/message?id=${chatId}`, {
      message: input,
      timestamp: Date.now(),
      user: user,
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <h4>
          To: <span className="chat__name">{chatName}</span>
        </h4>
        <strong>Details</strong>
      </div>

      <div className="chat__messages">
        <FlipMove>
          {messages.map(({ user, _id, message, timestamp }) => (
            <Message
              key={_id}
              id={_id}
              sender={user}
              message={message}
              timestamp={timestamp}
            />
          ))}
        </FlipMove>
      </div>

      <div className="chat__input">
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage}>Send</button>
        </form>
        <IconButton>
          <MicNone />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
