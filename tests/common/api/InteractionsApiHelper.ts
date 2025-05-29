import {APIRequestContext, APIResponse, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import type Interaction from '../../../backend/src/api/types/interaction';
import {Entity} from "./Entity";

export class InteractionsApiHelper {
    private api: APIRequestContext;
    private readonly baseUrl: string;

    constructor(api: APIRequestContext, baseUrl: string = '/api') {
        this.api = api;
        this.baseUrl = baseUrl;
    }

    async getInteractions(): Promise<APIResponse> {
        return  await this.api.get(`${this.baseUrl}/interactions`);
    }

    async getEntities(): Promise<APIResponse> {
        return  await this.api.get(`${this.baseUrl}/entities`);
    }
    async createInteraction(payload: Interaction): Promise<APIResponse> {
        return await this.api.post(`${this.baseUrl}/interaction`, {
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async deleteInteraction(interactionId: string): Promise<APIResponse> {
        return await this.api.delete(`${this.baseUrl}/interaction/${interactionId}`);
    }



    async generateInteractionPayload(entities: Entity[], details: any): Promise<Interaction>  {
        const source: Entity = entities[faker.number.int({min:0, max: entities.length /2 })];
        const target: Entity = entities[faker.number.int({min: entities.length /2, max: entities.length -1})];
        return {
            sourceId: source.id,
            source: source.name,
            sourceCompany: source.company,
            targetId: target.id,
            target: target.name,
            targetCompany: target.company,
            type: faker.helpers.arrayElement(['Phone', 'Message', 'Email'] as const),
            description: details
        };
    }
    async generateInteractionPayloadWithInvalidTargetId(entities: Entity[], details: any): Promise<Interaction>  {
        const source: Entity = entities[faker.number.int({min:0, max: entities.length /2 })];
        const target: Entity = entities[faker.number.int({min: entities.length /2, max: entities.length -1})];
        return {
            sourceId: source.id,
            source: source.name,
            sourceCompany: source.company,
            targetId: '999999',
            target: target.name,
            targetCompany: target.company,
            type: faker.helpers.arrayElement(['Phone', 'Message', 'Email'] as const),
            description: details
        };
    }

    async validateInteractionActualAndExpectedPayloads(interactionObject: Interaction, newInteraction: Interaction): Promise<void> {
        expect(interactionObject.id).toBeDefined();
        expect(interactionObject.timestamp).toBeDefined();
        expect(interactionObject.sourceId).toBe(newInteraction.sourceId);
        expect(interactionObject.source).toBe(newInteraction.source);
        expect(interactionObject.sourceCompany).toBe(newInteraction.sourceCompany);
        expect(interactionObject.targetId).toBe(newInteraction.targetId);
        expect(interactionObject.target).toBe(newInteraction.target);
        expect(interactionObject.targetCompany).toBe(newInteraction.targetCompany);
        expect(interactionObject.type).toBe(newInteraction.type);
        expect(interactionObject.description).toBe(newInteraction.description);
    }
}