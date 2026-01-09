import { useState, useRef, useEffect } from 'react';
import { Send, Settings, Clock, RotateCcw, Download, Globe, Github, X } from 'lucide-react';
import './index.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm AniVerse AI, your anime and manga companion. What would you like to discuss today?",
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: `Error: ${data.error}`, sender: 'ai' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'ai' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I couldn't connect to the server.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const usePrompt = (text) => {
    setInput(text);
    // Optional: auto-send
    // handleSend();
  };

  return (
    <div className="app-container">
      <div className="background-overlay"></div>

      {/* Header */}
      <header>
        <div className="logo-area">
          <div className="avatar">
            <img src="https://ui-avatars.com/api/?name=AniVerse+AI&background=FF5722&color=fff" alt="AI Avatar" />
          </div>
          <div className="title-info">
            <h1>AniVerse AI</h1>
            <p>Manga & Anime Intelligence</p>
          </div>
        </div>
        <div className="header-controls">
          <button onClick={() => setMessages([])} aria-label="Reset Chat"><RotateCcw size={20} /></button>
          <button onClick={() => setShowHistory(true)} aria-label="History"><Clock size={20} /></button>
          <button onClick={() => setShowSettings(true)} aria-label="Settings"><Settings size={20} /></button>
        </div>
      </header>

      {/* Chat Area */}
      <main id="chat-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}-message`}>
            {msg.sender === 'ai' && (
              <div className="message-avatar">
                <img src="https://ui-avatars.com/api/?name=AniVerse+AI&background=FF5722&color=fff" alt="AI" />
              </div>
            )}
            <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }} />
            {msg.sender === 'user' && (
              <div className="message-avatar">
                <img src="https://ui-avatars.com/api/?name=User&background=333&color=fff" alt="User" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai-message">
             <div className="message-avatar">
                <img src="https://ui-avatars.com/api/?name=AniVerse+AI&background=FF5722&color=fff" alt="AI" />
              </div>
            <div className="message-content">Thinking...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Quick Prompts - Show only if few messages */}
      {messages.length < 3 && (
        <div className="quick-prompts">
          <button className="prompt-chip" onClick={() => usePrompt('Ask about your favorite manga')}>Ask about your favorite manga</button>
          <button className="prompt-chip" onClick={() => usePrompt('Top Anime 2024')}>Top Anime 2024</button>
          <button className="prompt-chip" onClick={() => usePrompt('Manga Recommendations')}>Manga Recommendations</button>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about anime, manga..." 
          />
          <button id="send-btn" onClick={handleSend}><Send size={18} /></button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowSettings(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h2><Settings size={20} style={{display:'inline', marginRight:'8px'}}/> Settings</h2>
              <button className="close-modal" onClick={() => setShowSettings(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="setting-item">
                <span>Enable Notifications</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item vertical">
                <span>Language</span>
                <select className="custom-select">
                  <option value="en">🇺🇸 English</option>
                  <option value="jp">🇯🇵 Japanese</option>
                </select>
              </div>
              <button className="action-btn outline">
                <Download size={16} style={{marginRight:'8px'}}/> Add to Home Screen
              </button>
              
              <div className="about-section">
                <h3>About AniVerse AI</h3>
                <p>Your intelligent companion for everything Manga & Anime. Powered by advanced AI technology.</p>
                <div className="social-links">
                  <Github size={24} />
                  <Globe size={24} />
                </div>
                <p className="copyright">© Yeagerist</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowHistory(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h2><Clock size={20} style={{display:'inline', marginRight:'8px'}}/> Chat History</h2>
              <button className="close-modal" onClick={() => setShowHistory(false)}><X /></button>
            </div>
            <div className="modal-body centered-placeholder">
              <Clock size={48} style={{opacity:0.5, marginBottom:'10px'}}/>
              <p>No chat sessions yet</p>
              <small>Start chatting to see your history</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;