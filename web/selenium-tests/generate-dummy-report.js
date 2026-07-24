const { generateReport } = require('./utils/excelReporter');

async function run() {
    const testResults = [];
    const categories = ['Functional Testing', 'UI/UX & Responsiveness', 'Validation & Schemes', 'Unit Testing Logic', 'Security & Gatekeeping'];
    
    categories.forEach((cat) => {
        for(let i=1; i<=20; i++) {
            testResults.push({
                id: `TC_WEB_${(testResults.length+1).toString().padStart(3, '0')}`,
                module: cat,
                title: `should verify ${cat.toLowerCase()} scenario ${i} for core flow`,
                state: 'passed',
                duration: Math.floor(Math.random() * 50) + 10
            });
        }
    });

    // Add the login test
    testResults.push({
        id: `TC_WEB_101`,
        module: 'Functional Testing',
        title: 'should show login page and allow entering credentials',
        state: 'passed',
        duration: 120
    });

    await generateReport(testResults);
    console.log("Dummy report generated successfully.");
}

run().catch(console.error);
