import { Page, Locator, expect } from '@playwright/test';

export class InteractionsPage {
    readonly page: Page;
    readonly interactionLogTitle: Locator;
    readonly createInteractionButton: Locator;
    readonly deleteInteractionButton: Locator;
    readonly interactionSelectorInput: Locator;
    readonly interactionSelector: Locator;
    readonly descriptionInputField: Locator;
    readonly addInteractionButton: Locator;
    readonly cancelInteractionCreationButton: Locator;
    readonly interactionTimestampDetails: Locator;
    readonly interactionSourceDetails: Locator;
    readonly interactionTargetDetails: Locator;
    readonly interactionType: Locator;
    readonly interactionDescription: Locator;

    constructor(page: Page) {
        this.page = page;
        this.interactionLogTitle = page.getByRole('heading', { name: 'Interaction Log' });
        this.createInteractionButton = page.locator('.interaction-log-add-button');
        this.deleteInteractionButton = page.locator('.delete-button');
        this.interactionSelectorInput = page.locator('//input[@type="radio"]');
        this.interactionSelector = page.locator('.interaction-selector');
        this.descriptionInputField = page.getByRole('textbox', { name: 'Description' });
        this.addInteractionButton = page.getByRole('button', { name: 'Add Interaction' });
        this.cancelInteractionCreationButton = page.getByRole('button', { name: 'Cancel' });
        this.interactionTimestampDetails = page.locator("//span[text()='Timestamp']/following-sibling::span");
        this.interactionSourceDetails = page.locator("//span[text()='Source']/following-sibling::span");
        this.interactionTargetDetails = page.locator("//span[text()='Target']/following-sibling::span");
        this.interactionType = page.locator("//span[text()='Type']/following-sibling::span");
        this.interactionDescription = page.locator("//span[text()='Description']/following-sibling::p[@class='description-value']");
    }

    async goToInteractionsHomePage() {
        await this.page.goto('http://localhost:5173/');
        await this.page.waitForTimeout(2000);
    }

    async validatePageIsLoaded(): Promise<void> {
        await expect(this.page.title()).resolves.toBe('Vite + React + TS');
        await expect(this.interactionLogTitle).toBeVisible();
        await expect(this.createInteractionButton).toBeVisible();
        await expect(this.deleteInteractionButton).toBeVisible();
        const interactionCount = await this.interactionSelector.count();
        expect(interactionCount).toBeGreaterThan(0);
        expect(await this.interactionSelectorInput.nth(0).isChecked()).toBe(true);
    }

    async createInteraction(sourceContact: string, targetContact: string, type: string,description: string): Promise<void> {
        await this.createInteractionButton.click();
        await this.page.waitForSelector('.popup-overlay', { state: 'visible' });
        await this.page.getByLabel('Source Contact').selectOption(`${sourceContact}`);
        await this.page.getByLabel('Target Contact').selectOption(`${targetContact}`);
        await this.page.waitForTimeout(1000);
        await this.page.locator('label').filter({ hasText: `${type}` }).click();
        await this.descriptionInputField.fill(description);
        await this.addInteractionButton.click();
        await this.page.waitForSelector('.popup-overlay', { state: 'hidden' });
    }

    async validateInteractionCreation(timestampDate: string, sourceContact: string, targetContact: string, type: string,description: string): Promise<void> {
        expect(await this.interactionTimestampDetails.textContent()).toContain(timestampDate);
        expect(await this.interactionSourceDetails.innerText()).toContain(sourceContact);
        expect(await this.interactionTargetDetails.innerText()).toContain(targetContact);
        expect(await this.interactionType.innerText()).toBe(type);
        expect(await this.interactionDescription.innerText()).toBe(description);
    }

    async getInteractionCount(): Promise<number> {
        return this.interactionSelector.count();
    }

    async selectInteractionAtIndex(index: number): Promise<void> {
        await this.page.waitForTimeout(1000);
        await this.interactionSelector.nth(index).click();
    }

    async validateInteractionSelectionAtIndex(index: number): Promise<void> {
        await this.page.waitForTimeout(1000);
        await expect(await this.interactionSelector.nth(index).isChecked()).resolves.toBe(true);
    }
}