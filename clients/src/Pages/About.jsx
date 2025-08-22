import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import './CSS/About.css'; 
import Footer from "../Components/Footer/Footer";




const About = () => {

const navigate = useNavigate();

const [activeTab, setActiveTab] = useState("story");

// Testimonials data section
const testimonials = [
  {
    text: "HotelsPaddie made booking so easy! The experience was smooth and the hotel was exactly as described.",
    name: "John Oyebode",
    location: "Lagos, Nigeria",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "I love the exclusive deals I found here. Saved me so much money on my last trip!",
    name: "Aisha Bello",
    location: "Abuja, Nigeria",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "Best customer support ever! They helped me change my booking at the last minute without extra charges.",
    name: "Esmond Smith",
    location: "Port Harcourt, Nigeria",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg"
  }
];
const [currentIndex, setCurrentIndex] = useState(0);

const nextSlide = () => {
  setCurrentIndex((prev) => (prev + 1) % testimonials.length);
};

const prevSlide = () => {
  setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
};


// popular hotels data section
const products = [
  {
    title: "Standard Rooms",
    description: "Experience comfort with our standard rooms, perfect for a relaxing stay",
    image: "https://media.istockphoto.com/id/2162590329/photo/modern-bedroom.jpg?s=612x612&w=0&k=20&c=siZL-hqr0TqDR7x8zKMsIAh6z-Zji1_JFuaqk8H14QQ=",
  },
  {
    title: "Deluxe Rooms",
    description: "Indulge in luxury with our deluxe rooms, featuring premium amenities",
    image: "https://media.istockphoto.com/id/168704591/photo/luxurious-two-bed-hotel-room-with-hardwood-floors.jpg?s=612x612&w=0&k=20&c=N05XD0WrPljmDansJamGNXvSsCzmnvjSS9Hxj6xuDQU=",
  },
  {
    title: "Suites",
    description: "Spacious suites with stunning views and top-notch facilities",
    image: "https://media.istockphoto.com/id/850262790/photo/classic-scandinavian-bedroom.jpg?s=612x612&w=0&k=20&c=T49FjRWmkRBybykN8qa3fjPhpgP5Y04s4FNodtCFW8s=",
  },
  {
    title: "Double Rooms",
    description: "Perfect for families or groups, our double rooms offer ample space and comfort",
    image: "https://media.istockphoto.com/id/1163498940/photo/interior-of-a-modern-luxury-hotel-double-bed-bedroom.jpg?s=612x612&w=0&k=20&c=75KFjgY3RHrQq2yTV4boA4A89qMeccMQZotFKIMURS8=",
  },
  {
    title: "Queen Rooms",
    description: "Elegant queen rooms with a touch of sophistication for a memorable stay",
    image: "https://media.istockphoto.com/id/954121470/photo/cozy-studio-apartment-design-with-bedroom-and-living-space.jpg?s=612x612&w=0&k=20&c=xAG5R-ZYlzj6Wj-UgFfja9VhEtH83fj8CcAtaLn2ZKI=",
  },
  {
    title: "Presidential Suites",
    description: "Experience the pinnacle of luxury with our presidential suites, designed for the elite",
    image: "https://media.istockphoto.com/id/2155061918/photo/man-lying-on-bed-in-hotel.jpg?s=612x612&w=0&k=20&c=wPAmFEKzv4fAabOgfi2fMb90PnK-N7NfRqi6lLiVD34=",
  },
];

const images = [
    "https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=",
    "https://media.istockphoto.com/id/164658984/photo/modern-bedroom-interior-design.jpg?s=612x612&w=0&k=20&c=ze07e8AZxkKlVStBLEsoa1FECiAaH2Bnj1cxENOLCqM=",
    "https://media.istockphoto.com/id/954121470/photo/cozy-studio-apartment-design-with-bedroom-and-living-space.jpg?s=612x612&w=0&k=20&c=xAG5R-ZYlzj6Wj-UgFfja9VhEtH83fj8CcAtaLn2ZKI=",
    "https://media.istockphoto.com/id/2212370588/photo/the-travel-with-a-colors-luggage-as-business-trip-in-a-holiday-image-of-city-building.jpg?s=612x612&w=0&k=20&c=CmczsCfg22FjVyoAX8NZ0j_eQFF8wm8gzfbEiP1_jwA=",
    "https://media.istockphoto.com/id/168620563/photo/bed-in-living-room.jpg?s=612x612&w=0&k=20&c=tQumTM4jpsXF2F13UIF9MhtdlEL2MJKnjoJgjnZuIv8=",
  ];
  return (
    <>
    <Navbar />
    <div className="about-page">
        <div className="about-content">
          <section
            className="about-banner"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          >
            <div className="hero-content">
              <h1>About Us</h1>
              <h2>Know about HotelsPaddie</h2>
              <p>
                We provide what you need to enjoy your holiday with your family <br />
                Time to create another memorable moment
              </p>
              <div className="search-form-wrapper">{/* Add form here */}</div>
            </div>
          </section>
        </div>

        <div className="about-heading">
          <h1>Welcome to HotelsPaddie</h1>
          <p>
            HotelsPaddie is the next-generation, modern-day Online Travel Agency (OTA) born out of a bold vision and an intense passion to be the best in redefining how people discover, book, and experience hospitality across Africa—starting with Nigeria. 
          </p>
        </div>
    

     <div className="about-details-container">
      <div className="row">
        {/* Left Column - Image */}
        <div className="about-col-1">
          <img
            src="https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM="
            alt="Product"
          />
        </div>

        {/* Right Column - Details */}
        <div className="about-col-2">
          <h1 className="sub-title">About Us</h1>
          <h1 className="sub-title2">Our History</h1>

          {/* Tab Titles */}
          <div className="tab-titles">
            <p
              className={`tab-links ${activeTab === "story" ? "active-link" : ""}`}
              onClick={() => setActiveTab("story")}
            >
              Our Story.
            </p>
            <p
              className={`tab-links ${activeTab === "choose-us" ? "active-link" : ""}`}
              onClick={() => setActiveTab("choose-us")}
            >
              Why Choose Us.
            </p>
            <p
              className={`tab-links ${activeTab === "reg-hotels" ? "active-link" : ""}`}
              onClick={() => setActiveTab("reg-hotels")}
            >
              Registered Hotels.
            </p>
            <p
              className={`tab-links ${activeTab === "contact" ? "active-link" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Us.
            </p>
          </div>

          {/* Tab Contents */}
          {activeTab === "story" && (
            <div className="tab-contents active-tab">
              <p>
                HotelsPaddie is the next-generation, modern-day Online Travel Agency (OTA) redefining how people discover, book, and experience hospitality across Africa—starting with Nigeria. Born out of a bold vision and an intense passion to be the best, we are not just building a platform; we are building a movement rooted in African identity, innovation, and excellence.
                <br /> <br />
                At HotelsPaddie, we understand the heartbeat of modern African travelers and hospitalitypartners. Our mission is to bridge local insight with global standards—delivering seamless hotel booking
                <br /> <br />
                We are proudly African. Our identity shapes our voice, our service, and our commitment toshowcasing the best of local hospitality. Whether you're planning a getaway within Lagos, abusiness trip to Abuja, or an adventure across borders, HotelsPaddie is your trusted travel companion—reliable, relatable, and revolutionary. 
                <br /> <br />
                Join us as we build Africa’s most loved travel platform—powered by technology, driven by culture, and fueled by purpose.
              </p>
              
            </div>
          )}

          {activeTab === "choose-us" && (
            <div className="tab-contents active-tab">
              <p>
                At HotelsPaddie, we are committed to transforming the way you experience travel in Africa. Our platform is designed to empower travelers with the tools they need to explore Africa like never before. From personalized recommendations to exclusive deals, we are committed to enhancing every step of your journey. Our user-friendly interface, secure payment options, and 24/7 customer support ensure that your experience is as smooth as it is memorable.
                <br /> <br />
                <ul>
                  <li>Personalized Travel Experience: Tailored recommendations based on your preferences.</li>
                  <li>Exclusive Deals: Access to special offers and discounts on a wide range of accommodations.</li>
                  <li>24/7 Customer Support: Our dedicated team is always ready to assist you with any inquiries or issues.</li>
                  <li>Secure Transactions: We prioritize your safety with secure payment options and data protection.</li>
                  <li>Community Engagement: Join a vibrant community of travelers and hotel owners sharing experiences and insights.</li>
                </ul>
              </p>
              
            </div>
          )}

          {activeTab === "reg-hotels" && (
            <div className="tab-contents active-tab">
              <p>
                HotelsPaddie is not just a booking platform; it's a community of travelers and hotel owners working together to create unforgettable experiences. We are proud to partner with over 2000 registered hotels across Nigeria and beyond, each offering unique accommodations that reflect the rich diversity of African culture. Our commitment to quality and authenticity ensures that every stay with us is not just a booking, but a journey into the heart of Africa's hospitality.
                <br /> <br />
                Whether you're looking for a luxury escape, a cozy boutique hotel, or a budget-friendly option, HotelsPaddie has something for everyone. Our platform features detailed listings, real-time availability, and transparent pricing, making it easier than ever to find the perfect place to stay. Join us in celebrating the best of African hospitality and discover why HotelsPaddie is the preferred choice for travelers across the continent.
              </p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="tab-contents active-tab">
              <p>
                We value your feedback and are here to assist you with any questions or concerns you may have. Whether you need help with a booking, want to share your experience, or have suggestions for improvement, our team is ready to listen and respond. You can reach us through our contact form on the website, email us at <br />
                <a href="mailto:info@hotelspaddie.com">info@hotelspaddie.com</a>  
                <br />
                or call our customer support hotline at <br />    
                <a href="tel:+234123456789">+234 123 456 789</a>.
                <br /> <br />
                We are committed to providing you with the best possible service and ensuring that your experience with HotelsPaddie is nothing short of exceptional. Your satisfaction is our top priority, and we look forward to hearing from you soon!  
                </p>
                <p className="more-contact">
                  <Link to={`/contact`}>More Contact Details</Link>
                </p>
            </div>
          )}
        </div>
      </div>
     </div> 

        {/* Testimonials Carousel Section */}
        <div className="testimonials-section">
          <h2>What Our Users Say</h2>
          <div className="carousel-container">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card ${index === currentIndex ? "active" : ""}`}
              >
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-user">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-buttons">
            <button onClick={prevSlide}>‹</button>
            <button onClick={nextSlide}>›</button>
          </div>
        </div>


      {/* Popular hotel section */}
      <div className="popular-rooms">
      <div className="container">
        <h4>
          Popular Room Categories
          <hr />
        </h4>
          <div className="product-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="thumbnail">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="room-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>
                  <Link to={`/hotels`}>View in hotel</Link>
                </p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery section */}
      <section className="image-gallery">
      {images.map((img, index) => (
        <div key={index} className="gallery-item">
          <img src={img} alt={`Gallery ${index + 1}`} />
        </div>
        ))}
      </section>

    </div>

    <Footer />
    </>
  );
};

export default About;
