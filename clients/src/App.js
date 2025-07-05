import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Hotels from './Pages/Hotels';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Footer from './Components/Footer/Footer';
import Listing from './Pages/Listing';




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
      </Routes>
      
      {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
