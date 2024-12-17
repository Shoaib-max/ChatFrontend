import React, { useState } from 'react'
import chatIcon from "../assets/speak.png"
import {  toast } from 'react-hot-toast';
import { createRoom as api, joinChatApi } from '../service/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';

export const JoinCreateChat = () => {
  const [detail,setDetail] = useState({
    "roomId" : "",
    "userName" : ""
  })

  const {roomId,setRoomId,userName,setCurrentUser,setConnected,connected} = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (event)=>{
    
    setDetail({
      ...detail,
      [event.target.name] : event.target.value
    });

  }

  const validateForm = ()=>{
    if(detail.roomId==="" || detail.userName===""){
      toast.error("invalid input")
      return false;
    }

    return true;
  }

  const joinChat = async()=>{
      if(validateForm()){
       try{
        const room = await joinChatApi(detail.roomId);
        toast.success("joined successfully");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat")
       } catch(error){
        if(error.status==400){
          toast.error(error.response.data)
        }
        toast.error("error in joining room " +error)
       }
      }
  }

  const createRoom = async ()=>{
    if(validateForm()){
      console.log(detail)
      // call apis
      try{
        const response = await api(detail.roomId);
        console.log(response);
        toast.success("room create successfully")
        //join the room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        joinChat();
        setConnected(true);
        navigate("/chat")
      }catch(error){
        console.log(error)
        if(error.status == 400){
          toast.error("Room Id already Exists")
        } else{
          toast.error("error while creating room")
        }
      }

    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>

        <div className='p-10 dark:border-gray-700 border w-full max-w-md rounded dark:bg-gray-900 shadow'>
        <div>
        <img  className='w-24 mx-auto' src ={chatIcon}/>
      </div>
            <h1 className='text-2xl font-semibold text-center'>Join Room or Create Room</h1>

          <div className=''>
        <label htmlFor='your name' className='block font-medium mb-2'>
           name 
           </label>
           <input 
           type='text'
           id='name'
           onChange={handleFormInputChange}
           value={detail.userName}
           name="userName"
           placeholder='Enter the name'
           className='w-full dark:bg-gray-600 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
           />
      </div>

      <div className=''>
        <label htmlFor='your name' className='block font-medium mb-2'>
           New Room Id 
           </label>
           <input 
           type='text'
           id='name'
           onChange={handleFormInputChange}
           value={detail.roomId}
            name="roomId"
           placeholder='Enter the RoomId'
           className='w-full dark:bg-gray-600 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
           />
      </div>

      {/* button */}

      <div className='flex items-center justify-center gap-5 mb-2 mt-4 px-2 py-3'>
        <button onClick={joinChat} className='px-2 py-3 dark:bg-blue-600 hover:dark:bg-blue-800 rounded-full'>
          Join Room
        </button>

        <button onClick={createRoom} className='px-2 py-3 dark:bg-orange-600 hover:dark:bg-orange-800 rounded-full'>
          Create Room
        </button>
      </div>

        </div>

     

    </div>
  )
}
