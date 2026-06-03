import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:3000/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus('Backend not running (start with node server.js)'));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Notification App</h1>
      <div style={{ background: '#e0e0e0', padding: '20px', borderRadius: '10px' }}>
        <h3>Backend Status:</h3>
        <p>{status}</p>
      </div>
      <p style={{ marginTop: '20px', fontSize: '12px', color: 'gray' }}>
        Roll Number: 2330605
      </p>
    </div>
  );
}

export default App;