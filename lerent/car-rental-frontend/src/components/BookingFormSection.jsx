import React, { useState } from 'react';

const BookingFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    notes: ''
  });

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
    <section id="booking" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12 font-goldman">
          ZAREZERVUJTE SI AUTO
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meno - full width */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Meno</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Janko Hraško"
              className="w-full bg-white text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none"
            />
          </div>
          
          {/* Telefon and Email on one line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black text-sm font-medium mb-2">Váš telefón</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+421"
                className="w-full bg-white text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black text-sm font-medium mb-2">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="janko@hrasko.sk"
                className="w-full bg-white text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          
          {/* Miesto vyzdvihnutia - full width */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Miesto vyzdvihnutia</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-white text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none appearance-none"
            >
              <option value="">Vyberte možnosť</option>
              <option value="nitra">Nitra</option>
              <option value="bratislava">Bratislava</option>
              <option value="kosice">Košice</option>
            </select>
          </div>
          
          {/* Poznamka - full width */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Poznámka</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Zadajte tu..."
              rows={4}
              className="w-full bg-white text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none resize-none"
            ></textarea>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="text-black hover:opacity-90 text-black px-12 py-3 font-bold text-lg transition-colors"
              style={{
                clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                borderRadius: '0px',
                backgroundColor: '#fa9208'
              }}
            >
              Rezervovať
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingFormSection;