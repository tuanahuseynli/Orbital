const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 32],
  iconAnchor: [25, 16]
});
const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

async function updateISS() {
  const response = await fetch('http://api.open-notify.org/iss-now.json');
  const data = await response.json();
  const { latitude, longitude } = data.iss_position;

  marker.setLatLng([latitude, longitude]);
  map.setView([latitude, longitude], map.getZoom());
  document.getElementById('coords').textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
}
updateISS();
setInterval(updateISS, 5000);

async function loadAPOD() {
  const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
  const data = await response.json();
  document.getElementById('apod-img').src = data.url;
  document.getElementById('apod-title').textContent = data.title;
  document.getElementById('apod-desc').textContent = data.explanation;
}
loadAPOD();

async function loadMarsWeather() {
    try {
      const response = await fetch('https://api.maas2.apollorion.com/');
      const data = await response.json();
  
      document.getElementById('mars-temp').textContent =
        `Temperature: ${data.min_temp}°C to ${data.max_temp}°C`;
      document.getElementById('mars-pressure').textContent =
        `Pressure: ${data.pressure} Pa`;
      document.getElementById('mars-season').textContent =
        `Season: ${data.season}`;
    } catch (error) {
      document.getElementById('mars-temp').textContent = 'Mars weather data unavailable.';
    }
  }
  
  loadMarsWeather();
  
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  let stars = [];
  const numStars = 150;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        velocity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.velocity;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawStars);
  }

  initStars();
  drawStars();
