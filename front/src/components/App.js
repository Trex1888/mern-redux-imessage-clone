import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Imessage from "../components/Imessage";
import { login, logout, selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import Login from "./Login";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return (
    <div className="app">
      {user ? (
        <Imessage />
      ) : (
        <h2>
          <Login />{" "}
        </h2>
      )}
    </div>
  );
}

export default App;
