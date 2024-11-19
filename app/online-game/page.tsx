'use client';
import NavBar from "../components/NavBar";
import QuickStart from "../components/QuickStart";
import GameList from "./components/GameList";

export default function OnlineGame() {
  return (
    <>
      <NavBar title='Game Hub' />
      <main>

        <QuickStart />
        <hr />
        <GameList roomList={[]} onJoinGame={() => { }} />

      </main>
    </>)
}