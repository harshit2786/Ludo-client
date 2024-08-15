export type DiceNum = 1 | 2 | 3 | 4 | 5 | 6;
export interface Payload {
    turn : boolean;
    yourPos : number;
    opponent : number;
    diceRoll : DiceNum
}