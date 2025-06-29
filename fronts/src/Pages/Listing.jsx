import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import "./CSS/Listing.css";

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
        // Fetch all hotels and find the one with hotelId
        const hotelRes = await fetch("http://localhost:3001/api/hotels");
        const hotels = await hotelRes.json();
        const foundHotel = hotels.find(h => h.uuid === hotelId || h.nid === hotelId);
        setHotel(foundHotel);

        if (!foundHotel || !foundHotel.nid) {
          setRooms([]);
          setLoading(false);
          return;
        }

        // Fetch rooms for this hotel using nid as a query param
        const roomsRes = await fetch(`http://localhost:3001/api/hotel-rooms?nid=${foundHotel.nid}`);
        const hotelRooms = await roomsRes.json();
        console.log("hotelRooms API response:", hotelRooms);
        if (!Array.isArray(hotelRooms)) {
          setError("No rooms found or error fetching rooms.");
          setRooms([]);
          return;
        }
        setRooms(hotelRooms);
      } catch (err) {
        console.error("Error fetching hotel or rooms:", err);
        setError("Failed to load hotel or rooms.");
        setRooms([]); // Ensure rooms is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchHotelAndRooms();
  }, [hotelId]);

  if (loading) return <div className="listing-loading">Loading...</div>;
  if (error) return <div className="listing-error">{error}</div>;
  if (!hotel) return <div className="listing-error">Hotel not found.</div>;

  return (
    <div className="listing-page">
      <div className="listing-header">
        <img className="listing-main-img" src={hotel.field_media?.split(", ")[0]} alt={hotel.title} />
        <div className="listing-header-info">
          <h1>{hotel.title}</h1>
          <div className="listing-rating">
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <span>{hotel.field_rating}</span>
            <span className="listing-reviews">(316 reviews)</span>
          </div>
          <div className="listing-location">{hotel.field_location}</div>
          <div className="listing-amenities">{hotel.field_amenities}</div>
        </div>
      </div>
      <div className="listing-rooms-list">
        {!Array.isArray(rooms) || rooms.length === 0 ? (
          <div className="listing-no-rooms">No rooms available for this hotel.</div>
        ) : (
          rooms.map((room, idx) => (
            <div className="listing-room-card" key={room.uuid || idx}>
              <img className="listing-room-img" src={room.image || hotel.field_media?.split(", ")[0]} alt={room.title || hotel.title} />
              <div className="listing-room-info">
                <div className="listing-room-title">{room.title || "Room"}</div>
                <div className="listing-room-desc">{room.description || "No description provided."}</div>
                <div className="listing-room-meta">
                  <span>Guests: {room.guests || "-"}</span>
                  <span>Beds: {room.beds || "-"}</span>
                  <span>Baths: {room.baths || "-"}</span>
                </div>
                <div className="listing-room-price">{room.price ? `NGN${room.price}` : "Price on request"}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Listing;