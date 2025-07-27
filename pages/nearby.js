import React, { useState, useEffect, useCallback } from 'react';

export default function NearbyPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Animation on scroll for Nearby Places page
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: '.nearby-page', threshold: 1.3 },
        { selector: '.btn-find', threshold: 1.3 },
        { selector: '.nearby-places-list', threshold: 1.3 }
      ];

      elementsToAnimate.forEach(element => {
        const el = document.querySelector(element.selector);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;
          
          if (elementPosition < screenPosition) {
            el.classList.add('animate');
          }
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  const fetchNearbyPlaces = useCallback(async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError('');
    
    try {
      const radius = 3000;
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="restaurant"](around:${radius},${userLocation.lat},${userLocation.lng});
          node["amenity"="cafe"](around:${radius},${userLocation.lat},${userLocation.lng});
          node["amenity"="fast_food"](around:${radius},${userLocation.lat},${userLocation.lng});
          node["tourism"="hotel"](around:${radius},${userLocation.lat},${userLocation.lng});
          node["tourism"="guest_house"](around:${radius},${userLocation.lat},${userLocation.lng});
          node["amenity"="bar"](around:${radius},${userLocation.lat},${userLocation.lng});
        );
        out body;
      `;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.elements && Array.isArray(data.elements)) {
        // Filter and validate places
        const validPlaces = data.elements
          .filter(place => 
            place.lat && 
            place.lon && 
            place.tags && 
            (place.tags.name || place.tags.amenity || place.tags.tourism)
          )
          .slice(0, 20); // Limit to 20 places to prevent UI issues
        
        setPlaces(validPlaces);
        setRetryCount(0);
      } else {
        setPlaces([]);
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to fetch nearby places. Please try again.');
      }
      
      console.error('Error fetching nearby places:', err);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchNearbyPlaces();
  }, [fetchNearbyPlaces]);

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        });
        setError('');
      },
      (err) => {
        setLoading(false);
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchNearbyPlaces();
    }
  };

  const getPlaceName = (place) => {
    if (!place.tags) return 'Unknown Place';
    
    if (place.tags.name) return place.tags.name;
    
    const amenity = place.tags.amenity;
    const tourism = place.tags.tourism;
    
    if (amenity === 'restaurant') return 'Restaurant';
    if (amenity === 'cafe') return 'Cafe';
    if (amenity === 'fast_food') return 'Fast Food';
    if (amenity === 'bar') return 'Bar';
    if (tourism === 'hotel') return 'Hotel';
    if (tourism === 'guest_house') return 'Guest House';
    
    return 'Place';
  };

  const getPlaceIcon = (place) => {
    if (!place.tags) return '📍';
    
    const amenity = place.tags.amenity;
    const tourism = place.tags.tourism;
    
    if (amenity === 'restaurant' || amenity === 'cafe' || amenity === 'fast_food') return '🍽️';
    if (amenity === 'bar') return '🍺';
    if (tourism === 'hotel' || tourism === 'guest_house') return '🏨';
    
    return '📍';
  };

  const getPlaceType = (place) => {
    if (!place.tags) return '';
    
    const amenity = place.tags.amenity;
    const tourism = place.tags.tourism;
    
    if (amenity) return amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('_', ' ');
    if (tourism) return tourism.charAt(0).toUpperCase() + tourism.slice(1).replace('_', ' ');
    
    return '';
  };

  return (
    <div className="nearby-container">
      <div className="nearby-page">
        <div className="page-header">
          <h2>Nearby Restaurants & Hotels</h2>
          <p className="page-description">
            Discover restaurants, cafes, hotels and other places near your location
          </p>
        </div>

        <div className="action-section">
          <button 
            className="btn-find" 
            onClick={handleFindNearby} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {userLocation ? 'Refreshing...' : 'Getting Location...'}
              </>
            ) : (
              userLocation ? 'Refresh Location' : 'Find Nearby Places'
            )}
          </button>

          {userLocation && (
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span>Location found! Showing places within 3km radius</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            {retryCount < 3 && userLocation && (
              <button onClick={handleRetry} className="retry-btn">
                Retry
              </button>
            )}
          </div>
        )}

        {!loading && !error && userLocation && (
          <div className="results-section">
            {places.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No places found</h3>
                <p>Try expanding your search radius or check your location.</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h3>Found {places.length} places nearby</h3>
                </div>
                <ul className="nearby-places-list">
                  {places.map((place, index) => (
                    <li 
                      key={`${place.id}-${index}`}
                      className="nearby-place-item"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="place-card">
                        <div className="place-header">
                          <span className="place-icon">{getPlaceIcon(place)}</span>
                          <div className="place-info">
                            <strong className="place-name">
                              {getPlaceName(place)}
                            </strong>
                            <span className="place-type">
                              {getPlaceType(place)}
                            </span>
                          </div>
                        </div>

                        <div className="place-details">
                          {place.tags?.cuisine && (
                            <div className="detail-item">
                              <span className="detail-label">🍴 Cuisine:</span>
                              <span className="detail-value">{place.tags.cuisine}</span>
                            </div>
                          )}
                          
                          {place.tags?.['addr:street'] && (
                            <div className="detail-item">
                              <span className="detail-label">📍 Address:</span>
                              <span className="detail-value">
                                {place.tags['addr:street']}
                                {place.tags['addr:city'] && `, ${place.tags['addr:city']}`}
                              </span>
                            </div>
                          )}

                          {place.tags?.phone && (
                            <div className="detail-item">
                              <span className="detail-label">📞 Phone:</span>
                              <span className="detail-value">
                                <a href={`tel:${place.tags.phone}`}>{place.tags.phone}</a>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="place-actions">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="get-location-btn"
                          >
                            <span className="btn-icon">🗺️</span>
                            View on Map
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .nearby-container {
          min-height: calc(100vh - 200px);
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .nearby-page {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .nearby-page.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .page-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .page-description {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .action-section {
          padding: 2rem;
          text-align: center;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .btn-find {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 auto;
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
          animation-delay: 0.2s;
        }

        .btn-find:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-find:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 2px 8px rgba(148, 163, 184, 0.3);
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .location-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: #dcfce7;
          color: #166534;
          border-radius: 8px;
          font-weight: 500;
          animation: fadeInUp 0.6s ease forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem 2rem;
          padding: 1rem;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-weight: 500;
        }

        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: auto;
          transition: background 0.2s ease;
        }

        .retry-btn:hover {
          background: #b91c1c;
        }

        .results-section {
          padding: 2rem;
        }

        .results-header {
          margin-bottom: 1.5rem;
        }

        .results-header h3 {
          margin: 0;
          color: #374151;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .empty-state p {
          margin: 0;
        }

        .nearby-places-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 1rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
          animation-delay: 0.6s;
        }

        .nearby-place-item {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }

        .place-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .place-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .place-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .place-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .place-info {
          flex: 1;
        }

        .place-name {
          display: block;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .place-type {
          display: inline-block;
          background: #f3f4f6;
          color: #6b7280;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .place-details {
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .detail-label {
          font-weight: 500;
          color: #6b7280;
          min-width: 80px;
          flex-shrink: 0;
        }

        .detail-value {
          color: #374151;
          flex: 1;
        }

        .detail-value a {
          color: #3b82f6;
          text-decoration: none;
        }

        .detail-value a:hover {
          text-decoration: underline;
        }

        .place-actions {
          display: flex;
          gap: 0.75rem;
        }

        .get-location-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 8px;
          font-size: 0.9rem;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .get-location-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-icon {
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nearby-container {
            padding: 1rem;
          }

          .page-header {
            padding: 2rem 1.5rem;
          }

          .page-header h2 {
            font-size: 1.75rem;
          }

          .action-section,
          .results-section {
            padding: 1.5rem;
          }

          .place-card {
            padding: 1.25rem;
          }

          .place-header {
            flex-direction: column;
            gap: 0.75rem;
          }

          .place-icon {
            align-self: flex-start;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            padding: 1.5rem 1rem;
          }

          .page-header h2 {
            font-size: 1.5rem;
          }

          .action-section,
          .results-section {
            padding: 1rem;
          }

          .btn-find {
            width: 100%;
            justify-content: center;
          }

          .place-card {
            padding: 1rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .nearby-container {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          }

          .nearby-page {
            background: #1e293b;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .action-section {
            background: #334155;
            border-bottom-color: #475569;
          }

          .place-card {
            background: #334155;
            border-color: #475569;
            color: #f1f5f9;
          }

          .place-name {
            color: #f1f5f9;
          }

          .place-type {
            background: #475569;
            color: #cbd5e1;
          }

          .detail-value {
            color: #cbd5e1;
          }

          .results-header h3 {
            color: #f1f5f9;
          }

          .empty-state {
            color: #94a3b8;
          }

          .empty-state h3 {
            color: #f1f5f9;
          }
        }
      `}</style>
    </div>
  );
}