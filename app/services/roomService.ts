// import { generateClient } from "aws-amplify/data";
// import type { Schema } from '@/amplify/data/resource' 
// import { getCurrentUser } from "aws-amplify/auth";

// export type RoomStatus = 'WAITING' | 'PLAYING' | 'FINISHED' | 'CANCELLED' | null;
// export class RoomStatusEnum {
//   static WAITING = 'WAITING' as RoomStatus;
//   static PLAYING = 'PLAYING' as RoomStatus;
//   static FINISHED = 'FINISHED' as RoomStatus;
//   static CANCELLED = 'CANCELLED' as RoomStatus;
// }

// export enum ModelSortDirection {
//   ASC = "ASC",
//   DESC = "DESC",
// }

// export type CreateRoomInput = Omit<Room, 'id' | 'createdAt'>;

// export type UpdateRoomInput = Omit<Room, 'createdAt'>;

// export interface UpdateRoomByPlayerInput {
//     id: string;
//     players: string[];
// }

// export interface Room  {
//     id: string;
//     name: string;
//     status: RoomStatus;
//     simpleCode: string;
//     public: string;
    
//     mode: string;
//     timeLimit?: number;
//     roomLimit?: number;
//     totalRounds?: number;
//     full?: boolean | null;
//     players: string[];
    
//     spectators?: string[];
//     currentRound?: number;
//     turn?: string;
//     moves?: string;
//     winner?: string;
    
//     owner: string;
//     createdAt: Date;
// }

// export const roomService = {
    
//     getRooms: async () => {
//         const client = generateClient<Schema>({authMode: 'apiKey'});

//         return await client.models.Room.list({
//             filter: {
//                 status: {
//                     eq: 'WAITING'
//                 }
//             },
//           });
//   },
//    getRoomsBySimpleCode: async (simpleCode: string) => {

//     const client = generateClient<Schema>({authMode: 'apiKey'});

//     return await client.models.Room.listRoomBySimpleCode({
//         simpleCode,
//     });
//   },

//   getRoomsByPublic: async (mode: string) => {
//     const client = generateClient<Schema>({authMode: 'apiKey'});

//     return await client.models.Room.listRoomByPublicAndCreatedAt({
//         public: 'Public',
//     }, {
//         filter: {
//             status: {
//                 eq: 'WAITING'
//             }
//         },
//         sortDirection: ModelSortDirection.DESC,
//     });
//   },

//   createNewRoom: async (room: CreateRoomInput) => {
//     const client = generateClient<Schema>({authMode: 'userPool'});
//     const { userId: owner } = await getCurrentUser()
//     return room;
//     // return await client.models.Room.create({
//     //     ...room,
//     //     createdAt: new Date().toISOString(),
//     //     owner,
//     // });
    
//     // .create({
//     //     ...room,
//     //     createdAt: new Date().toISOString(),
//     //     owner,
//     // });
//   },

//   updateRoomByOwner: async (room: UpdateRoomInput) => {
//     const client = generateClient<Schema>({authMode: 'userPool'});
//     return room;
//     // return await client.models.Room.update({
//     //     ...room,
//     // });
//   },

//   updateRoomByPlayer: async (room: UpdateRoomByPlayerInput) => {
//     const client = generateClient<Schema>({authMode: 'userPool'});
//     return room
//     // return await client.models.Room.update({
//     //     ...room,
//     // });
//   },


// }