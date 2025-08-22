import React from "react";
import './CSS/PrivacyPolicy.css';
import { Mail, PhoneOutgoing, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const PrivacyPolicy = () => {
  
  const navigate = useNavigate();
  const handleBack = () => {
        navigate(-1);
    };

  return (
    <>
      <div className="privacy-container">
        <header className="privacy-header">
          <h1>Privacy Policy for HotelsPaddie</h1>
          <p>HotelsPaddie ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, share, and safeguard your data when you use our platform, website, and services</p>
        </header>

        <section className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <br />
          <h3>1.1 Personal Information</h3>
          <br />
          <p>
            <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Payment information (processed securely)</li>
            </ul>
          </p>
            <br />
          <h3>1.2 Non-Personal Information</h3>
          <p>
            <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type</li>
                <li>Operating system</li>
                <li>Usage data (e.g., pages visited, clicks, and time spent on the platform)</li>
            </ul>
          </p>
            <br />
          <h3>1.3 Information from Third Parties</h3>
          <p>
            <ul>
                <li>Data provided by third-party booking partners or service providers.</li>
                <li>Social media profile information (if you sign in via social media).</li>
            </ul>
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
            <br />
          <ul>
            <li>
                <b>Booking and Transaction Processing: </b>To process your reservations, payments, and confirmations.
            </li>
            <li>
                <b>Customer Support: </b>To assist you with inquiries, requests, or complaints.
            </li>
            <li>
                <b>Personalization: </b>To tailor the content and offers displayed to you.
            </li>
            <li>
                <b>Marketing: </b>To send promotional materials, special offers, and updates (you can opt-out at any time).
            </li>
            <li>
                <b>Analytics: </b>To improve our platform, analyze usage trends, and enhance user experience.
            </li>
            <li>
                <b>Legal Compliance: </b>To comply with applicable laws, regulations, and legal obligations.
            </li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. How We Share Your Information</h2>
          <p>Your information may be shared with:</p>
          <br />
          <h3>3.1 Third-Party Service Providers</h3>
          <p>We share data with trusted partners who assist in providing services, such as:</p>
          <ul>
            <li>Hotels, airlines, and other travel service providers. </li>
            <li>Payment processors and fraud detection services.</li>
            <li>Marketing and analytics platforms.</li>
          </ul>
          <br />
          <h3>3.2 Legal Requirements</h3>
          <p>We may disclose your information when required to:</p>
          <ul>
            <li>Comply with applicable laws or regulations.</li>
            <li>Respond to legal requests or government authorities.</li>
            <li>Protect the rights, property, or safety of HotelsPaddie, users</li>
          </ul>
          <br />
          <h3>3.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of our assets, your information may be transferred to the new entity.</p>
        </section>

        <section className="privacy-section">
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>We use cookies, web beacons, and similar technologies to:</p>
          <br />
          <ul>
            <li>Remember your preferences.</li>
            <li>Provide a faster and more secure experience.</li>
            <li> Analyze website traffic and usage patterns.</li>
          </ul>
          <br />
          <p>You can manage or disable cookies through your browser settings, though this may affect your user experience.</p>
        </section>

        <section className="privacy-section">
          <h2>5. Data Retention</h2>
          <p>We retain your information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or comply with legal obligations. Once no longer needed, your data will be securely deleted or anonymized.</p>
        </section>

        <section className="privacy-section">
          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
            <br />
          <ul>
            <li>Access: Request access to your personal information.</li>
            <li>Correction: Correct inaccurate or incomplete data.</li>
            <li>Deletion: Request deletion of your personal data.</li>
            <li>Data Portability: Obtain a copy of your data in a usable format.</li>
            <li>Withdraw Consent: Withdraw your consent to data processing at any time.</li>
            <li>Opt-Out: Unsubscribe from marketing communications.</li>
          </ul>
          <br />
          <p>To exercise your rights, please contact us at info@hotelspaddie.com.</p>
        </section>

        <section className="privacy-section">
          <h2> 7. Data Security</h2>
          <p>We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Children's Privacy</h2>
          <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with data, we will delete it promptly</p>
        </section>

        <section className="privacy-section">
          <h2>9. International Data Transfers</h2>
          <p>As a global platform, your information may be transferred and stored in countries outside your own. We ensure that such transfers comply with applicable data protection laws.</p>
        </section>

        <section className="privacy-section">
          <h2>10. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy periodically to reflect changes in our practices or for legal reasons. We will notify you of significant changes by posting the updated policy on our website and updating the "Effective Date."</p>
        </section>

        <section className="privacy-section">
          <h2>11. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
          <br />
          <p>
            <b><Mail size={20}/> </b> <a href="mailto:info@hotelspaddie.com">info@hotelspaddie.com</a> <br />
            <b><PhoneOutgoing size={20}/> </b> <a href="tel:+2348171772822">+2348171772822</a>
          </p>
          <br />
          <p>Thank you for trusting HotelsPaddie with your travel needs.</p>
        </section>
        <div className="back-btn-container">
          <button className="back-btn" onClick={handleBack}>
           <Undo2 size={20}/> Back
          </button>
        </div>
      </div>
  </>
  );
}

export default PrivacyPolicy



