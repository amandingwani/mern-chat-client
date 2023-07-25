import { useContext, useEffect, useState, useRef} from "react";
import _ from "lodash";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import axios from "axios";
import Contact from "./Contact";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMsgText, setNewMsgText] = useState('');
    const [messages, setMessages] = useState([]);
    const {id, username} = useContext(UserContext);
    const messagesBoxRef = useRef();

    useEffect(() => {
        connectToWs();
    }, []);

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            console.log('WS disconnected');
            setTimeout(() => {
                console.log('Trying to reconnect to ws');
                connectToWs();
            }, 1000);
        })
    }

    function showOnlinePeople(peopleArr) {
        const people = {};
        peopleArr.forEach(({userId, username}) => {
            if (userId !== id)
                people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(ev) {
        const msgData = JSON.parse(ev.data);
        if ('online' in msgData) {
            showOnlinePeople(msgData.online);
        }
        else if ('text' in msgData) {
            setMessages(prev => ([...prev, {...msgData}]));
        }
    }

    function sendMsg(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMsgText
        }));
        setMessages(prev => ([...prev, {
            _id: Date.now(),
            sender: id,
            recipient: selectedUserId,
            text: newMsgText
        }]));
        setNewMsgText('');
    }

    const messagesWithoutDupes = _.uniqBy(messages, "_id");

    useEffect(() => {
        messagesBoxRef.current?.lastElementChild?.scrollIntoView();
    }, [messagesWithoutDupes]);

    // set offline people as soon as online people are set
    useEffect(() => {
        axios.get('/people').then(res => {
            const allUsersArr = res.data;

            // offline people = all - online - ourself
            const onlinePeopleAndMe = {
                ...onlinePeople,
                [id]: username
            };

            const offlinePeopleArr = allUsersArr.filter(u => {
                let isUserOnline = false;
                Object.keys(onlinePeopleAndMe).forEach(key => {
                    if (key === u._id)
                        isUserOnline = true;
                });
                return !isUserOnline;
            });

            let offlinePeopleObjects = {}
            offlinePeopleArr.forEach(p => {
                offlinePeopleObjects[p._id] = p.username;
            });
            setOfflinePeople(offlinePeopleObjects);

        })
    }, [onlinePeople]);

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/' + selectedUserId)
                .then((res) => {
                    setMessages(res.data);
                });
        }
    }, [selectedUserId]);

    return(
        <div className="flex h-screen">
            <div className="bg-blue-50 w-1/3">
                <Logo />
                {/* making an array of divs using map */}
                {/* online people */}
                {Object.keys(onlinePeople).map(userId => (
                    <Contact userId={userId} 
                        onClick={() => setSelectedUserId(userId)}
                        isSelected={userId === selectedUserId}
                        username={onlinePeople[userId]}
                        online={true}
                    />
                ))}
                {/* offline people */}
                {Object.keys(offlinePeople).map(userId => (
                    <Contact userId={userId} 
                        onClick={() => setSelectedUserId(userId)}
                        isSelected={userId === selectedUserId}
                        username={offlinePeople[userId]}
                        online={false}
                    />
                ))}
            </div>
            <div className="bg-blue-100 w-2/3 flex flex-col p-2 gap-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-gray-400">MernChat: Send and receive messages</div>
                        </div>
                    )}
                    {selectedUserId && (
                        <div className="relative h-full">
                            <div ref={messagesBoxRef} className="absolute inset-0 overflow-auto">
                                {messagesWithoutDupes.map(m => (
                                    <div key={m._id} className={(m.sender === id ? 'text-right' : 'text-left')}>
                                        <div className={"inline-block text-left p-2 my-2 rounded-md text-sm " + (m.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMsg}>
                        <input type="text"
                                value={newMsgText}
                                onChange={ev => setNewMsgText(ev.target.value)}
                                placeholder="Message"
                                className="bg-white flex-grow border p-2 rounded-sm"
                        />
                        <button type='submit' className="bg-blue-500 p-2 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};