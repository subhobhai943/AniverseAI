import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import logo from '../assets/artworks-000496368060-wd4wu9-t500x500.jpg'

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