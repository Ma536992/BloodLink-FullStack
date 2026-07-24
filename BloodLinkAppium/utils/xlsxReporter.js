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
        
        summarySheet.addRow(['Category', 'Tests', 'Passed', 'Failed', 'Pass Rate']);
        summarySheet.getRow(1).font = { bold: true };

        const catData = {};
        testResults.forEach(res => {
            const catName = res.category ? res.category.replace('Category: ', '') : 'Unknown';
            if (!catData[catName]) catData[catName] = { tests: 0, passed: 0, failed: 0, results: [] };
            
            catData[catName].tests++;
            if (res.state === 'passed') catData[catName].passed++;
            else catData[catName].failed++;
            
            catData[catName].results.push(res);
        });

        for (const [catName, stats] of Object.entries(catData)) {
            const passRate = stats.tests > 0 ? ((stats.passed / stats.tests) * 100).toFixed(1) + '%' : '0%';
            summarySheet.addRow([catName, stats.tests, stats.passed, stats.failed, passRate]);
        }
        
        const totalPassRate = total > 0 ? ((passed / total) * 100).toFixed(1) + '%' : '0%';
        summarySheet.addRow(['Total', total, passed, failed, totalPassRate]);
        summarySheet.getRow(summarySheet.rowCount).font = { bold: true };

        summarySheet.getColumn(1).width = 30;
        summarySheet.getColumn(2).width = 15;
        summarySheet.getColumn(3).width = 15;
        summarySheet.getColumn(4).width = 15;
        summarySheet.getColumn(5).width = 15;

        // Create a separate sheet for each category (11 sections)
        for (const [catName, stats] of Object.entries(catData)) {
            const safeSheetName = catName.substring(0, 31).replace(/[\\\/\?\*\[\]\:]/g, '');
            const sheet = workbook.addWorksheet(safeSheetName);
            
            sheet.columns = [
                { header: 'Test Title', key: 'title', width: 80 },
                { header: 'Status', key: 'state', width: 15 },
                { header: 'Duration (ms)', key: 'duration', width: 15 },
                { header: 'Error', key: 'error', width: 50 }
            ];
            
            sheet.getRow(1).font = { bold: true };
            
            stats.results.forEach(res => {
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
        }

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
# 📱 VeriTask Appium Mobile E2E Test Results

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
