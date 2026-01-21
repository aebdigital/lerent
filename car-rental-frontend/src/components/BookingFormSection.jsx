import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { locationsAPI, carsAPI } from '../services/api';
import CustomDatePicker from './CustomDatePicker';

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    selectedCar: '',
    location: '',
    pickupDate: null,
    returnDate: null,
    notes: ''
  });

  const [locations, setLocations] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Load pickup/dropoff locations from API
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const { locations: locs, defaultLocation } = await locationsAPI.getPickupLocations();
        if (locs && locs.length > 0) {
          console.log('📍 Loaded', locs.length, 'pickup locations for booking form');
          // Use location names for the dropdown
          const locationNames = locs.map(loc => loc.name);
          setLocations(locationNames);

          // Set default location if available
          if (defaultLocation && !formData.location) {
            setFormData(prev => ({
              ...prev,
              location: defaultLocation
            }));
          }
        } else {
          console.warn('⚠️ No locations returned from API, using fallback');
          // Fallback to default options
          setLocations(['Pobočka Nitra']);
        }
      } catch (err) {
        console.error('❌ Error loading pickup locations:', err);
        // Fallback to default options
        setLocations(['Pobočka Nitra']);
      }
    };

    loadLocations();
  }, []);

  // Load all cars from API
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoadingCars(true);
        const response = await carsAPI.getAvailableCars();
        console.log('🚗 Loaded cars for booking form:', response);

        // Handle both array and object response formats
        const carsData = Array.isArray(response) ? response : (response.data || []);

        console.log('🚗 Total cars:', carsData.length);
        setAllCars(carsData);
        setAvailableCars(carsData); // Initially all cars are available
      } catch (err) {
        console.error('❌ Error loading cars:', err);
        setAllCars([]);
        setAvailableCars([]);
      } finally {
        setLoadingCars(false);
      }
    };

    loadCars();
  }, []);

  // When user selects a car, fetch its unavailable dates
  useEffect(() => {
    const fetchCarAvailability = async () => {
      if (!formData.selectedCar) {
        setUnavailableDates([]);
        return;
      }

      try {
        // Get 6 months range for availability check
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);

        const availability = await carsAPI.getCarAvailability(
          formData.selectedCar,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );

        if (availability && availability.unavailableDates) {
          const unavailable = availability.unavailableDates.map(dateStr => new Date(dateStr));
          setUnavailableDates(unavailable);
          console.log('📅 Loaded unavailable dates for car:', unavailable.length);
        }
      } catch (err) {
        console.error('❌ Error fetching car availability:', err);
        setUnavailableDates([]);
      }
    };

    fetchCarAvailability();
  }, [formData.selectedCar]);

  // When user selects dates, filter available cars
  useEffect(() => {
    const filterCarsByDates = async () => {
      if (!formData.pickupDate || !formData.returnDate) {
        // No dates selected, show all cars
        setAvailableCars(allCars);
        return;
      }

      try {
        const startDate = formData.pickupDate.toISOString().split('T')[0];
        const endDate = formData.returnDate.toISOString().split('T')[0];

        // Check availability for each car
        const availabilityChecks = await Promise.all(
          allCars.map(async (car) => {
            try {
              const availability = await carsAPI.getCarAvailability(car._id, startDate, endDate);
              return {
                car,
                isAvailable: availability && availability.isAvailable
              };
            } catch (err) {
              console.error(`Error checking availability for car ${car._id}:`, err);
              return { car, isAvailable: false };
            }
          })
        );

        // Filter to only available cars
        const available = availabilityChecks
          .filter(check => check.isAvailable)
          .map(check => check.car);

        setAvailableCars(available);
        console.log('🚗 Filtered to', available.length, 'available cars for selected dates');

        // If selected car is not available, clear selection
        if (formData.selectedCar && !available.find(car => car._id === formData.selectedCar)) {
          setFormData(prev => ({ ...prev, selectedCar: '' }));
        }
      } catch (err) {
        console.error('❌ Error filtering cars by dates:', err);
        setAvailableCars(allCars);
      }
    };

    filterCarsByDates();
  }, [formData.pickupDate, formData.returnDate, allCars]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateSelect = (field, date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If a car is selected, navigate to reservation page with pre-filled data
    if (formData.selectedCar) {
      const selectedCarObj = allCars.find(car => car._id === formData.selectedCar);
      const carName = selectedCarObj ? `${selectedCarObj.brand} ${selectedCarObj.model}` : '';

      const queryParams = new URLSearchParams({
        carId: formData.selectedCar,
        carName: carName,
        ...(formData.pickupDate && { pickupDate: formData.pickupDate.toISOString() }),
        ...(formData.returnDate && { returnDate: formData.returnDate.toISOString() }),
        ...(formData.location && { pickupLocation: formData.location, returnLocation: formData.location })
      });

      navigate(`/booking?${queryParams.toString()}`);
    } else {
      // No car selected, just log for now
      console.log('Form submitted without car selection:', formData);
      alert('Prosím vyberte auto');
    }
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

          {/* Date pickers - on one line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Dátum vyzdvihnutia</label>
              <CustomDatePicker
                selectedDate={formData.pickupDate}
                onDateSelect={(date) => handleDateSelect('pickupDate', date)}
                minDate={new Date()}
                unavailableDates={unavailableDates}
                placeholder="Vyberte dátum"
                otherSelectedDate={formData.returnDate}
                isReturnPicker={false}
                onOtherDateReset={() => handleDateSelect('returnDate', null)}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Dátum vrátenia</label>
              <CustomDatePicker
                selectedDate={formData.returnDate}
                onDateSelect={(date) => handleDateSelect('returnDate', date)}
                minDate={formData.pickupDate ? new Date(formData.pickupDate.getTime() + 86400000 * 2) : new Date()}
                unavailableDates={unavailableDates}
                placeholder="Vyberte dátum"
                otherSelectedDate={formData.pickupDate}
                isReturnPicker={true}
              />
            </div>
          </div>

          {/* Vyber auta - full width */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Vyberte auto
              {formData.pickupDate && formData.returnDate && (
                <span className="ml-2 text-xs text-gray-400">
                  ({availableCars.length} dostupných)
                </span>
              )}
            </label>
            <select
              name="selectedCar"
              value={formData.selectedCar}
              onChange={handleInputChange}
              disabled={loadingCars}
              className="w-full text-white px-4 py-3 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none disabled:opacity-50"
              style={{backgroundColor: '#191919', borderColor: '#0a0a0a'}}
            >
              <option value="">
                {loadingCars ? 'Načítavam autá...' : 'Vyberte auto'}
              </option>
              {availableCars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.brand} {car.model} - od {car.pricing?.dailyRate || car.dailyRate || 0}€/deň
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
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
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