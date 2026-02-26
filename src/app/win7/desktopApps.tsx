"use client";

import React, { ReactNode, useState } from 'react';
import { useClippy, CLIPPY_LINES } from './Win7Clippy';

export interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  content: ReactNode;
  width?: number;
  height?: number;
  showOnDesktop?: boolean;
  pinToStart?: boolean;
}

// About Me Content
const AboutContent = () => (
  <div className="app-content about-app">
    <div className="explorer-toolbar">
      <button className="toolbar-btn">← Back</button>
      <button className="toolbar-btn">→ Forward</button>
      <div className="address-bar">
        <span className="address-icon">📁</span>
        <span>C:\Users\Eugene\About Me</span>
      </div>
    </div>
    <div className="explorer-content">
      <div className="about-hero">
        <div className="about-avatar">
          <img src="/win7/user-avatar.svg" alt="Eugene Boondock" />
        </div>
        <div className="about-info">
          <h1>Eugene Ncube</h1>
          <p className="tagline">aka Eugene Boondock - Founder of Boondock Labs</p>
        </div>
      </div>
      
      <div className="about-section">
        <h2>🚀 A Lab for Boundless Creation</h2>
        <p>
          Hi, I'm Eugene Ncube (Eugene Boondock) - founder of Boondock Labs. I don't just code; 
          I build digital playgrounds, spark new experiences, and turn ambitious ideas into reality.
        </p>
        <p>
          Boondock Labs is my personal tech studio. Here I explore, experiment, and craft projects 
          that matter, blending web technology, game design, and even forays into AI and digital worlds.
        </p>
      </div>

      <div className="about-section">
        <h2>⚡ AI-Powered Development</h2>
        <p>In this AI revolution, I leverage cutting-edge tools to accelerate development:</p>
        <div className="skills-tags">
          {['Cursor', 'Windsurf', 'VS Code', 'Claude Code', 'OpenAI Codex', 'GitHub'].map(tool => (
            <span key={tool} className="skill-tag">{tool}</span>
          ))}
        </div>
        <p className="highlight">
          Projects that would take <strong>years or months</strong> now complete in <strong>weeks or days</strong>.
        </p>
      </div>

      <div className="about-section">
        <h2>💪 Development Philosophy</h2>
        <div className="philosophy-grid">
          <div className="philosophy-item">
            <span className="check">✓</span>
            <strong>No delays:</strong> Committed to delivering on time, every time
          </div>
          <div className="philosophy-item">
            <span className="check">✓</span>
            <strong>GitHub mastery:</strong> Professional version control and collaboration
          </div>
          <div className="philosophy-item">
            <span className="check">✓</span>
            <strong>Code comprehension:</strong> Deep understanding of complex systems
          </div>
          <div className="philosophy-item">
            <span className="check">✓</span>
            <strong>Debugging expertise:</strong> Hours spent pinpointing and resolving issues
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>🛠️ Technical Journey</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-marker">1</div>
            <div className="timeline-content">
              <h3>Foundation Building</h3>
              <p>HTML5, CSS3, Vanilla JS</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker">2</div>
            <div className="timeline-content">
              <h3>Modern Frameworks</h3>
              <p>React, Next.js, Node.js, TypeScript</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker">3</div>
            <div className="timeline-content">
              <h3>AI Integration & Acceleration</h3>
              <p>AI Tools, Automation, Rapid Prototyping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Services Content - Control Panel Style
const ServicesContent = () => (
  <div className="app-content services-app control-panel">
    <div className="explorer-toolbar">
      <button className="toolbar-btn">← Back</button>
      <button className="toolbar-btn">→ Forward</button>
      <div className="address-bar">
        <span className="address-icon">⚙️</span>
        <span>Control Panel\All Control Panel Items\Services</span>
      </div>
    </div>
    <div className="control-panel-header">
      <h1>⚙️ Services - What I Can Build For You</h1>
      <p>Adjust settings for your project</p>
    </div>
    <div className="services-grid">
      <div className="service-item">
        <img src="/win7/icons/authentic/gnome-laptop.png" alt="" className="service-icon" />
        <h3>Website Development</h3>
        <p>Professional websites that establish your online presence. Responsive design, SEO optimization, and CMS.</p>
      </div>
      <div className="service-item">
        <img src="/win7/icons/authentic/gnome-globe.png" alt="" className="service-icon" />
        <h3>Web Applications</h3>
        <p>Modern, beautiful, and fast web apps. React, Vue.js, Next.js ecosystems. Progressive web apps & e-commerce.</p>
      </div>
      <div className="service-item">
        <img src="/win7/icons/authentic/gnome-joystick.png" alt="" className="service-icon" />
        <h3>Game Development</h3>
        <p>Engaging web-based games and interactive experiences. HTML5 games, gamification, and interactive storytelling.</p>
      </div>
      <div className="service-item">
        <img src="/win7/icons/authentic/applications-development.png" alt="" className="service-icon" />
        <h3>Metaverse & Scripts</h3>
        <p>Custom scripts for virtual worlds. Earth2 and other metaverse platforms. Virtual experience enhancements.</p>
      </div>
      <div className="service-item">
        <img src="/win7/icons/authentic/cpu.png" alt="" className="service-icon" />
        <h3>AI & ML Integration</h3>
        <p>Integrating AI capabilities into applications. Chatbots, data analysis, custom model training.</p>
      </div>
      <div className="service-item">
        <img src="/win7/icons/authentic/network-config.png" alt="" className="service-icon" />
        <h3>MCP Server Development</h3>
        <p>Custom Model Context Protocol servers. Transform APIs into AI-integrated tools for Claude and other LLMs.</p>
      </div>
    </div>
  </div>
);

// Work/Projects Content - File Explorer Style
const WorkContent = () => (
  <div className="app-content work-app explorer">
    <div className="explorer-toolbar">
      <button className="toolbar-btn">← Back</button>
      <button className="toolbar-btn">→ Forward</button>
      <div className="address-bar">
        <span className="address-icon">📁</span>
        <span>C:\Users\Eugene\Projects</span>
      </div>
    </div>
    <div className="explorer-sidebar">
      <div className="sidebar-section">
        <h4>Favorites</h4>
        <div className="sidebar-item active">📁 Featured</div>
        <div className="sidebar-item">📁 Client Work</div>
        <div className="sidebar-item">📁 Open Source</div>
      </div>
    </div>
    <div className="explorer-main">
      <div className="project-cards">
        <div className="project-card">
          <div className="project-image">
            <img src="/earthie-world.png" alt="Earthie World" />
          </div>
          <div className="project-info">
            <h3>🌍 Earthie.world</h3>
            <p>Comprehensive Earth2 metaverse community platform with 17+ API integrations, real-time market data, interactive mapping.</p>
            <div className="project-tags">
              <span>NextJS</span>
              <span>React</span>
            </div>
            <a href="https://earthie.world" target="_blank" rel="noopener noreferrer" className="project-link">
              Visit Site →
            </a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-image">
            <img src="/morphed.png" alt="Morphed.io" />
          </div>
          <div className="project-info">
            <h3>🔮 Morphed.io</h3>
            <p>Full Platform Development - Backend infrastructure, frontend interface, custom API endpoints, MCP server.</p>
            <div className="project-tags">
              <span>Full-Stack</span>
              <span>MCP Server</span>
              <span>API</span>
            </div>
            <a href="https://morphed.io" target="_blank" rel="noopener noreferrer" className="project-link">
              Visit Site →
            </a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-image placeholder">
            <span>🍽️</span>
          </div>
          <div className="project-info">
            <h3>Platedom.com</h3>
            <p>AI Restaurant Platform - Generative AI that transforms menus into visual feasts. Michelin-star quality food photography.</p>
            <div className="project-tags">
              <span>Firebase</span>
              <span>Generative AI</span>
              <span>React</span>
            </div>
            <a href="https://platedom.com" target="_blank" rel="noopener noreferrer" className="project-link">
              Visit Site →
            </a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-image placeholder">
            <span>🔧</span>
          </div>
          <div className="project-info">
            <h3>Earth2 MCP Server</h3>
            <p>Complete MCP server enabling Claude to access Earth2 account data, properties, wallet information, and marketplace.</p>
            <div className="project-tags">
              <span>MCP Server</span>
              <span>Earth2 API</span>
              <span>Claude</span>
            </div>
            <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" className="project-link">
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Contact - Email App Style
const ContactContent = () => (
  <div className="app-content contact-app email-client">
    <div className="email-toolbar">
      <button className="toolbar-btn primary">📧 New Message</button>
      <button className="toolbar-btn">📥 Inbox</button>
      <button className="toolbar-btn">📤 Sent</button>
    </div>
    <div className="email-compose">
      <div className="email-header">
        <h2>📧 New Message to Eugene Boondock</h2>
        <p>Let's build something amazing together!</p>
      </div>
      <form className="contact-form">
        <div className="form-row">
          <label>To:</label>
          <input type="text" value="eugene@boondocklabs.com" readOnly />
        </div>
        <div className="form-row">
          <label>From:</label>
          <input type="email" placeholder="your.email@example.com" />
        </div>
        <div className="form-row">
          <label>Name:</label>
          <input type="text" placeholder="Your full name" />
        </div>
        <div className="form-row">
          <label>Subject:</label>
          <select>
            <option value="">Select project type...</option>
            <option>Website Development</option>
            <option>Web Application</option>
            <option>MCP Server Development</option>
            <option>AI Integration</option>
            <option>Game Development</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-row">
          <label>Budget:</label>
          <select>
            <option value="">Select budget range...</option>
            <option>$500 - $1,000</option>
            <option>$1,000 - $5,000</option>
            <option>$5,000 - $10,000</option>
            <option>$10,000+</option>
          </select>
        </div>
        <div className="form-row full">
          <label>Message:</label>
          <textarea placeholder="Describe your project, goals, and any specific requirements..." rows={6}></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="send-btn">📤 Send Message</button>
        </div>
      </form>
    </div>
  </div>
);

// Computer - My Computer Style
const ComputerContent = () => (
  <div className="app-content computer-app">
    <div className="explorer-toolbar">
      <button className="toolbar-btn">← Back</button>
      <button className="toolbar-btn">→ Forward</button>
      <div className="address-bar">
        <span className="address-icon">💻</span>
        <span>Computer</span>
      </div>
    </div>
    <div className="computer-content">
      <div className="drive-section">
        <h3>Hard Disk Drives</h3>
        <div className="drives-grid">
          <div className="drive-item">
            <img src="/win7/icons/authentic/drive-harddisk.png" alt="" />
            <div className="drive-info">
              <span className="drive-name">Local Disk (C:)</span>
              <div className="drive-bar">
                <div className="drive-used" style={{ width: '65%' }}></div>
              </div>
              <span className="drive-space">186 GB free of 500 GB</span>
            </div>
          </div>
          <div className="drive-item">
            <img src="/win7/icons/authentic/drive-harddisk.png" alt="" />
            <div className="drive-info">
              <span className="drive-name">Projects (D:)</span>
              <div className="drive-bar">
                <div className="drive-used" style={{ width: '45%' }}></div>
              </div>
              <span className="drive-space">550 GB free of 1 TB</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="drive-section">
        <h3>Network Locations</h3>
        <div className="drives-grid">
          <div className="drive-item clickable">
            <img src="/win7/icons/authentic/gnome-fs-network.png" alt="" />
            <div className="drive-info">
              <span className="drive-name">GitHub (\\github.com)</span>
              <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer">
                @EugeneBoondock
              </a>
            </div>
          </div>
          <div className="drive-item clickable">
            <img src="/win7/icons/authentic/gnome-fs-network.png" alt="" />
            <div className="drive-info">
              <span className="drive-name">LinkedIn (\\linkedin.com)</span>
              <a href="https://linkedin.com/in/eugeneboondock" target="_blank" rel="noopener noreferrer">
                Profile
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="system-info-section">
        <h3>System Information</h3>
        <div className="system-info">
          <p><strong>Developer:</strong> Eugene Ncube (Eugene Boondock)</p>
          <p><strong>Company:</strong> Boondock Labs</p>
          <p><strong>Specialty:</strong> Full-Stack Development, AI Integration, MCP Servers</p>
          <p><strong>Location:</strong> Building the future, one line of code at a time</p>
        </div>
      </div>
    </div>
  </div>
);

// Internet Explorer - Portfolio Browser
const InternetExplorerContent = () => (
  <div className="app-content ie-app">
    <div className="ie-toolbar">
      <button className="toolbar-btn">← Back</button>
      <button className="toolbar-btn">→ Forward</button>
      <button className="toolbar-btn">🔄</button>
      <button className="toolbar-btn">🏠</button>
      <div className="address-bar">
        <span className="address-icon">🌐</span>
        <input type="text" value="https://boondocklabs.com" readOnly />
        <button className="go-btn">→</button>
      </div>
    </div>
    <div className="ie-content">
      <div className="welcome-page">
        <h1>🌐 Welcome to Boondock Labs</h1>
        <p className="tagline">AI-Powered Web Development & MCP Servers</p>
        
        <div className="quick-links">
          <h2>Quick Links</h2>
          <div className="links-grid">
            <a href="https://earthie.world" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span>🌍</span>
              <span>Earthie.world</span>
            </a>
            <a href="https://morphed.io" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span>🔮</span>
              <span>Morphed.io</span>
            </a>
            <a href="https://platedom.com" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span>🍽️</span>
              <span>Platedom.com</span>
            </a>
            <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span>💻</span>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="featured-text">
          <p>Expert web development, AI integration, and Model Context Protocol servers.</p>
          <p>Building the future of digital experiences.</p>
        </div>
      </div>
    </div>
  </div>
);

// Notepad - README
const NotepadContent = () => (
  <div className="app-content notepad-app">
    <div className="notepad-menu">
      <span>File</span>
      <span>Edit</span>
      <span>Format</span>
      <span>View</span>
      <span>Help</span>
    </div>
    <textarea className="notepad-content" defaultValue={`
╔══════════════════════════════════════════════════════════════╗
║                     BOONDOCK LABS README                      ║
╚══════════════════════════════════════════════════════════════╝

Welcome to Boondock Labs! 

================== ABOUT ==================

Hi, I'm Eugene Ncube (Eugene Boondock), founder of Boondock Labs.
I build digital experiences that matter.

================== SERVICES ==================

• Website Development
• Web Applications  
• Game Development
• Metaverse & Scripts
• AI & ML Integration
• MCP Server Development

================== CONTACT ==================

Email: eugene@boondocklabs.com
GitHub: @EugeneBoondock
Website: https://boondocklabs.com

================== SOCIAL ==================

Twitter: @eugeneboondock
LinkedIn: /in/eugeneboondock

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for visiting my Windows 7 portfolio!
Let's build something amazing together.

© ${new Date().getFullYear()} Boondock Labs. All rights reserved.
`.trim()} readOnly />
  </div>
);

// AI Assistant Content (Clippy-style) — interactive with real Clippy context
const AIAssistantContent = () => {
  const { speak, play, isReady } = useClippy();
  const [messages, setMessages] = useState([
    { role: 'clippy', text: "Welcome! I noticed you opened my assistant. Feel free to explore the portfolio or click any suggestion below!" },
  ]);
  const [input, setInput] = useState('');

  const addMessage = (role: 'user' | 'clippy', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const triggerClippy = (animation: string, text: string) => {
    play(animation);
    setTimeout(() => speak(text), 600);
    addMessage('clippy', text);
  };

  const SUGGESTIONS = [
    { label: '📂 View my projects',    anim: 'Searching',    line: CLIPPY_LINES.projects },
    { label: '💼 Learn about services', anim: 'Explain',      line: CLIPPY_LINES.services },
    { label: '📧 Contact Eugene',       anim: 'Writing',      line: CLIPPY_LINES.contact  },
    { label: '👤 About Boondock Labs',  anim: 'Congratulate', line: CLIPPY_LINES.about    },
  ];

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage('user', trimmed);
    setInput('');
    // Simple keyword-based response
    const lower = trimmed.toLowerCase();
    let anim = 'Thinking';
    let response = "It looks like you have a question! Try one of the suggestion buttons for quick answers.";
    if (lower.includes('project') || lower.includes('work')) { anim = 'Searching'; response = CLIPPY_LINES.projects; }
    else if (lower.includes('service') || lower.includes('build')) { anim = 'Explain'; response = CLIPPY_LINES.services; }
    else if (lower.includes('contact') || lower.includes('email')) { anim = 'Writing'; response = CLIPPY_LINES.contact; }
    else if (lower.includes('about') || lower.includes('who')) { anim = 'Congratulate'; response = CLIPPY_LINES.about; }
    else if (lower.includes('hello') || lower.includes('hi')) { anim = 'Wave'; response = "Hello there! I'm Clippy, your portfolio guide!"; }
    else if (lower.includes('bye') || lower.includes('goodbye')) { anim = 'GoodBye'; response = "Goodbye! Come back anytime!"; }
    setTimeout(() => triggerClippy(anim, response), 300);
  };

  return (
    <div className="app-content ai-assistant-app">
      <div className="ai-header">
        <img src="/win7/icons/authentic/stock_help-agent.png" alt="Clippy" className="ai-avatar clippy-icon" />
        <div className="ai-title">
          <h3>Clippy - Boondock Assistant</h3>
          <p>{isReady ? "It looks like you're visiting a portfolio! Would you like help?" : "Loading Clippy…"}</p>
        </div>
      </div>
      <div className="ai-suggestions">
        <h4>💡 It looks like you&apos;re exploring my portfolio!</h4>
        <p>Would you like help with:</p>
        <div className="suggestion-buttons">
          {SUGGESTIONS.map(s => (
            <button key={s.label} className="suggestion-btn" onClick={() => triggerClippy(s.anim, s.line)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="ai-chat-area">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.role === 'clippy' ? 'assistant' : 'user'}`}>
              <span className="message-icon">{m.role === 'clippy' ? '📎' : '👤'}</span>
              <span>{m.text}</span>
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Ask Clippy something…"
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="chat-send-btn" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

// Media Player Content (YouTube)
const MediaPlayerContent = () => (
  <div className="app-content media-player-app">
    <div className="media-menubar">
      <span>File</span>
      <span>View</span>
      <span>Play</span>
      <span>Tools</span>
      <span>Help</span>
    </div>
    <div className="media-content">
      <div className="media-video-area">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0" 
          title="Media Player"
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
    <div className="media-controls">
      <div className="media-progress">
        <div className="progress-bar"></div>
      </div>
      <div className="media-buttons">
        <button className="media-btn">⏮</button>
        <button className="media-btn play-btn">▶</button>
        <button className="media-btn">⏭</button>
        <button className="media-btn">🔊</button>
        <div className="volume-slider"></div>
      </div>
    </div>
  </div>
);

// Minesweeper Content
const MinesweeperContent = () => {
  const [gameState, setGameState] = React.useState<'playing' | 'won' | 'lost'>('playing');
  const [grid, setGrid] = React.useState(() => generateMinesweeperGrid());
  
  function generateMinesweeperGrid() {
    const size = 9;
    const mines = 10;
    const cells: { isMine: boolean; revealed: boolean; flagged: boolean; adjacent: number }[][] = [];
    
    // Initialize empty grid
    for (let i = 0; i < size; i++) {
      cells[i] = [];
      for (let j = 0; j < size; j++) {
        cells[i][j] = { isMine: false, revealed: false, flagged: false, adjacent: 0 };
      }
    }
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!cells[x][y].isMine) {
        cells[x][y].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate adjacent mines
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!cells[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di, nj = j + dj;
              if (ni >= 0 && ni < size && nj >= 0 && nj < size && cells[ni][nj].isMine) {
                count++;
              }
            }
          }
          cells[i][j].adjacent = count;
        }
      }
    }
    return cells;
  }
  
  const handleCellClick = (i: number, j: number) => {
    if (gameState !== 'playing' || grid[i][j].revealed || grid[i][j].flagged) return;
    
    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[i][j].isMine) {
      // Reveal all mines
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (newGrid[x][y].isMine) newGrid[x][y].revealed = true;
        }
      }
      setGrid(newGrid);
      setGameState('lost');
      return;
    }
    
    // Flood fill reveal
    const reveal = (x: number, y: number) => {
      if (x < 0 || x >= 9 || y < 0 || y >= 9) return;
      if (newGrid[x][y].revealed || newGrid[x][y].flagged || newGrid[x][y].isMine) return;
      newGrid[x][y].revealed = true;
      if (newGrid[x][y].adjacent === 0) {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            reveal(x + di, y + dj);
          }
        }
      }
    };
    reveal(i, j);
    setGrid(newGrid);
    
    // Check win
    let won = true;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (!newGrid[x][y].isMine && !newGrid[x][y].revealed) won = false;
      }
    }
    if (won) setGameState('won');
  };
  
  const handleRightClick = (e: React.MouseEvent, i: number, j: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || grid[i][j].revealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[i][j].flagged = !newGrid[i][j].flagged;
    setGrid(newGrid);
  };
  
  const resetGame = () => {
    setGrid(generateMinesweeperGrid());
    setGameState('playing');
  };
  
  return (
    <div className="app-content minesweeper-app">
      <div className="minesweeper-menubar">
        <span>Game</span>
        <span>Help</span>
      </div>
      <div className="minesweeper-header">
        <div className="mine-counter">010</div>
        <button className="reset-btn" onClick={resetGame}>
          {gameState === 'playing' ? '😊' : gameState === 'won' ? '😎' : '😵'}
        </button>
        <div className="timer">000</div>
      </div>
      <div className="minesweeper-grid">
        {grid.map((row, i) => (
          <div key={i} className="minesweeper-row">
            {row.map((cell, j) => (
              <button
                key={j}
                className={`minesweeper-cell ${cell.revealed ? 'revealed' : ''} ${cell.flagged ? 'flagged' : ''}`}
                onClick={() => handleCellClick(i, j)}
                onContextMenu={(e) => handleRightClick(e, i, j)}
              >
                {cell.revealed ? (
                  cell.isMine ? '💣' : cell.adjacent > 0 ? cell.adjacent : ''
                ) : cell.flagged ? '🚩' : ''}
              </button>
            ))}
          </div>
        ))}
      </div>
      {gameState !== 'playing' && (
        <div className="game-over-message">
          {gameState === 'won' ? '🎉 You Win!' : '💥 Game Over!'}
        </div>
      )}
    </div>
  );
};

// Solitaire Content
const SolitaireContent = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  return (
    <div className="app-content solitaire-app">
      <div className="solitaire-menubar">
        <span>Game</span>
        <span>Help</span>
      </div>
      <div className="solitaire-table">
        <div className="solitaire-top">
          <div className="deck-area">
            <div className="card-deck">🂠</div>
            <div className="card-waste"></div>
          </div>
          <div className="foundation-area">
            {suits.map((suit, i) => (
              <div key={i} className="foundation-pile">
                <span className={suit === '♥' || suit === '♦' ? 'red' : ''}>{suit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="tableau-area">
          {[1, 2, 3, 4, 5, 6, 7].map((pile) => (
            <div key={pile} className="tableau-pile">
              {Array.from({ length: pile }).map((_, i) => (
                <div key={i} className={`tableau-card ${i === pile - 1 ? 'face-up' : 'face-down'}`}>
                  {i === pile - 1 ? (
                    <span className={Math.random() > 0.5 ? 'red' : ''}>
                      {values[Math.floor(Math.random() * values.length)]}{suits[Math.floor(Math.random() * suits.length)]}
                    </span>
                  ) : '🂠'}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="solitaire-message">
          <p>🃏 Classic Solitaire - Coming Soon!</p>
          <p>Drag cards to build foundation piles from Ace to King</p>
        </div>
      </div>
    </div>
  );
};

export const desktopApps: DesktopApp[] = [
  {
    id: 'computer',
    name: 'Computer',
    icon: '/win7/icons/authentic/computer.png',
    content: <ComputerContent />,
    width: 900,
    height: 600,
    showOnDesktop: true,
    pinToStart: true,
  },
  {
    id: 'about',
    name: 'About Me',
    icon: '/win7/icons/authentic/gnome-fs-home.png',
    content: <AboutContent />,
    width: 850,
    height: 650,
    showOnDesktop: true,
    pinToStart: true,
  },
  {
    id: 'work',
    name: 'My Projects',
    icon: '/win7/icons/authentic/folder-documents.png',
    content: <WorkContent />,
    width: 950,
    height: 700,
    showOnDesktop: true,
    pinToStart: true,
  },
  {
    id: 'services',
    name: 'Services',
    icon: '/win7/icons/authentic/control-center.png',
    content: <ServicesContent />,
    width: 900,
    height: 650,
    showOnDesktop: true,
    pinToStart: true,
  },
  {
    id: 'contact',
    name: 'Contact Me',
    icon: '/win7/icons/authentic/internet-mail.png',
    content: <ContactContent />,
    width: 750,
    height: 600,
    showOnDesktop: true,
    pinToStart: true,
  },
  {
    id: 'ie',
    name: 'Internet Explorer',
    icon: '/win7/icons/authentic/web-browser.png',
    content: <InternetExplorerContent />,
    width: 1000,
    height: 700,
    showOnDesktop: true,
    pinToStart: false,
  },
  {
    id: 'notepad',
    name: 'README.txt',
    icon: '/win7/icons/authentic/wine-notepad.png',
    content: <NotepadContent />,
    width: 650,
    height: 500,
    showOnDesktop: true,
    pinToStart: false,
  },
  {
    id: 'recycle',
    name: 'Recycle Bin',
    icon: '/win7/icons/authentic/gnome-fs-trash-empty.png',
    content: <div className="app-content recycle-app">
      <div className="explorer-toolbar">
        <button className="toolbar-btn">← Back</button>
        <button className="toolbar-btn">Empty Recycle Bin</button>
      </div>
      <div className="recycle-content">
        <div className="empty-message">
          <img src="/win7/icons/authentic/gnome-fs-trash-empty.png" alt="" />
          <p>The Recycle Bin is empty.</p>
        </div>
      </div>
    </div>,
    width: 600,
    height: 400,
    showOnDesktop: true,
    pinToStart: false,
  },
  {
    id: 'ai-assistant',
    name: 'Clippy Assistant',
    icon: '/win7/icons/authentic/stock_help-agent.png',
    content: <AIAssistantContent />,
    width: 500,
    height: 550,
    showOnDesktop: true,
    pinToStart: true,
  },
  {
    id: 'media-player',
    name: 'Windows Media Player',
    icon: '/win7/icons/authentic/media-player.png',
    content: <MediaPlayerContent />,
    width: 800,
    height: 560,
    showOnDesktop: true,
    pinToStart: false,
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: '/win7/icons/authentic/gnomine.png',
    content: <MinesweeperContent />,
    width: 320,
    height: 420,
    showOnDesktop: false,
    pinToStart: false,
  },
  {
    id: 'solitaire',
    name: 'Solitaire',
    icon: '/win7/icons/authentic/solitaire.png',
    content: <SolitaireContent />,
    width: 750,
    height: 580,
    showOnDesktop: false,
    pinToStart: false,
  },
];
