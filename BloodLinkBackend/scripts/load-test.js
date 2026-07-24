import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 100,
    duration: '1m'
};

export default function () {
    // Target the Firebase Hosting URL or backend
    const url = __ENV.BACKEND_URL || 'https://Ma536992.github.io/BloodLink-FullStack/';
    
    const res = http.get(url);
    
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    
    // Tiny sleep to simulate real user pacing
    sleep(0.1);
}
