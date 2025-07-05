import React from "react";
import Hero from "../Components/Hero/Hero";
import BestHotels from "../Components/BestHotels/BestHotels";
import Banner from "../Components/Banner/Banner";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import HostWithUs from "../Components/HostWithUs/HostWithUs";
import DownloadApp from "../Components/DownloadApp/DownloadApp";
import Carousel from "../Components/Carousel/Carousel";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <HostWithUs />
      <BestHotels />
      <DownloadApp />
      <Carousel />
      <Footer />
    </div>
  );
};

export default Home;
