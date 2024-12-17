
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import toast from 'react-hot-toast';
import { baseURL } from '../service/AxiosHelper';
import { getMessages } from '../service/RoomService';
import { timeAgo } from '../config/Helper';


 const ChatPage = () => {

    const UserDetails = useChatContext();
    
    const {roomId,currentUser,connected} = useChatContext();

    const[message , setMessage] = useState([]);
    const[input,setInput] = useState("");
    const inputRef = useRef(null);
    const chatBox = useRef(null);
    const [stompClient,setStopmClient] = useState("");



    const navigate = useNavigate();
    useEffect(()=>{
        if(!connected)
        navigate("/")
    },[roomId,connected,currentUser])

    useEffect(()=>{
        async function loadMessages() {
            if (!roomId) return;
            try{
                const messagesData = await getMessages(roomId);
                console.log(messagesData)
                setMessage(messagesData);
            } catch(error){
                console.log(error)
            }
            
        }

        loadMessages();
    },[roomId])

    useEffect(() => {
        if (chatBox.current) {
            chatBox.current.scroll({
                top: chatBox.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [message]);
    
    useEffect(()=>{
        const connectWebSocket = ()=>{
            const sock = new SockJS(`${baseURL}/chat`);
           
            const client = Stomp.over(sock);
            client.connect({},()=>{
            setStopmClient(client);
            toast.success("connected");
            client.subscribe( `/topic/room/${roomId}`,(message)=>{
                const newMessages = JSON.parse(message.body);
                setMessage((prev)=>[...prev,newMessages]);
            })
            });   
      }
      if(connected)
        connectWebSocket();
    },[roomId])

    const sendMessages = async()=>{
        console.log("started")

        if (stompClient && connected && input.trim()) {
            console.log(input);
           
           
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify({ sender : currentUser , content : input.trim(),roomId : roomId }));
            
            setInput(""); 
          } else {
            console.log("Connection not established or input is empty");
          }

    }

  return (
    <div className=''>
        {/* header */}
        <header className='dark:border-gray-700 border fixed w-full h-16 dark:bg-gray-900 py-5  shadow flex justify-around items-center'>
            <div > 
                <h1 className=' text-xl font-semibold'>
                    Room : <span>Family Room</span>
                </h1>
            </div>

            <div className="div">
            <h1 className=' text-xl font-semibold'>
            User : <span>{UserDetails.currentUser}</span>
                </h1>
            </div>

            <div className="div">
            <h1 className='dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full'>
            Leave Room 
                </h1>
                
            </div>
        </header>

        <main ref={chatBox} className='py-20 border w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto'>
           <div>
            {
                message.map((mess,index)=>(    
                    <div key={index} className={`flex ${mess.sender==currentUser?'justify-end' :'justify-start'} `}>
                    
                    <div  className={`my-2 px-10 ${mess.sender===currentUser ? 'bg-green-800' : 'bg-purple-800'} p-2 rounded-md max-w-sm`}>


                        <div className='flex flex-row'>
                            <img className='h-10 w-10 gap-20'  src="https://avatar.iran.liara.run/public/46"/>
                        <div className=' flex flex-col gap-1'>
                        <p className='text-sm font-bold'>
                            {mess.sender}
                        </p>
                        <p className='text-sm font-bold'>
                            {mess.content}
                        </p>
                        <p className='text-xs text-gray-800'>{timeAgo(mess.timeStamp)}</p>
                        </div>
                        </div>

                        </div>    

                    </div>            
                ))
                                    }
                                </div>
                                </main>

        {/* input messages */}

        <div className=' fixed bottom-2 w-full h-16 flex '>
            <div className=' h-full px-10 gap-2 flex items-center justify-between rounded w-2/3 mx-auto dark:border-gray-900'>
                <input type="text"
                value={input}

                onChange={(e)=>setInput(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                        sendMessages();
                    }
                }}
                 placeholder='type here ' 
                 className="rounded-lg w-full dark:border-gray-700 dark:bg-gray-900 px-3 py-2 rounded h-full text-left focus:outline-none" />
                
                <button className='dark:bg-purple-600  h-10 w-10 rounded-full flex justify-center items-center '>
                    <MdAttachFile size={20}/>
                </button>

                <button onClick={sendMessages} className='dark:bg-green-600  h-10 w-10 rounded-full flex justify-center items-center '>
                    <MdSend size={20}/>
                </button>

            </div>
           
        </div>
        
    </div>
  )
}

export default ChatPage
