import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { Rocket, Search, Zap, TrendingUp, ChevronRight, Sparkles, Brain} from 'lucide-react';

function LandingPage({ onSignIn }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Signed in user:', user);
      onSignIn(user);
    } catch (error) {
      console.error('Google Sign-In error:', error.message);
      alert(`Failed to sign in: ${error.message}`);
    }
  };

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Keyword Research",
      description: "AI-powered keyword discovery with competition analysis and search volume insights"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Intelligent Content Generation",
      description: "Create SEO-optimized content that ranks higher and engages your audience"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Track your content performance with detailed SEO scoring and recommendations"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Results",
      description: "Generate high-quality content in seconds, not hours of manual work"
    }
  ];

  // const stats = [
  //   { number: "10,000+", label: "Content Pieces Created" },
  //   { number: "500+", label: "Happy Users" },
  //   { number: "95%", label: "SEO Score Average" },
  //   { number: "3x", label: "Faster Content Creation" }
  // ];

  return (
    <div className="landing-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          left: `${mousePosition.x * 0.02}%`,
          top: `${mousePosition.y * 0.02}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s ease'
        }} />
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
      </div>

      <div className="landing-container" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4rem',
          padding: '1rem 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}>
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              SEO Scientist
            </h1>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '8px 16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#6b46c1', fontSize: '14px', fontWeight: '500' }}>
              AI-Powered Platform
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          marginBottom: '6rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            padding: '8px 20px',
            marginBottom: '2rem',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)'
          }}>
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span style={{ color: '#6b46c1', fontSize: '14px', fontWeight: '500' }}>
              Transform Your Content Strategy
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #1e293b 0%, #6b46c1 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI-Powered Content Writer for{' '}
            <span style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SEO Success
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                borderRadius: '2px',
                opacity: 0.6
              }} />
            </span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Create SEO-optimized content that ranks higher, engages better, and converts more visitors into customers with the power of artificial intelligence.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <button 
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.2)';
                e.target.style.borderColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                className="google-icon"
                style={{ width: '20px', height: '20px' }}
              />
              <span>Continue with Google</span>
              <ChevronRight className="w-5 h-5" style={{ marginLeft: '4px' }} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              color: '#6b46c1',
              fontSize: '14px'
            }}>
              {/* <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users className="w-4 h-4" />
                <span>10,000+ Users</span>
              </div> */}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginTop: '4rem'
          }}>
            {/* {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))} */}
          </div>
        </section>

        {/* Features Section */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #1e293b 0%, #6b46c1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Powerful AI Features
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Everything you need to create content that dominates search results
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.1)';
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                }}>
                  <div style={{ color: 'white' }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          borderRadius: '32px',
          padding: '4rem 2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Ready to Transform Your Content?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              Join thousands of creators already dominating search results
            </p>
            <button 
              onClick={handleGoogleSignIn}
              style={{
                background: 'white',
                color: '#8b5cf6',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
              }}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                style={{ width: '20px', height: '20px' }}
              />
              <span>Get Started Free</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '3rem 0 2rem',
          marginTop: '4rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SEO Scientist
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            SEO Scientist. Transforming content creation with AI.
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          .landing-container {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;