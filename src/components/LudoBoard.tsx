import { Image } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Board1 from "../assets/Board1.png";
import { DiceNum } from "../models/model";

function Board({
  myPos,
  opponentPos,
  dice,
}: {
  myPos: number;
  opponentPos: number;
  dice: DiceNum;
}) {
  const [initialMy, setInitialMy] = useState<number>(0);
  const [initialOp, setInitialOp] = useState<number>(0);
  useEffect(() => {
    const makingMove = async (ini: number) => {
        setTimeout(() => setInitialMy(ini + dice),500)
      
      if (ini + dice !== myPos) {
        setTimeout(() => setInitialMy(myPos), 1000);
      }
    };
    if (initialMy !== myPos) {
      const ini = initialMy;
      makingMove(ini);
    }
  }, [myPos]);
  useEffect(() => {
    const makingMove = async (ini: number) => {
        setTimeout(() => {
            setInitialOp(ini + dice)
        }, 500);
      
      if (ini + dice !== opponentPos) {
        setTimeout(() => setInitialOp(opponentPos), 1000);
      }
    };
    if (initialOp !== opponentPos) {
      const ini = initialOp;
      makingMove(ini);
    }
  }, [opponentPos]);
  useEffect(() => {
    console.log("Positions",myPos,opponentPos,dice)
  },[myPos,opponentPos,dice])
  const posTOPix = (pos: number) => {
    if (pos === 0) {
      return { x: -25, y: 25 };
    } else {
      const y = Math.ceil(pos / 10);
      let x = pos % 10;
      if (x === 0) {
        x = 10;
      }
      if (y % 2 === 0) {
        x = 11 - x;
      }
      return { x: 25 + (x - 1) * 50, y: 25 + (y - 1) * 50 };
    }
  };
  return (
    <div className="relative">
      <Image
        className=" z-0"
        radius="none"
        src={Board1}
        height="500px"
        width="500px"
      />
      <div style={{
    left: initialMy === 0 ? '-25px' : `${posTOPix(initialMy).x}px`,
    bottom: `${posTOPix(initialMy).y}px`,transition: 'left 0.5s ease, bottom 0.5s ease',
  }}
        className={` z-20 rounded-full h-4 w-4 border border-divider bg-red-500  absolute transform -translate-x-1/2 translate-y-1/2  `}
      ></div>
      <div style={{
    left: initialOp === 0 ? '-25px' : `${posTOPix(initialOp).x}px`,
    bottom: `${posTOPix(initialOp).y}px`,transition: 'left 0.5s ease, bottom 0.5s ease',
  }}
        className={` z-10 rounded-full border border-divider bg-black h-4 w-4 transform -translate-x-1/3 translate-y-1/3 absolute   `}
      ></div>
    </div>
  );
}

export default Board;
