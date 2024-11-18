import { generateClient } from "aws-amplify/api";
import { type Schema } from '../../amplify/data/resource' 
import { getCurrentUser } from "aws-amplify/auth";

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type CreateMessageInput = Omit<Message, 'id' | 'createdAt'>;

export type UpdateMessageInput = Omit<Message, 'createdAt'>;

export interface Message {
    id: string;
    content: string;
    owner: string;
    roomID: string 
    createdAt: string;
    color: string;
    name: string;
  }


export const messageService = {
    getMessagesByRoomId: async (roomID: string) => {
        const client = generateClient<Schema>({authMode: 'apiKey'});
        return await client.models.Message.listMessageByRoomIDAndCreatedAt({
            roomID,
        }, {
            limit: 20,
            sortDirection: ModelSortDirection.DESC,
        });
    },

    createNewMessage: async (message: CreateMessageInput) => {
        const client = generateClient<Schema>({authMode: 'userPool'});
        const { userId: owner } = await getCurrentUser()
        return await client.models.Message.create({
            ...message,
            createdAt: new Date().toISOString(),
            owner,
        });
    },
}
