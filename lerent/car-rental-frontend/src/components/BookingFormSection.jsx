import React, { useState, useRef } from 'react';
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

const BookingFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    selectedCar: '',
    location: '',
    notes: ''
  });

  // Available cars list
  const availableCars = [
    { id: 'audi-a6', name: 'AUDI A6', price: 90 },
    { id: 'bmw-540i-xdrive', name: 'BMW 540I XDRIVE', price: 90 },
    { id: 'audi-s4', name: 'AUDI S4', price: 90 },
    { id: 'audi-s6', name: 'AUDI S6', price: 100 },
    { id: 'maserati-levante', name: 'MASERATI LEVANTE', price: 130 },
    { id: 'bmw-840i-xdrive', name: 'BMW 840I XDRIVE', price: 140 },
    { id: 'bmw-x7-xdrive-40d', name: 'BMW X7 XDRIVE 40D', price: 200 }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section id="booking" className="py-24" style={{backgroundColor: '#000000'}}>
      <div className="max-w-6xl mx-auto px-4">
        <FadeInUp>
          <h2 className="text-4xl md:text-5xl font-medium text-white text-center mb-12 font-goldman">
            RÝCHLA REZERVÁCIA AUTA
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meno - full width */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Meno</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Peter Novák"
              className="w-full text-white px-4 py-3 rounded-lg border border-gray-900 focus:border-orange-500 focus:outline-none"
              style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
            />
          </div>
          
          {/* Telefon and Email on one line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Váš telefón</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+421"
                className="w-full text-white px-4 py-3 rounded-lg border border-gray-900 focus:border-orange-500 focus:outline-none"
                style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="meno@gmail.com"
                className="w-full text-white px-4 py-3 rounded-lg border border-gray-900 focus:border-orange-500 focus:outline-none"
                style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
              />
            </div>
          </div>

          {/* Vyber auta - full width */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Vyberte auto</label>
            <select
              name="selectedCar"
              value={formData.selectedCar}
              onChange={handleInputChange}
              className="w-full text-white px-4 py-3 rounded-lg border border-gray-900 focus:border-orange-500 focus:outline-none appearance-none"
              style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
            >
              <option value="">Vyberte auto</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} - od {car.price}€/deň
                </option>
              ))}
            </select>
          </div>

          {/* Miesto vyzdvihnutia - full width */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Miesto vyzdvihnutia</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full text-white px-4 py-3 rounded-lg border border-gray-900 focus:border-orange-500 focus:outline-none appearance-none"
              style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
            >
              <option value="">Vyberte možnosť</option>
              <option value="nitra">Nitra</option>
              <option value="bratislava">Bratislava</option>
              <option value="kosice">Košice</option>
            </select>
          </div>
          
          {/* Poznamka - full width */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Poznámka</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Zadajte tu..."
              rows={4}
              className="w-full text-white px-4 py-3 rounded-lg border border-gray-900 focus:border-orange-500 focus:outline-none resize-none"
              style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
            ></textarea>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="hover:opacity-90 px-12 py-3 font-bold text-lg transition-colors"
              style={{
                clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                borderRadius: '0px',
                backgroundColor: '#fa9208',
                color: '#191919'
              }}
            >
              Rezervovať
            </button>
          </div>
          </form>
        </FadeInUp>
      </div>
    </section>
  );
};

export default BookingFormSection;