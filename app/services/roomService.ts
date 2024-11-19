import { generateClient } from "aws-amplify/data";
import type { Schema } from '@/amplify/data/resource' 
import { getCurrentUser } from "aws-amplify/auth";

export type RoomStatus = 'WAITING' | 'PLAYING' | 'FINISHED' | 'CANCELLED' | null;
export class RoomStatusEnum {
  static WAITING = 'WAITING' as RoomStatus;
  static PLAYING = 'PLAYING' as RoomStatus;
  static FINISHED = 'FINISHED' as RoomStatus;
  static CANCELLED = 'CANCELLED' as RoomStatus;
}

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type CreateRoomInput = Omit<Room, 'id'>;

export type UpdateRoomInput = Omit<Room, 'createdAt'>;

export interface UpdateRoomByPlayerInput {
    id: string;
    players: string[];
}

type Room =  any; //Schema['Room']['type'][0];

export const roomService = {
    
    getRooms: async () => {
        const client = generateClient<Schema>({authMode: 'apiKey'});

        return await client.models.Room.list({
            filter: {
                status: {
                    eq: 'WAITING'
                }
            },
          });
  },
   getRoomsBySimpleCode: async (simpleCode: string) => {

    const client = generateClient<Schema>({authMode: 'apiKey'});

    return await client.models.Room.listRoomBySimpleCode({
        simpleCode,
    });
  },

  getRoomsByPublic: async (mode: string) => {
    const client = generateClient<Schema>({authMode: 'apiKey'});

    return await client.models.Room.listRoomByPublicAndCreatedAt({
        public: 'Public',
    }, {
        filter: {
            status: {
                eq: 'WAITING'
            }
        },
        sortDirection: ModelSortDirection.DESC,
    });
  },

  createNewRoom: async (room: CreateRoomInput) => {
    const client = generateClient<Schema>({authMode: 'userPool'});
    const { userId: owner } = await getCurrentUser()
    return await client.models.Room.create({
        ...room,
        players: [owner],
    });
  },

  updateRoomByOwner: async (room: any) => {
    const client = generateClient<Schema>({authMode: 'userPool'});
    return await client.models.Room.update(room);
  },

  joinRoom: async (id: string, players: any[]) => {
    const client = generateClient<any>({authMode: 'userPool'});
    return await client.models.Room.update({
    id,
    players,
    });
  },


}