import { getAuthHeaders, getAccessToken } from './authService';

const API_BASE_URL = 'http://localhost:3001/api';

export const bookingService = {
  // Create a new booking (updated for multiple rooms)
  async createBooking(bookingData) {
    try {
      console.log('Creating booking with data:', bookingData);
      
      const headers = getAuthHeaders();
      console.log('Auth headers being sent:', headers);
      
      // For multiple rooms, we might need to create multiple booking records
      // or send the rooms data as part of the booking
      const bookingPayload = {
        ...bookingData,
        // Ensure the title includes room summary
        title: bookingData.title || `Booking for ${bookingData.hotel_name}`,
        // Add room details to special requests if not already included
        field_special_requests: bookingData.field_special_requests ? 
          `${bookingData.field_special_requests}\n\nRooms booked: ${bookingData.rooms?.map(r => `${r.quantity}x ${r.room_title}`).join(', ')}` :
          `Rooms booked: ${bookingData.rooms?.map(r => `${r.quantity}x ${r.room_title}`).join(', ')}`
      };
      
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingPayload)
      });

      console.log('Create booking response status:', response.status);
      
      const data = await response.json();
      console.log('Create booking response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      return data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  // Create multiple room bookings (alternative approach)
  async createMultipleRoomBookings(hotelData, selectedRooms, bookingDetails) {
    try {
      console.log('Creating multiple room bookings...');
      
      const bookingPromises = selectedRooms.map(async ({ room, quantity, totalPrice }) => {
        const individualBookingData = {
          title: `${hotelData.title} - ${quantity}x ${room.title || room.field_room_category}`,
          field_check_in_date: bookingDetails.checkInDate,
          field_check_out_date: bookingDetails.checkOutDate,
          field_number_of_guest: Math.ceil(bookingDetails.numberOfGuests / selectedRooms.length), // Distribute guests
          field_total_price: (totalPrice * bookingDetails.nights).toFixed(2),
          field_booking_status: "pending",
          field_payment_status: "unpaid",
          field_special_requests: `${bookingDetails.specialRequests || ''}\nRoom: ${room.title}\nQuantity: ${quantity}`.trim(),
          hotel_id: hotelData.nid || hotelData.uuid || hotelData.id,
          hotel_name: hotelData.title,
          room_id: room.uuid || room.id,
          room_title: room.title,
          room_category: room.field_room_category,
          quantity: quantity,
          nights: bookingDetails.nights
        };

        return this.createBooking(individualBookingData);
      });

      const results = await Promise.all(bookingPromises);
      
      return {
        success: true,
        message: 'All bookings created successfully',
        bookings: results,
        main_booking_id: results[0]?.booking_id
      };
    } catch (error) {
      console.error('Create multiple room bookings error:', error);
      throw error;
    }
  },

  // Get user's past bookings
  async getUserBookings() {
    try {
      console.log('Fetching user past bookings...');
      
      const response = await fetch(`${API_BASE_URL}/user-past-bookings`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('Get user past bookings response status:', response.status);
      
      const data = await response.json();
      console.log('Get user past bookings response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      return data;
    } catch (error) {
      console.error('Get user past bookings error:', error);
      throw error;
    }
  },

  // Get specific booking
  async getBooking(bookingId) {
    try {
      console.log('Fetching booking:', bookingId);
      
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('Get booking response status:', response.status);
      
      const data = await response.json();
      console.log('Get booking response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking');
      }

      return data;
    } catch (error) {
      console.error('Get booking error:', error);
      throw error;
    }
  },

  // Update booking after payment
  async updateBooking(bookingId, updateData) {
    try {
      console.log('Updating booking:', bookingId, 'with data:', updateData);
      
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      console.log('Update booking response status:', response.status);
      
      const data = await response.json();
      console.log('Update booking response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking');
      }

      return data;
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  },

  // Update multiple bookings (for multiple room bookings)
  async updateMultipleBookings(bookingIds, updateData) {
    try {
      console.log('Updating multiple bookings:', bookingIds);
      
      const updatePromises = bookingIds.map(bookingId => 
        this.updateBooking(bookingId, updateData)
      );

      const results = await Promise.all(updatePromises);
      
      return {
        success: true,
        message: 'All bookings updated successfully',
        updated_bookings: results
      };
    } catch (error) {
      console.error('Update multiple bookings error:', error);
      throw error;
    }
  },

  // Simulate payment process (updated for multiple rooms)
  async processPayment(bookingData, paymentData) {
    try {
      console.log('Processing payment for booking(s):', bookingData);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking status to confirmed and paid
      const updateData = {
        field_booking_status: 'confirmed',
        field_payment_status: 'paid'
      };

      let result;
      
      if (Array.isArray(bookingData.bookings)) {
        // Multiple bookings
        const bookingIds = bookingData.bookings.map(b => b.booking_id);
        result = await this.updateMultipleBookings(bookingIds, updateData);
      } else {
        // Single booking
        result = await this.updateBooking(bookingData.booking_id, updateData);
      }
      
      console.log('Payment processed successfully:', result);
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  // Calculate total booking price
  calculateTotalPrice(selectedRooms, nights = 1) {
    return selectedRooms.reduce((total, { room, quantity }) => {
      const roomPrice = parseFloat(room.field_price_per_night?.replace(/[^0-9.]/g, '') || 0);
      return total + (roomPrice * quantity * nights);
    }, 0);
  },

  // Validate booking data
  validateBookingData(bookingData, selectedRooms) {
    const errors = [];

    if (!bookingData.checkInDate) {
      errors.push('Check-in date is required');
    }

    if (!bookingData.checkOutDate) {
      errors.push('Check-out date is required');
    }

    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      
      if (checkIn >= checkOut) {
        errors.push('Check-out date must be after check-in date');
      }

      if (checkIn < new Date().setHours(0, 0, 0, 0)) {
        errors.push('Check-in date cannot be in the past');
      }
    }

    if (!bookingData.numberOfGuests || bookingData.numberOfGuests < 1) {
      errors.push('Number of guests must be at least 1');
    }

    if (!selectedRooms || selectedRooms.length === 0) {
      errors.push('At least one room must be selected');
    }

    // Validate room capacity
    if (selectedRooms && bookingData.numberOfGuests) {
      const totalCapacity = selectedRooms.reduce((sum, { room, quantity }) => {
        const capacity = parseInt(room.field_capacity || 0);
        return sum + (capacity * quantity);
      }, 0);

      if (totalCapacity > 0 && bookingData.numberOfGuests > totalCapacity) {
        errors.push(`Selected rooms can accommodate maximum ${totalCapacity} guests`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default bookingService;






//Original code for bookingService.js
// import { getAuthHeaders, getAccessToken } from './authService';

// const API_BASE_URL = 'http://localhost:3001/api';

// export const bookingService = {
//   // Create a new booking
//   async createBooking(bookingData) {
//     try {
//       console.log('Creating booking with data:', bookingData);
      
//       const headers = getAuthHeaders();
//       console.log('Auth headers being sent:', headers);
      
//       const response = await fetch(`${API_BASE_URL}/bookings`, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(bookingData)
//       });

//       console.log('Create booking response status:', response.status);
      
//       const data = await response.json();
//       console.log('Create booking response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create booking');
//       }

//       return data;
//     } catch (error) {
//       console.error('Create booking error:', error);
//       throw error;
//     }
//   },

//   // Get user's past bookings
//   async getUserBookings() {
//     try {
//       console.log('Fetching user past bookings...');
      
//       const response = await fetch(`${API_BASE_URL}/user-past-bookings`, {
//         method: 'GET',
//         headers: getAuthHeaders()
//       });

//       console.log('Get user past bookings response status:', response.status);
      
//       const data = await response.json();
//       console.log('Get user past bookings response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch bookings');
//       }

//       return data;
//     } catch (error) {
//       console.error('Get user past bookings error:', error);
//       throw error;
//     }
//   },

//   // Get specific booking
//   async getBooking(bookingId) {
//     try {
//       console.log('Fetching booking:', bookingId);
      
//       const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
//         method: 'GET',
//         headers: getAuthHeaders()
//       });

//       console.log('Get booking response status:', response.status);
      
//       const data = await response.json();
//       console.log('Get booking response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch booking');
//       }

//       return data;
//     } catch (error) {
//       console.error('Get booking error:', error);
//       throw error;
//     }
//   },

//   // Update booking after payment
//   async updateBooking(bookingId, updateData) {
//     try {
//       console.log('Updating booking:', bookingId, 'with data:', updateData);
      
//       const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
//         method: 'PATCH',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(updateData)
//       });

//       console.log('Update booking response status:', response.status);
      
//       const data = await response.json();
//       console.log('Update booking response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update booking');
//       }

//       return data;
//     } catch (error) {
//       console.error('Update booking error:', error);
//       throw error;
//     }
//   },

//   // Simulate payment process
//   async processPayment(bookingId, paymentData) {
//     try {
//       console.log('Processing payment for booking:', bookingId);
      
//       // Simulate payment processing delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Update booking status to confirmed and paid
//       const updateData = {
//         field_booking_status: 'confirmed',
//         field_payment_status: 'paid'
//       };

//       const result = await this.updateBooking(bookingId, updateData);
      
//       console.log('Payment processed successfully:', result);
//       return result;
//     } catch (error) {
//       console.error('Payment processing error:', error);
//       throw error;
//     }
//   }
// };

// export default bookingService; 