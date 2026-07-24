const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const ExcelJS = require('exceljs');

describe('BloodLink Web Login E2E', function() {
    let driver;
    const testResults = [];

    before(async function() {
        let options = new chrome.Options();
        options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    afterEach(function() {
        testResults.push({
            title: this.currentTest.title,
            state: this.currentTest.state || 'skipped',
            duration: this.currentTest.duration || 0
        });
    });

    after(async function() {
        await driver.quit();

        // Generate Excel Report
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Selenium Test Results');
        
        sheet.columns = [
            { header: 'Test ID & Description', key: 'title', width: 80 },
            { header: 'Status', key: 'state', width: 15 },
            { header: 'Duration (ms)', key: 'duration', width: 15 }
        ];
        
        sheet.getRow(1).font = { bold: true };
        
        testResults.forEach(res => {
            const row = sheet.addRow(res);
            if (res.state === 'passed') {
                row.getCell('state').font = { color: { argb: 'FF008000' } }; // Green
            } else {
                row.getCell('state').font = { color: { argb: 'FFFF0000' } }; // Red
            }
        });
        
        await workbook.xlsx.writeFile('Selenium_Test_Report.xlsx');
        console.log('✅ Excel Report generated: Selenium_Test_Report.xlsx');
    });

    it('should show login page and allow entering credentials', async function() {
        await driver.get('https://Ma536992.github.io/BloodLink-FullStack/#/login');

        const emailInput = await driver.wait(until.elementLocated(By.css('[placeholder="Email Address"]')), 10000);
        await emailInput.sendKeys('test@example.com');

        const passwordInput = await driver.findElement(By.css('[placeholder="Password"]'));
        await passwordInput.sendKeys('password123');

        const loginBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Login Account')]"));
        assert.ok(await loginBtn.isDisplayed());
    });
});
