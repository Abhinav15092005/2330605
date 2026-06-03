import { useState, useEffect } from 'react';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [priorityNotifs, setPriorityNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [limit, setLimit] = useState(10);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2FpbWwwODFAY2djamhhbmplcmkuaW4iLCJleHAiOjE3ODA0ODI0MDEsImlhdCI6MTc4MDQ4MTUwMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImJjZjFkYmFlLWU3MjMtNDA3Ny05M2I5LTgyOTJmMzE3Y2YyNyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaGluYXYgcGFuZGV5Iiwic3ViIjoiY2FhZDU5NTQtMjdmZS00MjVhLWFiYWQtZmRjZmM3NjhjNjgzIn0sImVtYWlsIjoiMjNhaW1sMDgxQGNnY2poYW5qZXJpLmluIiwibmFtZSI6ImFiaGluYXYgcGFuZGV5Iiwicm9sbE5vIjoiMjMzMDYwNSIsImFjY2Vzc0NvZGUiOiJud3dzS3giLCJjbGllbnRJRCI6ImNhYWQ1OTU0LTI3ZmUtNDI1YS1hYmFkLWZkY2ZjNzY4YzY4MyIsImNsaWVudFNlY3JldCI6ImtOWlpIQW5GVUtCUlFObmUifQ.YIVV7yaBgguJ58OQqtjP92tIKzcFtGAfrZga4n70r0I';

  const getWeight = (type) => {
    if (type === 'Placement') return 3;
    if (type === 'Result') return 2;
    return 1;
  };

  const getPriorityScore = (notif) => {
    return (getWeight(notif.Type) * 1000000000000) + new Date(notif.Timestamp).getTime();
  };

  const getTopPriority = (notifs, n) => {
    if (!notifs || notifs.length === 0) return [];
    return [...notifs].sort((a, b) => getPriorityScore(b) - getPriorityScore(a)).slice(0, n);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://4.224.186.213/evaluation-service/notifications', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        const notifs = data.notifications || [];
        setNotifications(notifs);
        setPriorityNotifs(getTopPriority(notifs, limit));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    setPriorityNotifs(getTopPriority(notifications, limit));
  }, [limit, notifications]);

  const filteredNotifs = filter === 'all' ? notifications : notifications.filter(n => n.Type === filter);

  const getColor = (type) => {
    if (type === 'Placement') return 'linear-gradient(135deg, #1e3c72, #2a5298)';
    if (type === 'Result') return 'linear-gradient(135deg, #f2994a, #f2c94c)';
    return 'linear-gradient(135deg, #11998e, #38ef7d)';
  };

  const getIcon = (type) => {
    if (type === 'Placement') return '🏢';
    if (type === 'Result') return '📊';
    return '🎉';
  };

  const stats = {
    total: notifications.length,
    placement: notifications.filter(n => n.Type === 'Placement').length,
    result: notifications.filter(n => n.Type === 'Result').length,
    event: notifications.filter(n => n.Type === 'Event').length
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Fetching notifications from server...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>📬 Campus Notification System</h1>
        <p style={styles.subtitle}>Afford Medical Technologies | Full Stack Evaluation</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total Notifications</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #1e3c72, #2a5298)'}}>
          <div style={styles.statValue}>{stats.placement}</div>
          <div style={styles.statLabel}>🏢 Placements</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f2994a, #f2c94c)'}}>
          <div style={styles.statValue}>{stats.result}</div>
          <div style={styles.statLabel}>📊 Results</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #11998e, #38ef7d)'}}>
          <div style={styles.statValue}>{stats.event}</div>
          <div style={styles.statLabel}>🎉 Events</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setActiveTab('all')}
          style={{...styles.tab, ...(activeTab === 'all' ? styles.tabActive : {})}}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          📋 All Notifications
          <span style={styles.tabCount}>{stats.total}</span>
        </button>
        <button 
          onClick={() => setActiveTab('priority')}
          style={{...styles.tab, ...(activeTab === 'priority' ? styles.tabActive : {})}}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🔥 Priority Inbox
          <span style={styles.tabCount}>{limit}</span>
        </button>
      </div>

      {/* Priority Controls */}
      {activeTab === 'priority' && (
        <div style={styles.controlsContainer}>
          <label style={styles.controlLabel}>📌 Show Top:</label>
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            style={styles.select}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      )}

      {/* Filter Buttons */}
      {activeTab === 'all' && (
        <div style={styles.filterContainer}>
          {['all', 'Placement', 'Result', 'Event'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? styles.filterBtnActive : {}),
                ...(f === 'Placement' && filter !== f ? styles.filterBtnPlacement : {}),
                ...(f === 'Result' && filter !== f ? styles.filterBtnResult : {}),
                ...(f === 'Event' && filter !== f ? styles.filterBtnEvent : {}),
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {f === 'all' ? 'All' : `${getIcon(f)} ${f}`}
            </button>
          ))}
        </div>
      )}

      {/* Notifications List */}
      <div style={styles.notificationsList}>
        {(activeTab === 'all' ? filteredNotifs : priorityNotifs).map((n, index) => (
          <div
            key={n.ID}
            style={{
              ...styles.card,
              animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
              borderLeftColor: n.Type === 'Placement' ? '#1e3c72' : (n.Type === 'Result' ? '#f2994a' : '#11998e')
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardType}>
                <span style={styles.cardIcon}>{getIcon(n.Type)}</span>
                <span style={{...styles.cardTypeText, color: n.Type === 'Placement' ? '#1e3c72' : (n.Type === 'Result' ? '#f2994a' : '#11998e')}}>
                  {n.Type}
                </span>
              </div>
              <div style={styles.cardTime}>
                <span style={styles.clockIcon}>🕐</span> {n.Timestamp}
              </div>
            </div>
            <div style={styles.cardMessage}>{n.Message}</div>
            {activeTab === 'priority' && (
              <div style={styles.priorityScore}>
                <span style={styles.scoreIcon}>📊</span> Priority Score: {getPriorityScore(n).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>Priority Algorithm: (Type Weight × 1,000,000,000,000) + Timestamp | Weights: Placement(3) &gt; Result(2) &gt; Event(1)</p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: '#f0f2f5',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a237e',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #1a237e, #4a148c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    color: 'white',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.9,
    marginTop: '5px'
  },
  tabsContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    background: 'white',
    padding: '10px',
    borderRadius: '50px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  tab: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '40px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  tabActive: {
    background: 'linear-gradient(135deg, #1a237e, #4a148c)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(26,35,126,0.3)'
  },
  tabCount: {
    background: 'rgba(255,255,255,0.2)',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '0.8rem'
  },
  controlsContainer: {
    background: 'white',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  controlLabel: {
    fontWeight: '600',
    color: '#333'
  },
  select: {
    padding: '8px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  filterContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '25px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  filterBtn: {
    padding: '10px 24px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
    color: '#555',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #1a237e, #4a148c)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(26,35,126,0.3)'
  },
  filterBtnPlacement: { borderLeft: '3px solid #1e3c72' },
  filterBtnResult: { borderLeft: '3px solid #f2994a' },
  filterBtnEvent: { borderLeft: '3px solid #11998e' },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    borderLeft: '5px solid',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  cardType: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  cardIcon: {
    fontSize: '1.4rem'
  },
  cardTypeText: {
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  cardTime: {
    fontSize: '0.8rem',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  clockIcon: {
    fontSize: '0.9rem'
  },
  cardMessage: {
    fontSize: '1.1rem',
    color: '#333',
    fontWeight: '500',
    marginBottom: '8px'
  },
  priorityScore: {
    fontSize: '0.75rem',
    color: '#999',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  scoreIcon: {
    fontSize: '0.8rem'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    padding: '20px',
    color: '#999',
    fontSize: '0.8rem',
    borderTop: '1px solid #ddd'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: 'white',
    marginTop: '20px',
    fontSize: '1.1rem'
  }
};

export default App;