import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import './styles/base.css';
import './styles/glass.css';
import './styles/responsive.css';
import './styles/shell.css';
import './styles/home.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
