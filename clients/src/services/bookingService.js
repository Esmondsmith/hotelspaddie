import { getAuthHeaders, getAccessToken } from './authService';

const API_BASE_URL = 'http://localhost:3001/api';

export const bookingService = {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      console.log('Creating booking with data:', bookingData);
      
      const headers = getAuthHeaders();
      console.log('Auth headers being sent:', headers);
      
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingData)
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

  // Get user's bookings
  async getUserBookings() {
    try {
      console.log('Fetching user bookings...');
      
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('Get bookings response status:', response.status);
      
      const data = await response.json();
      console.log('Get bookings response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      return data;
    } catch (error) {
      console.error('Get bookings error:', error);
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

  // Simulate payment process
  async processPayment(bookingId, paymentData) {
    try {
      console.log('Processing payment for booking:', bookingId);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking status to confirmed and paid
      const updateData = {
        field_booking_status: 'confirmed',
        field_payment_status: 'paid'
      };

      const result = await this.updateBooking(bookingId, updateData);
      
      console.log('Payment processed successfully:', result);
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
};

export default bookingService; 