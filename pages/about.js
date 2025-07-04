import React from 'react';
import Head from 'next/head';

export default function About() {
  const features = [
    { icon: "🗺️", label: "Add to Map – Drop a pin, add title, date & more" },
    { icon: "🧭", label: "Find Nearby – Use Geolocation API" },
    { icon: "🎛️", label: "Filter by Category – Music, Tech, Volunteering..." },
    { icon: "💾", label: "Persistent Storage – localStorage support" },
    { icon: "📱", label: "Interactive UI – Popups, animations, responsive" },
    { icon: "📄", label: "NEW: Detailed Event Pages" },
    { icon: "🗺️", label: "NEW: Mini Maps on Event Detail" },
    { icon: "☁️", label: "NEW: Weather Planner (5-day forecast)" },
    { icon: "📸", label: "NEW: Event Gallery – user shared photos" },
    { icon: "🔄", label: "NEW: Modular Routing with react-router" },
  ];

  return (
    <>
      <Head>
        <title>About Us | EventMappr</title>
        <meta name="description" content="Learn more about EventMappr's mission and features." />
      </Head>

      <div className="about-page">
        {/* Header Section */}
        <div className="about-header">
          <div className="container">
            <h1>About EventMappr</h1>
            <p>
              EventMappr is a lightweight, open-source community event mapping web app. 
              Users can discover, add, and explore local events pinned on an interactive map.
              It’s a user-friendly frontend tool for discovering and cataloging community happenings.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>✨ Features</h2>
          <div className="features-grid">
            {features.map((item, idx) => (
              <div className="feature-pill" key={idx}>
                <span className="emoji">{item.icon}</span>
                <span className="text">{item.label}</span>
              </div>
            ))}
            
          </div>
        </div>
        <div className="badges">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/github/stars/Bhavya1352/eventmappr?style=social" alt="GitHub stars" />
  <img src="https://img.shields.io/github/forks/Bhavya1352/eventmappr?style=social" alt="GitHub forks" />
  <img src="https://img.shields.io/github/issues/Bhavya1352/eventmappr" alt="GitHub issues" />
  <img src="https://img.shields.io/github/issues-raw/Bhavya1352/eventmappr?label=open%20issues&color=orange" alt="Open issues" />
  <img src="https://img.shields.io/github/contributors/Bhavya1352/eventmappr?color=green" alt="Contributors" />
</div>

      </div>

      <style jsx>{`
        .about-page {
          min-height: calc(100vh - 400px);
        }

        .about-header {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 6rem 2rem 4rem;
          text-align: center;
        }

        .about-header h1 {
          font-size: 2.8rem;
          margin-bottom: 1.5rem;
        }

        .about-header p {
          max-width: 800px;
          margin: auto;
          font-size: 1.1rem;
        }

        .features-section {
          padding: 2.85rem 2rem;
          text-align: center;
          background-color: #0f0f1a;
          color: white;
        }

        .features-section h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          
        }

        .features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #232344;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 9999px;
          font-size: 0.95rem;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: background 0.3s ease;
        }

        .feature-pill:hover {
          background-color: #2f2f5c;
        }

        .emoji {
          font-size: 1.2rem;
        }
.badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  background-color: #0a0a0a;
  border-top: 1px solid var(--border, #222);
}

.badges img {
  height: 28px;
  border-radius: 4px;
}

        @media (max-width: 500px) {
          .feature-pill {
            font-size: 0.85rem;
            padding: 0.5rem 1rem;
          }

          .about-header h1 {
            font-size: 2rem;
          }

          .features-section h2 {
            font-size: 1.5rem;
          }
            
        }
      `}</style>
    </>
  );
}
