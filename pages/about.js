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
        <section className="about-header">
          <div className="container">
            <h1>About EventMappr</h1>
            <p>
              EventMappr is a lightweight, open-source community event mapping web app.
              Users can discover, add, and explore local events pinned on an interactive map.
              It’s a user-friendly frontend tool for discovering and cataloging community happenings.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>✨ Features</h2>
          <div className="features-grid">
            {features.map((item, idx) => (
              <div className="feature-pill" key={idx}>
                <span className="emoji">{item.icon}</span>
                <span className="text">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Badges Section */}
        <section className="badges">
          <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
          <img src="https://img.shields.io/github/stars/Bhavya1352/eventmappr?style=social" alt="GitHub stars" />
          <img src="https://img.shields.io/github/forks/Bhavya1352/eventmappr?style=social" alt="GitHub forks" />
          <img src="https://img.shields.io/github/issues/Bhavya1352/eventmappr" alt="GitHub issues" />
          <img src="https://img.shields.io/github/issues-raw/Bhavya1352/eventmappr?label=open%20issues&color=orange" alt="Open issues" />
          <img src="https://img.shields.io/github/contributors/Bhavya1352/eventmappr?color=green" alt="Contributors" />
        </section>
      </div>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background-color: #0f0f1a;
          color: white;
          font-family: 'Segoe UI', sans-serif;
        }

        .about-header {
          background-color:rgb(57, 57, 201);
          padding: 6rem 2rem 4rem;
          text-align: center;
        }

        .about-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .about-header p {
          max-width: 760px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .features-section {
          padding: 4rem 2rem;
          text-align: center;
        }

        .features-section h2 {
          font-size: 2.2rem;
          margin-bottom: 2.5rem;
        }

        .features-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          max-width: 900px;
          margin: auto;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #232344;
          padding: 0.7rem 1.3rem;
          border-radius: 9999px;
          font-size: 0.95rem;
          font-weight: 500;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .feature-pill:hover {
          background-color:rgb(125, 125, 218);
          transform: scale(1.04);
        }

        .emoji {
          font-size: 1.3rem;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          padding: 2.5rem 1rem;
          background-color: #0a0a0a;
          border-top: 1px solid #222;
        }

        .badges img {
          height: 28px;
          border-radius: 5px;
        }

        @media (max-width: 600px) {
          .about-header h1 {
            font-size: 2.2rem;
          }

          .features-section h2 {
            font-size: 1.7rem;
          }

          .feature-pill {
            font-size: 0.85rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </>
  );
}
