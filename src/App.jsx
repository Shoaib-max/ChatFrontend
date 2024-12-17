import { useState } from 'react'
import toast from 'react-hot-toast'



function App() {

  return (
    <>
    <div >This is my main page </div>
    <button onClick={()=>{
      toast.success("successfully saved")
    }}>click me</button>

    </>
  )
}

export default App
