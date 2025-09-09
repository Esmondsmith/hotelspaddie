import React from 'react';
import './TrendingDestinations.css';
import { Link } from 'react-router-dom';

const destinations = [
  { name: "Lagos", flag: "🇳🇬", image: "https://media.istockphoto.com/id/1484126859/photo/lekki-ikoyi-link-bridge.jpg?s=612x612&w=0&k=20&c=A5_AmvU5IkAelGVKMvAXUVQwdNZa53XjH12XL92GZWg=" },
  { name: "Ikeja", flag: "🇳🇬", image: "https://media.istockphoto.com/id/1294884531/photo/ozone-cinema.jpg?s=612x612&w=0&k=20&c=YlyQNKv1t_m0t_JytrCcvCepKBzw76A78BCmha2kVQ0=" },
  { name: "Abuja", flag: "🇳🇬", image: "https://i0.wp.com/outravelandtour.com/wp-content/uploads/2019/12/Best-Neighborhoods-To-Stay-In-Abuja.jpg?fit=1080%2C606&ssl=1" },
  { name: "Benin City", flag: "🇳🇬", image: "https://th.bing.com/th/id/OIP.wHIHLtRAmHWMeW0g8NYNNwHaEI?w=322&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7" },
  { name: "Port Harcourt", flag: "🇳🇬", image: "https://multiplanng.com/wp-content/uploads/2023/07/head-office.webp" },
  { name: "Owerri", flag: "🇳🇬", image: "https://images.nigeriapropertycentre.com/area-guides/c32ce05a-e892-461a-8183-ce7c8dff276d.png" },
  { name: "Kaduna", flag: "🇳🇬", image: "https://blog.naijaspider.com/wp-content/uploads/2024/07/Kaduna.webp" },
  { name: "Ibadan", flag: "🇳🇬", image: "https://i0.wp.com/oyoaffairs.net/wp-content/uploads/2020/08/images-1.jpeg" }
];

const TrendingDestinations = () => {
  // Function to get the state ID based on city name for proper filtering
  const getStateIdForCity = (cityName) => {
    const stateMapping = {
      'Lagos': '32',
      'Ikeja': '32', // Ikeja is in Lagos state
      'Abuja': '33',
      'Benin City': '35', // if Benin City uses Port Harcourt state ID as fallback
      'Port Harcourt': '35',
      'Owerri': '35', // if Owerri uses Port Harcourt state ID as fallback
      'Kaduna': '34', // if Kaduna uses Kano state ID as fallback
      'Ibadan': '36'
    };
    return stateMapping[cityName] || '';
  };

  return (
    <section className="trending-destinations">
      <h2 className="section-title">Trending Destinations</h2>
      <div className="destinations-grid">
        {destinations.map((dest, index) => {
          // Create the search URL with location parameter and state filter
          const searchParams = new URLSearchParams({
            location: dest.name,
            title: dest.name,
            state: getStateIdForCity(dest.name)
          });
          
          return (
            <Link
              key={index}
              to={`/hotels?${searchParams.toString()}`}
              className="destination-card"
              onClick={() => {
                // Optional: Log the click for debugging
                console.log(`Navigating to hotels in ${dest.name}`);
              }}
            >
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="destination-image" 
              />
              <div className="destination-overlay">
                <h3>{dest.name} <span>{dest.flag}</span></h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingDestinations;
