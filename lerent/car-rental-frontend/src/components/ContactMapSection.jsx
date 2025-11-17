import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Fade In Up Animation Component
const FadeInUp = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ContactMapSection = () => {
  return (
    <section id="contact" className="py-24" style={{backgroundColor: '#000000'}}>
      <div className="max-w-7xl mx-auto px-4">
        <FadeInUp>
          <h2 className="text-4xl md:text-5xl font-medium text-white text-center mb-4 font-goldman">
            AKO SA K NÁM DOSTAŤ
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="flex items-center justify-center space-x-3 text-white p-4 rounded-lg" style={{background: 'linear-gradient(143deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)'}}>
              <svg className="w-6 h-6" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span className="font-medium">+421 905 318 164</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white p-4 rounded-lg" style={{background: 'linear-gradient(143deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)'}}>
              <svg className="w-6 h-6" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span className="font-medium">info@lerent.sk</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white p-4 rounded-lg" style={{background: 'linear-gradient(143deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)'}}>
              <svg className="w-6 h-6" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="font-medium">Bratislavská 9, Nitra</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white p-4 rounded-lg" style={{background: 'linear-gradient(143deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)'}}>
              <svg className="w-6 h-6" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span className="font-medium">Po - Pia od 8:00 do 17:00</span>
            </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <div className="h-96 overflow-hidden" style={{backgroundColor: '#000000'}}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2596.325896779728!2d18.110927!3d48.3174613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b3f0017a7734b%3A0x5b52f8d9b7ea2f1!2sLeRent!5e0!3m2!1sen!2ssk!4v1699999999999!5m2!1sen!2ssk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="LeRent - Bratislavská 9, Nitra"
          ></iframe>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default ContactMapSection;