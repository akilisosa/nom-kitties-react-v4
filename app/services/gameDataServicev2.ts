// import { Subject } from 'rxjs';
// import { io, Socket } from 'socket.io-client';

// class GameDataService {
//   private socket!: Socket;
//   private messageSubject = new Subject<any>();
//   private readonly SERVER_URL = 'http://localhost:4000'; // Adjust the URL as needed

//   connect() {
//     if (this.socket) {
//       this.socket.disconnect();
//     }

//     this.socket = io(this.SERVER_URL, {
//       reconnectionAttempts: 5, // Maximum number of reconnection attempts
//       reconnectionDelay: 1000, // Delay between reconnection attempts
//     });

//     this.socket.on('connect', () => {
//       console.log('WebSocket connection established');
//     });

//     this.socket.on('disconnect', () => {
//       console.log('WebSocket connection closed');
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('WebSocket connection error:', error);
//     });

//     this.socket.on('message', (data) => {
//       console.log('Received:', data);
//       this.messageSubject.next(data);
//     });
//   }

//   sendMessage(event: string, message: any) {
//     this.socket.emit(event, message);
//   }

//   getMessageSubject() {
//     return this.messageSubject.asObservable();
//   }
// }

// export default GameDataService;