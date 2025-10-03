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
import AudiA6Img from '../audia6.JPG';
import BMW540iImg from '../bmw540i.png';
import AudiS4Img from '../audis4.webp';
import AudiS6Img from '../audis6.JPG';
import MaseratiImg from '../maseratilevante.JPG';
import BMW840iImg from '../bmw840i.png';
import BMWX7Img from '../bmwx7.JPG';
import VideoIcon from '../video_orange.png';

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
    'audi-a6': AudiA6Img,
    'bmw-540i-xdrive': BMW540iImg,
    'audi-s4': AudiS4Img,
    'audi-s6': AudiS6Img,
    'maserati-levante': MaseratiImg,
    'bmw-840i-xdrive': BMW840iImg,
    'bmw-x7-xdrive-40d': BMWX7Img
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
      image: AudiA6Img,
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
      image: BMW540iImg,
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
      image: AudiS4Img,
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
      image: AudiS6Img,
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
      image: MaseratiImg,
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
      image: BMW840iImg,
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
      image: BMWX7Img,
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

  // Force navbar to be black on mobile for car details page
  useEffect(() => {
    // Add a class to body to signal the header should be black on mobile
    document.body.classList.add('force-black-header-mobile');
    return () => {
      document.body.classList.remove('force-black-header-mobile');
    };
  }, []);

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
      <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
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
      <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
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
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000', fontFamily: 'AvantGarde, sans-serif'}}>
      {/* Hero Section - Desktop Only */}
      <div className="hidden lg:block">
        <div
          className="relative w-full h-[100vh] bg-cover bg-center flex items-end"
          style={{
            backgroundImage: `url(${getCarImage(car)})`
          }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(16, 16, 16, 0.00) 70%, #101010 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)'
          }}></div>

          {/* Video Button - Bottom Left */}
          <div className="absolute bottom-[10%] left-16 z-10">
            <button className="bg-black bg-opacity-50 hover:bg-opacity-70 p-4 rounded-full transition-all duration-200">
              <img src={VideoIcon} alt="Video" className="w-8 h-8" />
            </button>
          </div>

          {/* Car Title - Middle Bottom */}
          <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 z-10">
            <h1 className="text-6xl font-bold text-white font-goldman drop-shadow-lg text-center">
              {car.brand} {car.model}
            </h1>
          </div>


          {/* Rezervovat Button - Bottom Right */}
          <div className="absolute bottom-[10%] right-16 z-10">
            <button
              onClick={scrollToBooking}
              className="hover:opacity-90 px-8 py-3 font-bold text-lg transition-colors"
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
        </div>
      </div>

      {/* Gallery Section - Mobile: Single Clickable Photo, Desktop: 6 Photos Grid */}
      <div className="w-full">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Image - 99% width with top padding for navbar */}
          <div className="px-[0.5%] pt-24">
            <div
              className="aspect-[16/9] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(0);
                setShowImageModal(true);
              }}
            >
              <img
                src={getCarImage(car)}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile Car Info Section */}
          <div className="px-4 py-6">
            {/* Car Title */}
            <h1 className="text-4xl font-bold text-white font-goldman mb-6">
              {car.brand} {car.model}
            </h1>

            {/* Buttons Row */}
            <div className="flex items-center justify-between mb-6">
              {/* Video Button */}
              <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full transition-colors duration-200">
                <img src={VideoIcon} alt="Video" className="w-6 h-6" />
              </button>

              {/* Rezervovat Button */}
              <button
                onClick={scrollToBooking}
                className="hover:opacity-90 px-6 py-3 font-bold text-base transition-colors"
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
          </div>
        </div>

        {/* Desktop Gallery - Full Width Thumbnails in a Row */}
        <div className="hidden lg:block w-full py-6">
          <div className="grid grid-cols-6 gap-4 px-4">
            {/* Generate gallery photos */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-200"
                onClick={() => {
                  setCurrentImageIndex(index - 1);
                  setShowImageModal(true);
                }}
              >
                <img
                  src={getCarImage(car)}
                  alt={`${car.brand} ${car.model} - Photo ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Show All Button - Last thumbnail with overlay */}
            <div
              className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer relative hover:opacity-75 transition-opacity duration-200"
              onClick={() => {
                setCurrentImageIndex(0);
                setShowImageModal(true);
              }}
            >
              <img
                src={getCarImage(car)}
                alt={`${car.brand} ${car.model} - More photos`}
                className="w-full h-full object-cover"
              />
              {/* Transparent overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-semibold">+6</div>
                  <div className="text-sm">Zobraziť všetky</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Specs Section - Mobile: 3x2 Grid, Desktop: Horizontal Row */}
      <div className="w-full py-8" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Specs */}
          <div className="lg:hidden grid grid-cols-3 gap-1">
            <div className="flex flex-col items-center text-center">
              <BoltIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs text-gray-300">Výkon</div>
                <div className="font-semibold text-xs text-white">{car.power}</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <GlobeAltIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs text-gray-300">Palivo</div>
                <div className="font-semibold text-xs text-white">{car.fuelType}</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <CogIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs text-gray-300">Spotreba</div>
                <div className="font-semibold text-xs text-white">5 l/100km</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <UsersIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs text-gray-300">Prevodovka</div>
                <div className="font-semibold text-xs text-white">{car.transmission}</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <CalendarIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs text-gray-300">Rok</div>
                <div className="font-semibold text-xs text-white">{car.year}</div>
              </div>
            </div>
          </div>

          {/* Desktop Specs - Horizontal Row */}
          <div className="hidden lg:grid lg:grid-cols-5 lg:gap-8">
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <BoltIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Výkon</div>
                <div className="font-semibold text-base text-white">{car.power}</div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <GlobeAltIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Palivo</div>
                <div className="font-semibold text-base text-white">{car.fuelType}</div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <CogIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Spotreba</div>
                <div className="font-semibold text-base text-white">5 l/100km</div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <UsersIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Prevodovka</div>
                <div className="font-semibold text-base text-white">{car.transmission}</div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <CalendarIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Rok</div>
                <div className="font-semibold text-base text-white">{car.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Mobile Content Order: Prenájom, Cenník, Popis */}
        <div className="lg:hidden space-y-8">
          {/* Mobile Booking Form */}
          <div id="booking-section" className="rounded-lg p-6 shadow-lg border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
            <h2 className="text-2xl font-semibold text-white mb-6">Prenájom</h2>

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
              <div className="rounded-lg p-4 space-y-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <div className="flex justify-between">
                  <span className="text-gray-300">Depozit:</span>
                  <span className="font-semibold text-white">{getDeposit().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between pt-4 mt-4" style={{borderTop: '1px solid rgba(107, 114, 128, 0.3)'}}>
                  <span className="text-white font-semibold text-2xl">Cena:</span>
                  <span className="font-semibold text-[rgb(250,146,8)] text-2xl">{(calculatePrice() + getKmPackagePrice()).toFixed(2)}€</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full mt-6 hover:opacity-90 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                style={{
                  backgroundColor: '#fa9208',
                  color: '#191919'
                }}
                disabled={car.status !== 'available'}
              >
                {car.status === 'available' ? 'Pokračovať v objednávke' : 'Momentálne nedostupné'}
              </button>
            </div>
          </div>

          {/* Mobile Pricing Table */}
          <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
            <h3 className="text-xl font-semibold text-white mb-4">Cenník prenájmu</h3>

            <div className="divide-y divide-gray-800">
              <div className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-white">1-2 dni</span>
                  <span className="text-[rgb(250,146,8)] font-semibold text-right">45€</span>
                </div>
              </div>

              <div className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-white">3-6 dní</span>
                  <span className="text-[rgb(250,146,8)] font-semibold text-right">40€</span>
                </div>
              </div>

              <div className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-white">7-13 dní</span>
                  <span className="text-[rgb(250,146,8)] font-semibold text-right">35€</span>
                </div>
              </div>

              <div className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-white">14-20 dní</span>
                  <span className="text-[rgb(250,146,8)] font-semibold text-right">30€</span>
                </div>
              </div>

              <div className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-white">21-27 dní</span>
                  <span className="text-[rgb(250,146,8)] font-semibold text-right">28€</span>
                </div>
              </div>

              <div className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-white">28+ dní</span>
                  <span className="text-[rgb(250,146,8)] font-semibold text-right">25€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Car Description */}
          <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
            <h2 className="text-2xl font-semibold text-white mb-4">Popis</h2>
            <div className="text-gray-300 leading-relaxed">
              {car.description || getCarDescription(car.brand, car.model)}
            </div>
          </div>
        </div>

        {/* Desktop Two-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Left Column - Cenník */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing Table */}
            <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <h3 className="text-xl font-semibold text-white mb-4">Cenník prenájmu</h3>

              <div className="divide-y divide-gray-800">
                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">1-2 dni</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">45€</span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">3-6 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">40€</span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">7-13 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">35€</span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">14-20 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">30€</span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">21-27 dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">28€</span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">28+ dní</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">25€</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Rezervovat and Popis */}
          <div className="lg:col-span-1 space-y-6">
            {/* Desktop Booking Form */}
            <div className="rounded-lg p-6 shadow-lg border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <h2 className="text-2xl font-semibold text-white mb-6">Rezervovať</h2>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-1 gap-4">
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
                <div className="rounded-lg p-4 space-y-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Depozit:</span>
                    <span className="font-semibold text-white">{getDeposit().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between pt-4 mt-4" style={{borderTop: '1px solid rgba(107, 114, 128, 0.3)'}}>
                    <span className="text-white font-semibold text-2xl">Cena:</span>
                    <span className="font-semibold text-[rgb(250,146,8)] text-2xl">{(calculatePrice() + getKmPackagePrice()).toFixed(2)}€</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  className="w-full mt-6 hover:opacity-90 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: '#fa9208',
                    color: '#191919'
                  }}
                  disabled={car.status !== 'available'}
                >
                  {car.status === 'available' ? 'Pokračovať v objednávke' : 'Momentálne nedostupné'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Car Description - Full Width */}
        <div className="hidden lg:block mt-8">
          <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
            <h2 className="text-2xl font-semibold text-white mb-4">Popis</h2>
            <div className="text-gray-300 leading-relaxed">
              {car.description || getCarDescription(car.brand, car.model)}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection />

        {/* Additional Shared Sections */}
        <ContactMapSection />
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : 5)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Main Image */}
            <div className="max-w-full max-h-full">
              <img
                src={getCarImage(car)}
                alt={`${car.brand} ${car.model} - Photo ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev < 5 ? prev + 1 : 0)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / 6
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-white' : 'border-transparent opacity-70'
                  }`}
                >
                  <img
                    src={getCarImage(car)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage; 