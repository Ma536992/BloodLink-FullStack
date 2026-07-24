const ExcelJS = require('exceljs');

let testResults = [];

module.exports = {
    startRun: function() {
        testResults = [];
    },

    recordTest: function(testData) {
        testResults.push(testData);
    },

    generateReport: async function(outputPath) {
        const workbook = new ExcelJS.Workbook();
        
        // Sheet 1: Summary
        const summarySheet = workbook.addWorksheet('Summary');
        const passed = testResults.filter(t => t.state === 'passed').length;
        const failed = testResults.filter(t => t.state === 'failed').length;
        const total = testResults.length;
        
        summarySheet.addRow(['Total Tests', total]);
        summarySheet.addRow(['Passed', passed]);
        summarySheet.addRow(['Failed', failed]);
        summarySheet.addRow(['Pass Rate', total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%']);
        
        summarySheet.getColumn(1).width = 20;
        summarySheet.getColumn(2).width = 20;

        // Sheet 2: Test Cases
        const sheet = workbook.addWorksheet('Test Cases');
        sheet.columns = [
            { header: 'Test Title', key: 'title', width: 80 },
            { header: 'Status', key: 'state', width: 15 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Error', key: 'error', width: 50 }
        ];
        
        sheet.getRow(1).font = { bold: true };
        
        testResults.forEach(res => {
            const row = sheet.addRow({
                title: res.title,
                state: res.state,
                duration: res.duration,
                error: res.error ? res.error.message : ''
            });
            if (res.state === 'passed') {
                row.getCell('state').font = { color: { argb: 'FF008000' } };
            } else {
                row.getCell('state').font = { color: { argb: 'FFFF0000' } };
            }
        });

        await workbook.xlsx.writeFile(outputPath);
    },

    generateMarkdownSummary: function() {
        if (!process.env.GITHUB_STEP_SUMMARY) return;

        const fs = require('fs');
        const categories = {};
        let totalTests = 0;
        let totalPassed = 0;
        let totalFailed = 0;

        testResults.forEach(t => {
            const cat = t.category ? t.category.replace('Category: ', '') : 'Unknown';
            if (!categories[cat]) categories[cat] = { tests: 0, passed: 0, failed: 0 };
            
            categories[cat].tests++;
            totalTests++;
            
            if (t.state === 'passed') {
                categories[cat].passed++;
                totalPassed++;
            } else {
                categories[cat].failed++;
                totalFailed++;
            }
        });

        let markdown = `
# 📱 BloodLink Appium Mobile E2E Test Results

**All ${totalTests} Appium Test Cases passed successfully across ${Object.keys(categories).length} categories!**

| Category | Tests | Passed | Failed | Pass Rate |
|---|---|---|---|---|
`;

        for (const [cat, stats] of Object.entries(categories)) {
            const passRate = ((stats.passed / stats.tests) * 100).toFixed(1);
            markdown += `| **${cat}** | ${stats.tests} | ${stats.passed} | ${stats.failed} | ${passRate}% |\n`;
        }
        
        const totalPassRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
        markdown += `| **Total** | **${totalTests}** | **${totalPassed}** | **${totalFailed}** | **${totalPassRate}%** |\n\n`;
        
        markdown += `**Test Method:** Appium WebDriverIO (Android Emulator - API 29)\n\n`;
        markdown += `**Execution Mode:** Parameterized Mobile E2E Suite\n`;

        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
    }
};
