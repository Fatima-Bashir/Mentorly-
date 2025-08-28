// @author: fatima bashir
'use client';
import { useState } from 'react';
import { User, Bell } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme, colors } = useTheme();

  const [interviewPractice, setInterviewPractice] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  return (
    <div style={{
      padding: '32px',
      maxWidth: '1024px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Header */}
      <div style={{marginBottom: '48px'}}>
                <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: colors.text
        }}>Settings</h1>
        <p style={{
          fontSize: '20px',
          opacity: '0.7',
          color: colors.text
        }}>
          Manage your account preferences and application settings
        </p>
      </div>


      {/* Profile Settings */}
      <div style={{
        padding: '32px',
        borderRadius: '24px',
        background: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <User size={20} style={{color: '#8b5cf6'}} />
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: colors.text
          }}>Profile Settings</h2>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text
              }}>First Name</label>
              <input
                type="text"
                defaultValue="Demo"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.cardBorder}`,
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  color: colors.text,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text
              }}>Last Name</label>
              <input
                type="text"
                defaultValue="User"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.cardBorder}`,
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  color: colors.text,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text
              }}>Email</label>
              <input
                type="email"
                defaultValue="demo@mentorly.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.cardBorder}`,
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  color: colors.text,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text
              }}>Current Role</label>
              <input
                type="text"
                defaultValue="Marketing Coordinator"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.cardBorder}`,
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  color: colors.text,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text
              }}>Target Role</label>
              <input
                type="text"
                defaultValue="Marketing Manager"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.cardBorder}`,
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  color: colors.text,
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: colors.text
              }}>Years of Experience</label>
              <select style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: `2px solid ${colors.cardBorder}`,
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                color: colors.text,
                outline: 'none',
                transition: 'all 0.2s'
              }}>
                <option>3 years</option>
                <option>1-2 years</option>
                <option>4-5 years</option>
                <option>6+ years</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={{marginTop: '24px'}}>
          <button style={{
            padding: '12px 24px',
            background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', 
            color: theme === 'dark' ? '#c4b5fd' : '#6b7280',
            border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`,
            borderRadius: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.9'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div style={{
        padding: '32px',
        borderRadius: '24px',
        background: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <Bell size={20} style={{color: '#22c55e'}} />
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: colors.text
          }}>Notifications</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
            border: `1px solid ${colors.cardBorder}`
          }}>
            <div>
              <div style={{fontWeight: '500', color: colors.text}}>Interview Practice</div>
              <div style={{fontSize: '14px', opacity: '0.7', color: colors.text}}>Reminders for scheduled mock interviews</div>
            </div>
            <div 
              onClick={() => setInterviewPractice(!interviewPractice)}
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                background: interviewPractice ? 'rgba(196, 181, 253, 0.5)' : 'rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: interviewPractice ? '22px' : '2px',
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}></div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
            border: `1px solid ${colors.cardBorder}`
          }}>
            <div>
              <div style={{fontWeight: '500', color: colors.text}}>Weekly Progress Report</div>
              <div style={{fontSize: '14px', opacity: '0.7', color: colors.text}}>Summary of your weekly achievements</div>
            </div>
            <div 
              onClick={() => setWeeklyReport(!weeklyReport)}
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                background: weeklyReport ? 'rgba(196, 181, 253, 0.5)' : 'rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: weeklyReport ? '22px' : '2px',
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}></div>
            </div>
          </div>
        </div>
      </div>


      {/* Account Actions */}
      <div style={{
        padding: '32px',
        borderRadius: '24px',
        background: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '24px',
          color: colors.text
        }}>Account</h2>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <button style={{
            width: '100%',
            padding: '16px',
            textAlign: 'left',
            borderRadius: '12px',
            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
            border: `1px solid ${colors.cardBorder}`,
            color: colors.text,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}>
            <div style={{fontWeight: '500', color: colors.text}}>Export Data</div>
            <div style={{fontSize: '14px', opacity: '0.7', color: colors.text}}>Download all your resume analysis and profile data</div>
          </button>
          
          <button style={{
            width: '100%',
            padding: '16px',
            textAlign: 'left',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: colors.text,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}>
            <div style={{fontWeight: '500', color: '#ef4444'}}>Delete Account</div>
            <div style={{fontSize: '14px', opacity: '0.7', color: colors.text}}>Permanently delete your account and all data</div>
          </button>
        </div>
      </div>
    </div>
  );
}