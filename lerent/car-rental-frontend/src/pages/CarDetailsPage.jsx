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
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../components/Button';
import CarImage from '../components/CarImage';
import DatePicker from '../components/DatePicker';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';
import { carsAPI, locationsAPI } from '../services/api';
import HeroImg from '../test.png';
import AudiA6Img from '../audia6.JPG';
import BMW540iImg from '../bmw540i.png';
import AudiS4Img from '../audis4.webp';
import AudiS6Img from '../audis6.JPG';
import MaseratiImg from '../maseratilevante.JPG';
import BMW840iImg from '../bmw840i.png';
import BMWX7Img from '../bmwx7.JPG';
import VideoIcon from '../video_orange.png';

// Function to get all car images from API or fallbacks
const getCarImages = (car) => {
  if (!car) return [HeroImg];

  // If car has images array (from API), return all image URLs
  if (car.images && car.images.length > 0) {
    return car.images.map(img => img.url);
  }

  // Check if car already has a single image property
  if (car.image) return [car.image];

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
    return [carImageMap[car._id]];
  }

  // Try to match by brand and model
  const brand = car.brand ? car.brand.toUpperCase() : '';
  const model = car.model ? car.model.toUpperCase() : '';

  if (brand.includes('AUDI') && model.includes('A6')) return ['/src/audia6.JPG'];
  if (brand.includes('BMW') && model.includes('540')) return ['/src/bmw540i.png'];
  if (brand.includes('AUDI') && model.includes('S4')) return ['/src/audis4.webp'];
  if (brand.includes('AUDI') && model.includes('S6')) return ['/src/audis6.JPG'];
  if (brand.includes('MASERATI')) return ['/src/maseratilevante.JPG'];
  if (brand.includes('BMW') && model.includes('840')) return ['/src/bmw840i.png'];
  if (brand.includes('BMW') && model.includes('X7')) return ['/src/bmwx7.JPG'];

  // Default fallback
  return [HeroImg];
};

// Function to get primary car image (first image for hero/main display)
const getCarImage = (car) => {
  const images = getCarImages(car);
  return images[0];
};

// Function to format duration text with proper Slovak plurals
const formatDurationText = (duration) => {
  // Handle specific API duration formats
  if (duration.includes('2-3days')) return '2-3 dni';
  if (duration.includes('4-10days')) return '4-10 dni';
  if (duration.includes('11-20days')) return '11-20 dni';
  if (duration.includes('21-29days')) return '21-29 dni';
  if (duration.includes('30-60days')) return '30-60 dni';
  if (duration.includes('60plus')) return '60+ dni';

  // Generic replacements
  return duration
    .replace('day', ' deň')
    .replace('days', ' dni')
    .replace('plus', '+')
    .replace(/(\d+)\s*dens/g, (match, number) => {
      const num = parseInt(number);
      return num === 1 ? `${num} deň` : `${num} dni`;
    });
};

// Function to filter and format pricing data - only show specific duration tiers
const getValidPricingEntries = (car) => {
  const entries = [];

  // Define allowed duration keys and their display order (excluding 60plus - we add it manually)
  const allowedDurations = ['2-3days', '4-10days', '11-20days', '21-29days', '30-60days'];

  // Only use pricing.rates from API
  if (car.pricing?.rates && Object.keys(car.pricing.rates).length > 0) {
    allowedDurations.forEach((duration) => {
      const price = car.pricing.rates[duration];
      // Only include entries where price is valid (number > 0 or truthy string)
      if (price && ((typeof price === 'number' && price > 0) || (typeof price === 'string' && price.trim()))) {
        entries.push({
          label: formatDurationText(duration),
          price: typeof price === 'number' ? `${price}€` : price
        });
      }
    });
  } else if (car.priceList && car.priceList.length > 0) {
    // Fallback to priceList from API if available
    car.priceList.forEach((priceItem) => {
      const price = priceItem.price || priceItem.rate;
      if ((typeof price === 'number' && price > 0) || (typeof price === 'string' && price.trim())) {
        entries.push({
          label: priceItem.duration || priceItem.label || 'Prenájom',
          price: `${price}€`
        });
      }
    });
  }

  // Always add 60+ dni entry at the end
  entries.push({
    label: '60+ dni',
    price: 'dohoda - volať/písať mail'
  });

  return entries;
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
  const [locations, setLocations] = useState([]);
  const [locationObjects, setLocationObjects] = useState([]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  // Ensure currentImageIndex stays within bounds
  useEffect(() => {
    const carImages = getCarImages(car);
    if (currentImageIndex >= carImages.length) {
      setCurrentImageIndex(0);
    }
  }, [car, currentImageIndex]);

  // Keyboard support for lightbox
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'Escape':
          setShowImageModal(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentImageIndex(prev => prev > 0 ? prev - 1 : getCarImages(car).length - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentImageIndex(prev => prev < getCarImages(car).length - 1 ? prev + 1 : 0);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, car]);

  useEffect(() => {
    const loadCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load pickup/dropoff locations from API
        try {
          const { locations: locs, defaultLocation } = await locationsAPI.getPickupLocations();
          if (locs && locs.length > 0) {
            console.log('📍 Loaded', locs.length, 'pickup locations from API');
            // Store full location objects
            setLocationObjects(locs);
            // Use location names for the dropdown
            const locationNames = locs.map(loc => loc.name);
            setLocations(locationNames);
            console.log('✅ Locations set in state:', locationNames.length);

            // Set default location if available
            if (defaultLocation && !bookingData.pickupLocation) {
              setBookingData(prev => ({
                ...prev,
                pickupLocation: defaultLocation,
                returnLocation: defaultLocation
              }));
            }
          } else {
            console.warn('⚠️ No locations returned from API');
            // Fallback to default
            setLocations(['Pobočka Nitra']);
            setLocationObjects([]);
          }
        } catch (err) {
          console.error('❌ Error loading pickup locations:', err);
          // Fallback to default
          setLocations(['Pobočka Nitra']);
          setLocationObjects([]);
        }

        // Fetch car details from API
        const carData = await carsAPI.getCarDetails(id);

        if (!carData) {
          // Fallback to static data if API fails
          console.warn('API returned no data, using static fallback');
          const fallbackCar = staticCarsData.find(car => car._id === id) || staticCarsData[0];
          setCar(fallbackCar);
        } else {
          console.log('Car details loaded from API:', carData);
          console.log('Pricing data:', {
            'pricing.rates': carData.pricing?.rates,
            'pricing.dailyRate': carData.pricing?.dailyRate,
            'pricing.deposit': carData.pricing?.deposit,
            dailyRate: carData.dailyRate,
            weeklyRate: carData.weeklyRate,
            monthlyRate: carData.monthlyRate,
            priceList: carData.priceList,
            deposit: carData.deposit
          });
          setCar(carData);
        }

        // Load availability
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);

        try {
          const availability = await carsAPI.getCarAvailability(id, startDate, endDate);
          const dates = availability.unavailableDates || [];
          setUnavailableDates(dates);
        } catch (err) {
          console.warn('Could not load availability:', err);
          setUnavailableDates([]);
        }
      } catch (err) {
        console.error('Error loading car details:', err);
        setError('Nepodarilo sa načítať detaily vozidla');
        // Use static fallback on error
        const fallbackCar = staticCarsData.find(car => car._id === id) || staticCarsData[0];
        if (fallbackCar) {
          setCar(fallbackCar);
          setError(null);
        }
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

  // Calculate price per day based on tiered pricing from API
  // Only use allowed tiers: 2-3days, 4-10days, 11-20days, 21-29days, 30-60days, 60plus
  const getPricePerDay = (days) => {
    if (!car) return 0;

    // If car has pricing.rates (tiered pricing), use it
    if (car.pricing?.rates) {
      const rates = car.pricing.rates;

      // Match the number of days to the appropriate tier (only allowed tiers)
      if (days >= 2 && days <= 3 && rates['2-3days']) return rates['2-3days'];
      if (days >= 4 && days <= 10 && rates['4-10days']) return rates['4-10days'];
      if (days >= 11 && days <= 20 && rates['11-20days']) return rates['11-20days'];
      if (days >= 21 && days <= 29 && rates['21-29days']) return rates['21-29days'];
      if (days >= 30 && days <= 60 && rates['30-60days']) return rates['30-60days'];
      // For 60+ days, use the 30-60days rate
      if (days > 60 && rates['30-60days']) return rates['30-60days'];

      // Fallback to 2-3days rate for 1 day or if no tier matches
      return rates['2-3days'] || car.pricing?.dailyRate || car.dailyRate || 0;
    }

    return car.dailyRate || 0;
  };

  const calculateDaysWithTime = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0;

    // Create full datetime objects with time
    const pickupDateTime = new Date(bookingData.pickupDate);
    const [pickupHours, pickupMinutes] = bookingData.pickupTime.split(':');
    pickupDateTime.setHours(parseInt(pickupHours), parseInt(pickupMinutes), 0, 0);

    const returnDateTime = new Date(bookingData.returnDate);
    const [returnHours, returnMinutes] = bookingData.returnTime.split(':');
    returnDateTime.setHours(parseInt(returnHours), parseInt(returnMinutes), 0, 0);

    // Calculate the difference in milliseconds and convert to days
    const timeDifference = returnDateTime - pickupDateTime;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Always round up to ensure minimum billing period
    // If return time is later than pickup time, it counts as +1 day
    return Math.ceil(daysDifference);
  };

  const calculatePrice = () => {
    if (!car || !bookingData.pickupDate || !bookingData.returnDate) return 0;
    const days = calculateDaysWithTime();
    const pricePerDay = getPricePerDay(days);
    const basePrice = pricePerDay * days;
    const latePickupFee = calculateLatePickupFee();
    const lateDropoffFee = calculateLateDropoffFee();
    return basePrice + deliveryPrice + latePickupFee + lateDropoffFee;
  };

  const calculateLatePickupFee = () => {
    if (!bookingData.pickupTime) return 0;
    const [hours, minutes] = bookingData.pickupTime.split(':');
    const pickupHour = parseInt(hours);
    const pickupMinute = parseInt(minutes);
    const timeInMinutes = pickupHour * 60 + pickupMinute;

    // Fee applies for pickup from 17:30 (5:30 PM) onwards
    return timeInMinutes >= 17 * 60 + 30 ? 30 : 0;
  };

  const calculateLateDropoffFee = () => {
    if (!bookingData.returnTime) return 0;
    const [hours, minutes] = bookingData.returnTime.split(':');
    const returnHour = parseInt(hours);
    const returnMinute = parseInt(minutes);
    const timeInMinutes = returnHour * 60 + returnMinute;

    // Fee applies for dropoff from 17:30 (5:30 PM) onwards
    return timeInMinutes >= 17 * 60 + 30 ? 30 : 0;
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

    // Check multiple possible deposit sources from database
    if (car.pricing?.deposit && car.pricing.deposit > 0) {
      return car.pricing.deposit;
    }

    if (car.deposit && car.deposit > 0) {
      return car.deposit;
    }

    // If no deposit is set in database, return 0 (don't use hardcoded fallback)
    return 0;
  };

  const scrollToBooking = () => {
    // Navigate directly to booking page with the car ID
    navigate(`/booking?car=${id}`);
  };

  const handleBookNow = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) {
      alert('Prosím vyberte dátum prevzatia a vrátenia vozidla');
      return;
    }

    // Validate minimum 2-day reservation
    const daysDifference = calculateDaysWithTime();
    if (daysDifference < 2) {
      alert('Minimálna dĺžka rezervácie sú 2 dni. Prosím vyberte dátumy s minimálnym rozdielom 2 dní.');
      return;
    }

    const queryParams = new URLSearchParams({
      car: id,
      pickupDate: bookingData.pickupDate.toISOString().split('T')[0],
      returnDate: bookingData.returnDate.toISOString().split('T')[0],
      pickupTime: bookingData.pickupTime,
      returnTime: bookingData.returnTime
    });

    navigate(`/booking?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[rgb(250,146,8)] mx-auto"></div>
          <p className="mt-4 text-white font-goldman">Načítavajú sa detaily vozidla...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-goldman font-semibold text-white mb-2">Vozidlo sa nenašlo</h2>
          <p className="text-gray-300 font-goldman mb-4">{error}</p>
          <Button onClick={() => navigate('/fleet')}>
            Späť na flotilu
          </Button>
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
              className="hover:opacity-90 px-8 py-3 text-base transition-colors duration-200 border border-gray-600 rounded-lg"
              style={{
                backgroundColor: '#fa9208',
                color: '#191919',
                fontWeight: 700
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
                src={getCarImages(car)[0] || getCarImage(car)}
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
                className="hover:opacity-90 px-8 py-3 text-base transition-colors duration-200 border border-gray-600 rounded-lg"
                style={{
                  backgroundColor: '#fa9208',
                  color: '#191919',
                  fontWeight: 700
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
            {/* Display actual car images from API */}
            {getCarImages(car).slice(0, 5).map((imageUrl, index) => (
              <div
                key={index}
                className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-200"
                onClick={() => {
                  setCurrentImageIndex(index);
                  setShowImageModal(true);
                }}
              >
                <img
                  src={imageUrl}
                  alt={`${car.brand} ${car.model} - Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Show All Button - Show remaining count or "View All" */}
            <div
              className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer relative hover:opacity-75 transition-opacity duration-200"
              onClick={() => {
                setCurrentImageIndex(0);
                setShowImageModal(true);
              }}
            >
              <img
                src={getCarImages(car)[getCarImages(car).length > 5 ? 5 : 0]}
                alt={`${car.brand} ${car.model} - More photos`}
                className="w-full h-full object-cover"
              />
              {/* Transparent overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-white font-goldman text-center">
                  <div className="text-2xl font-semibold">
                    {getCarImages(car).length > 6 ? `+${getCarImages(car).length - 5}` : 'Všetky'}
                  </div>
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
                <div className="text-xs font-goldman text-gray-300">Výkon</div>
                <div className="font-goldman font-semibold text-xs text-white">{car.engine?.power || car.power || '140'} kW</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <GlobeAltIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs font-goldman text-gray-300">Palivo</div>
                <div className="font-goldman font-semibold text-xs text-white capitalize">
                  {car.fuelType === 'gasoline' ? 'Benzín' :
                   car.fuelType === 'diesel' ? 'Nafta' :
                   car.fuelType === 'electric' ? 'Elektro' :
                   car.fuelType === 'hybrid' ? 'Hybrid' :
                   car.fuelType || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <UsersIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs font-goldman text-gray-300">Počet miest</div>
                <div className="font-goldman font-semibold text-xs text-white">{car.seats || 5}</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <CogIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs font-goldman text-gray-300">Prevodovka</div>
                <div className="font-semibold text-xs text-white capitalize">
                  {car.transmission === 'automatic' ? 'Automat' :
                   car.transmission === 'manual' ? 'Manuál' :
                   car.transmission || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <BoltIcon className="h-4 w-4 text-[rgb(250,146,8)] flex-shrink-0 mb-1" />
              <div>
                <div className="text-xs font-goldman text-gray-300">Výkon</div>
                <div className="font-goldman font-semibold text-xs text-white">{car.engine?.power || car.power || '140'} kW</div>
              </div>
            </div>
            {car.color && (
              <div className="flex flex-col items-center text-center">
                <div className="h-4 w-4 flex-shrink-0 mb-1 rounded-full border-2 border-[rgb(250,146,8)]" style={{backgroundColor: car.color.toLowerCase()}}></div>
                <div>
                  <div className="text-xs font-goldman text-gray-300">Farba</div>
                  <div className="font-semibold text-xs text-white capitalize">{car.color}</div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Specs - Horizontal Row */}
          <div className="hidden lg:grid lg:grid-cols-6 lg:gap-4">
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <BoltIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Výkon</div>
                <div className="font-semibold text-base text-white">{car.engine?.power || car.power || '140'} kW</div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <GlobeAltIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Palivo</div>
                <div className="font-semibold text-base text-white capitalize">
                  {car.fuelType === 'gasoline' ? 'Benzín' :
                   car.fuelType === 'diesel' ? 'Nafta' :
                   car.fuelType === 'electric' ? 'Elektro' :
                   car.fuelType === 'hybrid' ? 'Hybrid' :
                   car.fuelType || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <CogIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Prevodovka</div>
                <div className="font-semibold text-base text-white capitalize">
                  {car.transmission === 'automatic' ? 'Automat' :
                   car.transmission === 'manual' ? 'Manuál' :
                   car.transmission || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <UsersIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Počet miest</div>
                <div className="font-semibold text-base text-white">{car.seats || 5}</div>
              </div>
            </div>
            {car.doors && (
              <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                <svg className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm text-gray-300">Počet dverí</div>
                  <div className="font-semibold text-base text-white">{car.doors}</div>
                </div>
              </div>
            )}
            {car.color && (
              <div className="flex flex-row items-center space-x-3 p-4 rounded-lg shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                <div className="h-6 w-6 rounded-full border-2 border-[rgb(250,146,8)] flex-shrink-0" style={{backgroundColor: car.color.toLowerCase()}}></div>
                <div>
                  <div className="text-sm text-gray-300">Farba</div>
                  <div className="font-semibold text-base text-white capitalize">{car.color}</div>
                </div>
              </div>
            )}
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
                    otherSelectedDate={bookingData.returnDate}
                    isReturnPicker={false}
                    onOtherDateReset={() => handleInputChange('returnDate', null)}
                    carId={id}
                    className="w-full"
                  />
                </div>
                <div>
                  <DatePicker
                    selectedDate={bookingData.returnDate}
                    onDateSelect={(date) => handleInputChange('returnDate', date)}
                    minDate={bookingData.pickupDate ? new Date(bookingData.pickupDate.getTime() + 86400000 * 2) : new Date()}
                    unavailableDates={unavailableDates}
                    otherSelectedDate={bookingData.pickupDate}
                    isReturnPicker={true}
                    carId={id}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Pricing Information */}
              <div className="rounded-lg p-4 space-y-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                {bookingData.pickupDate && bookingData.returnDate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Počet dní:</span>
                      <span className="font-goldman font-semibold text-white">{calculateDaysWithTime()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Cena za deň:</span>
                      <span className="font-goldman font-semibold text-white">{getPricePerDay(Math.ceil((bookingData.returnDate - bookingData.pickupDate) / (1000 * 60 * 60 * 24))).toFixed(2)}€</span>
                    </div>
                  </>
                )}
                {getDeposit() > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Depozit:</span>
                    <span className="font-semibold text-white">{getDeposit().toFixed(2)}€</span>
                  </div>
                )}

                {/* Late Fees breakdown */}
                {(calculateLatePickupFee() > 0 || calculateLateDropoffFee() > 0) && (
                  <>
                    {calculateLatePickupFee() > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Prevzatie od 17:30 ({bookingData.pickupTime}):</span>
                        <span className="font-semibold text-white">{calculateLatePickupFee().toFixed(2)}€</span>
                      </div>
                    )}
                    {calculateLateDropoffFee() > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Vrátenie od 17:30 ({bookingData.returnTime}):</span>
                        <span className="font-semibold text-white">{calculateLateDropoffFee().toFixed(2)}€</span>
                      </div>
                    )}
                  </>
                )}

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
                disabled={car.status !== 'available' && car.status !== 'active'}
              >
                {(car.status === 'available' || car.status === 'active') ? 'Pokračovať v objednávke' : 'Momentálne nedostupné'}
              </button>
            </div>
          </div>

          {/* Mobile Pricing Table */}
          <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
            <h3 className="text-xl font-semibold text-white mb-4">Cenník prenájmu</h3>

            <div className="divide-y divide-gray-800">
              {/* Display all valid pricing entries */}
              {getValidPricingEntries(car).map((entry, index) => (
                <div key={index} className="py-3">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white">{entry.label}</span>
                    <span className="text-[rgb(250,146,8)] font-semibold text-right">{entry.price}</span>
                  </div>
                </div>
              ))}

              {/* Show deposit if available - check both car.deposit and car.pricing.deposit */}
              {(car.deposit || car.pricing?.deposit) && (
                <div className="py-3 border-t-2 border-gray-700 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-white font-semibold">Depozit</span>
                    <span className="text-white font-semibold text-right">{car.deposit || car.pricing.deposit}€</span>
                  </div>
                </div>
              )}
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
                {/* Display all valid pricing entries */}
                {getValidPricingEntries(car).map((entry, index) => (
                  <div key={index} className="py-3">
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-white">{entry.label}</span>
                      <span className="text-[rgb(250,146,8)] font-semibold text-right">{entry.price}</span>
                    </div>
                  </div>
                ))}

                {/* Show deposit if available - check both car.deposit and car.pricing.deposit */}
                {(car.deposit || car.pricing?.deposit) && (
                  <div className="py-3 border-t-2 border-gray-700 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-white font-semibold">Depozit</span>
                      <span className="text-white font-semibold text-right">{car.deposit || car.pricing.deposit}€</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - Rezervovat and Popis */}
          <div className="lg:col-span-1 space-y-6">
            {/* Desktop Booking Form */}
            <div id="booking-section-desktop" className="rounded-lg p-6 shadow-lg border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <h2 className="text-2xl font-goldman font-semibold text-white mb-6">Rezervovať</h2>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <DatePicker
                      selectedDate={bookingData.pickupDate}
                      onDateSelect={(date) => handleInputChange('pickupDate', date)}
                      minDate={new Date()}
                      unavailableDates={unavailableDates}
                      otherSelectedDate={bookingData.returnDate}
                      isReturnPicker={false}
                      onOtherDateReset={() => handleInputChange('returnDate', null)}
                      carId={id}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <DatePicker
                      selectedDate={bookingData.returnDate}
                      onDateSelect={(date) => handleInputChange('returnDate', date)}
                      minDate={bookingData.pickupDate ? new Date(bookingData.pickupDate.getTime() + 86400000 * 2) : new Date()}
                      unavailableDates={unavailableDates}
                      otherSelectedDate={bookingData.pickupDate}
                      isReturnPicker={true}
                      carId={id}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="rounded-lg p-4 space-y-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                  {bookingData.pickupDate && bookingData.returnDate && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Počet dní:</span>
                        <span className="font-goldman font-semibold text-white">{calculateDaysWithTime()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cena za deň:</span>
                        <span className="font-goldman font-semibold text-white">{getPricePerDay(calculateDaysWithTime()).toFixed(2)}€</span>
                      </div>
                    </>
                  )}
                  {getDeposit() > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Depozit:</span>
                      <span className="font-goldman font-semibold text-white">{getDeposit().toFixed(2)}€</span>
                    </div>
                  )}

                  {/* Late Fees breakdown */}
                  {(calculateLatePickupFee() > 0 || calculateLateDropoffFee() > 0) && (
                    <>
                      {calculateLatePickupFee() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Prevzatie od 17:30 ({bookingData.pickupTime}):</span>
                          <span className="font-goldman font-semibold text-white">{calculateLatePickupFee().toFixed(2)}€</span>
                        </div>
                      )}
                      {calculateLateDropoffFee() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Vrátenie od 17:30 ({bookingData.returnTime}):</span>
                          <span className="font-goldman font-semibold text-white">{calculateLateDropoffFee().toFixed(2)}€</span>
                        </div>
                      )}
                    </>
                  )}

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
                  disabled={car.status !== 'available' && car.status !== 'active'}
                >
                  {(car.status === 'available' || car.status === 'active') ? 'Pokračovať v objednávke' : 'Momentálne nedostupné'}
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

        {/* Features Section */}
        {car.features && car.features.length > 0 && (
          <div className="mt-8">
            <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <h2 className="text-2xl font-semibold text-white mb-4">Výbava</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-[rgb(250,146,8)] flex-shrink-0" />
                    <span className="capitalize">
                      {feature.replace(/-/g, ' ').replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Information */}
        {locationObjects.length > 0 && (
          <div className="mt-8">
            <div className="rounded-lg p-6 border border-gray-800 shadow-sm" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              <h2 className="text-2xl font-semibold text-white mb-4">Miesto prevzatia</h2>
              <div className="space-y-4">
                {locationObjects.map((location, index) => (
                  <div key={location.id || index} className="flex items-start space-x-3">
                    <MapPinIcon className="h-6 w-6 text-[rgb(250,146,8)] flex-shrink-0 mt-1" />
                    <div className="text-gray-300">
                      <div className="font-semibold text-white mb-1">{location.name}</div>
                      {location.address && (
                        <div className="text-sm">
                          <div>{location.address}</div>
                        </div>
                      )}
                      {location.openingHours && (
                        <div className="text-sm text-gray-400 mt-1">
                          Otváracie hodiny: {location.openingHours}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <ReviewsSection />

        {/* Additional Shared Sections */}
        <ContactMapSection />
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 text-white hover:text-red-400 z-10 transition-all duration-200 hover:scale-110 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : getCarImages(car).length - 1)}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 z-10 transition-all duration-200 hover:scale-110 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Main Image */}
            <div className="max-w-full max-h-full transition-all duration-300 ease-in-out">
              <img
                key={currentImageIndex}
                src={getCarImages(car)[currentImageIndex] || getCarImage(car)}
                alt={`${car.brand} ${car.model} - Photo ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain transition-opacity duration-300 ease-in-out animate-slideIn"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev < getCarImages(car).length - 1 ? prev + 1 : 0)}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 z-10 transition-all duration-200 hover:scale-110 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {getCarImages(car).length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
              {getCarImages(car).map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-white' : 'border-transparent opacity-70'
                  }`}
                >
                  <img
                    src={imageUrl}
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