"use client";

import { useState, useRef, useEffect } from "react";
import { FiLoader, FiAlertCircle, FiCompass, FiMapPin, FiExternalLink } from "react-icons/fi";
import dynamic from "next/dynamic";
import Places from "./places";

const TouristPlacesMap = dynamic(() => import("./TouristPlacesMap"), { ssr: false });

export default function TouristPlacesSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Click the button to find historical places near you.");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFindAttractions = () => {
    setLoading(true);
    setError(null);
    setAttractions([]);
    setSelectedPlace(null);

    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    setStatus("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];
        setUserLocation(location);
        setStatus(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        fetchAttractions(latitude, longitude);
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable location permissions.");
        setStatus("Location error: " + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchAttractions = async (lat, lon) => {
    const query = `[out:json][timeout:25];(node["historic"](around:30000,${lat},${lon}););out body;>;out skel qt;`;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);

      const data = await response.json();
      const formatted = data.elements
        .filter((e) => e.tags && e.tags.name)
        .map((e) => ({
          id: e.id,
          name: e.tags.name,
          position: [e.lat, e.lon],
          type: e.tags.historic || "Historic Site",
          description: e.tags.description || e.tags.wikipedia || null,
          website: e.tags.website || null,
          address: e.tags["addr:street"] || null,
        }))
        .slice(0, 20); // Increased to 20 results

      setAttractions(formatted);
      setStatus(formatted.length > 0 ? `Found ${formatted.length} historical places` : "No historical places found within 5km.");
    } catch (err) {
      setError("Failed to fetch attractions. The service might be temporarily unavailable.");
      setStatus("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Animation state for header
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  // Theme detection effect
  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(currentTheme === 'dark');
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Animate top heading on scroll
    const animateHeading = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const screenPosition = window.innerHeight / 1.3;
      if (rect.top < screenPosition) {
        headerRef.current.classList.add('animate');
      }
    };
    window.addEventListener('scroll', animateHeading);
    animateHeading(); // Initial check

    // Enhanced scroll-based animations with staggered effects
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: '.tourist-places-container', threshold: 1.3 },
        { selector: '.tp-sidebar', threshold: 1.3 },
        { selector: '.tp-list-grid', threshold: 1.3 },
        { selector: '.tp-list-card', threshold: 1.3 }
      ];

      elementsToAnimate.forEach(element => {
        const els = document.querySelectorAll(element.selector);
        els.forEach((el, index) => {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;

          if (elementPosition < screenPosition) {
            // Add staggered delay for list items
            const delay = element.selector === '.tp-list-card' ? index * 100 : 0;
            setTimeout(() => {
              el.classList.add('animate');
            }, delay);
          }
        });
      });
    };

    // Add a small delay before adding scroll listener to ensure content is visible
    setTimeout(() => {
      window.addEventListener('scroll', animateOnScroll, { passive: true });
      animateOnScroll(); // Run once on load
    }, 200);

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div className={`main-content font-sans bg-white ${isDarkMode ? 'dark-theme' : ''}`} style={{ position: 'relative' }}>
      {/* Video background for header */}
      <style jsx>{`
        .main-content {
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          min-weight: 100vh;
          flex-direction: column;
          alignItems: center;
          justifyContent: center;
        }

        .tourist-places-container {
          display: flex;
          height: 100%;
          width: 100%;
          
          justifyContent: center;
          alignItems: center;
          padding: 2rem;
          background: #f8fafc;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tourist-places-container.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .tp-sidebar {
    height: 100%;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .list-places {
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 16px;
  height: 50%;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}


  .list-places::-webkit-scrollbar {
    width: 0px;
  }

  .list-places::-webkit-scrollbar-track {
    background: transparent;
  }

  .list-places::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;
  }

  .list-places::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }

  .tp-list-grid {
  
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 860px; /* Adjust if needed */
  margin: auto 150px;
  list-style: none;
  padding: 0;
}



  .tp-list-card {
    width:100%;
    
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    background: linear-gradient(135deg, #f8fafc 0%, #e0ecff 100%);
    border: 1px solid #e2e8f0;
    border-left: 4px solid #60a5fa;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    // box-shadow: 0 2px 8px rgba(96, 165, 250, 0.08);
    box-shadow: 0 2px 8px lightblue;
    
    position: relative;
    overflow: hidden;
  }

  .tp-list-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.02) 0%, rgba(59, 130, 246, 0.04) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tp-list-card:hover {
    transform: translateY(10px);
    
    box-shadow: 0 8px 25px rgba(96, 165, 250, 0.15);
    border-left-color: #3b82f6;
  }

  .tp-list-card:hover::before {
    opacity: 1;
  }

  .tp-list-card.selected {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-left-color: #2563eb;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
    transform: translateY(-1px);
  }

  .tp-list-card.selected::before {
    opacity: 1;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.08) 100%);
  }

  .place-map-container {
    position: relative;
    flex: 0 0 70px;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    overflow: hidden;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .tp-list-card:hover .place-map-container {
    border-color: #60a5fa;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
  }

  .place-map-container iframe {
    border: 0;
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 8px;
  }

  .map-pin-icon {
    position: absolute;
    bottom: 6px;
    right: 6px;
    color: #2563eb;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .tp-list-card:hover .map-pin-icon {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  .place-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .place-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

  }
    .btn-near-me {
    padding: 0.5rem 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
      }

  .place-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .place-type-badge {
    color: #2563eb;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 8px;
    text-transform: capitalize;
    white-space: nowrap;
    
    transition: all 0.3s ease;
  }

  .tp-list-card:hover .place-type-badge {
    background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
    border-color: #a5b4fc;
  }

  .place-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
  }

  .directions-link {
    color: #2563eb;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: 500;
    gap: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }

  .directions-link:hover {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-color: #93c5fd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  .directions-link:active {
    transform: translateY(0);
  }

  /* Add map area styles */
  .tp-map-area {
    flex: 1;
    min-height: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0.2s;
  }

  .tp-map-area.animate {
    opacity: 1;
    transform: translateY(0);
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .tourist-places-container {
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
    }
    
    .tp-sidebar {
      width: 100%;
      max-width: 500px;
      margin-bottom: 2rem;
    }
      .list-places{
      width: 100%;
      }
    
    .tp-map-area {
      width: 100%;
      max-width: 800px;
    }
  }
  @media (max-width: 768px) {
    .tp-sidebar {
      max-width: 100%;
      border-radius: 12px;
    }
    
    .list-places {
      padding: 12px;
    }
    
    .tp-list-grid {
      gap: 10px;
      width:100%;
    }
    
    .tp-list-card {
      padding: 10px;
      gap: 12px;
    }
    
    .place-map-container {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
    }
    
    .place-title {
      font-size: 1rem;
    }
    
    .place-type-badge {
      font-size: 0.7rem;
      padding: 2px 6px;
    }
    
    .directions-link {
      font-size: 0.8rem;
      padding: 5px 8px;
    }
  }

  @media (max-width: 480px) {
    .tp-list-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .place-map-container {
      align-self: center;
    }
    
    .place-info {
      width: 100%;
    }
    
    .place-header {
      justify-content: space-between;
    }
    
    .place-title {
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
    }
  }

  /* Loading and Empty States */
  .loading-state,
  .empty-state {
    padding: 24px 16px;
    text-align: center;
    color: #64748b;
    font-size: 0.9rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px;
    border: 1px dashed #cbd5e1;
    margin: 12px 0;
  }

  /* Error State Styles */
  .error-alert {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border: 1px solid #fecaca;
    border-left: 4px solid #ef4444;
  }

  /* Force dark theme CSS variables */
  .dark-theme {
    --bg-color: #0a0a0f;
    --text-color: #e2e8f0;
    --text-muted: #94a3b8;
    --card-bg: #1a1a23;
    --border-color: rgba(99, 102, 241, 0.2);
    --hover-bg: #22222c;
    --shadow-color: rgba(0, 0, 0, 0.5);
  }

  /* Comprehensive Dark Theme for Tourist Places Page */
  [data-theme="dark"] .main-content,
  .dark-theme.main-content {
    background: linear-gradient(to bottom, var(--bg-color, #0a0a0f), #0f0f15) !important;
    color: var(--text-color, #e2e8f0) !important;
  }

  [data-theme="dark"] .tourist-places-container,
  .dark-theme .tourist-places-container {
    background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(19, 19, 26, 0.98) 50%, rgba(26, 26, 35, 0.95) 100%) !important;
    border-radius: 20px;
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(99, 102, 241, 0.1) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.1) !important;
  }

  [data-theme="dark"] .tp-sidebar,
  .dark-theme .tp-sidebar {
    background: linear-gradient(135deg, var(--card-bg, #1a1a23) 0%, #16161f 100%) !important;
    border: 1px solid var(--border-color, rgba(99, 102, 241, 0.2)) !important;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
  }

  [data-theme="dark"] .tp-list-card,
  .dark-theme .tp-list-card {
    background: linear-gradient(135deg, #1e1e2e 0%, var(--card-bg, #1a1a23) 100%) !important;
    border: 1px solid var(--border-color, rgba(99, 102, 241, 0.15)) !important;
    border-left: 4px solid #6366f1 !important;
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.4),
      0 2px 8px rgba(99, 102, 241, 0.1) !important;
    color: var(--text-color, #e2e8f0) !important;
  }

  [data-theme="dark"] .tp-list-card:hover {
    background: linear-gradient(135deg, #252538 0%, var(--hover-bg, #22222c) 100%);
    border-color: rgba(99, 102, 241, 0.4);
    border-left-color: #4f46e5;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }

  [data-theme="dark"] .tp-list-card.selected {
    background: linear-gradient(135deg, #312e81 0%, #3730a3 100%);
    border-left-color: #4f46e5;
    border-color: rgba(79, 70, 229, 0.5);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      0 4px 20px rgba(79, 70, 229, 0.4);
    color: #c7d2fe;
  }

  [data-theme="dark"] .place-map-container {
    background: linear-gradient(135deg, #1a1a23 0%, var(--hover-bg, #22222c) 100%);
    border: 2px solid var(--border-color, rgba(99, 102, 241, 0.2));
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  [data-theme="dark"] .tp-list-card:hover .place-map-container {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 
      0 6px 16px rgba(0, 0, 0, 0.5),
      0 2px 8px rgba(99, 102, 241, 0.2);
  }

  [data-theme="dark"] .map-pin-icon {
    background: rgba(26, 26, 35, 0.95);
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  [data-theme="dark"] .place-title {
    color: var(--text-color, #e2e8f0);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  [data-theme="dark"] .place-type-badge {
    color: #a5b4fc;
    background: linear-gradient(135deg, #1a1a23 0%, var(--hover-bg, #22222c) 100%);
    border: 1px solid var(--border-color, rgba(99, 102, 241, 0.2));
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  [data-theme="dark"] .tp-list-card:hover .place-type-badge {
    background: linear-gradient(135deg, #4338ca 0%, #5b21b6 100%);
    border-color: #6d28d9;
    color: #c7d2fe;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  [data-theme="dark"] .directions-link {
    color: #a5b4fc;
    background: linear-gradient(135deg, #1a1a23 0%, var(--hover-bg, #22222c) 100%);
    border: 1px solid var(--border-color, rgba(99, 102, 241, 0.2));
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  [data-theme="dark"] .directions-link:hover {
    background: linear-gradient(135deg, #4338ca 0%, #5b21b6 100%);
    border-color: #6d28d9;
    color: #c7d2fe;
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
    transform: translateY(-1px);
  }

  [data-theme="dark"] .tp-map-area {
    background: linear-gradient(135deg, var(--card-bg, #1a1a23) 0%, #16161f 100%);
    border: 1px solid var(--border-color, rgba(99, 102, 241, 0.15));
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  [data-theme="dark"] .loading-state,
  [data-theme="dark"] .empty-state,
  .dark-theme .loading-state,
  .dark-theme .empty-state {
    color: var(--text-muted, #94a3b8) !important;
    background: linear-gradient(135deg, #1e1e2e 0%, var(--card-bg, #1a1a23) 100%) !important;
    border: 1px dashed var(--border-color, rgba(99, 102, 241, 0.3)) !important;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* Enhanced empty state styling */
  [data-theme="dark"] .empty-state,
  .dark-theme .empty-state {
    background: linear-gradient(135deg, 
      rgba(30, 30, 46, 0.8) 0%, 
      rgba(26, 26, 35, 0.9) 50%, 
      rgba(22, 22, 31, 0.8) 100%) !important;
    border: 2px dashed rgba(99, 102, 241, 0.4) !important;
    color: var(--text-muted, #a1a1aa) !important;
    font-weight: 500;
    text-align: center;
    padding: 32px 24px !important;
    border-radius: 16px !important;
    position: relative;
    overflow: hidden;
  }

  [data-theme="dark"] .empty-state::before,
  .dark-theme .empty-state::before {
    display: block;
    font-size: 2.5rem;
    margin-bottom: 12px;
    opacity: 0.6;
  }

  [data-theme="dark"] .empty-state::after,
  .dark-theme .empty-state::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 0%, 
      rgba(99, 102, 241, 0.05) 50%, 
      transparent 100%);
    pointer-events: none;
  }

  [data-theme="dark"] .error-alert {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
    border: 1px solid rgba(239, 68, 68, 0.4);
    border-left: 4px solid #ef4444;
    color: #fca5a5;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  /* Dark theme scrollbar styling */
  [data-theme="dark"] .list-places {
    scrollbar-width: thin;
    scrollbar-color: var(--border-color, rgba(99, 102, 241, 0.3)) transparent;
  }

  [data-theme="dark"] .list-places::-webkit-scrollbar-thumb {
    background: var(--border-color, rgba(99, 102, 241, 0.3));
    border-radius: 6px;
  }

  [data-theme="dark"] .list-places::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted, rgba(99, 102, 241, 0.5));
  }





  /* Hero Section keeps original styling in all themes */

  /* Additional dark theme focus states */
  [data-theme="dark"] .tp-list-card:focus-within,
  .dark-theme .tp-list-card:focus-within {
    outline: 2px solid rgba(99, 102, 241, 0.5);
    outline-offset: 2px;
  }

  [data-theme="dark"] .directions-link:focus,
  .dark-theme .directions-link:focus {
    outline: 2px solid rgba(99, 102, 241, 0.5);
    outline-offset: 2px;
  }
      `}</style>
      <div style={{ position: 'relative', width: '100%', minHeight: '390px' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.6)'
          }}
        >
          <source src="https://videos.pexels.com/video-files/5243307/5243307-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        {/* Overlayed header content */}
        <div
          ref={headerRef}
          className="tp-heading"
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 0 40px 0',
            marginTop: '90px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ background: 'rgba(30, 41, 59, 0.82)', borderRadius: 24, padding: '38px 32px 32px 32px', boxShadow: '0 8px 32px 0 rgba(30,41,59,0.22)', textAlign: 'center', width: '100%', maxWidth: 600 }}>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-1px', textShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>Historical Places Explorer</h1>
            <p style={{ color: '#e0e7ef', fontSize: '1.18rem', marginBottom: 28, textAlign: 'center', maxWidth: 500, textShadow: '0 1px 8px rgba(0,0,0,0.13)' }}>
              Find and explore historical places near you. Click on a place to see it on the map.
            </p>
            <button
              onClick={handleFindAttractions}
              disabled={loading}
              className="btn-near-me w-full bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-blue-700 disabled:bg-slate-400"
              style={{ marginBottom: 0, maxWidth: 260, boxShadow: '0 2px 12px 0 rgba(56,189,248,0.13)', marginLeft: 'auto', marginRight: 'auto' }}
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiCompass />}
              <span>{loading ? 'Searching...' : 'Find Places Near Me'}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="tourist-places-container">
        {/* Sidebar */}
        <aside className="tp-sidebar">
          {error && (
            <div className="p-3 mb-3 bg-red-100 text-red-700 text-sm flex items-center gap-2 rounded error-alert">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="list-places">
            {loading && attractions.length === 0 && (
              <div className="loading-state">Loading nearby places...</div>
            )}
            {!loading && attractions.length === 0 && !error && (
              <div className="empty-state">No places found. Try searching!</div>
             
            )}

            <ul className="tp-list-grid">
              {attractions.map((place) => (
                <li key={place.id}>
                  <div
                    className={`tp-list-card${selectedPlace?.id === place.id ? ' selected' : ''}`}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <div className="place-map-container">
                      <iframe
                        title={place.name}
                        width="70"
                        height="70"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.position[1] - 0.005}%2C${place.position[0] - 0.005}%2C${place.position[1] + 0.005}%2C${place.position[0] + 0.005}&layer=mapnik&marker=${place.position[0]}%2C${place.position[1]}`}
                        allowFullScreen=""
                        loading="lazy"
                      />
                      <span className="map-pin-icon">
                        <FiMapPin size={18} />
                      </span>
                    </div>
                    <div className="place-info">
                      <div className="place-header">
                        <h3 className="place-title">{place.name}</h3>
                        <span className="place-type-badge">
                          {place.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="place-actions">
                        <a
                          className="directions-link"
                          href={`https://www.google.com/maps/search/?api=1&query=${place.position[0]},${place.position[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiExternalLink size={15} />
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="tp-map-area">
          <TouristPlacesMap
            attractions={attractions}
            userLocation={userLocation}
            selectedPlace={selectedPlace}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
}
