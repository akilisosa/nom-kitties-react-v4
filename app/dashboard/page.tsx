'use client';
import Navbar from "../components/NavBar";
import ProtectedRoute from "../components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import QuickStart from "./components/QuickStart";

export default function Dashboard() {
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
            <QuickStart />
          </div>
        </div>

        {/* Empty item divider - if you need it */}
        <div className="border-t my-4"></div>
      </main>
    </div>



    </ProtectedRoute>
  )
}