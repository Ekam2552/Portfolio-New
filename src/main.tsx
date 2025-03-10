import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';

// Fix for iOS Safari 100vh issue
const setVhVariable = () => {
  // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set the --vh variable when the page loads
setVhVariable();

// Update the --vh variable when the window is resized
window.addEventListener('resize', setVhVariable);
window.addEventListener('orientationchange', setVhVariable);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
