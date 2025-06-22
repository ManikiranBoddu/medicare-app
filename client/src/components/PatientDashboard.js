import React, { useEffect, useState, useCallback } from 'react';
import { FaUser, FaPills, FaCalendarAlt, FaSignOutAlt, FaCamera, FaCheck, FaTimes, FaPlus, FaTrash, FaBell, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = ({ onSwitch = () => {} }) => {
  const navigate = useNavigate();

  // Load initial state from localStorage or use defaults
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', time: '08:00' },
      { id: 2, name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', time: '08:00' }
    ];
  });
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('logs');
    return saved ? JSON.parse(saved) : [
      { id: 1, medication_id: 1, status: 'taken', taken_at: '2025-06-19T08:00:00Z', photo_url: null },
      { id: 2, medication_id: 2, status: 'taken', taken_at: '2025-06-19T08:00:00Z', photo_url: null }
    ];
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date('2025-06-22T02:40:00Z')); // Adjusted to 08:10 AM IST (UTC+5:30)
  const [viewDate, setViewDate] = useState(new Date('2025-06-22T02:40:00Z')); // Adjusted to 08:10 AM IST (UTC+5:30)
  const [selectedFile, setSelectedFile] = useState(null);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', time: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [streak, setStreak] = useState(0);

  // Save to localStorage whenever medications or logs change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
    localStorage.setItem('logs', JSON.stringify(logs));
    console.log('Logs updated in localStorage:', logs);
  }, [medications, logs]);

  // Calculate adherence rate
  const calculateAdherence = useCallback(() => {
    if (!medications.length || !logs.length) return 0;
    const now = new Date('2025-06-22T02:40:00Z'); // 08:10 AM IST
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    const recentLogs = logs.filter(log => new Date(log.taken_at) >= oneWeekAgo);
    
    let totalExpected = medications.length * 7;
    let totalTaken = recentLogs.filter(log => log.status === 'taken').length;
    
    return totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : 0;
  }, [medications, logs]);

  // Calculate streak
  const calculateStreak = useCallback((updatedLogs = logs) => {
    if (!updatedLogs.length || !medications.length) {
      console.log('No logs or medications, streak set to 0');
      return 0;
    }
    
    let streak = 0;
    const today = new Date('2025-06-22T02:40:00Z'); // 08:10 AM IST
    
    console.log('Starting streak calculation...');
    console.log('Total medications:', medications.length);
    console.log('Total logs:', updatedLogs.length);

    // Check each day starting from today going backwards
    for (let daysBack = 0; daysBack < 365; daysBack++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - daysBack);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      console.log(`Checking date: ${dateStr} (${daysBack} days back)`);

      // Get all logs for this date that are 'taken'
      const dayLogs = updatedLogs.filter(log => {
        const logDate = new Date(log.taken_at).toISOString().split('T')[0];
        const matches = logDate === dateStr && log.status === 'taken';
        if (matches) {
          console.log(`Found matching log: Med ID ${log.medication_id} on ${logDate}`);
        }
        return matches;
      });

      // Count unique medications taken on this day
      const medicationsTakenToday = new Set(dayLogs.map(log => log.medication_id));
      
      console.log(`Medications taken on ${dateStr}: ${medicationsTakenToday.size}/${medications.length}`);

      // Check if ALL medications were taken
      if (medicationsTakenToday.size === medications.length) {
        streak++;
        console.log(`✓ All meds taken on ${dateStr}. Streak: ${streak}`);
      } else {
        console.log(`✗ Not all meds taken on ${dateStr}. Breaking streak at: ${streak}`);
        break;
      }
    }
    
    console.log('Final calculated streak:', streak);
    return streak;
  }, [medications, logs]); // Include logs in dependencies

  // Initialize streak on mount
  useEffect(() => {
    // Only calculate streak if we have both medications and logs
    if (medications.length > 0) {
      const initialStreak = calculateStreak(logs);
      console.log('Setting initial streak to:', initialStreak);
      setStreak(initialStreak);
    } else {
      console.log('No medications found, setting streak to 0');
      setStreak(0);
    }
  }, [medications, logs, calculateStreak]); // Add all dependencies

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll position to top
  }, []);

  const isTodayTaken = useCallback(() => {
    const today = new Date('2025-06-22T02:40:00Z').toISOString().split('T')[0]; // 08:10 AM IST
    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.taken_at).toISOString().split('T')[0];
      return logDate === today && log.status === 'taken';
    });
    return todayLogs.length === medications.length;
  }, [logs, medications]);

  const markAsTaken = async (medicationId) => {
    try {
      const today = new Date('2025-06-22T02:40:00Z').toISOString(); // 08:10 AM IST
      const todayDateStr = today.slice(0, 10);
      
      const existingLog = logs.find(log => {
        const logDate = new Date(log.taken_at).toISOString().split('T')[0];
        return log.medication_id === medicationId && logDate === todayDateStr && log.status === 'taken';
      });
      
      if (existingLog) {
        setCompletionStatus({
          show: true,
          message: `You've already marked ${medications.find(m => m.id === medicationId).name} as taken today.`,
          type: 'success'
        });
        setTimeout(() => setCompletionStatus(null), 5000);
        return;
      }

      const newLog = {
        id: Date.now(),
        medication_id: medicationId,
        status: 'taken',
        taken_at: today,
        photo_url: selectedFile ? URL.createObjectURL(selectedFile) : null
      };
      
      setLogs(prev => {
        const updatedLogs = [...prev, newLog];
        console.log('New log added:', newLog);
        
        const updatedTodayLogs = updatedLogs.filter(log => {
          const logDate = new Date(log.taken_at).toISOString().split('T')[0];
          return logDate === todayDateStr && log.status === 'taken';
        });
        
        const allTaken = updatedTodayLogs.length === medications.length;

        if (allTaken) {
          const newStreak = calculateStreak(updatedLogs);
          console.log('Streak after all taken:', newStreak);
          setStreak(newStreak);
          
          setCompletionStatus({
            show: true,
            message: `Great job! You've taken all your medications for ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}. Your streak is now ${newStreak} days!`,
            type: 'success'
          });
        } else {
          const medication = medications.find(m => m.id === medicationId);
          setCompletionStatus({
            show: true,
            message: `Great job! You've taken your ${medication.name} for ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}.`,
            type: 'success'
          });
        }
        
        setTimeout(() => setCompletionStatus(null), 5000);
        return updatedLogs;
      });
      
      setSelectedFile(null);
    } catch (error) {
      setCompletionStatus({
        show: true,
        message: `Failed to mark medication as taken: ${error.message}`,
        type: 'error'
      });
    }
  };

  const markAllAsTaken = async () => {
    try {
      const today = new Date('2025-06-22T02:40:00Z').toISOString().slice(0, 10); // 08:10 AM IST
      const medicationsToMark = medications.filter(med => {
        return !logs.some(log => {
          const logDate = new Date(log.taken_at).toISOString().split('T')[0];
          return log.medication_id === med.id && logDate === today && log.status === 'taken';
        });
      });

      if (medicationsToMark.length === 0) {
        setCompletionStatus({
          show: true,
          message: `All medications are already marked as taken today.`,
          type: 'success'
        });
        setTimeout(() => setCompletionStatus(null), 5000);
        return;
      }

      const newLogs = medicationsToMark.map(med => ({
        id: Date.now() + med.id,
        medication_id: med.id,
        status: 'taken',
        taken_at: new Date('2025-06-22T02:40:00Z').toISOString(),
        photo_url: selectedFile ? URL.createObjectURL(selectedFile) : null
      }));

      setLogs(prev => {
        const updatedLogs = [...prev, ...newLogs];
        console.log('New logs added:', newLogs);
        
        const newStreak = calculateStreak(updatedLogs);
        console.log('Streak after all taken:', newStreak);
        setStreak(newStreak);
        
        setCompletionStatus({
          show: true,
          message: `Great job! You've taken all your medications for ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}. Your streak is now ${newStreak} days!`,
          type: 'success'
        });
        setTimeout(() => setCompletionStatus(null), 5000);
        return updatedLogs;
      });
      setSelectedFile(null);
    } catch (error) {
      setCompletionStatus({
        show: true,
        message: `Failed to mark medications as taken: ${error.message}`,
        type: 'error'
      });
    }
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.time) return;
    
    const medication = {
      id: Date.now(),
      ...newMedication
    };
    
    setMedications(prev => [...prev, medication]);
    setNewMedication({ name: '', dosage: '', frequency: '', time: '' });
    setShowAddForm(false);
  };

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    setLogs(prev => prev.filter(l => l.medication_id !== id));
  };

  const getMedicationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return medications.map(med => {
      const log = logs.find(log => {
        const logDate = new Date(log.taken_at).toISOString().split('T')[0];
        return log.medication_id === med.id && logDate === dateStr && log.status === 'taken';
      });
      return { ...med, takenOnDate: !!log, logData: log };
    });
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const hasLog = logs.some(log => {
        const logDate = new Date(log.taken_at).toISOString().split('T')[0];
        return logDate === dateStr && log.status === 'taken';
      });
      const isToday = current.toDateString() === new Date('2025-06-22T02:40:00Z').toDateString(); // 08:10 AM IST
      const isCurrentMonth = current.getMonth() === month;
      const isSelected = current.toDateString() === selectedDate.toDateString();
      
      days.push({
        date: new Date(current),
        dateStr,
        hasLog,
        isToday,
        isCurrentMonth,
        isSelected,
        day: current.getDate()
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const adherenceRate = calculateAdherence();
  const todayStatus = isTodayTaken();
  const calendarDays = generateCalendarDays();
  const medsForDate = getMedicationsForDate(viewDate);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <div className="logo-section">
        <div className="logo">
          <span>M</span>
        </div>
        <h1>MediCare Companion</h1>
        <p>Patient Dashboard</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button 
          onClick={() => onSwitch('caretaker')}
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
            gap: '8px'
          }}
        >
          Switch to Caretaker
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
            gap: '8px'
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
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          Good Morning! <FaUser /> {/* 08:10 AM IST is morning */}
        </h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', opacity: '0.9' }}>
          Ready to stay on track with your medication?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{streak}</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Day Streak</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{todayStatus ? '✓' : '○'}</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Today's Status</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '25px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{adherenceRate}%</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Weekly Rate</div>
          </div>
        </div>
      </div>

      {completionStatus && (
        <div style={{
          background: completionStatus.type === 'success' ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
            {completionStatus.type === 'success' ? '✓' : '✗'}
          </div>
          <h3 style={{ margin: '0 0 10px 0' }}>
            {completionStatus.type === 'success' ? 'Medication Completed!' : 'Error'}
          </h3>
          <p style={{ margin: '0', opacity: '0.9' }}>{completionStatus.message}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
            <FaPills /> Today's Medication
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
              Daily Medication Set: {medications.length}
            </div>
            <div style={{ color: '#6c757d' }}>Complete set of daily tablets</div>
          </div>

          <div style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px dashed #dee2e6' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <FaCamera style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '10px' }} />
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>Add Proof Photo (Optional)</div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                Take a photo of your medication or pill organizer as confirmation
              </div>
            </div>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            />
            
            {selectedFile && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          <button
            onClick={markAllAsTaken}
            disabled={isTodayTaken()}
            style={{
              width: '100%',
              background: isTodayTaken() ? '#28a745' : 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isTodayTaken() ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: medications.length === 0 ? 0.5 : 1
            }}
          >
            {isTodayTaken() ? <FaCheck /> : <FaPills />}
            {isTodayTaken() ? 'Completed for Today' : 'Mark as Taken'}
          </button>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
            <FaCalendarAlt /> Medication Calendar
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
              onClick={() => {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
                setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
              }}
              style={{
                background: '#3498db',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              ◀
            </button>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button
              onClick={() => {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
                setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
              }}
              style={{
                background: '#3498db',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
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
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedDate(day.date);
                  setViewDate(day.date);
                }}
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
                  transition: 'all 0.2s ease'
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
                    background: day.isSelected || day.isToday ? '#fff' : '#2ecc71'
                  }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '25px',
        marginTop: '25px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: '#2c3e50' }}>
            <FaPills /> Medications for {viewDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaPlus /> Add Medication
          </button>
        </div>

        {showAddForm && (
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Medication Name"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '8px' }}
              />
              <input
                type="text"
                placeholder="Dosage (e.g., 100mg)"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '8px' }}
              />
              <input
                type="text"
                placeholder="Frequency (e.g., Once daily)"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '8px' }}
              />
              <input
                type="time"
                value={newMedication.time}
                onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addMedication}
                style={{
                  background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Add Medication
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: '15px' }}>
          {medsForDate.map((med) => (
            <div key={med.id} style={{
              padding: '20px',
              border: '1px solid #e9ecef',
              borderRadius: '12px',
              background: med.takenOnDate ? '#f8fff8' : '#fff',
              borderLeft: `4px solid ${med.takenOnDate ? '#2ecc71' : '#dee2e6'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{med.name}</h4>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    {med.dosage} • {med.frequency} {med.time && `• ${med.time}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {med.takenOnDate && <FaCheck style={{ color: '#2ecc71', fontSize: '1.2rem' }} />}
                  <button
                    onClick={() => deleteMedication(med.id)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              {!med.takenOnDate && (
                <button
                  onClick={() => markAsTaken(med.id)}
                  style={{
                    background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaCheck /> Mark as Taken
                </button>
              )}
              
              {med.logData && med.logData.photo_url && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={med.logData.photo_url}
                    alt="Proof"
                    style={{
                      maxWidth: '150px',
                      maxHeight: '100px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {medications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <FaPills style={{ fontSize: '3rem', marginBottom: '15px', opacity: '0.3' }} />
            <p>No medications added yet. Click "Add Medication" to get started.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;