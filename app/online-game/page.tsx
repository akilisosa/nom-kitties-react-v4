'use client';
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import QuickStart from "../components/QuickStart";
import GameList from "./components/GameList";
import { Schema } from "@/amplify/data/resource";
import { roomService } from "../services/roomService";
import { useRouter } from "next/navigation";

type Room = Schema['Room']['type'];

export default function OnlineGame() {
  const router = useRouter();
  const [roomList, setRoomList] = useState<Room[]>([]);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
    const rl = (await roomService.getRoomsByPublic('classic')).data || [];
      setRoomList(rl);
  } 
    catch (e) {
      console.log('error', e)
    }
  } 

  const handleJoinGame = (room: Room) => {
    router.push(`/online-game/room/${room.simpleCode}`);
  }

  return (
    <>
      <NavBar title='Game Hub' />
      <main>

        <QuickStart />
        <hr />
        <GameList roomList={roomList} onJoinGame={handleJoinGame} />

      </main>
    </>)
}