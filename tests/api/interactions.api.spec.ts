import { test, expect, request, APIRequestContext } from '@playwright/test';
import type Interaction from '../../backend/src/api/types/interaction';
import {faker} from "@faker-js/faker";
import {Entity} from "../common/api/Entity";
import {InteractionsApiHelper} from "../common/api/InteractionsApiHelper";

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
        expect(data.length).toBeGreaterThan(0)
    });

    test('Verify GET entities', async () => {
        const response = await interactionsApiHelper.getEntities();
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test('Create interaction using POST method', async () => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = faker.lorem.sentence();
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        /** validation: status code, message and details */
        const responseBody = await createdInteractionResponse.json();
        const interactionObject = responseBody.interaction as Interaction;
        expect(createdInteractionResponse.status()).toBe(201);
        expect(responseBody.message).toBe('Interaction created');
        await interactionsApiHelper.validateInteractionActualAndExpectedPayloads(interactionObject, newInteraction);
        /** Interaction clean up step */
        await interactionsApiHelper.deleteInteraction(responseBody.interaction.id);
    })

    test('Concurrent interaction creation', async () => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        for (let i = 0; i < 100; i++) {
            const details: string = faker.lorem.sentence();
            const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
            const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
            /** validation: status code, message and details */
            const responseBody = await createdInteractionResponse.json();
            const interactionObject = responseBody.interaction as Interaction;
            expect(createdInteractionResponse.status()).toBe(201);
            expect(responseBody.message).toBe('Interaction created');
            await interactionsApiHelper.validateInteractionActualAndExpectedPayloads(interactionObject, newInteraction);
            /** Interaction clean up step */
            await interactionsApiHelper.deleteInteraction(responseBody.interaction.id);
        }
    })

    test('Create interaction description with 1 character ', async () => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = 'a';
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        /** validation: status code, message and details */
        const responseBody = await createdInteractionResponse.json();
        const interactionObject = responseBody.interaction as Interaction;
        expect(createdInteractionResponse.status()).toBe(201);
        expect(responseBody.message).toBe('Interaction created');
        await interactionsApiHelper.validateInteractionActualAndExpectedPayloads(interactionObject, newInteraction);
        /** Interaction clean up step */
        await interactionsApiHelper.deleteInteraction(responseBody.interaction.id);
    })

    test('Create interaction description with 1000 words', async () => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = faker.word.words(1000);
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        /** validation: status code, message and details */
        const responseBody = await createdInteractionResponse.json();
        const interactionObject: Interaction = responseBody.interaction as Interaction;
        expect(createdInteractionResponse.status()).toBe(201);
        expect(responseBody.message).toBe('Interaction created');
        await interactionsApiHelper.validateInteractionActualAndExpectedPayloads(interactionObject, newInteraction);
        /** Interaction clean up step */
        await interactionsApiHelper.deleteInteraction(responseBody.interaction.id);
    })

    test('Create interaction description with special characters', async () => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = faker.string.sample(1000);
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        /** validation: status code, message and details */
        const responseBody = await createdInteractionResponse.json();
        const interactionObject: Interaction = responseBody.interaction as Interaction;
        expect(createdInteractionResponse.status()).toBe(201);
        expect(responseBody.message).toBe('Interaction created');
        await interactionsApiHelper.validateInteractionActualAndExpectedPayloads(interactionObject, newInteraction);
        /** Interaction clean up step */
        await interactionsApiHelper.deleteInteraction(responseBody.interaction.id);
    })

    test ('Verify failure to create interaction with empty details', async () => {
        // const entitiesResponse = await interactionsApiHelper.getEntities();
        // const entities = await entitiesResponse.json() as Entity[];
        // const details: string = faker.lorem.sentence();
        // const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayloadWithInvalidTargetId(entities, details);
        // const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        // /** validation of the error message*/
        // const responseBody = await createdInteractionResponse.json();
        // expect(createdInteractionResponse.status()).toBe(400);
        // expect(responseBody.message).toBe('Interaction details cannot be empty');
    })
    /** Interaction creation needs to be tested will invalid values for each of the fields, empty, missing fields in object and null values */

    test('Verify function to delete interaction using DELETE method ', async () => {
        const entitiesResponse = await interactionsApiHelper.getEntities();
        const entities = await entitiesResponse.json() as Entity[];
        const details: string = faker.lorem.sentence();
        const newInteraction: Interaction = await interactionsApiHelper.generateInteractionPayload(entities, details);
        const createdInteractionResponse = await interactionsApiHelper.createInteraction(newInteraction);
        const responseBody = await createdInteractionResponse.json();
        const iId: string = responseBody.interaction.id;
        await interactionsApiHelper.deleteInteraction(iId);
        /** validation: status code, message, details and absence in the list of interactions*/
        const interactionsResponse = await interactionsApiHelper.getInteractions();
        const interactions = await interactionsResponse.json();
        for (const interaction of interactions) {
            expect(interaction.id).not.toBe(iId);
        }
    })

    test('Verify delete interaction with non-existing id', async () => {
        /** Edge case testing with several invalid id values */
        // const listOfInvalidIds = ['', ' ', '1234567890', 'non-existing-id'];
        // for (const id of listOfInvalidIds) {
        //     const response = await interactionsApiHelper.deleteInteraction(id);
        //     console.log(response); // there is no response code or message to validate it
        // }
        // This test will take down the app when the last value which is not a number is passed as param
    })
});