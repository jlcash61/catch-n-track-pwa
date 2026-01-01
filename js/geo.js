import { loadUserData } from './map.js';
import { fetchWeatherAndAstronomy } from './weather.js';

export function showUserLocationAndData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            window.map.setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(window.map).bindPopup('You are here!').openPopup();

            fetchWeatherAndAstronomy(lat, lng);
            loadUserData();
        }, () => alert('Geolocation failed.'));
    } else {
        alert('Geolocation not supported.');
    }
}
