import './App.css';
import io from "socket.io-client"
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3002");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  
  const register = (e) => {
    e.preventDefault();
    setShowChat(true);
    localStorage.setItem('username', username);
    socket.emit("newUser", { username: username, socket: socket.id })
  }

  return (
    <div className="App">
    {!showChat ? (
      <div id='login_box'>
        <div>
          <h3>Welcome to MyIrc, enter your username to begin chating</h3>
          <form onSubmit={e => register(e)}>
            <input
                type="text"
                placeholder="Enter username"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    ) : (
      <Chat socket={socket} username={username}/>
    )}
    </div>
  );
}

export default App;
