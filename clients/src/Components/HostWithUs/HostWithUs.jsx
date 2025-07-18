import React from 'react'
import './HostWithUs.css'
import { Link } from 'react-router-dom';
// import image from './Assets/image.png'; 



const HostWithUs = () => {

  return (
    <section className="hosting-section">
    <div className="container">
        <div className="hosting-content">
        <div className="hosting-text">
            <h2>Try Hosting With Us</h2>
            <p>Learn about us and join hundreds of hotel owners to register their hotels for users to see</p>
            <Link to='/about'>
                <button className="hosting-btn">Learn More</button>
            </Link>
        </div>
        <div className="hosting-image">
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop" alt="Hosting" />            
        </div>
        </div>
    </div>
    </section>
  )
}

export default HostWithUs