const http = require('http');

async function Log(stack, level, package, message) {
    const allowedStacks = ['backend', 'frontend'];
    const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    
    if (!allowedStacks.includes(stack)) {
        console.log('Invalid stack:', stack);
        return;
    }
    if (!allowedLevels.includes(level)) {
        console.log('Invalid level:', level);
        return;
    }
    
    const logData = JSON.stringify({
        stack: stack,
        level: level,
        package: package,
        message: message
    });
    
    const options = {
        hostname: '4.224.186.213',
        path: '/evaluation-service/logs',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': logData.length
        }
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('Log sent:', data);
        });
    });
    
    req.on('error', (error) => {
        console.log('Log failed:', error.message);
    });
    
    req.write(logData);
    req.end();
}

module.exports = { Log };