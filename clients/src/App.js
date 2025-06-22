import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Hotels from './Pages/Hotels';
import About from './Pages/About';
import Contact from './Pages/Contact';
// import Cart from './Pages/Cart';
import Product from './Pages/Product';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Footer from './Components/Footer/Footer';

import hotel_banner from './Components/Assets/banner_mens.png'
import about_banner from './Components/Assets/banner_women.png'
import contact_banner from './Components/Assets/banner_kids.png'




function App() {
  return (
    <div >

      <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hotels' element={<Hotels banner={hotel_banner} category="hotel"/>} />
        <Route path='/about' element={<About banner={about_banner} category="about"/>} />
        <Route path='/contact' element={<Contact banner={contact_banner} category="contact"/>} />
        <Route path='/product' element={<Product/>} />
          <Route path=':productId' element={<Product/>} />
        <Route/>
        {/* <Route path='/cart' element={<Cart />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
      {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
