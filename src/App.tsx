import { useEffect, useState } from "react";
import { useWebHook } from "./hooks/webSocketHook"
import { Button } from "@nextui-org/react";

export const INIT_GAME = "init_game";
export const MOVE = "move"
export const END = "end"
export const PENDING = "pending"
function App() {
  type Status = "REQ" | "PEN" | "CON"
  const socket = useWebHook();
  const [connected,setConnected] = useState<Status>("REQ")
  useEffect(() => {
    if(!socket){
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if(message.type === PENDING){
        setConnected("PEN");
      }
      if(message.type === INIT_GAME){
        setConnected("CON");
      }
    } 
  },[socket])
  if(!socket){
    return (<div className=" h-screen flex items-center justify-center w-full">Connecting...</div>)
  }
  return (
    <div className=" h-screen w-full flex items-center justify-center">
      {connected==="REQ" && <Button onClick={()=> socket.send(JSON.stringify({
        type : INIT_GAME
      }))}>Play Game</Button>}
      {connected==="PEN" && <div>Looking for Players to play game with....</div>}
    </div>
  )
}

export default App
