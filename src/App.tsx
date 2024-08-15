/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useWebHook } from "./hooks/webSocketHook";
import { Button } from "@nextui-org/react";
import Board from "./components/LudoBoard";
import Dice from "react-dice-roll";
import { DiceNum, Payload } from "./models/model";
import toast, { Toaster } from "react-hot-toast";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const END = "end";
export const PENDING = "pending";
function App() {
  type Status = "REQ" | "PEN" | "CON";
  const socket = useWebHook();
  const [connected, setConnected] = useState<Status>("REQ");
  const [diceRoll, setDiceRoll] = useState<DiceNum>(1);
  const [myPos, setMyPos] = useState<number>(0);
  const [opponentPos, setOpponentPos] = useState<number>(0);
  const [myMove, setMyMove] = useState<boolean>(false);
  const diceRef = useRef<any>(null);

  const makeMove = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: MOVE,
        })
      );
    }
  };
  const rollDie = async (dice: DiceNum) => {
    console.log("current dice", dice);
    setDiceRoll(dice);
    if (diceRef.current) {
      setTimeout(() => diceRef.current.rollDice(), 500);
    }
  };
  const handleMove = async (paylaod: Payload) => {
    if (paylaod.opponent === 100 || paylaod.yourPos === 100) {
      if (paylaod.yourPos === 100) {
        toast("You Won", {
          duration: 4000,
          position: "top-center",
          icon: "👏",
        });
      } else {
        toast("You Lost", {
          duration: 4000,
          position: "top-center",
        });
      }
      setTimeout(
        () =>
          socket?.send(
            JSON.stringify({
              type: END,
            })
          ),
        3000
      );
      return;
    }

    await rollDie(paylaod.diceRoll);
    await setTimeout(() => {
      setMyPos(paylaod.yourPos);
      setOpponentPos(paylaod.opponent);
    }, 1000);
  };
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === PENDING) {
        setConnected("PEN");
      }
      if (message.type === INIT_GAME) {
        setConnected("CON");
        setMyPos(0);
        setOpponentPos(0);
        if (message.payload.turn === true) {
          setMyMove(true);
        } else {
          setMyMove(false);
        }
      }
      if (message.type === MOVE) {
        setMyMove(message.payload.turn);
        handleMove(message.payload);
      }
    };
  }, [socket]);
  if (!socket) {
    return (
      <div className=" h-screen flex items-center justify-center w-full">
        Connecting...
      </div>
    );
  }
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Toaster />
      {connected === "REQ" && (
        <Button
          onClick={() =>
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            )
          }
        >
          Play Game
        </Button>
      )}
      {connected === "PEN" && (
        <div>Looking for Players to play game with....</div>
      )}
      {connected === "CON" && (
        <div className=" flex justify-between w-full px-20 items-center gap-4">
          <div className=" flex flex-col gap-12">
            <p>
              {myMove ? "Its your turn to roll the dice" : "Opponent's turn"}
            </p>
            <Button disabled={!myMove} onClick={() => makeMove()}>
              Click
            </Button>
            <Dice ref={diceRef} disabled size={100} cheatValue={diceRoll} />
          </div>
          <Board myPos={myPos} opponentPos={opponentPos} dice={diceRoll} />
        </div>
      )}
    </div>
  );
}

export default App;
