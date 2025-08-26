// @author: fatima bashir
'use client';
import { BookOpen, Clock, CheckCircle, Play, Target } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';

export default function LearningPlanPage() {
  const { theme, colors } = useTheme();
  
  return (
    <div style={{
      padding: '32px',
      maxWidth: '1792px',
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
        }}>Personalized Learning Plan</h1>
        <p style={{
          fontSize: '20px',
          color: colors.text,
          opacity: '0.7'
        }}>
          Your AI-generated 4-week development plan to advance your career
        </p>
      </div>

      {/* Progress Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Week 1 - Completed */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#059669',
            marginBottom: '8px'
          }}>Week 1</div>
          <div style={{
            fontSize: '14px',
            color: colors.text,
            marginBottom: '12px'
          }}>Completed</div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#22c55e',
              height: '100%',
              width: '100%',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>

        {/* Week 2 - In Progress */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0284c7',
            marginBottom: '8px'
          }}>Week 2</div>
          <div style={{
            fontSize: '14px',
            color: colors.text,
            marginBottom: '12px'
          }}>In Progress</div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(56, 189, 248, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#38bdf8',
              height: '100%',
              width: '60%',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>

        {/* Week 3 - Upcoming */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#94a3b8',
            marginBottom: '8px'
          }}>Week 3</div>
          <div style={{
            fontSize: '14px',
            color: colors.text,
            opacity: '0.7',
            marginBottom: '12px'
          }}>Upcoming</div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(51, 65, 85, 0.3)',
            borderRadius: '4px'
          }}></div>
        </div>

        {/* Week 4 - Upcoming */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: colors.cardBackground,
          border: `1px solid ${colors.cardBorder}`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#94a3b8',
            marginBottom: '8px'
          }}>Week 4</div>
          <div style={{
            fontSize: '14px',
            color: colors.text,
            opacity: '0.7',
            marginBottom: '12px'
          }}>Upcoming</div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(51, 65, 85, 0.3)',
            borderRadius: '4px'
          }}></div>
        </div>
      </div>

      {/* Current Week Details */}
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
          marginBottom: '32px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={20} style={{color: '#8b5cf6'}} />
          </div>
          <div>
            <h2 style={{
              fontSize: '24px',
                          fontWeight: '600',
            color: colors.text,
              marginBottom: '4px'
            }}>Week 2: Leadership & Management</h2>
            <p style={{
              color: colors.text,
              opacity: '0.7'
            }}>Team dynamics and performance management fundamentals</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Lessons */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <h3 style={{
                          fontWeight: '600',
            color: colors.text,
              fontSize: '18px'
            }}>Lessons</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {/* Completed Lesson */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <CheckCircle size={20} style={{color: '#22c55e'}} />
                <div>
                  <div style={{
                    fontWeight: '500',
                    color: colors.text,
                    marginBottom: '4px'
                  }}>Communication Fundamentals</div>
                  <div style={{
                    fontSize: '14px',
                    color: colors.text,
                    opacity: '0.7'
                  }}>45 minutes</div>
                </div>
              </div>
              
              {/* Current Lesson */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <Play size={20} style={{color: '#38bdf8'}} />
                <div>
                  <div style={{
                    fontWeight: '500',
                    color: colors.text,
                    marginBottom: '4px'
                  }}>Team Leadership Strategies</div>
                  <div style={{
                    fontSize: '14px',
                    color: colors.text,
                    opacity: '0.7'
                  }}>60 minutes</div>
                </div>
              </div>
              
              {/* Upcoming Lesson */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '12px',
                          background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(226, 232, 240, 0.8)',
          border: `1px solid ${colors.cardBorder}`
              }}>
                <Clock size={20} style={{color: '#94a3b8'}} />
                <div>
                  <div style={{
                    fontWeight: '500',
                    color: colors.text,
                    opacity: '0.6',
                    marginBottom: '4px'
                  }}>Performance Management</div>
                  <div style={{
                                      fontSize: '14px',
                  color: colors.text,
                  opacity: '0.5'
                  }}>30 minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <h3 style={{
                          fontWeight: '600',
            color: colors.text,
              fontSize: '18px'
            }}>Projects</h3>
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <div style={{
                fontWeight: '500',
                color: colors.text,
                marginBottom: '8px'
              }}>Team Leadership Assessment</div>
              <div style={{
                fontSize: '14px',
                color: colors.text,
                opacity: '0.8',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                Lead a simulated team project with conflict resolution, goal setting, and performance reviews.
              </div>
              <button style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: theme === 'dark' ? '#7dd3fc' : '#0284c7',
                borderRadius: '16px',
                fontWeight: '500',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.8'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}>
                Start Project
              </button>
            </div>
          </div>

          {/* Resources */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <h3 style={{
                          fontWeight: '600',
            color: colors.text,
              fontSize: '18px'
            }}>Resources</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
                border: `1px solid ${colors.cardBorder}`
              }}>
                <div style={{
                                      fontWeight: '500',
                    color: colors.text,
                    marginBottom: '4px'
                }}>Leadership Guide</div>
                <div style={{
                  fontSize: '14px',
                  color: colors.text,
                  opacity: '0.7'
                }}>Essential management principles</div>
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
                border: `1px solid ${colors.cardBorder}`
              }}>
                <div style={{
                                      fontWeight: '500',
                    color: colors.text,
                    marginBottom: '4px'
                }}>Communication Templates</div>
                <div style={{
                  fontSize: '14px',
                  color: colors.text,
                  opacity: '0.7'
                }}>Professional email and meeting scripts</div>
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(240, 249, 255, 0.8)',
                border: `1px solid ${colors.cardBorder}`
              }}>
                <div style={{
                                      fontWeight: '500',
                    color: colors.text,
                    marginBottom: '4px'
                }}>Case Studies</div>
                <div style={{
                  fontSize: '14px',
                  color: colors.text,
                  opacity: '0.7'
                }}>Real leadership success stories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Plan Overview */}
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
        }}>Complete 4-Week Development Plan</h2>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {/* Week 1 */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                            fontWeight: '600',
            color: colors.text
              }}>Week 1: Communication Fundamentals</h3>
              <div style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '20px'
              }}>Completed</div>
            </div>
            <p style={{
              color: colors.text,
              opacity: '0.8',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              Master effective communication, active listening, presentation skills, and professional networking.
            </p>
          </div>
          
          {/* Week 2 */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                            fontWeight: '600',
            color: colors.text
              }}>Week 2: Leadership & Management</h3>
              <div style={{
                padding: '4px 12px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: theme === 'dark' ? '#7dd3fc' : '#0284c7',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '20px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>Current</div>
            </div>
            <p style={{
              color: colors.text,
              opacity: '0.8',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              Develop team leadership skills, learn delegation strategies, and practice performance management techniques.
            </p>
          </div>
          
          {/* Week 3 */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
                      background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(226, 232, 240, 0.8)',
          border: `1px solid ${colors.cardBorder}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                            fontWeight: '600',
            color: colors.text,
                opacity: '0.6'
              }}>Week 3: Strategic Planning</h3>
              <div style={{
                padding: '4px 12px',
                background: 'rgba(51, 65, 85, 0.5)',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '20px'
              }}>Upcoming</div>
            </div>
            <p style={{
              color: colors.text,
              opacity: '0.5',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              Learn strategic thinking, goal setting, project planning, and data-driven decision making.
            </p>
          </div>
          
          {/* Week 4 */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
                      background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(226, 232, 240, 0.8)',
          border: `1px solid ${colors.cardBorder}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                            fontWeight: '600',
            color: colors.text,
                opacity: '0.6'
              }}>Week 4: Career Advancement</h3>
              <div style={{
                padding: '4px 12px',
                background: 'rgba(51, 65, 85, 0.5)',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '20px'
              }}>Upcoming</div>
            </div>
            <p style={{
              color: colors.text,
              opacity: '0.5',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: '0'
            }}>
              Apply all learned skills in a comprehensive career advancement plan and practice negotiation strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}