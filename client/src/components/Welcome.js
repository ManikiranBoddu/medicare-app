import React, { useState } from 'react';
import { User, Heart, Calendar, Camera, Bell, BarChart3, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Welcome = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleNavigation = (role) => {
    if (role === 'patient') {
      navigate('/dashboard');
    } else if (role === 'caretaker') {
      navigate('/caretaker');
    }
    if (onSwitch) onSwitch(role); // Call the switch handler if provided
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #f0fff0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      paddingTop: '48px',
      paddingBottom: '32px',
      textAlign: 'center'
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px',
      position: 'relative'
    },
    logo: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #3b82f6, #10b981)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    statusDot: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '24px',
      height: '24px',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    pulse: {
      width: '12px',
      height: '12px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
      lineHeight: '1.2'
    },
    titleGradient: {
      background: 'linear-gradient(135deg, #2563eb, #059669)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#6b7280',
      lineHeight: '1.6',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px'
    },
    cardsContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 16px 48px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    cardHeader: {
      height: '8px',
      width: '100%'
    },
    patientHeader: {
      background: 'linear-gradient(90deg, #60a5fa, #2563eb)'
    },
    caretakerHeader: {
      background: 'linear-gradient(90deg, #34d399, #059669)'
    },
    cardContent: {
      padding: '32px'
    },
    iconContainer: {
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
      transition: 'transform 0.3s ease'
    },
    patientIcon: {
      backgroundColor: '#dbeafe'
    },
    caretakerIcon: {
      backgroundColor: '#d1fae5'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '12px'
    },
    cardDescription: {
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    featureList: {
      marginBottom: '32px'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      gap: '12px'
    },
    featureDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      flexShrink: 0
    },
    patientDot: {
      backgroundColor: '#60a5fa'
    },
    caretakerDot: {
      backgroundColor: '#34d399'
    },
    featureIcon: {
      flexShrink: 0
    },
    featureText: {
      color: '#374151',
      fontWeight: '500'
    },
    button: {
      width: '100%',
      padding: '16px 24px',
      borderRadius: '16px',
      border: 'none',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
    },
    patientButton: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    caretakerButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)'
    },
    buttonHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.2)'
    },
    footer: {
      textAlign: 'center',
      marginTop: '48px'
    },
    footerNote: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      padding: '12px 24px',
      borderRadius: '50px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    footerDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#60a5fa',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    footerText: {
      color: '#6b7280',
      fontWeight: '500'
    },
    decorations: {
      position: 'fixed',
      borderRadius: '50%',
      opacity: 0.2,
      animation: 'pulse 3s infinite',
      pointerEvents: 'none'
    },
    decoration1: {
      top: '80px',
      left: '40px',
      width: '80px',
      height: '80px',
      backgroundColor: '#93c5fd'
    },
    decoration2: {
      top: '160px',
      right: '64px',
      width: '64px',
      height: '64px',
      backgroundColor: '#86efac',
      animationDelay: '1s'
    },
    decoration3: {
      bottom: '80px',
      left: '80px',
      width: '48px',
      height: '48px',
      backgroundColor: '#c4b5fd',
      animationDelay: '2s'
    },
    decoration4: {
      bottom: '160px',
      right: '40px',
      width: '96px',
      height: '96px',
      backgroundColor: '#f9a8d4',
      animationDelay: '0.5s'
    }
  };

  return (
    <div style={styles.container}>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
          }
          
          @media (max-width: 768px) {
            .cards-container {
              grid-template-columns: 1fr !important;
            }
            .title {
              font-size: 2rem !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <Heart size={40} color="white" />
            <div style={styles.statusDot}>
              <div style={styles.pulse}></div>
            </div>
          </div>
        </div>
        
        <h1 style={styles.title}>
          Welcome to <span style={styles.titleGradient}>MediCare Companion</span>
        </h1>
        <p style={styles.subtitle}>
          Your trusted partner in medication management. Choose your role to get started with personalized features.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div style={styles.cardsContainer} className="cards-container">
        {/* Patient Card */}
        <div
          style={{
            ...styles.card,
            ...(hoveredCard === 'patient' ? styles.cardHover : {})
          }}
          onMouseEnter={() => setHoveredCard('patient')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{ ...styles.cardHeader, ...styles.patientHeader }}></div>
          <div style={styles.cardContent}>
            <div style={{ ...styles.iconContainer, ...styles.patientIcon }}>
              <User size={32} color="#2563eb" />
            </div>
            <h3 style={styles.cardTitle}>I'm a Patient</h3>
            <p style={styles.cardDescription}>
              Track your medication schedule and maintain your health records with ease.
            </p>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.patientDot }}></div>
                <Calendar size={16} color="#3b82f6" style={styles.featureIcon} />
                <span style={styles.featureText}>Track your medication schedule</span>
              </div>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.patientDot }}></div>
                <Shield size={16} color="#3b82f6" style={styles.featureIcon} />
                <span style={styles.featureText}>Mark medications as taken</span>
              </div>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.patientDot }}></div>
                <Camera size={16} color="#3b82f6" style={styles.featureIcon} />
                <span style={styles.featureText}>Upload proof photos (optional)</span>
              </div>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.patientDot }}></div>
                <BarChart3 size={16} color="#3b82f6" style={styles.featureIcon} />
                <span style={styles.featureText}>View your medication history</span>
              </div>
            </div>
            <button
              style={{
                ...styles.button,
                ...styles.patientButton,
                ...(hoveredButton === 'patient' ? styles.buttonHover : {})
              }}
              onMouseEnter={() => setHoveredButton('patient')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleNavigation('patient')}
            >
              Continue as Patient
            </button>
          </div>
        </div>

        {/* Caretaker Card */}
        <div
          style={{
            ...styles.card,
            ...(hoveredCard === 'caretaker' ? styles.cardHover : {})
          }}
          onMouseEnter={() => setHoveredCard('caretaker')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{ ...styles.cardHeader, ...styles.caretakerHeader }}></div>
          <div style={styles.cardContent}>
            <div style={{ ...styles.iconContainer, ...styles.caretakerIcon }}>
              <Users size={32} color="#059669" />
            </div>
            <h3 style={styles.cardTitle}>I'm a Caretaker</h3>
            <p style={styles.cardDescription}>
              Monitor and support your loved one's medication adherence journey.
            </p>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.caretakerDot }}></div>
                <BarChart3 size={16} color="#10b981" style={styles.featureIcon} />
                <span style={styles.featureText}>Monitor medication compliance</span>
              </div>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.caretakerDot }}></div>
                <Bell size={16} color="#10b981" style={styles.featureIcon} />
                <span style={styles.featureText}>Set up notification preferences</span>
              </div>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.caretakerDot }}></div>
                <BarChart3 size={16} color="#10b981" style={styles.featureIcon} />
                <span style={styles.featureText}>View detailed reports</span>
              </div>
              <div style={styles.featureItem}>
                <div style={{ ...styles.featureDot, ...styles.caretakerDot }}></div>
                <Heart size={16} color="#10b981" style={styles.featureIcon} />
                <span style={styles.featureText}>Receive real-time alerts</span>
              </div>
            </div>
            <button
              style={{
                ...styles.button,
                ...styles.caretakerButton,
                ...(hoveredButton === 'caretaker' ? styles.buttonHover : {})
              }}
              onMouseEnter={() => setHoveredButton('caretaker')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleNavigation('caretaker')}
            >
              Continue as Caretaker
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div style={styles.footer}>
        <div style={styles.footerNote}>
          <div style={styles.footerDot}></div>
          <span style={styles.footerText}>You can switch between roles anytime after setup</span>
        </div>
      </div>

      {/* Background Decorations */}
      <div style={{ ...styles.decorations, ...styles.decoration1 }}></div>
      <div style={{ ...styles.decorations, ...styles.decoration2 }}></div>
      <div style={{ ...styles.decorations, ...styles.decoration3 }}></div>
      <div style={{ ...styles.decorations, ...styles.decoration4 }}></div>
    </div>
  );
};

export default Welcome;