// ----------------------------
// ✅ FINAL script.js
// ----------------------------

// 1️⃣ Init map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2️⃣ Add Event setup
const eventForm = document.getElementById('eventForm');
const nameInput = document.getElementById('eventName');
const typeInput = document.getElementById('eventType');
const dateInput = document.getElementById('eventDate');
const timeInput = document.getElementById('eventTime');

let pendingEvent = null;

eventForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const type = typeInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    if (!name || !type || !date || !time) {
        alert('Please fill in all fields.');
        return;
    }

    pendingEvent = { name, type, date, time };
    alert('Click on the map to choose the event location.');
});

// ✅ Place marker + save event
map.on('click', e => {
    if (!pendingEvent) return;

    const { lat, lng } = e.latlng;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
            const address = data.display_name || `Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`;
            const event = {...pendingEvent, address, lat, lng };

            // Save
            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.push(event);
            localStorage.setItem('events', JSON.stringify(events));

            // Add marker
            L.marker([lat, lng]).addTo(map)
                .bindPopup(`<strong>${event.name}</strong><br>Type: ${event.type}<br>Date: ${event.date} ${event.time}<br>Location: ${address}`)
                .openPopup();

            pendingEvent = null;
            eventForm.reset();
            alert('Event added!');
        })
        .catch(err => {
            console.error(err);
            alert('Failed to get address.');
            pendingEvent = null;
        });
});

// ✅ Locate Button
const locateBtn = document.getElementById('locateBtn');
locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Not supported.');
    locateBtn.textContent = 'Locating...';

    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude } = pos.coords;
            map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup('You are here!').openPopup();
            locateBtn.textContent = 'Find Nearby 📍';
        },
        () => {
            alert('Could not locate.');
            locateBtn.textContent = 'Find Nearby 📍';
        }
    );
});

// ✅ Load valid events on map
window.addEventListener('load', () => {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const now = new Date();
    const valid = events.filter(ev => new Date(`${ev.date}T${ev.time}`) >= now);
    localStorage.setItem('events', JSON.stringify(valid));

    valid.forEach(ev => {
        L.marker([ev.lat, ev.lng]).addTo(map)
            .bindPopup(`<strong>${ev.name}</strong><br>Type: ${ev.type}<br>Date: ${ev.date} ${ev.time}<br>Location: ${ev.address}`);
    });
});