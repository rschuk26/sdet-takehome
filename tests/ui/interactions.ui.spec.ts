import { test, expect } from '@playwright/test';
import { InteractionsPage } from '../pages/InteractionsPage';
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

test.describe('Interactions Component', () => {
    let interactionsPage: InteractionsPage;

    test.beforeEach(async ({ page }) => {
        interactionsPage = new InteractionsPage(page);
        await interactionsPage.goToInteractionsHomePage();
    });

    test('Check if page is loaded', async ({ page }) => {
        await interactionsPage.validatePageIsLoaded();
    });

    // BUG: FAILS
    test('Validate interaction selection from the grid', async ({ page }) => {
        const interactionCount: number = await interactionsPage.getInteractionCount();
        const interactionIdx: number = faker.number.int({min: 0, max: interactionCount - 1});
        await interactionsPage.selectInteractionAtIndex(interactionIdx);
        /** BUG: this test finds an issue with html state of selector that does not have 'checked' attribute after the element is selected */
        await interactionsPage.validateInteractionSelectionAtIndex(interactionIdx);
    });

    test('Create interaction', async ({ page }) => {
        const contacts: string[] = ['Alice Rogers', 'Bob Arlo', 'Diana Evans', 'Chuck Davies'];
        const sourceContact: string = faker.helpers.arrayElement(contacts);
        const targetContact: string = faker.helpers.arrayElement(contacts);
        const interactionType: string = faker.helpers.arrayElement(['Phone', 'Message', 'Email'] as const);
        const description: string = faker.lorem.sentence();
        const timestampDate: string = DateTime.now().toFormat("MM/dd/yyyy");
        await interactionsPage.createInteraction(sourceContact, targetContact, interactionType, description);
        await interactionsPage.validateInteractionCreation(timestampDate, sourceContact, targetContact, interactionType, description);
    });

    // test('Delete interaction', async ({ page }) => {
        // first create interaction
        // then remove
        // validate that it is not present in the grid in ui and also can leverage api call to get interactions
    // });
});