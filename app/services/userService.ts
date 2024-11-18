import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource' 
import { getCurrentUser } from "aws-amplify/auth";

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export type UpdateUserInput = Omit<User, 'createdAt'>;

export interface User {
    id: string;
    name: string;
    color: string;
    type: string | null;
    score: number | null;
    gamesPlayed: number | null;
    wins: number | null;
    losses: number | null;
    owner: string;
  }


export const userService = {
    getUserByOwner: async (owner: string) => {
        const client = generateClient<Schema>({authMode: 'apiKey'});
        return await client.models.User.listUserByOwner({
            owner,
        }, {
            limit: 1,
        });
    },
    createUser: async (user: CreateUserInput) => {
        const client = generateClient<Schema>({authMode: 'userPool'});
        const { userId: owner } = await getCurrentUser()
        return await client.models.User.create({
            ...user,
            owner,
        });
    },
    updateUser: async (user: UpdateUserInput) => {
        const client = generateClient<Schema>({authMode: 'userPool'});
        return await client.models.User.update(user);
    },
}

