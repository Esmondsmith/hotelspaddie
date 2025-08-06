import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import Home from './Pages/Home';
import Hotels from './Pages/Hotels';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Footer from './Components/Footer/Footer';
import Listing from './Pages/Listing';
import BookingPage from './Pages/BookingPage';
import BookingHistory from './Pages/BookingHistory';
import ProtectedRoute from './Components/ProtectedRoute';
import UserProfilePage from './Pages/UserProfilePage';
import SignupHotel from './Pages/SignupHotel';
import HotelOwnerProfile from './Pages/HotelOwnerProfile';
import BookingSummary from './Pages/BookingSummary';

// import PrivateRoute from './Components/PrivateRoute'; // We'll create this


function App() {
  return (
    <div >

      <BrowserRouter>
      {/* <Navbar /> */}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hotels' element={<Hotels category="hotel"/>} />
        <Route path='/about' element={<About category="about"/>} />
        <Route path='/contact' element={<Contact category="contact"/>} />
        <Route path='/listing/:hotelId' element={<Listing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/register-hotel-owner' element={<SignupHotel />} />
       {/* <Route path="/hotel/:hotelId" element={<Listing />} />  new today 5/8 */}
       <Route path="/booking-summary" element={<BookingSummary />} /> {/* new today 5/8 */}
          {/* Existing payment route */}
        {/* <Route path="/payment" element={<Payment />} /> */}
        <Route path="/booking" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/booking-history" element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        } />
        <Route path="/user-profile" element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        {/* <Route 
            path="/user-profile" 
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            } 
        /> */}
        <Route path="/hotel-owner-profile" element={
          <ProtectedRoute>
            <HotelOwnerProfile />
          </ProtectedRoute>
        } />
        {/* <Route path="/book/:hotelId/:roomId" element={<BookingPage />} /> */}
      </Routes>
      
      {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
