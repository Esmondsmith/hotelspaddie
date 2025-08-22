
import React, { useState } from "react";
import './CSS/Contact.css'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'


const Contact = () => {
  const [showMap, setShowMap] = useState(false);

  const faqs = [
  {
    question: "Why should i use your app in booking hotels?",
    answer:
      "At HotelsPaddie, we are committed to transforming the way you experience travel in Africa. Our platform is designed to empower travelers with the tools they need to explore Africa like never before. From personalized recommendations to exclusive deals, we are committed to enhancing every step of your journey."
  },
  {
    question: "Can I modify or cancel my booking?",
    answer:
      "Yes. You can manage your booking through the “My Reservations” section. Cancellations are free up to 48 hours before your check-in date. You will also get a full refund of your payment made"
  },
  {
    question: "How do I book a room on your website?",
    answer:
      "You can easily book by selecting your preferred dates, choosing a room type, and confirming with secure online payment. A confirmation email will be sent instantly."
  },
  {
    question: "Do I need a credit card to make a reservation?",
    answer:
      "Most bookings require a credit card guarantee. However, some hotels may also accept debit cards or allow payment on arrival."
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No. All fees and taxes are displayed during the booking process. What you see is what you pay."
  },
  {
    question: "Can I book without creating an account?",
    answer:
      "Yes, you can book as a guest. However, creating an account allows you to manage reservations and access exclusive offers."
  }
];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
    <Navbar />
    <div className="contact">
      <section className="contact-banner">
        <div className="contact-banner-overlay">
          <div className="contact-banner-content">
            <h1>Contact Us</h1>
            <p>We’re here to help you 24/7 with your bookings and inquiries</p>
          </div>
        </div>
      </section>
    </div>
    
    <section className="contact-section">
      {/* Contact Info */}
      <div className="contact-info">
        <h2>Contact Information</h2>

        <div className="info-item">
          <span className="icon">
            <FaEnvelope size={22}/>
          </span>
          <p>
            <a href="mailto:info@hotelspaddie.com">info@hotelspaddie.com</a>
          </p>
        </div>

        <div className="info-item">
          <span className="icon">
            <FaPhone size={22}/>
          </span>
          <p>
            <a href="tel:+2348171772822">+2348171772822</a>
          </p>
        </div>

        <div className="info-item location">
          <span className="icon">
            <FaMapMarkerAlt size={24}/>
          </span>
          <p>
            60486 Frankfurt am Main
            <br />
            Germany
          </p>
        </div>
        <div>
          <br />
            <a
              className="view-map"
              href="https://www.google.com/maps/search/?api=1&query=60486+Frankfurt+am+Main+Germany"
              target="_blank"
              rel="noreferrer"
            >
              View on Google Maps
            </a>
        </div>
        {/* Toggle Button */}
        <button className="toggle-map" onClick={() => setShowMap(!showMap)}>
          <FaMapMarkerAlt /> {showMap ? "Hide Map" : "Show Map"}
        </button>

        {/* Google Map Embed */}
        {showMap && (
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps?q=60486+Frankfurt+am+Main+Germany&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <form className="contact-form">
        <h2>Send Us a Message</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" placeholder="Your Name" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" id="email" placeholder="Your Email" required />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" name="subject" id="subject" placeholder="Subject" required />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            rows="5"
            placeholder="Your Message"
            required
          ></textarea>
        </div>

        <button type="submit">Send Message</button>
      </form>
    </section>

    <section className="faq-section" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              <div
                className="faq-answer"
                style={{
                  maxHeight: activeIndex === index ? "200px" : "0px"
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
    </>
  );
};

export default Contact;
