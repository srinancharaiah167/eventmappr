import React, { useEffect } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
    });
  }, []);

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
        <section className="about-header" data-aos="fade-down">
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
        <div className="features-section">
          {/* Background Video for Features Section Only */}
          <div className="features-bg-wrap">
            <video className="features-bg-video" autoPlay loop muted playsInline poster="/about-bg-fallback.jpg">
              <source src="https://videos.pexels.com/video-files/2361938/2361938-uhd_2560_1440_30fps.mp4" type="video/mp4" />
            </video>
            <div className="features-bg-overlay"></div>
          </div>
          <h2 data-aos="zoom-in">✨ Features</h2>
          <div className="features-grid">
            {features.map((item, idx) => (
              <div className="feature-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 80}>
                <span className="emoji">{item.icon}</span>
                <span className="text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

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
          min-height: calc(100vh - 400px);
          position: relative;
          overflow: hidden;
        }
        .about-header {
          position: relative;
          z-index: 2;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
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
          position: relative;
          z-index: 2;
          padding: 2.85rem 2rem;
          text-align: center;
          background-color: #0f0f1a;
          color: white;
          overflow: hidden;
        }
        .features-bg-wrap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .features-bg-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }
        .features-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 30, 0.65);
        }
        .features-section h2 {
          font-size: 2.2rem;
          margin-bottom: 2.5rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(220px, 1fr));
          gap: 2.2rem 2.2rem;
          justify-content: center;
          align-items: stretch;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .feature-card {
          background: rgba(32, 32, 64, 0.94);
          border-radius: 1.3rem;
          box-shadow: 0 8px 32px rgba(24,24,64,0.25), 0 2px 8px rgba(0,0,0,0.10);
          padding: 2.2rem 1.25rem 2rem 1.25rem;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(.4,2,.6,1), box-shadow 0.3s;
          position: relative;
          border: 1.5px solid rgba(255,255,255,0.08);
          z-index: 3;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.035);
          box-shadow: 0 16px 48px rgba(24,24,64,0.32), 0 4px 16px rgba(0,0,0,0.15);
          background: rgba(38, 38, 80, 0.99);
          border: 1.5px solid #4e6cf3;
        }
        .emoji {
          font-size: 2.1rem;
          margin-bottom: 0.7rem;
          filter: drop-shadow(0 2px 6px #0008);
        }
        .feature-card .text {
          font-size: 1.09rem;
          font-weight: 500;
          color: #fff;
          text-align: center;
          line-height: 1.5;
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

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
        }
        @media (max-width: 500px) {
          .feature-card {
            font-size: 0.85rem;
            padding: 1rem 0.7rem;
          }
          .about-header h1 {
            font-size: 2.2rem;
          }
          .features-section h2 {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </>
  );
}
