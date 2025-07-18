import React, { useState } from 'react';
import { Apple, Play } from 'lucide-react';
import './DownloadApp.css'
import downloadApp from '../Assets/phone.jpeg';


const DownloadApp = () => {
  return (
    <div className="landing-page">
      {/* Mobile App Section */}
      <section className="app-section">
        <div className="container">
          <div className="app-content">
            <div className="app-text">
              <h2>Download <br /> our mobile app</h2>
              <p>Book hotels on the go with our mobile app. Available for free on these platforms.</p>
              <div className="app-buttons">
                <button className="app-btn">
                  <Apple size={24} />
                  <div>
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </button>
                <button className="app-btn">
                  <Play size={24} />
                  <div>
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </button>
              </div>
            </div>
            {/* double phone */}
            <div className="download-app-img">
               <img src={downloadApp} alt="download-app Logo" />
            </div>
          </div>
        </div>
      </section>
      {/* <section className="offers">
        <div className="container">
          <div className="offer-content">
            <div className="app-text">
              <h2>Offers<br /> </h2>
              <p>Get amazing discount when you register</p>
            </div>
            <div className="">
              <h2>Offers<br /> </h2>
              <p>Get amazing discount when you register</p>
            </div>
            <div className="">
              <h2>Offers<br /> </h2>
              <p>Get amazing discount when you register</p>
            </div>
            <div className="">
              <h2>Offers<br /> </h2>
              <p>Get amazing discount when you register</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default DownloadApp

