const https = require('https');
const http = require('http');

function getTypeWeight(type) {
    switch(type) {
        case 'Placement': return 3;
        case 'Result': return 2;
        case 'Event': return 1;
        default: return 0;
    }
}

function calculatePriorityScore(notification) {
    const typeWeight = getTypeWeight(notification.Type);
    const timestamp = new Date(notification.Timestamp).getTime();
    return (typeWeight * 1000000000000) + timestamp;
}

function getTop10Notifications(notifications) {
    const withPriority = notifications.map(n => ({
        ...n,
        priorityScore: calculatePriorityScore(n)
    }));
    
    withPriority.sort((a, b) => b.priorityScore - a.priorityScore);
    return withPriority.slice(0, 10);
}

function fetchNotifications() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '4.224.186.213',
            path: '/evaluation-service/notifications',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2FpbWwwODFAY2djamhhbmplcmkuaW4iLCJleHAiOjE3ODA0Nzk4ODUsImlhdCI6MTc4MDQ3ODk4NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY1OWQ4YTJlLTE2NjMtNDQ3Zi1hNWI5LWVhYTQxZTJlOTI5MiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaGluYXYgcGFuZGV5Iiwic3ViIjoiY2FhZDU5NTQtMjdmZS00MjVhLWFiYWQtZmRjZmM3NjhjNjgzIn0sImVtYWlsIjoiMjNhaW1sMDgxQGNnY2poYW5qZXJpLmluIiwibmFtZSI6ImFiaGluYXYgcGFuZGV5Iiwicm9sbE5vIjoiMjMzMDYwNSIsImFjY2Vzc0NvZGUiOiJud3dzS3giLCJjbGllbnRJRCI6ImNhYWQ1OTU0LTI3ZmUtNDI1YS1hYmFkLWZkY2ZjNzY4YzY4MyIsImNsaWVudFNlY3JldCI6ImtOWlpIQW5GVUtCUlFObmUifQ.EjRteDWwT1YTd4O03SesYoYrLVaM_eSXykSCd8rzN_c'
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.notifications || []);
                } catch(e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log('='.repeat(60));
    console.log('PRIORITY INBOX - TOP 10 NOTIFICATIONS');
    console.log('='.repeat(60));
    console.log('');
    
    try {
        const notifications = await fetchNotifications();
        
        if (notifications.length === 0) {
            console.log('No notifications found.');
            return;
        }
        
        const top10 = getTop10Notifications(notifications);
        
        console.log(`Total notifications: ${notifications.length}`);
        console.log(`Showing top ${top10.length} by priority (Placement > Result > Event, then by recency)`);
        console.log('');
        
        top10.forEach((n, index) => {
            const priorityLabel = n.Type === 'Placement' ? '🔥 HIGH' : (n.Type === 'Result' ? '📘 MEDIUM' : '📌 LOW');
            console.log(`${index + 1}. [${priorityLabel}] ${n.Type}`);
            console.log(`   Message: ${n.Message}`);
            console.log(`   Time: ${n.Timestamp}`);
            console.log(`   ID: ${n.ID.substring(0, 8)}...`);
            console.log('');
        });
        
    } catch(error) {
        console.error('Error fetching notifications:', error.message);
    }
}

main();