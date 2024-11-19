'use client';
import Navbar from "../components/NavBar";
import ProtectedRoute from "../components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import QuickStart from "../components/QuickStart";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../store/store";
import { useEffect, useState } from "react";
import { Schema } from "@/amplify/data/resource";
import { roomService } from "../services/roomService";

type Room = Schema['Room']['type'];

export default function Dashboard() {
const router = useRouter();
const dispatch = useAppDispatch();

const [roomList, setRoomList] = useState<Room[]>([]);

const fetchRooms = async () => {
  try {
      const rooms = (await roomService.getRoomsByPublic('classic')).data;
      setRoomList(rooms);
  } catch (error) {
      console.error('Error fetching rooms:', error);
  }
};


useEffect(() => {
    fetchRooms();
}, [])

  return (
    <ProtectedRoute>
     <Navbar title="Dashboard" />
<div className="flex flex-col h-screen">

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex flex-wrap justify-around gap-4">
          {/* User Profile Section */}
          <UserProfile />

          {/* Quick Start Section */}
          <div className="flex flex-col justify-center">
            <QuickStart onJoinGame={() => router.push('/online-game')} />
          </div>
        </div>

        {/* Empty item divider - if you need it */}
        <div className="border-t my-4"></div>
      </main>
    </div>



    </ProtectedRoute>
  )
}