import { useState, useEffect } from "react";
import "./App.scss";

// Components
import Navbar from "./components/Navbar/Navbar";
import Loader from "./components/Loader/Loader";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Work from "./components/Work/Work";
import Contact from "./components/Contact/Contact";
// Animation Context
import { AnimationProvider } from "./context/AnimationContext";

// Sections type for type safety
export type SectionType = "Home" | "About" | "Projects" | "Contact";

function App() {
  // State to manage content visibility
  const [contentVisible, setContentVisible] = useState(false);
  // State to manage active section
  const [activeSection, setActiveSection] = useState<SectionType>("Home");

  // Effect to handle scrolling
  useEffect(() => {
    if (contentVisible) {
      // Short delay to ensure DOM is ready before enabling scroll
      setTimeout(() => {
        document.body.style.overflow = ""; // Re-enable scrolling
      }, 100);
    } else {
      document.body.style.overflow = "hidden"; // Prevent scrolling during loader
    }
  }, [contentVisible]);

  // Handle loader completion
  const handleLoaderComplete = () => {
    // No need for extra delay, just show content when loader completes
    setContentVisible(true);
  };

  // Handle section change from navbar
  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section);
  };

  return (
    <AnimationProvider>
      {/* Loader component */}
      <Loader onComplete={handleLoaderComplete} duration={7} />

      {/* Main app content - always render but control visibility with CSS */}
      <div className={`App ${contentVisible ? "visible" : "hidden"}`}>
        <Navbar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Render sections based on active section */}
        {activeSection === "Home" && <Hero />}
        {activeSection === "About" && <About />}
        {activeSection === "Projects" && <Work />}
        {activeSection === "Contact" && <Contact />}
        {/* Other sections will be added later */}
      </div>
    </AnimationProvider>
  );
}

export default App;
