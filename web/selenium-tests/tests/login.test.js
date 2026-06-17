const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('BloodLink Web Login E2E', function() {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        await driver.quit();
    });

    it('should show login page and allow entering credentials', async function() {
        await driver.get('https://Ma536992.github.io/BloodLink-FullStack/#/login');

        const emailInput = await driver.wait(until.elementLocated(By.placeholderText('Email Address')), 10000);
        await emailInput.sendKeys('test@example.com');

        const passwordInput = await driver.findElement(By.placeholderText('Password'));
        await passwordInput.sendKeys('password123');

        const loginBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Login Account')]"));
        assert.ok(await loginBtn.isDisplayed());
    });
});
