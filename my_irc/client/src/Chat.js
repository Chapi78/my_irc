import React, { useEffect, useState} from 'react';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    // const [messageList, setMessageList] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();
        console.log("coucou");
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).toTimeString(),
            };

            await socket.emit("send_message", messageData);
            // setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive", (data) => {

        })
    }, [socket]);

    return (
        <form onSubmit={(e) => sendMessage(e)}>
            <div className='chat-header'>
                <h3>Send</h3>
            </div>
            <div className='chat-body'></div>
            <div className='chat-footer'>
                <input 
                    type="text" 
                    placeholder="Enter a msg..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                />
                <button>Send</button>
            </div>
        </form>
    )
}

export default Chat