import { httpClient } from "./AxiosHelper"

export const createRoom = async(roomDetail)=>{

 const response = await httpClient.post(`/api/v1/rooms/CreateRoom`,roomDetail)
    return response.data;
}

export const joinChatApi = async(roomId)=>{
   const response =  await httpClient.get(`/api/v1/rooms/${roomId}`)
   return response.data;

}

export const getMessages = async(roomId)=>{
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages`);
    return  response.data;
}