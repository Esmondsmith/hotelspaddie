// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Star } from "lucide-react";
// import "./CSS/Listing.css";
// import Navbar from "../Components/Navbar/Navbar";

// const Listing = () => {
//   const { hotelId } = useParams();
//   const [hotel, setHotel] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchHotelAndRooms = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         // Fetch all hotels and find the one with hotelId
//         const hotelRes = await fetch("http://localhost:3001/api/hotels");
//         const hotels = await hotelRes.json();
//         const foundHotel = hotels.find(h => h.uuid === hotelId || h.nid === hotelId);
//         setHotel(foundHotel);

//         if (!foundHotel || !foundHotel.nid) {
//           setRooms([]);
//           setLoading(false);
//           return;
//         }

//         // Fetch rooms for this hotel using nid as a query param
//         const roomsRes = await fetch(`http://localhost:3001/api/hotel-rooms?nid=${foundHotel.nid}`);
//         const hotelRoomsData = await roomsRes.json();
        
//         // Handle different response formats
//         let roomsArray = [];
//         if (Array.isArray(hotelRoomsData)) {
//           roomsArray = hotelRoomsData;
//         } else if (hotelRoomsData && Array.isArray(hotelRoomsData.data)) {
//           roomsArray = hotelRoomsData.data;
//         } else if (hotelRoomsData && Array.isArray(hotelRoomsData.rooms)) {
//           roomsArray = hotelRoomsData.rooms;
//         } else if (hotelRoomsData && typeof hotelRoomsData === 'object') {
//           // If it's an object with room data, convert to array
//           roomsArray = Object.values(hotelRoomsData);
//         }
        
//         setRooms(roomsArray);
//       } catch (err) {
//         console.error("Error fetching hotel or rooms:", err);
//         setError("Failed to load hotel or rooms.");
//         setRooms([]); // Ensure rooms is always an array
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHotelAndRooms();
//   }, [hotelId]);

//   if (loading) return <div className="listing-loading">Loading...</div>;
//   if (error) return <div className="listing-error">{error}</div>;
//   if (!hotel) return <div className="listing-error">Hotel not found.</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="listing-page">
//         <div className="listing-header">
//           <img className="listing-main-img" src={hotel.field_media?.split(", ")[0]} alt={hotel.title} />
//           <div className="listing-header-info">
//             <h1>{hotel.title}</h1>
//             <div className="listing-rating">
//               <Star size={18} fill="#FFD700" color="#FFD700" />
//               <span>{hotel.field_rating}</span>
//               <span className="listing-reviews">(316 reviews)</span>
//             </div>
//             <div className="listing-location">{hotel.field_location}</div>
//             <div className="listing-amenities">{hotel.field_amenities}</div>
//           </div>
//         </div>
//         <div className="listing-rooms-list">
//           {!Array.isArray(rooms) || rooms.length === 0 ? (
//             <div className="listing-no-rooms">No rooms available for this hotel.</div>
//           ) : (
//             rooms.map((room, idx) => (
//               <div className="listing-room-card" key={room.uuid || idx}>
//                 <img className="listing-room-img" src={room.field_media || hotel.field_media?.split(", ")[0]} alt={room.title || hotel.title} />
//                 <div className="listing-room-info">
//                   <div className="listing-room-title">{room.title || "Room"}</div>
//                   <div className="listing-room-desc">{room.field_body || "No description provided."}</div>
//                   <div className="listing-room-meta">
//                     <span>Guests: {room.guests || "-"}</span>
//                     <span>Beds: {room.beds || "-"}</span>
//                     <span>Baths: {room.baths || "-"}</span>
//                     <span>Capacity: {room.field_capacity}</span>
//                   </div>
//                   <div className="listing-room-price">{room.price ? `NGN${room.field_price_per_night}` : "Price on request"}</div>
//                   <button className="book-room">Book Room</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Listing;









// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Star } from "lucide-react";
// import "./CSS/Listing.css";
// import Navbar from "../Components/Navbar/Navbar";

// const Listing = () => {
//   const { hotelId } = useParams();
//   const [hotel, setHotel] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchHotelAndRooms = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         // Fetch all hotels and find the one with hotelId
//         const hotelRes = await fetch("https://zodr.zodml.org/api/hotels");
//         const hotels = await hotelRes.json();
//         const foundHotel = hotels.find(h => h.uuid === hotelId || h.nid === hotelId);
//         setHotel(foundHotel);

//         if (!foundHotel || !foundHotel.nid) {
//           setRooms([]);
//           setLoading(false);
//           return;
//         }

//         // Fetch rooms for this hotel using the correct API endpoint structure
//         const roomsRes = await fetch(`https://zodr.zodml.org/api/hotel-rooms/${foundHotel.nid}`);
//         const hotelRoomsData = await roomsRes.json();
        
//         // Debug: Log the API response
//         console.log("Raw API Response:", hotelRoomsData);
//         console.log("Hotel NID:", foundHotel.nid);
        
//         // Handle different response formats
//         let roomsArray = [];
//         if (Array.isArray(hotelRoomsData)) {
//           roomsArray = hotelRoomsData;
//         } else if (hotelRoomsData && Array.isArray(hotelRoomsData.data)) {
//           roomsArray = hotelRoomsData.data;
//         } else if (hotelRoomsData && Array.isArray(hotelRoomsData.rooms)) {
//           roomsArray = hotelRoomsData.rooms;
//         } else if (hotelRoomsData && typeof hotelRoomsData === 'object') {
//           // If it's an object with room data, convert to array
//           roomsArray = Object.values(hotelRoomsData);
//         }
        
//         // Debug: Log the processed rooms array
//         console.log("Processed Rooms Array:", roomsArray);
//         console.log("First room object:", roomsArray[0]);
        
//         setRooms(roomsArray);
//       } catch (err) {
//         console.error("Error fetching hotel or rooms:", err);
//         setError("Failed to load hotel or rooms.");
//         setRooms([]); // Ensure rooms is always an array
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHotelAndRooms();
//   }, [hotelId]);

//   // Helper function to get the first image from a comma-separated string
//   const getFirstImage = (mediaString) => {
//     if (!mediaString) return '';
//     return mediaString.split(', ')[0].trim();
//   };

//   // Helper function to format amenities for display
//   const formatAmenities = (amenities) => {
//     if (!amenities) return '';
//     return amenities.split(' , ').join(' • ');
//   };

//   if (loading) return <div className="listing-loading">Loading...</div>;
//   if (error) return <div className="listing-error">{error}</div>;
//   if (!hotel) return <div className="listing-error">Hotel not found.</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="listing-page">
//         <div className="listing-header">
//           <img 
//             className="listing-main-img" 
//             src={getFirstImage(hotel.field_media)} 
//             alt={hotel.title} 
//           />
//           <div className="listing-header-info">
//             <h1>{hotel.title}</h1>
//             <div className="listing-rating">
//               <Star size={18} fill="#FFD700" color="#FFD700" />
//               <span>{hotel.field_rating}</span>
//               <span className="listing-reviews">(316 reviews)</span>
//             </div>
//             {/* <div className="listing-location">{hotel.field_location}</div> */}
//             <div className="listing-amenities">{hotel.field_amenities}</div>
//           </div>
//         </div>
        
//         <div className="listing-rooms-list">
//           {!Array.isArray(rooms) || rooms.length === 0 ? (
//             <div className="listing-no-rooms">No rooms available for this hotel.</div>
//           ) : (
//             rooms.map((room, idx) => (
//               <div className="listing-room-card" key={room.uuid || idx}>
//                 <img 
//                   className="listing-room-img" 
//                   src={getFirstImage(room.field_media) || getFirstImage(hotel.field_media)} 
//                   alt={room.title || hotel.title} 
//                 />
//                 <div className="listing-room-info">
//                   <div className="listing-room-title">{room.title || "Room"}</div>
                  
//                   {/* Room Category */}
//                   <div className="listing-room-category">
//                     <strong>Category:</strong> {room.field_room_category || "Not specified"}
//                   </div>
                  
//                   {/* Room Description */}
//                   <div className="listing-room-desc">
//                     {room.field_body || "No description provided."}
//                   </div>
                  
//                   {/* Room Details */}
//                   <div className="listing-room-meta">
//                     <span><strong>Capacity:</strong> {room.field_capacity || "Not specified"} guests</span>
//                     <span><strong>Size:</strong> {room.field_room_size || "Not specified"}</span>
//                   </div>
                  
//                   {/* Room Amenities */}
//                   {room.field_room_amenities && (
//                     <div className="listing-room-amenities">
//                       <strong>Amenities:</strong> {formatAmenities(room.field_room_amenities)}
//                     </div>
//                   )}
                  
//                   {/* Price */}
//                   <div className="listing-room-price">
//                     {room.field_price_per_night || "Price on request"}
//                   </div>
                  
//                   <button className="book-room">Book Room</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Listing;






// const express = require('express');
// const cors = require('cors');
// const fetch = require('node-fetch'); 
// const app = express();

// app.use(cors()); 
// app.use(express.json()); 

// app.post('/api/Register', async (req, res) => {
//   try {
//     console.log('Received registration request:', JSON.stringify(req.body, null, 2));

//     // API to register users
//     const response = await fetch('https://zodr.zodml.org/entity/user?_format=json', {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA==',
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify(req.body)
//     });

//     console.log('External API response status:', response.status);
//     console.log('External API response headers:', Object.fromEntries(response.headers.entries()));

//     if (!response.ok) {
//       const text = await response.text();
//       console.error('Zodr API Error!', text);
//       return res.status(response.status).json({error:'Registration failed!', details: text});
//     }

//     const data = await response.json();
//     console.log('External API success response:', JSON.stringify(data, null, 2));
//     res.json(data);
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({error:'Server Error!', details: error.toString()});
//   }
// });

// // Endpoint for fetching all hotels
// app.get('/api/hotels', async (req, res) => {
//   try {
//     console.log('Fetching hotels from external API...');

//     const response = await fetch('https://zodr.zodml.org/api/hotels', {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Hotels API response status:', response.status);

//     if (!response.ok) {
//       const text = await response.text();
//       console.error('Hotels API Error!', text);
//       return res.status(response.status).json({error:'Failed to fetch hotels!', details: text});
//     }

//     const data = await response.json();
//     console.log('Hotels API success response:', JSON.stringify(data, null, 2));
//     res.json(data);
//   } catch (error) {
//     console.error('Hotels API error:', error);
//     res.status(500).json({error:'Failed to fetch hotels!', details: error.toString()});
//   }
// });

// // New endpoint for searching hotels with filters
// app.get('/api/search/hotels', async (req, res) => {
//   try {
//     console.log('Searching hotels with filters:', req.query);
    
//     // Build the search URL with query parameters
//     const baseUrl = 'https://zodr.zodml.org/api/search/hotels';
//     const queryParams = new URLSearchParams();
    
//     // Add filters to query params if they exist
//     if (req.query.field_state_target_id) {
//       queryParams.append('field_state_target_id', req.query.field_state_target_id);
//     }
//     if (req.query.title) {
//       queryParams.append('title', req.query.title);
//     }
//     if (req.query.field_rating_value) {
//       queryParams.append('field_rating_value', req.query.field_rating_value);
//     }
//     if (req.query.field_amenities_target_id) {
//       queryParams.append('field_amenities_target_id', req.query.field_amenities_target_id);
//     }
    
//     const searchUrl = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
//     console.log('Search URL:', searchUrl);

//     const response = await fetch(searchUrl, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Search API response status:', response.status);

//     if (!response.ok) {
//       const text = await response.text();
//       console.error('Search API Error!', text);
//       return res.status(response.status).json({error:'Failed to search hotels!', details: text});
//     }

//     const data = await response.json();
//     console.log('Search API success response:', JSON.stringify(data, null, 2));
    
//     // Ensure we return an array
//     const hotels = Array.isArray(data) ? data : (data.data ? data.data : []);
//     res.json(hotels);
//   } catch (error) {
//     console.error('Search API error:', error);
//     res.status(500).json({error:'Failed to search hotels!', details: error.toString()});
//   }
// });

// // Endpoint for fetching hotel rooms
// app.get('/api/hotel-rooms', async (req, res) => {
//   try {
//     const { nid } = req.query;
//     if (!nid) {
//       return res.status(400).json({ error: 'Missing nid parameter' });
//     }
    
//     const url = `https://zodr.zodml.org/api/hotel-rooms/?nid=${encodeURIComponent(nid)}`;
//     console.log('Fetching hotel rooms from:', url);
    
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
    
//     console.log('Hotel rooms API response status:', response.status);
    
//     if (!response.ok) {
//       const text = await response.text();
//       console.error('Hotel rooms API Error!', text);
//       return res.status(response.status).json({error:'Failed to fetch hotel rooms!', details: text});
//     }

//     const data = await response.json();
//     console.log("Hotel rooms API response:", data);

//     if (!Array.isArray(data)) {
//       return res.status(500).json({error:'Failed to fetch hotel rooms!', details: 'No rooms found or error fetching rooms.'});
//     }
    
//     res.json(data);
//   } catch (error) {
//     console.error('Hotel rooms API error:', error);
//     res.status(500).json({error:'Failed to fetch hotel rooms!', details: error.toString()});
//   }
// });

// // Additional endpoint for fetching states (if needed)
// app





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Star, MapPin, Wifi, Car, Dumbbell, Coffee } from "lucide-react";
// import "./CSS/Hotels.css";
// import Navbar from "../Components/Navbar/Navbar";
// import Footer from "../Components/Footer/Footer";

// const Hotels = () => {
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHotels = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await fetch("http://localhost:3001/api/hotels");
//         const data = await response.json();
//         setHotels(data);
//       } catch (err) {
//         setError("Failed to load hotels.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHotels();
//   }, []);

//   const getAmenityIcon = (amenity) => {
//     const amenityLower = amenity.toLowerCase();
//     if (amenityLower.includes("wi-fi") || amenityLower.includes("wifi")) return <Wifi size={16} />;
//     if (amenityLower.includes("parking")) return <Car size={16} />;
//     if (amenityLower.includes("fitness") || amenityLower.includes("gym")) return <Dumbbell size={16} />;
//     if (amenityLower.includes("restaurant") || amenityLower.includes("bar")) return <Coffee size={16} />;
//     return null;
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<Star key={i} size={16} fill="#FFD700" color="#FFD700" />);
//     }
//     if (hasHalfStar) {
//       stars.push(<Star key="half" size={16} fill="#FFD700" color="#FFD700" style={{ clipPath: "inset(0 50% 0 0)" }} />);
//     }
//     const emptyStars = 5 - Math.ceil(rating);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<Star key={`empty-${i}`} size={16} color="#D3D3D3" />);
//     }
//     return stars;
//   };

//   if (loading) {
//     return <div className="listing-loading">Loading hotels...</div>;
//   }
//   if (error) {
//     return <div className="listing-error">{error}</div>;
//   }

//   return (
//     <>
//     <Navbar />
//     <div className="best-hotels">
//       <div className="best-hotels-header">
//         <h1>List of Hotels</h1>
//         <hr />
//       </div>
//       {hotels.length === 0 ? (
//         <div className="no-hotels">
//           <p>No hotels available at the moment.</p>
//         </div>
//       ) : (
//         <div className="hotels-grid">
//           {hotels.map((hotel, index) => {
//             const images = hotel.field_media ? hotel.field_media.split(", ") : [];
//             const mainImage = images[0] || "/default-hotel.jpg";
//             const amenities = hotel.field_amenities ? hotel.field_amenities.split(", ") : [];
//             return (
//               <div key={hotel.uuid || index} className="hotel-card">
//                 <div className="hotel-image">
//                   <img src={mainImage} alt={hotel.title} />
//                   <div className="hotel-rating">
//                     <span className="rating-number">{hotel.field_rating}</span>
//                     <div className="stars">{renderStars(parseFloat(hotel.field_rating))}</div>
//                   </div>
//                 </div>
//                 <div className="hotel-info">
//                   <h3 className="hotel-title">{hotel.title}</h3>
//                   {hotel.field_location && (
//                     <div className="hotel-location">
//                       <MapPin size={16} />
//                       <span>{hotel.field_location}</span>
//                     </div>
//                   )}
//                   {hotel.field_body && (
//                     <p className="hotel-description">
//                       {hotel.field_body.length > 120
//                         ? `${hotel.field_body.substring(0, 120)}...`
//                         : hotel.field_body}
//                     </p>
//                   )}
//                   {amenities.length > 0 && (
//                     <div className="hotel-amenities">
//                       <h4>Key Amenities:</h4>
//                       <div className="amenities-list">
//                         {amenities.slice(0, 4).map((amenity, idx) => (
//                           <span key={idx} className="amenity-item">
//                             {getAmenityIcon(amenity)}
//                             {amenity.trim()}
//                           </span>
//                         ))}
//                         {amenities.length > 4 && (
//                           <span className="amenity-more">+{amenities.length - 4} more</span>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                   <button className="view-details-btn" onClick={() => navigate(`/listing/${hotel.uuid || hotel.nid}`)}>
//                     View Rooms
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default Hotels;