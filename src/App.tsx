import { useState, useEffect } from 'react';
import './App.scss';

// Components
import Navbar from './components/Navbar/Navbar';
import Loader from './components/Loader/Loader';
import Hero from './components/Hero/Hero';
// Animation Context
import { AnimationProvider } from './context/AnimationContext';

function App() {
  // State to manage content visibility
  const [contentVisible, setContentVisible] = useState(false);

  // Effect to handle scrolling
  useEffect(() => {
    if (contentVisible) {
      // Short delay to ensure DOM is ready before enabling scroll
      setTimeout(() => {
        document.body.style.overflow = ''; // Re-enable scrolling
      }, 100);
    } else {
      document.body.style.overflow = 'hidden'; // Prevent scrolling during loader
    }
  }, [contentVisible]);

  // Handle loader completion
  const handleLoaderComplete = () => {
    // No need for extra delay, just show content when loader completes
    setContentVisible(true);
  };

  return (
    <AnimationProvider>
      {/* Loader component */}
      <Loader onComplete={handleLoaderComplete} duration={7} />

      {/* Main app content - always render but control visibility with CSS */}
      <div className={`App ${contentVisible ? 'visible' : 'hidden'}`}>
        <Navbar />
        {/* Other components will go here */}
        <Hero />
      </div>
    </AnimationProvider>
  );
}

export default App;
