import { test, expect, request, APIRequestContext } from '@playwright/test';
import type Interaction from '../../backend/src/api/types/interaction';
import {faker} from "@faker-js/faker";
import {Entity} from "../common/api/Entity";
import {InteractionsApiHelper} from "../common/api/InteractionsApiHelper";
import {s} from "@faker-js/faker/dist/airline-BUL6NtOJ";

let apiContext: APIRequestContext;
let interactionsApiHelper: InteractionsApiHelper;

test.describe('API test suite for /interactions', () => {
    test.beforeAll(async () => {
        apiContext = await request.newContext({
            ignoreHTTPSErrors: true
        });
        interactionsApiHelper = new InteractionsApiHelper(apiContext);
    });

    test('Verify GET interactions', async () => {
        const response = await interactionsApiHelper.getInteractions();
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        console.log(data);
        // add more validation for data type returned etc...
    });

    test('Verify GET entities', async () => {
        const response = await interactionsApiHelper.getEntities();
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        const entities = await response.json() as Entity[];
        console.log(data);
        // add more validation for data type returned etc...
    });

    test('Create interaction using POST method ', async ({ page }) => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = faker.lorem.sentence();
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        expect(createdInteractionResponse.status()).toBe(201);
        console.log(createdInteractionResponse);
        // add more validation for data type returned etc...
        const responseBody = await createdInteractionResponse.json();
        expect(responseBody.message).toBe('Interaction created');
        /** Interaction clean up step */
        await interactionsApiHelper.deleteInteraction(responseBody.interaction.id);
    })

    test('Verify function to delete interaction using DELETE method ', async ({ page }) => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = faker.lorem.sentence();
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        const responseBody = await createdInteractionResponse.json();
        const iId: string = responseBody.interaction.id;
        await interactionsApiHelper.deleteInteraction(iId);
        // add more validation for data type returned etc...
        // get the list of interaction and validate that iId is not present in the list
        const interactionsResponse = await interactionsApiHelper.getInteractions();
        const interactions = await interactionsResponse.json();
        for (const interaction of interactions) {
            expect(interaction.id).not.toBe(iId);
        }
    })
});