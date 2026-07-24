const fs = require('fs');

function getMetricValue(metricObj, key) {
    if (!metricObj) return 'N/A';
    // Defensive extraction check for nested vs flat
    if (metricObj.values && metricObj.values[key] !== undefined) {
        return metricObj.values[key];
    }
    if (metricObj[key] !== undefined) {
        return metricObj[key];
    }
    return 'N/A';
}

function parseSummary() {
    try {
        const data = fs.readFileSync('summary.json', 'utf8');
        const summary = JSON.parse(data);
        const metrics = summary.metrics;

        const totalReqs = getMetricValue(metrics.http_reqs, 'count');
        const rps = getMetricValue(metrics.http_reqs, 'rate');
        const p95 = getMetricValue(metrics.http_req_duration, 'p(95)');
        const avg = getMetricValue(metrics.http_req_duration, 'avg');
        const fails = getMetricValue(metrics.http_req_failed, 'rate');

        const markdown = `
# 📈 API Load Test Performance Summary
| Metric | Value | Threshold |
|---|---|---|
| **Total Requests** | ${totalReqs} | - |
| **Throughput (RPS)** | ${typeof rps === 'number' ? rps.toFixed(2) : rps} | - |
| **Avg Latency** | ${typeof avg === 'number' ? avg.toFixed(2) : avg} ms | - |
| **p95 Latency** | ${typeof p95 === 'number' ? p95.toFixed(2) : p95} ms | < 1500 ms |
| **Failure Rate** | ${typeof fails === 'number' ? (fails * 100).toFixed(2) : fails}% | < 5% |

> [!NOTE]
> Tested with 100 Virtual Users over 1 minute.
`;
        
        fs.writeFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, { flag: 'a' });
        console.log('✅ k6 Summary parsed and written to GHA Step Summary.');

    } catch (e) {
        console.error('Failed to parse k6 summary:', e);
        process.exit(1);
    }
}

parseSummary();
