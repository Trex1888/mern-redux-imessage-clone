import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import SidebarChat from "../components/SidebarChat";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import axios from "../axios";
import Pusher from "pusher-js";

const pusher = new Pusher("831e70f6b3faba550351", {
  cluster: "us2",
});

function Sidebar() {
  const user = useSelector(selectUser);
  const [chats, setChats] = useState([]);

  const getChats = () => {
    axios.get("/get/conversationList").then((res) => {
      setChats(res.data);
    });
  };

  useEffect(() => {
    getChats();

    const channel = pusher.subscribe("chats");
    channel.bind("newChat", function (data) {
      getChats();
    });
  }, []);

  const addChat = (e) => {
    e.preventDefault();

    const chatName = prompt("Please enter a chat name");
    const firstMsg = prompt("Please send a message");

    if (chatName && firstMsg) {
      let chatId = "";

      axios
        .post("/new/conversation", {
          chatName: chatName,
        })
        .then((res) => {
          chatId = res.data._id;
        })
        .then(() => {
          axios.post(`/new/message?id=${chatId}`, {
            message: firstMsg,
            timestamp: Date.now(),
            user: user,
          });
        });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar
          onClick={() => auth.signOut()}
          src={user.photo}
          className="sidebar__avatar"
        />
        <div className="sidebar__input">
          <SearchIcon />
          <input placeholder="Search" />
        </div>

        <IconButton
          onClick={addChat}
          variant="outlined"
          className="sidebar__chats"
        >
          <RateReviewOutlinedIcon />
        </IconButton>
      </div>

      <div className="sidebar__chats">
        {chats.map(({ id, name, timestamp }) => (
          <SidebarChat key={id} id={id} chatName={name} timestamp={timestamp} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
