import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LandingPage from './LandingPage';

const API_BASE_URL = 'https://seo-scientist-backend.onrender.com/api';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Track authentication state
  const [data, setData] = useState({
    seedKeyword: '',
    keywords: [],
    selectedKeyword: '',
    titles: [],
    selectedTitle: '',
    topics: [],
    selectedTopic: '',
    content: '',
    seoScore: null,
    sessionId: ''
  });

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = (signedInUser) => {
    setUser(signedInUser);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      resetProcess(); // Reset app state on sign-out
    } catch (error) {
      console.error('Sign-out error:', error.message);
      alert(`Failed to sign out: ${error.message}`);
    }
  };

  const handleKeywordResearch = async () => {
    if (!data.seedKeyword.trim()) {
      alert('Please enter a seed keyword');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/keywords`, {
        seed_keyword: data.seedKeyword
      });
      
      console.log('Keyword response:', response.data);
      
      if (response.data.status === 'success') {
        setData(prev => ({
          ...prev,
          keywords: response.data.keywords,
          sessionId: response.data.session_id
        }));
        setCurrentStep(2);
      } else {
        console.error('Backend error:', response.data.error);
        alert(`Failed to generate keywords: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to generate keywords: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleGeneration = async (keyword) => {
    setData(prev => ({ ...prev, selectedKeyword: keyword }));
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/titles`, {
        keyword: keyword,
        session_id: data.sessionId
      });
      
      console.log('Titles response:', response.data);
      
      if (response.data.status === 'success') {
        setData(prev => ({ ...prev, titles: response.data.titles }));
        setCurrentStep(3);
      } else {
        console.error('Backend error:', response.data.error);
        alert(`Failed to generate titles: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to generate titles: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicGeneration = async (title) => {
    setData(prev => ({ ...prev, selectedTitle: title }));
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/topics`, {
        title: title,
        keyword: data.selectedKeyword,
        session_id: data.sessionId
      });
      
      console.log('Topics response:', response.data);
      
      if (response.data.status === 'success') {
        setData(prev => ({ ...prev, topics: response.data.topics }));
        setCurrentStep(4);
      } else {
        console.error('Backend error:', response.data.error);
        alert(`Failed to generate topics: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to generate topics: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleContentGeneration = async (topicOutline) => {
    setData(prev => ({ ...prev, selectedTopic: topicOutline }));
    setLoading(true);
    
    try {
      const payload = {
        keyword: data.selectedKeyword,
        title: data.selectedTitle,
        topic_outline: topicOutline,
        content_type: 'blog_intro',
        session_id: data.sessionId
      };
      console.log('Content request payload:', payload);
      
      const response = await axios.post(`${API_BASE_URL}/content`, payload);
      
      console.log('Content response:', response.data);
      
      if (response.data.status === 'success') {
        setData(prev => ({
          ...prev,
          content: response.data.content,
          seoScore: {
            percentage: response.data.seo_score,
            word_count: response.data.word_count,
            keyword_count: response.data.seo_factors.filter(f => f.toLowerCase().includes('keyword frequency')).length || 0
          }
        }));
        setCurrentStep(5);
      } else {
        console.error('Backend error:', response.data.error);
        alert(`Failed to generate content: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to generate content: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.content);
    alert('Content copied to clipboard!');
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([data.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${data.selectedKeyword.replace(/\s+/g, '_')}_content.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetProcess = () => {
    setCurrentStep(1);
    setData({
      seedKeyword: '',
      keywords: [],
      selectedKeyword: '',
      titles: [],
      selectedTitle: '',
      topics: [],
      selectedTopic: '',
      content: '',
      seoScore: null,
      sessionId: ''
    });
  };

  if (!user) {
    return <LandingPage onSignIn={handleSignIn} />;
  }

  // Render main app for authenticated users
  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>SEO Scientist</h1>
          <p>AI-Powered Content Writer</p>
          <div className="user-info">
            <span>Welcome, {user.displayName}</span>
            <button onClick={handleSignOut} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="progress-bar">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="step-content">
            {currentStep === 1 && (
              <div className="step">
                <h2>Step 1: Keyword Research</h2>
                <p>Enter a seed keyword to generate related SEO keywords</p>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="e.g., digital marketing"
                    value={data.seedKeyword}
                    onChange={(e) => setData(prev => ({ ...prev, seedKeyword: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleKeywordResearch()}
                  />
                  <button 
                    onClick={handleKeywordResearch}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? ' Generating...' : ' Generate Keywords'}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step">
                <h2>Step 2: Select Keyword</h2>
                <p>Choose a keyword from the AI-generated suggestions</p>
                <div className="options-grid">
                  {data.keywords.map((keyword, index) => (
                    <div 
                      key={index}
                      className="option-card"
                      onClick={() => handleTitleGeneration(keyword)}
                    >
                      <span className="keyword">{keyword}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                  ← Back to Keywords
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step">
                <h2>Step 3: Select Title</h2>
                <p>Choose from AI-generated SEO-optimized titles</p>
                <div className="selected-info">
                  <strong>Selected Keyword:</strong> {data.selectedKeyword}
                </div>
                <div className="options-list">
                  {data.titles.map((title, index) => (
                    <div 
                      key={index}
                      className="option-card title-card"
                      onClick={() => handleTopicGeneration(title)}
                    >
                      <h3>✨ {title}</h3>
                      <span className="length">{title.length} characters</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                  ← Back to Keywords
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="step">
                <h2>Step 4: Select Topic</h2>
                <p>Choose a content topic or outline</p>
                <div className="selected-info">
                  <strong>Title:</strong> {data.selectedTitle}
                </div>
                <div className="options-list">
                  {data.topics.split('\n\n').map((topic, index) => (
                    <div 
                      key={index}
                      className="option-card topic-card"
                      onClick={() => handleContentGeneration(topic)}
                    >
                      <p>{topic}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                  ← Back to Titles
                </button>
              </div>
            )}

            {currentStep === 5 && (
              <div className="step">
                <h2>Step 5: Generated Content</h2>
                <div className="content-summary">
                  <div className="summary-item">
                    <strong>Keyword:</strong> {data.selectedKeyword}
                  </div>
                  <div className="summary-item">
                    <strong>Title:</strong> {data.selectedTitle}
                  </div>
                </div>

                {data.seoScore && (
                  <div className="seo-score">
                    <h3>SEO Analysis</h3>
                    <div className="score-circle">
                      <span className="score">{data.seoScore.percentage}%</span>
                    </div>
                    <div className="score-details">
                      <div>Word Count: {data.seoScore.word_count}</div>
                      <div>Keyword Usage: {data.seoScore.keyword_count} times</div>
                    </div>
                  </div>
                )}

                <div className="content-output">
                  <h3>Generated Content</h3>
                  <div className="content-text">{data.content}</div>
                  <div className="content-actions">
                    <button onClick={copyToClipboard} className="btn btn-primary">
                      Copy to Clipboard
                    </button>
                    <button onClick={downloadContent} className="btn btn-secondary">
                      Download as Text
                    </button>
                    <button onClick={resetProcess} className="btn btn-accent">
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>AI is working its magic... ✨</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© SEO Scientist - Transforming content creation with AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
