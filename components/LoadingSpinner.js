import React from 'react';

export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={fullPage ? 'spinner-fullpage' : 'spinner-overlay'}>
      <div className="splash-container">
        <div className="splash-content">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <img src="/logg.svg" alt="Logo" className="spinner-logo" />
          </div>
          <div className="splash-text">
            <div className="splash-title">EventMappr</div>
            <div className="splash-subtitle">Discover Local Events</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .spinner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.85) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .spinner-fullpage {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.85) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.4s;
        }
        .splash-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.02),
            0 16px 48px rgba(0, 0, 0, 0.03),
            inset 0 0 40px rgba(var(--primary-rgb, 52, 152, 219), 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 320px;
          max-width: 480px;
          height: 320px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        .splash-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(var(--primary-rgb, 52, 152, 219), 0.05) 50%,
            transparent 100%
          );
          animation: shine 8s infinite;
          z-index: 1;
        }
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
          z-index: 2;
        }
        .spinner-container {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinner-ring {
          position: absolute;
          width: 160px;
          height: 160px;
          border: 5px solid rgba(var(--primary-rgb, 52, 152, 219), 0.2);
          border-top: 5px solid var(--primary, #3498db);
          border-bottom: 5px solid var(--primary-light, #6ec1e4);
          border-radius: 50%;
          animation: spin 1.4s cubic-bezier(0.4, 0.2, 0.2, 1) infinite;
          box-shadow: 
            0 0 48px 0 rgba(var(--primary-rgb, 52, 152, 219), 0.15),
            0 0 80px 0 rgba(var(--primary-rgb, 52, 152, 219), 0.08);
          background: transparent;
        }
        .spinner-logo {
          width: 112px;
          height: 112px;
          border-radius: 28px;
          background: white;
          box-shadow: 
            0 12px 48px rgba(var(--primary-rgb, 52, 152, 219), 0.1),
            0 6px 24px rgba(0, 0, 0, 0.03);
          z-index: 2;
          object-fit: contain;
          padding: 16px;
          transition: transform 0.3s ease;
        }
        .splash-text {
          text-align: center;
          position: relative;
        }
        .splash-title {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--primary, #3498db);
          letter-spacing: -0.6px;
          margin-bottom: 0.6rem;
          text-shadow: 0 2px 12px rgba(var(--primary-rgb, 52, 152, 219), 0.15);
          position: relative;
          z-index: 2;
        }
        .splash-subtitle {
          font-size: 1.2rem;
          color: var(--text-light, #666);
          opacity: 0.9;
          position: relative;
          z-index: 2;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% {
            transform: rotate(0deg) translate(-50%, -50%);
          }
          100% {
            transform: rotate(360deg) translate(-50%, -50%);
          }
        }
        @media (max-width: 600px) {
          .splash-container {
            padding: 2rem;
            min-width: 280px;
            height: 280px;
          }
          .spinner-container {
            width: 140px;
            height: 140px;
          }
          .spinner-ring {
            width: 140px;
            height: 140px;
          }
          .spinner-logo {
            width: 96px;
            height: 96px;
          }
          .splash-title {
            font-size: 2rem;
          }
          .splash-subtitle {
            font-size: 1rem;
            var(--background, #ffffff) 0%,
            rgba(var(--background-rgb, 255, 255, 255), 0.9) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .spinner-fullpage {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, 
            var(--background, #ffffff) 0%,
            rgba(var(--background-rgb, 255, 255, 255), 0.9) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.4s;
        }
        .splash-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 
            0 8px 32px rgba(var(--primary-rgb, 52, 152, 219), 0.05),
            0 16px 48px rgba(var(--primary-rgb, 52, 152, 219), 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 280px;
          max-width: 400px;
          height: 280px;
          transition: all 0.3s ease;
        }
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .spinner-container {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinner-ring {
          position: absolute;
          width: 140px;
          height: 140px;
          border: 4px solid rgba(var(--primary-rgb, 52, 152, 219), 0.2);
          border-top: 4px solid var(--primary, #3498db);
          border-bottom: 4px solid var(--primary-light, #6ec1e4);
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.4, 0.2, 0.2, 1) infinite;
          box-shadow: 
            0 0 40px 0 rgba(var(--primary-rgb, 52, 152, 219), 0.1),
            0 0 60px 0 rgba(var(--primary-rgb, 52, 152, 219), 0.05);
          background: transparent;
        }
        .spinner-logo {
          width: 96px;
          height: 96px;
          border-radius: 24px;
          background: white;
          box-shadow: 
            0 8px 32px rgba(var(--primary-rgb, 52, 152, 219), 0.08),
            0 4px 16px rgba(0, 0, 0, 0.03);
          z-index: 2;
          object-fit: contain;
          padding: 12px;
        }
        .splash-text {
          text-align: center;
        }
        .splash-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--primary, #3498db);
          letter-spacing: -0.5px;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 8px rgba(var(--primary-rgb, 52, 152, 219), 0.1);
        }
        .splash-subtitle {
          font-size: 1.1rem;
          color: var(--text-light, #666);
          opacity: 0.9;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .splash-container {
            padding: 1.5rem;
            min-width: 240px;
            height: 240px;
          }
          .spinner-container {
            width: 120px;
            height: 120px;
          }
          .spinner-ring {
            width: 120px;
            height: 120px;
          }
          .spinner-logo {
            width: 80px;
            height: 80px;
          }
          .splash-title {
            font-size: 1.8rem;
          }
          .splash-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
