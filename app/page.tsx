"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./app.css";
import "@aws-amplify/ui-react/styles.css";
import Image from 'next/image'

import { IoGameControllerOutline, IoHelpCircleOutline, IoPlanetOutline } from 'react-icons/io5';
import Link from 'next/link';


 const client = generateClient<Schema>({authMode: 'apiKey'});

export default function App() {
   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    const sub = client.models.Todo.observeQuery()
    .subscribe({
      next: (data: any) => console.log([...data.items]),
    });
  }

  // function listMessages() {
  //   messageService.getMessagesByRoomId('123').then((data) => {
  //     console.log('messages', data);
  //   });
    // const sub = client.models.Message.list({
    //   filter: {
    //     roomID: { eq: '123' },
    //   },
    // }).then((data) => {
    //   console.log('messages', data);
    // });
    // .subscribe({
    //   next: (data: any) => console.log([...data.items]),
    // });
  // }
  useEffect(() => {
    // listTodos();
    // listMessages();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }




  return (
<main className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Your existing Image components */}
        <Image
          src="/assets/title.png"
          alt="Nom Kitty in bubble letters"
          width={500}
          height={200}
          className="mx-auto mb-8"
          priority
        />
        
        <Image
          src="/assets/kitty.png"
          alt="Nom Kitty in bubble letters"
          width={400}
          height={300}
          className="mx-auto mb-8"
          priority
        />

        {/* Button Stack */}
        <div className="flex flex-col gap-4 max-w-md mx-auto mt-8">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors w-full text-lg font-semibold"
          >
            Online <IoPlanetOutline className="text-xl" />
          </Link>

          <Link 
            href="/local-game" 
            className="flex items-center justify-center gap-2 bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors w-full text-lg font-semibold"
          >
            Local Game <IoGameControllerOutline className="text-xl" />
          </Link>

          <Link 
            href="/learn-more" 
            className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors w-full text-lg font-semibold"
          >
            Learn More <IoHelpCircleOutline className="text-xl" />
          </Link>
        </div>
      </div>
    </main>
  );
}
