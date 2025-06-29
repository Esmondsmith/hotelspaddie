import React from "react";
import Hero from "../Components/Hero/Hero";
import BestHotels from "../Components/BestHotels/BestHotels";
// import Offers from '../Components/Offers/Offers'
// import NewCollections from '../Components/NewCollections/NewCollections'
// import Newsletter from '../Components/Newsletter/Newsletter'
import Banner from "../Components/Banner/Banner";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <BestHotels />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
