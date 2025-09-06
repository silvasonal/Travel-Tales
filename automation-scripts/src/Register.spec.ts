import { test, expect } from '@playwright/test';
import { locators } from './locators';

test( 'Register with Username  empty', async ({ page }) => {

    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('');
    await regEmailInput.fill('Sonal@example.com');
    await regPasswordInput.fill('Test@1234');

    await regButton.click();

    await expect(errorMessage).toHaveText('Username is required', { timeout: 3000 });
})

test( 'Register with Email  empty', async ({ page }) => {

    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('Sonal');
    await regEmailInput.fill('');
    await regPasswordInput.fill('Test@1234');

    await regButton.click();
    await expect(errorMessage).toHaveText('Email is required', { timeout: 3000 });
})

test( 'Register with Password  empty', async ({ page }) => {

    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('Sonal');
    await regEmailInput.fill('Sonal@example.com');
    await regPasswordInput.fill('');

    await regButton.click();
    await expect(errorMessage).toHaveText('Password is required', { timeout: 3000 });
})

test( 'Register with all fields empty', async ({ page }) => {

    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('');
    await regEmailInput.fill('');
    await regPasswordInput.fill('');

    await regButton.click();
    await expect(errorMessage).toHaveText('Username is required', { timeout: 3000 });
})

test( 'Register with already register username ', async ({ page }) => {

    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('KoH8OSonal');
    await regEmailInput.fill('KoH8OSonal@example.com');
    await regPasswordInput.fill('Test@1234');

    await regButton.click();
    await expect(errorMessage).toHaveText('Username already exists', { timeout: 3000 });
})

test( 'Register with already register email ', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('sonal');
    await regEmailInput.fill('KoH8OSonal@example.com');
    await regPasswordInput.fill('Test@1234');

    await regButton.click();
    await expect(errorMessage).toHaveText('Email already exists', { timeout: 3000 });
})

test ('Register invalid  email format', async ({ page }) => {

    await page.goto('http://localhost:3000/register');
    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const errorMessage = page.locator('#snackbar');

    await regUsernameInput.fill('Sonal');
    await regEmailInput.fill('sonal');
    await regPasswordInput.fill('Test@1234');

    await regButton.click();
    await expect(errorMessage).toHaveText('Invalid email format', { timeout: 3000 });
})

test ('Check Sign in text works and redirect to login page', async ({ page }) => {

    await page.goto('http://localhost:3000/register');
    const siginText = page.locator(locators.registerPage.siginText);

    await siginText.click();
    await expect(page).toHaveURL('http://localhost:3000/login');
})

test ('Register with all valid inputs', async ({ page }) => {

    await page.goto('http://localhost:3000/register');

    const regUsernameInput = page.locator(locators.registerPage.regUsernameInput);
    const regEmailInput = page.locator(locators.registerPage.regEmailInput);
    const regPasswordInput = page.locator(locators.registerPage.regPasswordInput);
    const regButton = page.locator(locators.registerPage.regButton);
    const successMessage = page.locator('#snackbar'); 

    const timestamp = Date.now();
    await regUsernameInput.fill(`user${timestamp}`);
    await regEmailInput.fill(`user${timestamp}@example.com`);
    await regPasswordInput.fill('Test@1234');

    await regButton.click();

    await expect(successMessage).toHaveText('Registration successful!', { timeout: 3000 });
    await expect(page).toHaveURL('http://localhost:3000/login', { timeout: 3000 });
})


