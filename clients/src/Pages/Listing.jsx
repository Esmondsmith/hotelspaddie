
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star} from "lucide-react";
import "./CSS/Listing.css";
import Navbar from "../Components/Navbar/Navbar";

const Listing = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      setLoading(true);
      setError("");
      try {
        const hotelRes = await fetch("https://zodr.zodml.org/api/hotels");
        const hotels = await hotelRes.json();
        const foundHotel = hotels.find(h => h.uuid === hotelId || h.nid === hotelId);
        setHotel(foundHotel);

        if (!foundHotel || !foundHotel.nid) {
          setRooms([]);
          setLoading(false);
          return;
        }

        const roomsRes = await fetch(`https://zodr.zodml.org/api/hotel-rooms/${foundHotel.nid}`);
        const hotelRoomsData = await roomsRes.json();

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
                  <button className="book-room">Book Room</button>
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
