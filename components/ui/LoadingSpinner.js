import React from 'react';

export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={fullPage ? 'spinner-fullpage' : 'spinner-overlay'}>
      <div className="spinner-container">
        <div className="spinner-ring"></div>
      </div>

      {!fullPage && (
        <p className="loading-message">Loading Map...</p>
      )}

      <style jsx>{`
        .spinner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .spinner-fullpage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .spinner-container {
          width: 80px;
          height: 80px;
        }

        .spinner-ring {
          width: 100%;
          height: 100%;
          border: 5px solid rgba(52, 152, 219, 0.2);
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-message {
          margin-top: 1rem;
          font-size: 1rem;
          color: #333;
        }
      `}</style>
    </div>
  );
}
