import React, { useEffect, useState} from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [room, setRoom] = useState("");
    const [showJoin, setshowJoin] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    const disconect = async (e) => {
        e.preventDefault();
        localStorage.clear(username);
        window.location.reload();
    }

    const joinRoom = (e) => {
        e.preventDefault();
        setshowJoin(true);
        if (username !== "" && room !== "") {
          const logData = {
            room: room,
            username: username,
          };
          socket.emit("join_room", logData);
          socket.emit("notif", {
            room: room,
            author: "server",
            message: `Welcome to ${username} to the room ${room}`,
            time:                     
              new Date(Date.now()).getHours() +
              ":" + 
              new Date(Date.now()).getMinutes(),
          });
        }
      }

    useEffect(() => {
        return () => {
            socket.on("receive", (data) => {
                console.log("receive", data);
                setMessageList((list) => [...list, data]);
            })
            socket.on("notif", (data) => {
                console.log("welcome ", data);
                setMessageList((list) => [...list, data]);
            })
        }
    }, [socket]);

    return (
    <div id='main'>
        <div id='head_chat' className='columns'>
            <h3>Join a chat or create one</h3>
            <form onSubmit={e => joinRoom(e)}>
            <input 
                type="text" 
                placeholder="Room id"
                onChange={(event) => {
                    setRoom(event.target.value);
                }}
            />
            <button type="submit">Join</button>
            </form>
            <button onClick={disconect}>disconnect</button>
        </div>
        <div id='body_chat' className='columns'>
            {showJoin ? (
            <form onSubmit={(e) => sendMessage(e)}>
                <div>
                    <h3>Welcome {username}!</h3>
                </div>
                <div id='message_box'>
                    <ScrollToBottom className='chat-room'>
                        {messageList.map((messageContent) => {
                            return (
                                <div
                                    className='message'
                                    // id=
                                >
                                    <div className='message-content'>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        <p id='author'>{messageContent.author}</p>
                                        <p id='time'>{messageContent.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </ScrollToBottom>
                </div>
                <div className='chat-footer'>
                    <input
                        type="text"
                        placeholder="Enter a msg..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                        className="chat_input"
                    />
                    <button>Send</button>
                </div>
            </form>
            ) : (<div></div>)}
        </div>
    </div>
    )
}

export default Chat