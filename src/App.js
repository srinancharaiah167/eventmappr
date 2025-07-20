import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import FooterSection from './components/sections/FooterSection';
import HomePage from './pages/HomePage';

// Import CSS
import './styles/style.css';
import './styles/Home.css';
import './styles/AppStyles.css';
import './styles/faq.css';

const App = () => {
  const [theme, setTheme] = useState('light');
    useEffect(() => {
    // Optionally detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme); // optional for CSS
  };
  return (
    <Router>
      <div className={`app ${theme}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Other routes can be added here */}
        </Routes>
        <FooterSection />
      </div>
    </Router>
  );
};

export default App; 