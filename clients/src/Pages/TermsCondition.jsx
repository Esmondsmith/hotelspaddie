import React from 'react'
import './CSS/TermsCondition.css';
import { Mail, PhoneOutgoing, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const TermsCondition = () => {

    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };
  return (
    <>
    <div className="terms-container">
      <header className="terms-header">
        <h1>Terms & Conditions</h1>
        <p>Welcome to HotelsPaddie. By accessing or using our platform, you agree to comply with and be
bound by the following Terms and Conditions. Please read these terms carefully before using our services.
</p>
      </header>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
        By accessing or using HotelsPaddie, you agree to these Terms and Conditions, our Privacy Policy, and all other applicable rules. If you do not agree, please do not use our platform.
        </p>
      </section>

      <section>
        <h2>2. Services Offered</h2>
        <p>
          HotelsPaddie provides a platform for users to search, compare, and book travel services. All bookings are subject to availability and the terms of third-party providers.

        </p>
      </section>

      <section>
        <h2>3. User Responsibilities</h2>
        <ul>
          <li> <b>Accurate Information:</b> Users must provide accurate and complete information when
making a booking.</li>
          <li> <b>Age Restriction: </b>Users must be at least 18 years old or have the consent of a legal
guardian.</li>
          <li> <b>Account Security: </b>Users are responsible for maintaining the confidentiality of their
account details.</li>
        </ul>
      </section>

      <section>
        <h2>4. Booking and Payment</h2>
        <ul>
          <li> <b>Third-Party Terms: </b>All bookings are processed by third-party providers. By making a
booking, you agree to their terms and conditions.</li>
          <li> <b>Payment Authorization: </b>You authorize HotelsPaddie, the third-party provider to charge
the payment method provided for bookings and applicable fees.</li>
          <li> <b>Cancellation and Refunds:</b> Cancellation and refund policies are governed by the
respective service provider.</li>
        </ul>
      </section>

      <section>
        <h2>5. Changes to Bookings</h2>
        <p>Any changes to bookings must comply with the policies of the service provider. Fees or
additional charges may apply.</p>
      </section>

      <section>
        <h2>6. Liability Disclaimer</h2>
        <ul>
          <li> <b>Third-Party Services:</b> HotelsPaddie acts as an intermediary between users and service
providers. We are not liable for the quality, safety, or fulfillment of services provided by
third parties.</li>
          <li> <b>No Warranty:</b> HotelsPaddie does not guarantee the availability, reliability, or accuracy of
the platform or services.</li>
        </ul>
      </section>

      <section>
        <h2>7. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the platform for fraudulent or unlawful purposes.</li>
          <li>Interfere with the platform's security or operations.</li>
          <li>Misuse any promotional offers or discounts.</li>
        </ul>
      </section>

      <section>
        <h2>8. Privacy</h2>
        <p>Your personal information is collected, used, and shared in accordance with our [Privacy Policy].</p>
      </section>

      <section>
        <h2>9. Intellectual Property</h2>
        <p>All content on the platform, including text, graphics, logos, and software, is the property of
HotelsPaddie and protected by intellectual property laws</p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>We reserve the right to terminate your access to the platform at our discretion for violations of
these Terms and Conditions.</p>
      </section>

      <section>
        <h2>11. Governing Law and Disputes</h2>
        <p>These terms are governed by the laws of Nigeria. Any disputes will be resolved exclusively in
the courts of Nigeria.</p>
      </section>

      <section>
        <h2>12. Amendments to Terms</h2>
        <p>HotelsPaddie reserves the right to update these Terms and Conditions at any time. Continued
use of the platform constitutes acceptance of the updated terms.</p>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>
        If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
        <br /><br />
          <b><Mail size={20}/> </b> <a href="mailto:info@hotelspaddie.com">info@hotelspaddie.com</a> <br />
          <b><PhoneOutgoing size={20}/> </b> <a href="tel:+2348171772822">+2348171772822</a>
        </p>
      </section> 
        {/* Back button */}
        <div className="back-btn-container">
          <button className="back-btn" onClick={handleBack}>
           <Undo2 size={20}/> Back
          </button>
        </div>
    </ div>
  
    </>
    
    );
}

export default TermsCondition