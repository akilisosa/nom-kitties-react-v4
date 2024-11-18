// components/ChatModal.tsx
'use client';
import { useEffect, useState } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  roomID: string;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose, roomID }: ChatModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
console.log("roomID", roomID);
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 transform transition-all
        ${isOpen ? 'translate-y-0 opacity-100 duration-500 ease-in-out' : 'translate-y-full opacity-100 duration-500 ease-in-out'}`}
    // TODO ask about transitions
        onTransitionEnd={() => {
        if (!isOpen) setIsAnimating(false);
      }}
    >
      {/* Modal Container */}
      <div className={`h-screen w-screen bg-white flex flex-col
        transform transition-transform
        ${isOpen ? 'translate-y-0 opacity-100 duration-500 ease-in-out' : 'translate-y-full opacity-100 duration-500 ease-in-out'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Chat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="space-y-4">
              {/* Example message */}
              <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                Example message
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// // components/ChatModal.tsx
// 'use client';

// interface ChatModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Modal Container */}
//       <div className="h-screen w-screen bg-white flex flex-col">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold">Chat</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               className="h-6 w-6 text-gray-600" 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M6 18L18 6M6 6l12 12" 
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Chat Content */}
//         <div className="flex-1 flex flex-col p-4 overflow-hidden">
//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto mb-4">
//             {/* Add your chat messages here */}
//             <div className="space-y-4">
//               {/* Example message */}
//               <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
//                 Example message
//               </div>
//             </div>
//           </div>

//           {/* Chat Input */}
//           <div className="border-t border-gray-200 pt-4">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//               />
//               <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
