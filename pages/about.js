import React, { useEffect } from "react";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Navigation,
  Filter,
  Save,
  Smartphone,
  FileText,
  Map,
  Cloud,
  Camera,
  RotateCcw,
} from "lucide-react";

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
    });
  }, []);

  const features = [
    {
      icon: <MapPin size={28} />,
      label: "Add to Map – Drop a pin, add title, date & more",
    },
    {
      icon: <Navigation size={28} />,
      label: "Find Nearby – Use Geolocation API",
    },
    {
      icon: <Filter size={28} />,
      label: "Filter by Category – Music, Tech, Volunteering...",
    },
    {
      icon: <Save size={28} />,
      label: "Persistent Storage – localStorage support",
    },
    {
      icon: <Smartphone size={28} />,
      label: "Interactive UI – Popups, animations, responsive",
    },
    { icon: <FileText size={28} />, label: "NEW: Detailed Event Pages" },
    { icon: <Map size={28} />, label: "NEW: Mini Maps on Event Detail" },
    {
      icon: <Cloud size={28} />,
      label: "NEW: Weather Planner (5-day forecast)",
    },
    {
      icon: <Camera size={28} />,
      label: "NEW: Event Gallery – user shared photos",
    },
    {
      icon: <RotateCcw size={28} />,
      label: "NEW: Modular Routing with react-router",
    },
  ];

  return (
    <>
      <Head>
        <title>About Us | EventMappr</title>
        <meta
          name="description"
          content="Learn more about EventMappr's mission and features."
        />
      </Head>

      <div className="about-page">
       
        <section className="hero-section" data-aos="fade-down">
          <div className="hero-content">
            <h1 data-aos="fade-up" data-aos-delay="300">
              About EventMappr
            </h1>
            <p data-aos="fade-up" data-aos-delay="400">
              EventMappr is a lightweight, open-source community event mapping
              web app. Users can discover, add, and explore local events pinned
              on an interactive map. It's a user-friendly frontend tool for
              discovering and cataloging community happenings.
            </p>
            <div className="hero-stats" data-aos="fade-up" data-aos-delay="500">
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Features</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Open Source</span>
              </div>
              <div className="stat">
                <span className="stat-number">MIT</span>
                <span className="stat-label">License</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <div className="section-header" data-aos="fade-up">
              <h2>✨ Powerful Features</h2>
              <p>Everything you need to discover and share local events</p>
            </div>
            
            <div className="features-grid">
              {features.map((item, idx) => (
                <div
                  className="feature-card"
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                >
                  <div className="feature-icon">
                    {item.icon}
                  </div>
                  <p className="feature-text">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-section" data-aos="fade-up">
          <div className="stats-container">
            <h3>Project Stats</h3>
            <div className="badges-grid">
              <img
                src="https://img.shields.io/badge/License-MIT-blue.svg"
                alt="License"
              />
              <img
                src="https://img.shields.io/github/stars/Bhavya1352/eventmappr?style=social"
                alt="GitHub stars"
              />
              <img
                src="https://img.shields.io/github/forks/Bhavya1352/eventmappr?style=social"
                alt="GitHub forks"
              />
              <img
                src="https://img.shields.io/github/issues/Bhavya1352/eventmappr"
                alt="GitHub issues"
              />
              <img
                src="https://img.shields.io/github/contributors/Bhavya1352/eventmappr?color=green"
                alt="Contributors"
              />
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #fafbff 0%, #f1f5ff 100%);
        }

        /* Hero Section */
        .hero-section {
          padding: 6rem 2rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: radial-gradient(ellipse 800px 600px at 50% -20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-section h1 {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-section p {
          font-size: 1.25rem;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 2rem;
          background: white;
          position: relative;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.125rem;
          color: #64748b;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }

        .feature-card:hover::before {
          transform: translateX(0);
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #dbeafe, #eff6ff);
          border-radius: 12px;
          margin-bottom: 1rem;
          color: #3b82f6;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          transform: scale(1.05);
        }

        .feature-text {
          font-size: 1rem;
          color: #374151;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .stats-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .stats-section h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        .badges-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .badges-grid img {
          height: 32px;
          border-radius: 6px;
          transition: transform 0.2s ease;
        }

        .badges-grid img:hover {
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }

          .hero-section p {
            font-size: 1.125rem;
          }

          .hero-stats {
            gap: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 4rem 1rem 3rem;
          }

          .hero-section h1 {
            font-size: 2rem;
          }

          .features-section {
            padding: 3rem 1rem;
          }

          .stats-section {
            padding: 3rem 1rem;
          }
        }
      `}</style>
    </>
  );
}