import React from "react";
import "../styles/Imessage.css";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function Imessage() {
  return (
    <div className="imessage">
      <Sidebar />
      <Chat />
    </div>
  );
}

export default Imessage;
