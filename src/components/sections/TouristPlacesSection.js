"use client";

import { useState, useRef, useEffect } from "react";
import { FiLoader, FiAlertCircle, FiCompass, FiMapPin, FiExternalLink } from "react-icons/fi";
import dynamic from "next/dynamic";

const TouristPlacesMap = dynamic(() => import("./TouristPlacesMap"), { ssr: false });

export default function TouristPlacesSection() {
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
    const query = `[out:json][timeout:25];(node["historic"](around:5000,${lat},${lon}););out body;>;out skel qt;`;

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
    <div className="main-content font-sans bg-white" style={{ position: 'relative' }}>
      {/* Video background for header */}
      <style jsx>{`
        .main-content {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .tourist-places-container {
          display: flex;
          flex: 1;
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
          width: 320px;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          margin-right: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tp-sidebar.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .tp-list-grid {
          display: grid;
          gap: 1rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tp-list-grid.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .tp-list-card {
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 12px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tp-list-card.animate {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--delay, 0s);
        }

        .tp-list-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        /* Animation keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tp-list-card.animate {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .tp-heading {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tp-heading.animate {
          opacity: 1;
          transform: translateY(0);
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
              className="w-full bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-blue-700 disabled:bg-slate-400"
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
            <div className="p-3 mb-3 bg-red-100 text-red-700 text-sm flex items-center gap-2 rounded">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div>
            {loading && attractions.length === 0 && (
              <div className="p-4 text-slate-500">Loading nearby places...</div>
            )}
            {!loading && attractions.length === 0 && !error && (
              <div className="p-4 text-slate-500">No places found. Try searching!</div>
            )}
            <ul className="tp-list-grid">
              {attractions.map((place) => (
  <li key={place.id}>
    <div
      className={`tp-list-card${selectedPlace?.id === place.id ? ' selected' : ''}`}
      onClick={() => setSelectedPlace(place)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px', background: 'linear-gradient(90deg, #e0ecff 0%, #f8fafc 100%)', borderLeft: '6px solid #60a5fa', boxShadow: '0 2px 12px 0 rgba(56,189,248,0.08)' }}
    >
      <div style={{ position: 'relative', flex: '0 0 70px', width: 70, height: 70, borderRadius: 10, overflow: 'hidden', background: '#e5e7eb', border: '1.5px solid #60a5fa', marginBottom: 0, boxShadow: '0 1px 6px 0 rgba(56,189,248,0.09)' }}>
        <iframe
          title={place.name}
          width="70"
          height="70"
          frameBorder="0"
          style={{ border: 0, width: 70, height: 70, display: 'block', borderRadius: 10 }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.position[1] - 0.005}%2C${place.position[0] - 0.005}%2C${place.position[1] + 0.005}%2C${place.position[0] + 0.005}&layer=mapnik&marker=${place.position[0]}%2C${place.position[1]}`}
          allowFullScreen=""
          loading="lazy"
        />
        <span style={{ position: 'absolute', bottom: 4, left: 4, color: '#2563eb', background: 'rgba(255,255,255,0.85)', borderRadius: '50%', padding: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }}>
          <FiMapPin size={18} />
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</h3>
          <span style={{ background: '#e0e7ef', color: '#2563eb', fontSize: '0.72rem', fontWeight: 600, borderRadius: 8, padding: '2px 8px', marginLeft: 2, textTransform: 'capitalize' }}>{place.type.replace(/_/g, ' ')}</span>
        </div>
        <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.position[0]},${place.position[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', background: '#e0e7ef', borderRadius: 6, padding: '2px 7px', fontSize: '0.89rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: 500, gap: 3 }}
          >
            <FiExternalLink size={15} style={{ marginRight: 3 }} /> Directions
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
