import React, { useState, useEffect, useCallback } from 'react';
import { FaUserShield, FaEnvelope, FaBell, FaCalendar, FaSignOutAlt, FaChartLine, FaCamera, FaCheck, FaTimes, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Dashboard.css';

const CaretakerDashboard = ({ onSwitch = () => {} }) => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [logs, setLogs] = useState([
    { id: 1, medication_id: 1, status: 'taken', taken_at: '2025-06-20T08:00:00Z', photo_url: null },
    { id: 2, medication_id: 2, status: 'taken', taken_at: '2025-06-19T07:30:00Z', photo_url: null },
    { id: 3, medication_id: 3, status: 'missed', taken_at: '2025-06-18T09:00:00Z', photo_url: null },
  ]);

  const patientData = {
    name: "Eleanor Thompson",
    age: 72,
    condition: "Hypertension & Diabetes",
    emergencyContact: "+1 (555) 123-4567",
    adherenceRate: 85,
    currentStreak: 5,
    missedThisMonth: 3,
    takenThisWeek: 4,
    totalMedications: 4,
    nextDose: "2:00 PM - Metformin",
    riskLevel: "Low",
  };

  const calculateAdherence = useCallback(() => {
    if (!logs.length) return 0;
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
    const recentLogs = logs.filter(log => new Date(log.taken_at) >= new Date(oneMonthAgo) && log.status === 'taken');
    const totalDays = 30;
    const takenDays = new Set(recentLogs.map(log => new Date(log.taken_at).toDateString())).size;
    return totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0;
  }, [logs]);

  const calculateStreak = useCallback(() => {
    if (!logs.length) return 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasLog = sortedLogs.some(log => 
        log.taken_at.includes(dateStr) && log.status === 'taken'
      );
      if (hasLog) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [logs]);

  const calculateMissedThisMonth = useCallback(() => {
    if (!logs.length) return 0;
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
    const takenDates = new Set(logs.filter(log => log.taken_at >= oneMonthAgo && log.status === 'taken').map(log => new Date(log.taken_at).toDateString()));
    const totalDays = 30;
    return totalDays - takenDates.size;
  }, [logs]);

  const calculateTakenThisWeek = useCallback(() => {
    if (!logs.length) return 0;
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
    return logs.filter(log => log.taken_at >= oneWeekAgo && log.status === 'taken').length;
  }, [logs]);

  useEffect(() => {
    const mockNotifications = [
      { id: 1, type: 'missed', message: 'Eleanor missed evening medication', time: '2 hours ago', urgent: true },
      { id: 2, type: 'taken', message: 'Morning medication taken successfully', time: '6 hours ago', urgent: false },
      { id: 3, type: 'reminder', message: 'Next dose reminder sent', time: '1 day ago', urgent: false },
    ];
    setNotifications(mockNotifications);

    const mockActivity = [
      { id: 1, action: 'Medication taken', details: 'Lisinopril 10mg', time: '8:00 AM', status: 'success' },
      { id: 2, action: 'Reminder sent', details: 'Evening dose notification', time: '6:00 PM', status: 'info' },
      { id: 3, action: 'Medication missed', details: 'Aspirin 81mg', time: '9:00 AM', status: 'warning' },
    ];
    setRecentActivity(mockActivity);
  }, []);

  const adherenceRate = calculateAdherence();
  const currentStreak = calculateStreak();
  const missedThisMonth = calculateMissedThisMonth();
  const takenThisWeek = calculateTakenThisWeek();
  const daysTaken = new Set(logs.filter(log => log.status === 'taken').map(log => new Date(log.taken_at).toDateString())).size || 0;
  const daysRemaining = 30 - daysTaken - missedThisMonth;

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    let current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const hasLog = logs.some(log => log.taken_at.includes(dateStr) && log.status === 'taken');
      const isToday = current.toDateString() === new Date().toDateString();
      const isCurrentMonth = current.getMonth() === month;
      const isSelected = current.toDateString() === selectedDate.toDateString();

      days.push({
        date: new Date(current),
        dateStr,
        hasLog,
        isToday,
        isCurrentMonth,
        isSelected,
        day: current.getDate(),
      });

      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleEmergencyCall = () => {
    alert('Calling emergency contact: ' + patientData.emergencyContact);
  };

  const handleSendReminder = () => {
    alert('Reminder sent to ' + patientData.name);
  };

  const handleVideoCall = () => {
    alert('Starting video call with ' + patientData.name);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll position to top
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <div className="logo-section">
        <div className="logo">
          <span>M</span>
        </div>
        <h1>MediCare Companion</h1>
        <p>Caretaker Dashboard</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => onSwitch('patient')}
          style={{
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Switch to Patient
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #2ecc71 0%, #3498db 100%)',
        color: 'white',
        borderRadius: '16px',
        padding: '30px',
        textAlign: 'center',
        marginBottom: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}! <FaUserShield />
        </h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', opacity: '0.9' }}>
          Monitoring {patientData.name}'s medication adherence
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{adherenceRate}%</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Adherence Rate</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{currentStreak}</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Day Streak</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{missedThisMonth}</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Missed This Month</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{takenThisWeek}</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Taken This Week</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
          { id: 'activity', label: 'Recent Activity', icon: <FaCalendar /> },
          { id: 'calendar', label: 'Calendar View', icon: <FaCalendar /> },
          { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              background: selectedTab === tab.id ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' : '#fff',
              color: selectedTab === tab.id ? '#fff' : '#2c3e50',
              border: '1px solid #e9ecef',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: selectedTab === tab.id ? '0 4px 10px rgba(46, 204, 113, 0.3)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {selectedTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
              <FaChartLine /> Today's Status
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
                Daily Medication Set: {patientData.totalMedications}
              </div>
              <div style={{ color: '#6c757d' }}>Next: {patientData.nextDose}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', background: '#f8fff8', borderRadius: '12px', borderLeft: '4px solid #2ecc71' }}>
                <FaCheck style={{ color: '#2ecc71', fontSize: '1.5rem', marginBottom: '10px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2ecc71' }}>3</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Taken Today</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: '#fff5f5', borderRadius: '12px', borderLeft: '4px solid #e74c3c' }}>
                <FaTimes style={{ color: '#e74c3c', fontSize: '1.5rem', marginBottom: '10px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e74c3c' }}>1</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Missed Today</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
              <FaArrowUp /> Quick Actions
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <button
                onClick={handleSendReminder}
                style={{
                  background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                <FaEnvelope /> Send Reminder
              </button>
              <button
                onClick={handleVideoCall}
                style={{
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                <FaCamera /> Start Video Call
              </button>
              <button
                onClick={() => alert('Notifications configured')}
                style={{
                  background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                <FaBell /> Configure Notifications
              </button>
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
              <FaArrowUp /> Monthly Adherence Progress
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '1rem', color: '#6c757d' }}>Overall Progress</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2c3e50' }}>{adherenceRate}%</span>
              </div>
              <div style={{ width: '100%', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden', height: '8px' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)', borderRadius: '10px', width: `${adherenceRate}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2ecc71' }}>{daysTaken}</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Days Taken</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#e74c3c' }}>{missedThisMonth}</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Days Missed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#3498db' }}>{daysRemaining}</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Days Remaining</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'activity' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
              <FaCalendar /> Recent Activity
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {recentActivity.map((activity) => (
                <div key={activity.id} style={{
                  padding: '15px',
                  borderLeft: '4px solid',
                  borderLeftColor: activity.status === 'success' ? '#2ecc71' : activity.status === 'warning' ? '#e74c3c' : '#3498db',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: activity.status === 'success' ? '#2ecc71' : activity.status === 'warning' ? '#e74c3c' : '#3498db',
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#2c3e50' }}>{activity.action}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#6c757d' }}>{activity.details}</p>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'calendar' && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
        }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
            <FaCalendar /> Medication Calendar
          </h3>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2ecc71' }}></div>
              Medication Taken
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3498db' }}></div>
              Today
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f39c12' }}></div>
              Selected
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }}
            >
              ◀
            </button>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }}
            >
              ▶
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '10px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: '600', padding: '8px', fontSize: '0.9rem', color: '#6c757d' }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDate(day.date)}
                style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  position: 'relative',
                  background: day.isSelected ? '#f39c12' : day.isToday ? '#3498db' : day.isCurrentMonth ? '#fff' : '#f8f9fa',
                  color: day.isSelected || day.isToday ? 'white' : day.isCurrentMonth ? '#2c3e50' : '#adb5bd',
                  fontWeight: day.isToday || day.isSelected ? '600' : 'normal',
                  border: '1px solid',
                  borderColor: day.isSelected ? '#e67e22' : day.isToday ? '#2980b9' : '#e9ecef',
                  transition: 'all 0.2s ease',
                }}
              >
                {day.day}
                {day.hasLog && (
                  <div style={{
                    position: 'absolute',
                    bottom: '3px',
                    right: '3px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: day.isSelected || day.isToday ? '#fff' : '#2ecc71',
                  }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'notifications' && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
        }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
            <FaBell /> Notifications
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: '15px',
                  borderLeft: '4px solid',
                  borderLeftColor: notification.urgent ? '#e74c3c' : notification.type === 'taken' ? '#2ecc71' : '#3498db',
                  background: notification.urgent ? '#fff5f5' : notification.type === 'taken' ? '#f8fff8' : '#f0f8ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: notification.urgent ? '#e74c3c' : notification.type === 'taken' ? '#2ecc71' : '#3498db',
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#2c3e50' }}>{notification.message}</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#6c757d' }}>{notification.time}</p>
                </div>
                {notification.urgent && (
                  <span style={{ padding: '5px 10px', background: '#e74c3c', color: '#fff', borderRadius: '12px', fontSize: '0.8rem' }}>
                    Urgent
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaretakerDashboard;
