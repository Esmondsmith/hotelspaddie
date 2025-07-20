import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star} from "lucide-react";
import "./CSS/Listing.css";
import Navbar from "../Components/Navbar/Navbar";

const Listing = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      setLoading(true);
      setError("");
      try {
        console.log('Fetching hotel with ID:', hotelId);
        const hotelRes = await fetch("http://localhost:3001/api/hotels");
        const hotels = await hotelRes.json();
        console.log('All hotels:', hotels);
        
        const foundHotel = hotels.find(h => {
          // Convert all IDs to strings for comparison
          const hotelUuid = String(h.uuid || '');
          const hotelNid = String(h.nid || '');
          const hotelId_field = String(h.id || '');
          const searchId = String(hotelId || '');
          
          // Also check if searchId matches the hotel title (URL-safe version)
          const hotelTitleId = h.title ? h.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : '';
          
          const match = hotelUuid === searchId || hotelNid === searchId || hotelId_field === searchId || hotelTitleId === searchId;
          console.log('Checking hotel:', h.title, 'UUID:', hotelUuid, 'NID:', hotelNid, 'ID:', hotelId_field, 'Title ID:', hotelTitleId, 'Search ID:', searchId, 'Match:', match);
          return match;
        });
        
        console.log('Found hotel:', foundHotel);
        setHotel(foundHotel);

        if (!foundHotel) {
          console.error('Hotel not found with ID:', hotelId);
          setError(`Hotel not found with ID: ${hotelId}`);
          setRooms([]);
          setLoading(false);
          return;
        }
        
        if (!foundHotel.nid) {
          console.log('Hotel found but no NID, trying to fetch rooms by title:', foundHotel.title);
          // Try to fetch rooms using the hotel title or other available identifier
          setRooms([]);
          setLoading(false);
          return;
        }

        // Try to fetch rooms using NID first, then fallback to title
        let roomsRes;
        let hotelRoomsData;
        
        if (foundHotel.nid) {
          console.log('Fetching rooms using NID:', foundHotel.nid);
          roomsRes = await fetch(`http://localhost:3001/api/hotel-rooms?nid=${foundHotel.nid}`);
        } else if (foundHotel.title) {
          console.log('Fetching rooms using title:', foundHotel.title);
          // Try different room endpoints
          try {
            roomsRes = await fetch(`http://localhost:3001/api/hotel-rooms?title=${encodeURIComponent(foundHotel.title)}`);
          } catch (err) {
            console.log('Failed to fetch rooms by title, trying alternative endpoint');
            roomsRes = await fetch(`http://localhost:3001/api/rooms?hotel=${encodeURIComponent(foundHotel.title)}`);
          }
        }
        
        if (roomsRes) {
          hotelRoomsData = await roomsRes.json();
        } else {
          hotelRoomsData = [];
        }

        let roomsArray = [];
        if (Array.isArray(hotelRoomsData)) {
          roomsArray = hotelRoomsData;
        } else if (hotelRoomsData && Array.isArray(hotelRoomsData.data)) {
          roomsArray = hotelRoomsData.data;
        } else if (hotelRoomsData && Array.isArray(hotelRoomsData.rooms)) {
          roomsArray = hotelRoomsData.rooms;
        } else if (hotelRoomsData && typeof hotelRoomsData === 'object') {
          roomsArray = Object.values(hotelRoomsData);
        }

        setRooms(roomsArray);
      } catch (err) {
        console.error("Error fetching hotel or rooms:", err);
        setError("Failed to load hotel or rooms.");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelAndRooms();
  }, [hotelId]);

  const getFirstImage = (mediaString) => {
    if (!mediaString) return '';
    return mediaString.split(', ')[0].trim();
  };

  const formatAmenities = (amenities) => {
    if (!amenities) return '';
    return amenities.split(' , ').join(' • ');
  };

  // Handle room booking navigation
  const handleBookRoom = (room) => {
    // Navigate to booking page with room and hotel data
    navigate('/booking', { 
      state: { 
        hotel: hotel,
        room: room 
      } 
    });
  };

  if (loading) return <div className="listing-loading">Loading...</div>;
  if (error) return <div className="listing-error">{error}</div>;
  if (!hotel) return <div className="listing-error">Hotel not found.</div>;

  return (
    <>
      <Navbar />
      <div className="listing-page">
        <div className="listing-header">
          <img 
            className="listing-main-img" 
            src={getFirstImage(hotel.field_media)} 
            alt={hotel.title} 
          />
          <div className="listing-header-info">
            <h1>{hotel.title}</h1>
            <div className="listing-rating">
              <Star size={18} fill="#FFD700" color="#FFD700" />
              <span>{hotel.field_rating}</span>
              <span className="listing-reviews">(316 reviews)</span>
            </div>
            <div className="listing-amenities">{hotel.field_amenities}</div>
          </div>
        </div>
        
        <div className="listing-rooms-list">
          {!Array.isArray(rooms) || rooms.length === 0 ? (
            <div className="listing-no-rooms">No rooms available for this hotel.</div>
          ) : (
            rooms.map((room, idx) => (
              <div className="listing-room-card" key={room.uuid || idx}>
                <img 
                  className="listing-room-img" 
                  src={getFirstImage(room.field_media) || getFirstImage(hotel.field_media)} 
                  alt={room.title || hotel.title} 
                />
                <div className="listing-room-info">
                  <div className="listing-room-title">{room.title || "Room"}</div>
                  <div className="listing-room-category">
                    <strong>Category:</strong> {room.field_room_category || "Not specified"}
                  </div>
                  <div className="listing-room-desc">
                    <strong>Description: </strong>{room.field_body || "No description provided."}
                  </div>
                  <div className="listing-room-meta">
                    <span><strong>Capacity:</strong> {room.field_capacity || "Not specified"} guests</span>
                    <span><strong>Room Size:</strong> {room.field_room_size || "Not specified"}</span>
                  </div>
                  {room.field_room_amenities && (
                    <div className="listing-room-amenities">
                      <strong>Amenities:</strong> {formatAmenities(room.field_room_amenities)}
                    </div>
                  )}
                  <button 
                    className="book-room"
                    onClick={() => handleBookRoom(room)}
                  >
                    Book Room
                  </button>
                </div>
                <div className="listing-room-price">
                  {room.field_price_per_night || "Price on request"} <small>/night</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Listing;