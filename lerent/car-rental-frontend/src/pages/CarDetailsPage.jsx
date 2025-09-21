import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BoltIcon, 
  GlobeAltIcon, 
  CogIcon, 
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import CarImage from '../components/CarImage';
import DatePicker from '../components/DatePicker';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';
import { carsAPI } from '../services/api';
import HeroImg from '../test.png';

// Function to get car images based on car ID or brand/model
const getCarImage = (car) => {
  if (!car) return HeroImg;
  
  // Check if car already has an image property
  if (car.image) return car.image;
  
  // Check if car has images array (from API)
  if (car.images && car.images.length > 0) {
    return car.images[0].url;
  }
  
  // Map car IDs to specific images (matching HomePage data)
  const carImageMap = {
    'audi-a6': '/src/audia6.JPG',
    'bmw-540i-xdrive': '/src/bmw540i.png',
    'audi-s4': '/src/audis4.webp',
    'audi-s6': '/src/audis6.JPG',
    'maserati-levante': '/src/maseratilevante.JPG',
    'bmw-840i-xdrive': '/src/bmw840i.png',
    'bmw-x7-xdrive-40d': '/src/bmwx7.JPG'
  };
  
  // Try to match by car ID
  if (car._id && carImageMap[car._id]) {
    return carImageMap[car._id];
  }
  
  // Try to match by brand and model
  const brand = car.brand ? car.brand.toUpperCase() : '';
  const model = car.model ? car.model.toUpperCase() : '';
  
  if (brand.includes('AUDI') && model.includes('A6')) return '/src/audia6.JPG';
  if (brand.includes('BMW') && model.includes('540')) return '/src/bmw540i.png';
  if (brand.includes('AUDI') && model.includes('S4')) return '/src/audis4.webp';
  if (brand.includes('AUDI') && model.includes('S6')) return '/src/audis6.JPG';
  if (brand.includes('MASERATI')) return '/src/maseratilevante.JPG';
  if (brand.includes('BMW') && model.includes('840')) return '/src/bmw840i.png';
  if (brand.includes('BMW') && model.includes('X7')) return '/src/bmwx7.JPG';
  
  // Default fallback
  return HeroImg;
};

// Function to get car descriptions
const getCarDescription = (brand, model) => {
  const carDescriptions = {
    'AUDI A6': 'Elegantná a výkonná limuzína, ktorá kombinuje luxus s pokročilou technológiou. Audi A6 ponúka výnimočný komfort jazdy a vynikajúcu dynamiku. Ideálne pre obchodné cesty aj osobné potreby.',
    'BMW 540I XDRIVE': 'Športová limuzína s pohonom všetkých kolies, ktorá poskytuje výnimočný zážitok z jazdy. BMW 540i xDrive je dokonalou kombináciou výkonu, luxusu a najnovších technológií.',
    'AUDI S4': 'Vysoko výkonné kombi s pokročilým pohonom quattro. Audi S4 je ideálne pre tých, ktorí potrebujú priestor aj adrenalín. Kombinuje praktickosť rodinného auta s výkonom športového vozidla.',
    'AUDI S6': 'Prémiové kombi s výnimočným výkonom a priestorom. Audi S6 predstavuje vrchol v segmente športových rodinných vozidiel, ponúkajúc luxus a funkcionalitu v jednom.',
    'MASERATI LEVANTE': 'Luxusné SUV s talianskym štýlom a výnimočným výkonom. Maserati Levante kombinuje eleganciu, športovosť a praktickosť. Ideálne pre tých, ktorí si cenia výnimočnosť.',
    'BMW 840I XDRIVE': 'Elegantné kupé s pokročilou technológiou a výnimočným dizajnom. BMW 840i xDrive poskytuje jedinečný zážitok z jazdy s prvkami luxusu a športovosti.',
    'BMW X7 XDRIVE 40D': 'Luxusné SUV s priestorom pre celú rodinu. BMW X7 ponúka maximálny komfort, najnovšie technológie a výnimočnú kvalitu prevedenia. Ideálne pre dlhé cesty a náročných klientov.'
  };
  
  const key = `${brand} ${model}`.toUpperCase();
  return carDescriptions[key] || 'Kvalitné vozidlo s vynikajúcimi jazdnými vlastnosťami a modernou výbavou. Ideálne pre pohodlné a bezpečné cestovanie.';
};

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    returnLocation: '',
    pickupDate: null,
    returnDate: null,
    pickupTime: '08:00',
    returnTime: '08:00',
    allowedKm: 200,
    kmPackage: null
  });

  const [customLocation, setCustomLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [distance, setDistance] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [calculating, setCalculating] = useState(false);

  const locations = [
    'Pobočka Nitra',
    'Vybrať miesto'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  // Static car data matching HomePage
  const staticCarsData = [
    {
      _id: 'audi-a6',
      brand: 'AUDI',
      model: 'A6',
      fullName: 'AUDI A6',
      dailyRate: 90,
      power: '250kW',
      transmission: '4x4',
      bodyType: 'Sedan',
      fuelType: 'Benzín',
      image: '/src/audia6.JPG',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'heated-seats']
    },
    {
      _id: 'bmw-540i-xdrive',
      brand: 'BMW',
      model: '540i xDrive',
      fullName: 'BMW 540I XDRIVE',
      dailyRate: 90,
      power: '250kW',
      transmission: '4x4',
      bodyType: 'Sedan',
      fuelType: 'Benzín',
      image: '/src/bmw540i.png',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'sport-package']
    },
    {
      _id: 'audi-s4',
      brand: 'AUDI',
      model: 'S4',
      fullName: 'AUDI S4',
      dailyRate: 90,
      power: '255kW',
      transmission: '4x4',
      bodyType: 'Kombi',
      fuelType: 'Nafta',
      image: '/src/audis4.webp',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'quattro']
    },
    {
      _id: 'audi-s6',
      brand: 'AUDI',
      model: 'S6',
      fullName: 'AUDI S6',
      dailyRate: 100,
      power: '255kW',
      transmission: '4x4',
      bodyType: 'Kombi',
      fuelType: 'Nafta',
      image: '/src/audis6.JPG',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'quattro', 'sport-package']
    },
    {
      _id: 'maserati-levante',
      brand: 'MASERATI',
      model: 'Levante',
      fullName: 'MASERATI LEVANTE',
      dailyRate: 130,
      power: '316kW',
      transmission: '4x4',
      bodyType: 'SUV',
      fuelType: 'Benzín',
      image: '/src/maseratilevante.JPG',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'leather-seats', 'premium-sound']
    },
    {
      _id: 'bmw-840i-xdrive',
      brand: 'BMW',
      model: '840i xDrive',
      fullName: 'BMW 840I XDRIVE',
      dailyRate: 140,
      power: '250kW',
      transmission: '4x4',
      bodyType: 'Sedan',
      fuelType: 'Benzín',
      image: '/src/bmw840i.png',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'sport-package', 'premium-sound']
    },
    {
      _id: 'bmw-x7-xdrive-40d',
      brand: 'BMW',
      model: 'X7 xDrive 40d',
      fullName: 'BMW X7 XDRIVE 40D',
      dailyRate: 200,
      power: '259kW',
      transmission: '4x4',
      bodyType: 'SUV',
      fuelType: 'Nafta',
      image: '/src/bmwx7.JPG',
      year: 2024,
      status: 'available',
      features: ['air-conditioning', 'gps', 'bluetooth', 'leather-seats', '7-seats', 'premium-sound']
    }
  ];

  useEffect(() => {
    const loadCarDetails = async () => {
      try {
        setLoading(true);
        // Use static data instead of API
        const carData = staticCarsData.find(car => car._id === id) || staticCarsData[0];
        setCar(carData);
        
        // Load availability
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);
        
        try {
          const availability = await carsAPI.getCarAvailability(id, startDate, endDate);
          setUnavailableDates(availability.unavailableDates || []);
        } catch (err) {
          console.warn('Could not load availability:', err);
        }
      } catch (err) {
        setError('Nepodarilo sa načítať detaily vozidla');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCarDetails();
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Show location input when "Vybrať miesto" is selected
    if (field === 'pickupLocation' && value === 'Vybrať miesto') {
      setShowLocationInput(true);
    } else if (field === 'pickupLocation' && value !== 'Vybrať miesto') {
      setShowLocationInput(false);
      setCustomLocation('');
      setDistance(null);
      setDeliveryPrice(0);
    }
  };

  // Calculate distance using Google Maps API
  const calculateDistance = async (destination) => {
    if (!destination || destination.trim() === '') {
      setDistance(null);
      setDeliveryPrice(0);
      return;
    }

    setCalculating(true);
    try {
      const service = new window.google.maps.DistanceMatrixService();
      const origin = 'Novozámocká 138, Horné Krškany, 949 05 Nitra, Slovakia';
      
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
          const distanceKm = response.rows[0].elements[0].distance.value / 1000;
          setDistance(distanceKm);
          // Calculate delivery price: 0.13€ per km for the round trip
          const price = Math.round(distanceKm * 2 * 0.13 * 100) / 100;
          setDeliveryPrice(price);
        } else {
          setDistance(null);
          setDeliveryPrice(0);
        }
        setCalculating(false);
      });
    } catch (error) {
      console.error('Error calculating distance:', error);
      setDistance(null);
      setDeliveryPrice(0);
      setCalculating(false);
    }
  };

  // Handle custom location input change
  const handleCustomLocationChange = (value) => {
    setCustomLocation(value);
    // Debounce the API call
    clearTimeout(window.locationTimeout);
    window.locationTimeout = setTimeout(() => {
      calculateDistance(value);
    }, 1000);
  };

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleKmPackageChange = (packageValue) => {
    setBookingData(prev => ({
      ...prev,
      kmPackage: prev.kmPackage === packageValue ? null : packageValue
    }));
  };

  const calculatePrice = () => {
    if (!car || !bookingData.pickupDate || !bookingData.returnDate) return 0;
    const days = Math.ceil((bookingData.returnDate - bookingData.pickupDate) / (1000 * 60 * 60 * 24));
    const basePrice = car.dailyRate * days;
    return basePrice + deliveryPrice;
  };

  const getKmPackagePrice = () => {
    if (!bookingData.kmPackage) return 0;
    switch (bookingData.kmPackage) {
      case '500': return 65;
      case '1000': return 120;
      case '2000': return 200;
      default: return 0;
    }
  };

  const getDeposit = () => {
    if (!car) return 0;
    return car.deposit || 1000;
  };

  const scrollToBooking = () => {
    const bookingElement = document.getElementById('booking-section');
    if (bookingElement) {
      const offsetTop = bookingElement.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleBookNow = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) {
      alert('Prosím vyberte dátum prevzatia a vrátenia vozidla');
      return;
    }
    
    const queryParams = new URLSearchParams({
      car: id,
      pickupDate: bookingData.pickupDate.toISOString().split('T')[0],
      returnDate: bookingData.returnDate.toISOString().split('T')[0]
    });
    
    navigate(`/booking?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Mini Hero Section */}
        <div 
          className="relative h-[30vh] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${HeroImg})`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
          </div>
        </div>

        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Načítavajú sa detaily vozidla...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Mini Hero Section */}
        <div 
          className="relative h-[30vh] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${HeroImg})`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
          </div>
        </div>

        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Vozidlo sa nenašlo</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => navigate('/fleet')}>
              Späť na flotilu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black" style={{fontFamily: 'AvantGarde, sans-serif'}}>
      {/* Hero Section - Full Width Car Photo */}
      <div 
        className="relative w-full h-[50vh] lg:h-[100vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `url(${getCarImage(car)})`
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Car Title - Bottom Left */}
        <div className="absolute bottom-[10%] left-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white font-goldman drop-shadow-lg">
            {car.brand} {car.model}
          </h1>
        </div>
        
        {/* YouTube Icon - Middle Bottom */}
        <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 z-10">
          <button className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors duration-200">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </button>
        </div>
        
        {/* Rezervovat Button - Bottom Right */}
        <div className="absolute bottom-[10%] right-[10%] z-10">
          <button
            onClick={scrollToBooking}
            className="text-black hover:opacity-90 px-8 py-3 font-bold text-lg transition-colors"
            style={{
              clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
              borderRadius: '0px',
              backgroundColor: '#fa9208'
            }}
          >
            Rezervovať
          </button>
        </div>
      </div>

      {/* Gallery Section - Single Photo with Navigation */}
      <div className="w-full">
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img 
              src={getCarImage(car)} 
              alt={`${car.brand} ${car.model}`} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Navigation arrows - inside the photo */}
          <button className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            1 / 6
          </div>
        </div>
      </div>

      {/* Car Specs Section - 3x2 Grid */}
      <div className="w-full py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-1 lg:gap-4">
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:space-x-3 lg:bg-white lg:p-4 lg:rounded-lg lg:shadow-sm lg:text-left">
              <BoltIcon className="h-4 w-4 lg:h-6 lg:w-6 text-[rgb(250,146,8)] flex-shrink-0 mb-1 lg:mb-0" />
              <div>
                <div className="text-xs lg:text-sm text-gray-600">Výkon</div>
                <div className="font-semibold text-xs lg:text-base">110 kW</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:space-x-3 lg:bg-white lg:p-4 lg:rounded-lg lg:shadow-sm lg:text-left">
              <GlobeAltIcon className="h-4 w-4 lg:h-6 lg:w-6 text-[rgb(250,146,8)] flex-shrink-0 mb-1 lg:mb-0" />
              <div>
                <div className="text-xs lg:text-sm text-gray-600">Palivo</div>
                <div className="font-semibold text-xs lg:text-base">{car.fuelType}</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:space-x-3 lg:bg-white lg:p-4 lg:rounded-lg lg:shadow-sm lg:text-left">
              <CogIcon className="h-4 w-4 lg:h-6 lg:w-6 text-[rgb(250,146,8)] flex-shrink-0 mb-1 lg:mb-0" />
              <div>
                <div className="text-xs lg:text-sm text-gray-600">Spotreba</div>
                <div className="font-semibold text-xs lg:text-base">5 l/100km</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:space-x-3 lg:bg-white lg:p-4 lg:rounded-lg lg:shadow-sm lg:text-left">
              <UsersIcon className="h-4 w-4 lg:h-6 lg:w-6 text-[rgb(250,146,8)] flex-shrink-0 mb-1 lg:mb-0" />
              <div>
                <div className="text-xs lg:text-sm text-gray-600">Prevodovka</div>
                <div className="font-semibold text-xs lg:text-base">{car.transmission}</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:space-x-3 lg:bg-white lg:p-4 lg:rounded-lg lg:shadow-sm lg:text-left">
              <CalendarIcon className="h-4 w-4 lg:h-6 lg:w-6 text-[rgb(250,146,8)] flex-shrink-0 mb-1 lg:mb-0" />
              <div>
                <div className="text-xs lg:text-sm text-gray-600">Rok</div>
                <div className="font-semibold text-xs lg:text-base">{car.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section - After Specs */}
      <div className="w-full px-4 py-8 bg-white">
        <div className="max-w-2xl mx-auto lg:max-w-4xl">
          <div id="booking-section" className="rounded-lg p-6 shadow-lg bg-white border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-black mb-6">Prenájom</h2>
            
            <div className="space-y-4">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    selectedDate={bookingData.pickupDate}
                    onDateSelect={(date) => handleInputChange('pickupDate', date)}
                    minDate={new Date()}
                    unavailableDates={unavailableDates}
                    carId={id}
                    className="w-full"
                  />
                </div>
                <div>
                  <DatePicker
                    selectedDate={bookingData.returnDate}
                    onDateSelect={(date) => handleInputChange('returnDate', date)}
                    minDate={bookingData.pickupDate ? new Date(bookingData.pickupDate.getTime() + 86400000) : new Date()}
                    unavailableDates={unavailableDates}
                    carId={id}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Pricing Information */}
              <div className="rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-gray-600">Depozit:</span>
                  <span className="font-semibold text-black">{getDeposit().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between pt-4 mt-4" style={{borderTop: '1px solid rgba(107, 114, 128, 0.3)'}}>
                  <span className="text-black font-semibold text-2xl">Cena:</span>
                  <span className="font-semibold text-[rgb(250,146,8)] text-2xl">{(calculatePrice() + getKmPackagePrice()).toFixed(2)}€</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full mt-6 bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                disabled={car.status !== 'available'}
              >
                {car.status === 'available' ? 'Dokončiť objednávku' : 'Momentálne nedostupné'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Pricing */}
          <div className="lg:col-span-1">



            {/* Pricing Table */}
            <div className="rounded-lg p-6 mb-6 bg-white border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-black mb-4">Cenník prenájmu</h3>
              
              <div className="divide-y divide-gray-200">
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">1-2 dni</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">45€</span>
                  </div>
                </div>
                
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">3-6 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">40€</span>
                  </div>
                </div>
                
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">7-13 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">35€</span>
                  </div>
                </div>
                
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">14-20 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">30€</span>
                  </div>
                </div>
                
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">21-27 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">28€</span>
                  </div>
                </div>
                
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-600">28+ dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">25€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="rounded-lg p-6 bg-white border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-black mb-4">Výbava auta</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[rgb(250,146,8)] rounded-full"></div>
                      <span className="text-gray-600 capitalize">{feature.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Car Description */}
          <div className="lg:col-span-1">
            <div className="rounded-lg p-6 bg-white border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-black mb-4">Popis</h2>
              <div className="text-gray-600 leading-relaxed">
                {car.description || getCarDescription(car.brand, car.model)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewsSection />
        
        {/* Additional Shared Sections */}
        <ContactMapSection />
        <BookingFormSection />
      </div>
    </div>
  );
};

export default CarDetailsPage; 