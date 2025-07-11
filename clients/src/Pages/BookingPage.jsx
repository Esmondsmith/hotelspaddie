import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar'; // Assuming Navbar is in this path
import './CSS/BookingPage.css'; // Pure CSS file
import { CalendarDays, Users, MessageSquare, DollarSign, Hotel } from 'lucide-react';

const BookingPage = () => {
    const { hotelId, roomId } = useParams(); // Get hotelId and roomId from URL
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingId, setBookingId] = useState('');

    const API_BASE_URL = 'https://zodr.zodml.org'; // Your external API base URL
    const LOCAL_BACKEND_URL = 'http://localhost:3001'; // Your local backend URL

    // Function to calculate total price
    const calculateTotalPrice = () => {
        if (room && checkInDate && checkOutDate) {
            const start = new Date(checkInDate);
            const end = new Date(checkOutDate);

            // Ensure check-out is after check-in
            if (end <= start) {
                setTotalPrice(0);
                return;
            }

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const pricePerNight = parseFloat(room.field_room_rate); // Assuming room rate is in field_room_rate

            if (!isNaN(pricePerNight)) {
                setTotalPrice((pricePerNight * diffDays).toFixed(2));
            } else {
                setTotalPrice(0);
            }
        } else {
            setTotalPrice(0);
        }
    };

    // Fetch hotel and room details on component mount or ID change
    useEffect(() => {
        const fetchHotelAndRoomDetails = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch hotel details (if needed for display)
                // Assuming an endpoint like /api/hotel/:hotelId or /api/hotels?uuid=...
                // For simplicity, we might just get hotel name from the room object if available
                // If hotelId is a UUID, you might need /jsonapi/node/hotel/{UUID}
                // For now, let's assume we fetch all hotels and find it, or the room data includes hotel info.
                // Or, if your backend has /api/hotel-details/:hotelId, use that.
                // For this example, I'll rely on the room fetch to get hotel details if possible,
                // or just display the hotelId directly.

                // Fetch rooms for the hotel and find the specific room
                const roomsResponse = await fetch(`${LOCAL_BACKEND_URL}/api/hotel-rooms?nid=${hotelId}`);
                if (!roomsResponse.ok) {
                    throw new Error(`Failed to fetch rooms for hotel ${hotelId}. Status: ${roomsResponse.status}`);
                }
                const roomsData = await roomsResponse.json();
                const foundRoom = roomsData.find(r => (r.uuid === roomId || r.nid === roomId)); // Check both UUID and NID

                if (!foundRoom) {
                    throw new Error(`Room with ID ${roomId} not found for hotel ${hotelId}.`);
                }

                setRoom(foundRoom);
                // Assuming hotel information might be nested or linked in the room object
                // If not, you'd need another fetch for hotel details:
                // const hotelResponse = await fetch(`${API_BASE_URL}/jsonapi/node/hotel/${hotelId}`);
                // const hotelData = await hotelResponse.json();
                // setHotel(hotelData.data.attributes.title); // Adjust based on actual hotel API response

                // For now, let's assume the room object has a hotel title or we use hotelId directly
                setHotel({ title: foundRoom.hotel_title || `Hotel ${hotelId}` }); // Fallback title

            } catch (err) {
                console.error("Error fetching hotel or room details:", err);
                setError(`Could not load hotel or room details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (hotelId && roomId) {
            fetchHotelAndRoomDetails();
        } else {
            setError('Missing hotel ID or room ID in URL.');
            setLoading(false);
        }
    }, [hotelId, roomId]);

    // Recalculate total price whenever dates or room changes
    useEffect(() => {
        calculateTotalPrice();
    }, [checkInDate, checkOutDate, room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setBookingSuccess(false);

        if (!checkInDate || !checkOutDate || numberOfGuests < 1 || !room || !hotelId || !roomId) {
            setError('Please fill in all required fields (dates, guests, and ensure room/hotel are selected).');
            setSubmitting(false);
            return;
        }

        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setError('Check-out date must be after check-in date.');
            setSubmitting(false);
            return;
        }

        const bookingPayload = {
            data: {
                type: "node--booking",
                attributes: {
                    title: `Booking for ${room.title} at ${hotel.title}`, // Dynamic title
                    field_check_in_date: checkInDate,
                    field_check_out_date: checkOutDate,
                    field_number_of_guest: parseInt(numberOfGuests, 10),
                    field_total_price: totalPrice.toString(), // Ensure it's a string as per API spec
                    field_booking_status: "pending",
                    field_payment_status: "unpaid",
                    field_special_requests: specialRequests,
                },
                relationships: {
                    field_hotel: {
                        data: {
                            type: "node--hotel",
                            id: hotelId // Use the hotelId from URL params
                        }
                    },
                    field_room: {
                        data: {
                            type: "node--room",
                            id: roomId // Use the roomId from URL params
                        }
                    }
                }
            }
        };

        console.log('Booking Payload:', JSON.stringify(bookingPayload, null, 2));

        try {
            // IMPORTANT: You need to replace 'YOUR_ACCESS_TOKEN_HERE' with a real OAuth2 token
            // This token would typically come from your authentication context or local storage after login.
            const accessToken = 'YOUR_ACCESS_TOKEN_HERE'; // Placeholder

            if (accessToken === 'YOUR_ACCESS_TOKEN_HERE') {
                setError('Authentication token is missing. Please log in.');
                setSubmitting(false);
                return;
            }

            const response = await fetch(`${LOCAL_BACKEND_URL}/jsonapi/node/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bookingPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Booking API Error:', errorData);
                throw new Error(errorData.error || `Booking failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Booking successful:', data);
            setBookingId(data.data.id || data.data.drupal_internal__nid); // Get UUID or NID
            setBookingSuccess(true);
            // Optionally, redirect to a confirmation page or payment gateway
            // navigate(`/booking-confirmation/${data.data.id}`);

        } catch (err) {
            console.error("Error creating booking:", err);
            setError(`Booking failed: ${err.message}. Please try again.`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="booking-page-container loading-state">
                <p>Loading hotel and room details...</p>
            </div>
        );
    }

    if (error && !bookingSuccess) {
        return (
            <div className="booking-page-container error-state">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="booking-page-container error-state">
                <p className="error-message">Room details could not be loaded. Please ensure the URL is correct or the room exists.</p>
                <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="booking-page-container success-state">
                <h2>Booking Confirmed!</h2>
                <p>Your booking for <span className="highlight">{room.title}</span> at <span className="highlight">{hotel.title}</span> has been successfully placed.</p>
                <p>Your Booking ID: <span className="highlight">{bookingId}</span></p>
                <p>Total Price: <span className="highlight">₦{new Intl.NumberFormat('en-US').format(totalPrice)}</span></p>
                <p>Check-in: {checkInDate} | Check-out: {checkOutDate}</p>
                <p>Number of Guests: {numberOfGuests}</p>
                <button onClick={() => navigate('/my-bookings')} className="view-bookings-button">View My Bookings</button>
                <button onClick={() => navigate('/')} className="home-button">Go to Home</button>
            </div>
        );
    }

    // Get today's date for min attribute on date inputs
    const today = new Date().toISOString().split('T')[0];
    const minCheckOutDate = checkInDate ? new Date(new Date(checkInDate).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0] : today;


    return (
        <>
            <Navbar />
            <div className="booking-page-container">
                <div className="booking-header">
                    <h1>Book Your Stay</h1>
                    <p>Complete your booking for <span className="highlight">{room.title}</span> at <span className="highlight">{hotel.title}</span></p>
                    <hr />
                </div>

                <div className="room-summary">
                    <h2>Room Details</h2>
                    <div className="room-info-grid">
                        <div className="info-item">
                            <Hotel size={20} />
                            <span>Room Type: {room.title}</span>
                        </div>
                        <div className="info-item">
                            <DollarSign size={20} />
                            <span>Price Per Night: ₦{new Intl.NumberFormat('en-US').format(parseFloat(room.field_room_rate))}</span>
                        </div>
                        <div className="info-item">
                            <Users size={20} />
                            <span>Max Guests: {room.field_max_guests || 'N/A'}</span>
                        </div>
                        {/* Add more room details if available in your room object */}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label htmlFor="checkInDate">
                            <CalendarDays size={18} /> Check-in Date:
                        </label>
                        <input
                            type="date"
                            id="checkInDate"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={today}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="checkOutDate">
                            <CalendarDays size={18} /> Check-out Date:
                        </label>
                        <input
                            type="date"
                            id="checkOutDate"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={minCheckOutDate}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numberOfGuests">
                            <Users size={18} /> Number of Guests:
                        </label>
                        <input
                            type="number"
                            id="numberOfGuests"
                            value={numberOfGuests}
                            onChange={(e) => setNumberOfGuests(e.target.value)}
                            min="1"
                            max={room.field_max_guests || 10} // Use room's max guests if available
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialRequests">
                            <MessageSquare size={18} /> Special Requests / Notes:
                        </label>
                        <textarea
                            id="specialRequests"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            rows="4"
                            placeholder="e.g., Non-smoking room, extra bed, late check-in..."
                        ></textarea>
                    </div>

                    <div className="total-price-section">
                        <p>Total Price: <span className="price-display">₦{new Intl.NumberFormat('en-US').format(totalPrice)}</span></p>
                    </div>

                    <button type="submit" className="submit-button" disabled={submitting || totalPrice <= 0}>
                        {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default BookingPage;