// ✅ Working version of the script.js with functioning Suggest Event feature

const events = [
  {
    name: "Community Cleanup",
    type: "Volunteering",
    lat: 28.604047,
    lng: 77.227003,
  },
  { name: "Local Music Night", type: "Music", lat: 28.626646, lng: 77.190096 },
  { name: "Tech Meetup", type: "Technology", lat: 28.613999, lng: 77.226603 },
  { name: "Farmers Market", type: "Market", lat: 28.616373, lng: 77.204582 },
  { name: "Art & Craft Fair", type: "Art", lat: 28.601078, lng: 77.208121 },
];

function loadDynamicEvents() {
  const dynamicEvents = JSON.parse(localStorage.getItem("dynamicEvents") || "{}");
  Object.values(dynamicEvents).forEach((event) => {
    const exists = events.find((e) => e.name === event.name);
    if (!exists) {
      events.push(event);
    }
  });
}

loadDynamicEvents();

let map = L.map("map").setView([28.6139, 77.209], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markerGroup = L.layerGroup().addTo(map);

function renderMarkers(filteredEvents) {
  markerGroup.clearLayers();
  filteredEvents.forEach((event) => {
    const marker = L.marker([event.lat, event.lng]).addTo(markerGroup);

    const popupContent = `
      <div style="text-align: center; min-width: 250px; padding: 5px; font-family: 'Poppins', sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px; border-radius: 15px 15px 0 0; margin: -5px -5px 10px -5px;">
          <strong style="font-size: 18px; font-weight: 600;">${event.name}</strong>
        </div>
        <div style="padding: 0 10px;">
          <div style="display: inline-block; background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; margin-bottom: 15px;">
            ${event.type}
          </div><br>
          <a href="event-details.html?event=${encodeURIComponent(event.name)}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 500; display: inline-block; margin-top: 5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            <i class="fas fa-info-circle" style="margin-right: 5px;"></i> View Details
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: "custom-popup",
    });

    if (event.type) {
      const prefs = JSON.parse(localStorage.getItem("eventPreferences") || "{}");
      prefs[event.type] = (prefs[event.type] || 0) + 1;
      localStorage.setItem("eventPreferences", JSON.stringify(prefs));
    }
  });
}

renderMarkers(events);

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function showSuggestedPopup(eventsList, type) {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.top = "120px";
  wrapper.style.right = "20px";
  wrapper.style.background = "white";
  wrapper.style.padding = "16px";
  wrapper.style.borderRadius = "12px";
  wrapper.style.boxShadow = "0 8px 30px rgba(229, 97, 241, 0.2)";
  wrapper.style.zIndex = 10000;
  wrapper.style.maxWidth = "280px";

  const listItems =
    eventsList.length > 0
      ? eventsList
          .map(
            (e) =>
              `<li style="margin-bottom: 10px;"><strong>${e.name}</strong><br><small>${e.type}</small></li>`
          )
          .join("")
      : "<li>No nearby events found for your preferences.</li>";

  wrapper.innerHTML = `
    <h3 style="margin-top: 0; font-family: Poppins; font-size: 18px;">🎯 Suggested ${type} Events</h3>
    <ul style="list-style: none; padding-left: 0;">${listItems}</ul>
    <button id="closeSuggestion" style="margin-top: 10px; padding: 6px 12px; background: #764ba2; color: white; border: none; border-radius: 6px;">Close</button>
  `;
  document.body.appendChild(wrapper);
  document.getElementById("closeSuggestion").onclick = () => wrapper.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("suggestBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const preferenceCounts = JSON.parse(
          localStorage.getItem("eventPreferences") || "{}"
        );

        let preferredType;
        if (Object.keys(preferenceCounts).length > 0) {
          preferredType = Object.keys(preferenceCounts).reduce((a, b) =>
            preferenceCounts[a] > preferenceCounts[b] ? a : b
          );
        } else {
          preferredType = "Music";
        }

        const nearbyMatching = events
          .filter((e) => e.type === preferredType)
          .filter((e) => getDistance(userLat, userLng, e.lat, e.lng) <= 5)
          .slice(0, 3);

        showSuggestedPopup(nearbyMatching, preferredType);
      },
      () => {
        alert("Unable to get your location.");
      }
    );
  });
});
