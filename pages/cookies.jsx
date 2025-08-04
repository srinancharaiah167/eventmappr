import React from 'react';

function Cookies() {
  return (
    <div className="cookies-container">
      <div className="cookies-page">
        <div className="header-section">
          <div className="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8" cy="8" r="1" fill="currentColor"/>
              <circle cx="16" cy="8" r="1" fill="currentColor"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
              <circle cx="6" cy="14" r="1" fill="currentColor"/>
              <circle cx="18" cy="14" r="1" fill="currentColor"/>
              <circle cx="10" cy="12" r="1" fill="currentColor"/>
              <circle cx="14" cy="10" r="1" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="title">Cookie Policy</h1>
          <p className="subtitle">How we use cookies to enhance your experience</p>
          <div className="updated-badge">
            <span>Last updated: June 29, 2025</span>
          </div>
        </div>

        <div className="content-grid">
          <section className="section">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2>What Are Cookies?</h2>
            </div>
            <p>
              Cookies are small text files stored on your device to help us improve your experience and analyze usage. They're essential for modern web functionality and personalization.
            </p>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2>How We Use Cookies</h2>
            </div>
            <div className="cookie-types">
              <div className="cookie-card">
                <div className="card-icon">⚙️</div>
                <div className="card-content">
                  <h3>Essential Cookies</h3>
                  <p>Enable core functionality and secure access</p>
                </div>
              </div>
              <div className="cookie-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h3>Analytics Cookies</h3>
                  <p>Help us understand how you use our platform</p>
                </div>
              </div>
              <div className="cookie-card">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h3>Preference Cookies</h3>
                  <p>Remember your settings and personalization</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2>Types of Cookies We Use</h2>
            </div>
            <div className="cookie-duration-grid">
              <div className="duration-item">
                <span className="duration-icon">⏱️</span>
                <div className="duration-content">
                  <h4>Session Cookies</h4>
                  <p>Expire when you close your browser</p>
                </div>
              </div>
              <div className="duration-item">
                <span className="duration-icon">🔄</span>
                <div className="duration-content">
                  <h4>Persistent Cookies</h4>
                  <p>Remain until deleted or expired</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2>Managing Cookies</h2>
            </div>
            <div className="management-options">
              <div className="management-card">
                <div className="card-icon">🌐</div>
                <div className="card-content">
                  <h3>Browser Settings</h3>
                  <p>Control cookies through your browser preferences</p>
                </div>
              </div>
              <div className="management-card">
                <div className="card-icon">⚠️</div>
                <div className="card-content">
                  <h3>Impact Notice</h3>
                  <p>Disabling cookies may affect platform functionality</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2>Third-Party Services</h2>
            </div>
            <p>
              We use third-party analytics services that may set their own cookies. These help us understand user behavior and improve our platform performance.
            </p>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="section-number">06</span>
              <h2>Changes to This Policy</h2>
            </div>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>
        </div>

        <div className="contact-section">
          <div className="contact-card">
            <h3>Questions about our cookies?</h3>
            <p>Our team is here to help you understand how we use cookies and protect your privacy.</p>
            <a href="mailto:support@eventmappr.com" className="contact-button">
              <span>Get in Touch</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookies-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .cookies-page {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-section {
          text-align: center;
          padding: 3rem 2rem 2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .header-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="10" cy="90" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }

        .icon-wrapper {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          margin-bottom: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .title {
          position: relative;
          z-index: 1;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.025em;
        }

        .subtitle {
          position: relative;
          z-index: 1;
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0 0 1.5rem 0;
          font-weight: 400;
        }

        .updated-badge {
          position: relative;
          z-index: 1;
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .content-grid {
          padding: 2rem;
        }

        .section {
          margin-top: -70px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .section-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .section p {
          font-size: 1rem;
          line-height: 1.7;
          color: #475569;
          margin: 0;
        }

        .cookie-types {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .cookie-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .cookie-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .management-options {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .management-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .management-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .card-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .card-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .card-content p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .cookie-duration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .duration-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .duration-item:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .duration-icon {
          font-size: 1.125rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .duration-content h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .duration-content p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .contact-section {
          padding: 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .contact-card {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border-radius: 20px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
        }

        .contact-card h3 {
          position: relative;
          z-index: 1;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .contact-card p {
          position: relative;
          z-index: 1;
          opacity: 0.9;
          margin: 0 0 1.5rem 0;
        }

        .contact-button {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .contact-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .cookies-container {
            padding: 1rem 0.5rem;
          }

          .header-section {
            padding: 2rem 1rem 1.5rem;
          }

          .title {
            font-size: 2rem;
          }

          .content-grid {
            padding: 1.5rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .cookie-types {
            grid-template-columns: 1fr;
          }

          .cookie-duration-grid {
            grid-template-columns: 1fr;
          }

          .contact-section {
            padding: 1.5rem;
          }

          .contact-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Cookies;