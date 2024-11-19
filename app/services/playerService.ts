// services/playerService.ts
import { v4 as uuidv4 } from 'uuid';

interface WebSocketMessage {
    type: string;
    id?: string;
    channel?: string;
    authorization?: {
        'x-api-key': string;
        host: string;
    };
    payload?: any;
}

class PlayerService {
    private ws: WebSocket | null = null;
    private subscribers: Set<(data: any) => void> = new Set();
    private readonly REALTIME_DOMAIN = 'hjzp2ynwl5ehvjn4lihvnesplm.appsync-realtime-api.us-east-1.amazonaws.com';
    private readonly HTTP_DOMAIN = 'hjzp2ynwl5ehvjn4lihvnesplm.appsync-api.us-east-1.amazonaws.com';
    private readonly API_KEY = 'da2-bmfwwzhplnb4bg3vdkik62u3ba';

    private getBase64URLEncoded(obj: any): string {
        return btoa(JSON.stringify(obj))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    private sendStartMessage(message: WebSocketMessage) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    connect(onConnect?: () => void) {
        const authorization = {
            host: this.HTTP_DOMAIN,
            'x-api-key': this.API_KEY
        };

        const header = this.getBase64URLEncoded(authorization);
        const subProtocols = [`header-${header}`, 'aws-appsync-event-ws'];

        this.ws = new WebSocket(`wss://${this.REALTIME_DOMAIN}/event/realtime`, subProtocols);

        this.ws.onopen = () => {
            console.log('WebSocket connection established');
            this.sendStartMessage({
                type: 'connection_init'
            });
            onConnect?.();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received:', data);

            switch (data.type) {
                case 'connection_ack':
                    console.log('Connection acknowledged');
                    break;
                case 'ka':
                    // Keep alive message
                    break;
                case 'subscription_ack':
                    console.log('Subscription acknowledged:', data);
                    break;
                case 'data':
                    // Notify all subscribers
                    this.subscribers.forEach(callback => callback(data));
                    break;
                case 'error':
                    console.error('WebSocket error:', data);
                    break;
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return {
            subscribe: (callback: (data: any) => void) => {
                this.subscribers.add(callback);
                return () => {
                    this.subscribers.delete(callback);
                };
            }
        };
    }

    subscribe(channelPath: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection not established');
            
             throw new Error('WebSocket connection not established');
        }
           

        const subscriptionId = uuidv4();
        const subscriptionMessage: WebSocketMessage = {
            type: 'subscribe',
            id: subscriptionId,
            channel: channelPath,
            authorization: {
                'x-api-key': this.API_KEY,
                host: this.HTTP_DOMAIN
            }
        };

        this.sendStartMessage(subscriptionMessage);
        return subscriptionId;
    }

    unsubscribe(subscriptionId: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.sendStartMessage({
                type: 'unsubscribe',
                id: subscriptionId
            });
        }
    }

    async publishEvent(channelName: string, eventData: any) {
        const endpoint = `https://${this.HTTP_DOMAIN}/event`;
        
        const data = {
            type: 'data',
            channel: channelName,
            event: JSON.stringify(eventData)
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": this.API_KEY
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error publishing event:', error);
            throw error;
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.subscribers.clear();
    }
}

export const playerService = new PlayerService();
