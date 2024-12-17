

import React from 'react'
import {  Routes, Route } from 'react-router-dom';
import { JoinCreateChat } from '../components/JoinCreateChat';
import ChatPage from '../components/chatPage';
 const AppRoutes = () => {
    
  return (
    <Routes>
    <Route path="/" element={<JoinCreateChat/>}/>
    <Route path="/chat" element={<ChatPage/>}/>
   </Routes>
  )
} 

export default AppRoutes
