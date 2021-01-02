import React from "react";
import "../styles/Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch((err) => {
      alert(err.message);
    });
  };

  return (
    <div className="login">
      <div className="login__logo">
        <img
          src="https://cnet4.cbsistatic.com/img/iorwesw7TaCroNY0vu75b7QrEkE=/770x578/2016/06/10/ef6ec391-50de-4434-b0bd-ebfe42900453/apple-imessage-icon.jpg"
          alt="img"
        />
        <h1>iMessage</h1>
      </div>
      <Button onClick={signIn}>Sign In</Button>
    </div>
  );
}

export default Login;
