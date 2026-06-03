const https = require('https');
const http = require('http');
const fs = require('fs');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

function getTypeWeight(type) {
    switch(type) {
        case 'Placement': return 3;
        case 'Result': return 2;
        case 'Event': return 1;
        default: return 0;
    }
}

function getTypeEmoji(type) {
    switch(type) {
        case 'Placement': return '🏢';
        case 'Result': return '📊';
        case 'Event': return '🎉';
        default: return '📌';
    }
}

function calculatePriorityScore(notification) {
    const typeWeight = getTypeWeight(notification.Type);
    const timestamp = new Date(notification.Timestamp).getTime();
    // Formula: (weight * 1 trillion) + timestamp for unique sorting
    return (typeWeight * 1000000000000) + timestamp;
}

function getTopNotifications(notifications, limit = 10) {
    const withPriority = notifications.map(n => ({
        ...n,
        priorityScore: calculatePriorityScore(n),
        typeWeight: getTypeWeight(n.Type)
    }));
    
    withPriority.sort((a, b) => b.priorityScore - a.priorityScore);
    return withPriority.slice(0, limit);
}

function getStats(notifications) {
    const stats = {
        Placement: 0,
        Result: 0,
        Event: 0
    };
    notifications.forEach(n => {
        stats[n.Type]++;
    });
    return stats;
}

function fetchNotifications() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '4.224.186.213',
            path: '/evaluation-service/notifications',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2FpbWwwODFAY2djamhhbmplcmkuaW4iLCJleHAiOjE3ODA0ODExNTQsImlhdCI6MTc4MDQ4MDI1NCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImIyYTI2YjJiLWFjZjMtNGFiNC1iNTI4LWQ0MTRlNGM3ZDRiMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaGluYXYgcGFuZGV5Iiwic3ViIjoiY2FhZDU5NTQtMjdmZS00MjVhLWFiYWQtZmRjZmM3NjhjNjgzIn0sImVtYWlsIjoiMjNhaW1sMDgxQGNnY2poYW5qZXJpLmluIiwibmFtZSI6ImFiaGluYXYgcGFuZGV5Iiwicm9sbE5vIjoiMjMzMDYwNSIsImFjY2Vzc0NvZGUiOiJud3dzS3giLCJjbGllbnRJRCI6ImNhYWQ1OTU0LTI3ZmUtNDI1YS1hYmFkLWZkY2ZjNzY4YzY4MyIsImNsaWVudFNlY3JldCI6ImtOWlpIQW5GVUtCUlFObmUifQ.I8OVxVFemc1OaOjIJjrFjicZcT5uFszeYUIvt0A8jE0'
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
    console.log(colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.magenta + '   🏆 AFFORD MEDICAL TECHNOLOGIES - PRIORITY INBOX 🏆' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset);
    console.log('');
    console.log(colors.yellow + '📅 Date:' + colors.reset + ' ' + new Date().toLocaleString());
    console.log(colors.yellow + '👤 Candidate:' + colors.reset + ' Abhinav Pandey (Roll No: 2330605)');
    console.log(colors.yellow + '📚 College:' + colors.reset + ' CGC University, Mohali');
    console.log('');
    
    try {
        const notifications = await fetchNotifications();
        
        if (notifications.length === 0) {
            console.log(colors.red + '❌ No notifications found.' + colors.reset);
            return;
        }
        
        const stats = getStats(notifications);
        const top10 = getTopNotifications(notifications, 10);
        
        // Display Statistics
        console.log(colors.green + '📊 NOTIFICATION STATISTICS' + colors.reset);
        console.log(colors.cyan + '─'.repeat(40) + colors.reset);
        console.log(`   📋 Total Notifications: ${colors.bright}${notifications.length}${colors.reset}`);
        console.log(`   🏢 Placement: ${colors.green}${stats.Placement}${colors.reset} (Priority: HIGH - Weight: 3)`);
        console.log(`   📊 Result: ${colors.yellow}${stats.Result}${colors.reset} (Priority: MEDIUM - Weight: 2)`);
        console.log(`   🎉 Event: ${colors.blue}${stats.Event}${colors.reset} (Priority: LOW - Weight: 1)`);
        console.log('');
        
        // Display Priority Algorithm
        console.log(colors.green + '⚙️ PRIORITY ALGORITHM' + colors.reset);
        console.log(colors.cyan + '─'.repeat(40) + colors.reset);
        console.log(`   Score = (Type Weight × 1,000,000,000,000) + Timestamp(ms)`);
        console.log(`   Type Weights: Placement=3, Result=2, Event=1`);
        console.log(`   Higher score = Higher priority`);
        console.log('');
        
        // Display Top 10 Priority Inbox
        console.log(colors.green + '🔥 TOP 10 PRIORITY INBOX' + colors.reset);
        console.log(colors.cyan + '='.repeat(70) + colors.reset);
        console.log('');
        
        top10.forEach((n, index) => {
            let priorityColor, priorityLabel, priorityIcon;
            if (n.Type === 'Placement') {
                priorityColor = colors.green;
                priorityLabel = 'HIGHEST';
                priorityIcon = '🔥🔥🔥';
            } else if (n.Type === 'Result') {
                priorityColor = colors.yellow;
                priorityLabel = 'MEDIUM';
                priorityIcon = '📘📘';
            } else {
                priorityColor = colors.blue;
                priorityLabel = 'LOW';
                priorityIcon = '📌';
            }
            
            console.log(priorityColor + `${index + 1}. ${priorityIcon} [${priorityLabel}] ${getTypeEmoji(n.Type)} ${n.Type}` + colors.reset);
            console.log(`   📝 Message: ${colors.bright}${n.Message}${colors.reset}`);
            console.log(`   🕐 Time: ${n.Timestamp}`);
            console.log(`   🆔 ID: ${n.ID.substring(0, 8)}...`);
            console.log(`   📊 Priority Score: ${priorityColor}${n.priorityScore}${colors.reset}`);
            console.log('');
        });
        
        console.log(colors.cyan + '='.repeat(70) + colors.reset);
        console.log(colors.bright + colors.magenta + '   ✅ Priority Inbox Generated Successfully!' + colors.reset);
        console.log(colors.cyan + '='.repeat(70) + colors.reset);
        
        // Save output to file for submission
        const output = {
            timestamp: new Date().toISOString(),
            candidate: {
                name: "Abhinav Pandey",
                rollNo: "2330605",
                college: "CGC University, Mohali",
                githubUsername: "Abhinav15092005"
            },
            statistics: stats,
            totalNotifications: notifications.length,
            top10Notifications: top10.map(n => ({
                rank: null,
                type: n.Type,
                message: n.Message,
                timestamp: n.Timestamp,
                id: n.ID
            }))
        };
        
        top10.forEach((n, i) => { output.top10Notifications[i].rank = i + 1; });
        
        fs.writeFileSync('priority_output.json', JSON.stringify(output, null, 2));
        console.log('\n' + colors.green + '📁 Output saved to priority_output.json' + colors.reset);
        
    } catch(error) {
        console.error(colors.red + '❌ Error fetching notifications:', error.message + colors.reset);
    }
}

main();