import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import logo from '../assets/file_00000000b8ac61f5b513d34bcf737fce.png'

// Set favicon dynamically
const link = document.createElement('link');
link.rel = 'icon';
link.href = logo;
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)