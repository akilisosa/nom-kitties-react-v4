import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource' 
import { getCurrentUser } from "aws-amplify/auth";

export type User = Schema['User']['type'];

export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export type UpdateUserInput = Omit<User, 'createdAt'>;


export const userService = {
    getUserByOwner: async (owner: string) => {
        const client = generateClient<Schema>({authMode: 'apiKey'});
        console.log('getUserByOwner', owner)
        return await client.models.User.listUserByOwner({
            owner
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

