import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GpsButton from '../ui/GpsButton';
import NearbyPlaces from './NearbyPlaces';
import NearbyPlacesPanel from './NearbyPlacesPanel';
import LoadingSpinner from '../ui/LoadingSpinner'; // Import the LoadingSpinner component

const MapExplorer = ({ events = [], onEventAdded, onEventDeleted, isAuthenticated }) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    organizer: '',
    contact: '',
    lat: null,
    lng: null,
  });
  const [filters, setFilters] = useState({
    Music: true,
    Tech: true,
    Volunteering: true,
    Market: true,
    Art: true,
    Sports: true,
    Education: true,
    'Comedy & Shows': true,
    'Wellness': true,
  });
  const [showForm, setShowForm] = useState(false);
  const [mapView, setMapView] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const [showNearby, setShowNearby] = useState(false);
  const [showNearbyPanel, setShowNearbyPanel] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // Fixed variable name
  const [nearbyError, setNearbyError] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState([40.7128, -74.0060]); // Default center: NYC
  const [isLoadingMapTiles, setIsLoadingMapTiles] = useState(true); // New state for loading tiles

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        console.log("✔ Got GPS:", pos);
        setCenter(pos);
      },
      (err) => {
        console.error("Geo error:", err.message);
        setCenter([40.7128, -74.0060]); // Fallback to default center
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleShowNearby = () => {
    if (!showNearby) {
      if (!navigator.geolocation) {
        setNearbyError('Geolocation is not supported by your browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); // Fixed variable name
          setShowNearby(true);
          setShowNearbyPanel(true);
          setNearbyError('');
          if (mapRef.current) {
            mapRef.current.setView([position.coords.latitude, position.coords.longitude], 14);
          }
        },
        () => {
          setNearbyError('Unable to retrieve your location. Please check your browser permissions.');
        }
      );
    } else {
      setShowNearby(false);
      setShowNearbyPanel(false);
      setNearbyError('');
    }
  };

  const handleCloseNearbyPanel = () => {
    setShowNearbyPanel(false);
  };

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Custom component to handle Leaflet map events


  const MapEvents = ({ setIsLoadingMapTiles }) => {
    const map = useMap();

    useEffect(() => {
      let tilesLoading = 0;

      const tileLoadStart = () => {
        tilesLoading++;
        setIsLoadingMapTiles(true);
      };

      const tileLoad = () => {
        tilesLoading--;
        if (tilesLoading <= 0) {
          setIsLoadingMapTiles(false);
        }
      };

      // Attach event listeners to all tile layers
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.on('tileloadstart', tileLoadStart);
          layer.on('tileload', tileLoad);
        }
      });

      return () => {
        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            layer.off('tileloadstart', tileLoadStart);
            layer.off('tileload', tileLoad);
          }
        });
      };
    }, [map, setIsLoadingMapTiles]);

    return null;
  };

  const TileEvents = ({ url, attribution, setIsLoadingMapTiles }) => {
    const tileLayerRef = useRef();
    const map = useMap();

    useEffect(() => {
      const tileLayer = tileLayerRef.current;

      if (!tileLayer) return;

      let tilesLoading = 0;

      const handleTileLoadStart = () => {
        tilesLoading++;
        setIsLoadingMapTiles(true);
      };

      const handleTileLoad = () => {
        tilesLoading--;
        if (tilesLoading <= 0) {
          setIsLoadingMapTiles(false);
        }
      };

      tileLayer.on('tileloadstart', handleTileLoadStart);
      tileLayer.on('tileload', handleTileLoad);

      return () => {
        tileLayer.off('tileloadstart', handleTileLoadStart);
        tileLayer.off('tileload', handleTileLoad);
      };
    }, [setIsLoadingMapTiles]);

    return (
      <TileLayer
        ref={tileLayerRef}
        url={url}
        attribution={attribution}
      />
    );
  };



  const handleMapCreated = (map) => {
    mapRef.current = map;
    setMapReady(true);
    map.on('click', (e) => {
      if (!isAuthenticated) {
        alert('Please sign in to add events');
        return;
      }
      const { lat, lng } = e.latlng;
      setNewEvent(prev => ({
        ...prev,
        lat: lat,
        lng: lng
      }));
      setShowForm(true);
    });
  };

  useEffect(() => {
    if (mapReady && mapRef.current && center && center[0] !== 40.7128) {
      console.log("📍 Flying to user location after both map + GPS ready:", center);
      mapRef.current.flyTo(center, 13, { duration: 1.2 });
    }
  }, [mapReady, center]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (category) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.category || !newEvent.lat || !newEvent.lng) {
      alert('Please fill in all required fields and select a location on the map.');
      return;
    }
    const event = {
      id: Date.now().toString(),
      ...newEvent,
      createdAt: new Date().toISOString(),
    };
    onEventAdded(event);
    setNewEvent({
      title: '',
      description: '',
      category: '',
      date: '',
      time: '',
      organizer: '',
      contact: '',
      lat: null,
      lng: null,
    });
    setShowForm(false);
  };

  const findNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        if (mapRef.current) {
          mapRef.current.setView([userLat, userLng], 13);
        }
      },
      () => {
        alert("Unable to retrieve your location. Please check your browser permissions.");
      }
    );
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) { // Changed to window.confirm
      onEventDeleted(eventId);
    }
  };

  const changeMapView = (view) => {
    setMapView(view);
    if (mapRef.current) {
      const tileLayer = document.querySelector('.leaflet-tile-pane');
      if (tileLayer) {
        tileLayer.style.filter = view === 'satellite' ? 'contrast(1.1) saturate(1.1)' : 'none';
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const createIcon = (category) => {
    const iconMapping = {
      Tech: { color: '#38BDF8', emoji: '💻' },
      Music: { color: '#FF6B6B', emoji: '🎵' },
      Volunteering: { color: '#4CAF50', emoji: '🤝' },
      Market: { color: '#FACC15', emoji: '🛍️' },
      Art: { color: '#9C27B0', emoji: '🎨' },
      Sports: { color: '#FF9800', emoji: '🏆' },
      Education: { color: '#3F51B5', emoji: '📚' },
      'Comedy & Shows': { color: '#8e44ad', emoji: '🎭' },
      'Wellness': { color: '#27ae60', emoji: '🧘' },
    };
    const iconInfo = iconMapping[category] || { color: '#333333', emoji: '📌' };
    return L.divIcon({
      html: `<div style="background-color: ${iconInfo.color}; color: white; border-radius: 50%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14px;">${iconInfo.emoji}</div>`,
      className: `event-marker ${category.toLowerCase()}-marker`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  const filteredEvents = events
    .filter(event => filters[event.category])
    .filter(event => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.organizer?.toLowerCase().includes(query)
      );
    });

  const categoryColors = {
    Music: '#48CAE4',
    Tech: '#26637F',
    Volunteering: '#22b4a3ff',
    Market: '#023E8A',
    Art: '#03045E',
    Sports: ' #417C9A ',
    Education: '#124B56',
    'Comedy & Shows': '#9b59b6',
    'Wellness': '#1abc9c',
  };

  useEffect(() => {
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: '.filter-controls', threshold: 1.3 },
        { selector: '.map-view-controls', threshold: 1.3 },
        { selector: '.search-bar', threshold: 1.3 },
        { selector: '.search-input', threshold: 1.3 },
        { selector: '.btn-nearby', threshold: 1.3 },
        { selector: '.view-option', threshold: 1.3 }
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

  return (
    <div className="map-explorer">
      <div className="map-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="btn-nearby" onClick={findNearby}>
            <span className="btn-icon">📍</span>
            <span className="btn-text">Find Nearby</span>
          </button>
          <button className={"btn-nearby" + (showNearby ? ' active' : '')} style={{ marginLeft: '0.5rem' }} onClick={handleShowNearby}>
            <span className="btn-icon">🍽️🏨</span>
            <span className="btn-text">{showNearby ? 'Hide' : 'Show'} Nearby Restaurants & Hotels</span>
          </button>
          {showNearbyPanel && (
            <NearbyPlacesPanel userLocation={userLocation} onClose={handleCloseNearbyPanel} />
          )}
          {nearbyError && <span style={{ color: 'red', marginLeft: '1rem' }}>{nearbyError}</span>}
        </div>

        <div className="filter-controls">
          <div className="filter-title">Filter by category:</div>
          <div className="filter-options">
            {Object.keys(filters).map(category => (
              <button
                key={category}
                className={`filter-tag ${filters[category] ? 'active' : 'inactive'}`}
                onClick={() => handleFilterChange(category)}
                style={{
                  '--category-color': categoryColors[category] || '#333333'
                }}
              >
                <span className="filter-icon">
                  {category === 'Music' && '🎵'}
                  {category === 'Tech' && '💻'}
                  {category === 'Volunteering' && '🤝'}
                  {category === 'Market' && '🛍️'}
                  {category === 'Art' && '🎨'}
                  {category === 'Sports' && '🏆'}
                  {category === 'Education' && '📚'}
                  {category === 'Comedy & Shows' && '🎭'}
                  {category === 'Wellness' && '🧘'}
                </span>
                <span className="filter-name">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="map-view-controls">
          <div className="view-title">Map Style:</div>
          <div className="view-options">
            <button
              className={`view-option ${mapView === 'standard' ? 'active' : ''}`}
              onClick={() => changeMapView('standard')}
            >
              Standard
            </button>
            <button
              className={`view-option ${mapView === 'satellite' ? 'active' : ''}`}
              onClick={() => changeMapView('satellite')}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      <div className="map-container">
        {isLoadingMapTiles && <LoadingSpinner fullPage={false} />} {/* Render spinner */}
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <MapEvents setIsLoadingMapTiles={setIsLoadingMapTiles} />
          {/* Add MapEvents component */}
          <TileEvents
            url={mapView === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            attribution={mapView === 'satellite'
              ? 'Tiles &copy; Esri ...'
              : '&copy; OpenStreetMap contributors'}
            setIsLoadingMapTiles={setIsLoadingMapTiles}
          />

          <Marker position={center}>
            <Popup>You are here</Popup>
          </Marker>

          {filteredEvents.map(event => (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createIcon(event.category)}
            >
              <Popup>
                <div className="event-popup">
                  <h3 className="event-title">{event.title}</h3>
                  <span className={`event-category ${event.category.toLowerCase()}`}>
                    {event.category}
                  </span>

                  {event.date && (
                    <div className="event-date">
                      <span className="popup-label">Date:</span> {event.date}
                      {event.time && <span> at {event.time}</span>}
                    </div>
                  )}

                  <p className="event-description">{event.description}</p>

                  {event.organizer && (
                    <div className="event-organizer">
                      <span className="popup-label">Organizer:</span> {event.organizer}
                    </div>
                  )}

                  {event.contact && (
                    <div className="event-contact">
                      <span className="popup-label">Contact:</span> {event.contact}
                    </div>
                  )}

                  <div className="event-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <GpsButton />

          {showNearby && userLocation && (
            <NearbyPlaces userLocation={userLocation} />
          )}
        </MapContainer>
      </div>

      {showForm && (
        <div className="event-form-overlay">
          <div className="event-form-container">
            <h2>Add New Event</h2>
            <form onSubmit={handleFormSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={newEvent.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Music">Music</option>
                  <option value="Tech">Tech</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Market">Market</option>
                  <option value="Art">Art</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                  <option value="Comedy & Shows">Comedy & Shows</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="organizer">Organizer</label>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={newEvent.organizer}
                    onChange={handleInputChange}
                    placeholder="Event organizer"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={newEvent.contact}
                    onChange={handleInputChange}
                    placeholder="Contact information"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .map-explorer {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          position: relative;
        }
        
        .map-controls {
          background-color: var(--background);
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          z-index: 10;
        }
        
        .search-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 30px;
          font-size: 0.95rem;
          background-color: var(--background-alt);
          color: var(--text);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
        }
        
        .btn-nearby {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-nearby:hover {
          background-color: var(--primary-dark);
        }
        
        .btn-icon {
          margin-right: 0.5rem;
        }
        
        .filter-controls {
          margin-bottom: 1rem;
        }

        .filter-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .filter-tag {
          background-color: var(--category-color);
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 30px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s ease, background-color 0.3s ease;
        }

        .filter-tag:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .filter-tag.inactive {
          opacity: 0.6;
        }

        .filter-tag.active {
          opacity: 1;
        }

        .filter-icon {
          font-size: 1.1rem;
        }

        .map-view-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .view-title {
          font-weight: 600;
          color: var(--text);
        }
        
        .view-options {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-option {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border);
          background-color: var(--background-alt);
          color: var(--text);
          font-size: 0.9rem;
        }
        
        .view-option.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        .map-container {
          z-index: 800;
          flex: 1;
          position: relative;
        }
        
        .event-popup {
          min-width: 200px;
          max-width: 300px;
        }
        
        .event-title {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        
        .event-category {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: white;
        }
        
        .event-description {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        
        .event-date,
        .event-organizer,
        .event-contact {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        
        .popup-label {
          font-weight: 600;
        }
        
        .event-actions {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        
        .btn-delete {
          padding: 0.35rem 0.75rem;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-delete:hover {
          background-color: #dc2626;
        }
        
        .event-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .event-form-container {
          background-color: var(--background);
          border-radius: 12px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .event-form-container h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .event-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .event-form label {
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .event-form input,
        .event-form select,
        .event-form textarea {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background-color: var(--background-alt);
          color: var(--text);
          font-size: 0.95rem;
        }
        
        .event-form input:focus,
        .event-form select:focus,
        .event-form textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-cancel:hover {
          background-color: var(--background-alt);
        }
        
        .btn-submit {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-submit:hover {
          background-color: var(--primary-dark);
        }
        
        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .btn-nearby {
            width: 100%;
            justify-content: center;
          }
          
          .map-view-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .view-options {
            width: 100%;
          }
          
          .view-option {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MapExplorer;
