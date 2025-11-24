import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, FunnelIcon, ArrowDownIcon, ArrowUpIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CarCard from '../components/CarCard';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';
import Carousel from '../components/Carousel';
import CustomDatePicker from '../components/CustomDatePicker';
import DatePicker from '../components/DatePicker';
import { carsAPI, locationsAPI, bannersAPI } from '../services/api';
import config from '../config/config';
import HeroImg from '../main page final1.jpg';
import VasenImg from '../vasen.webp';
import CarClassImg from '../testfilter2.png';
import AudiA6Img from '../audia6.JPG';
import BMW540iImg from '../bmw540i.png';
import AudiS4Img from '../audis4.webp';
import AudiS6Img from '../audis6.JPG';
import MaseratiImg from '../maseratilevante.JPG';
import BMW840iImg from '../bmw840i.png';
import BMWX7Img from '../bmwx7.JPG';
import SUVImg from '../catg img/SUV.webp';
import SUVIconImg from '../catg img/SUV.png';
import SedanIconImg from '../catg img/sedan-removebg-preview.png';
import SportIconImg from '../catg img/sport.webp';
import CoupeIconImg from '../catg img/coupe.png';
import KombiIconImg from '../catg img/combi.png';
import ElektroIconImg from '../catg img/elektricke.png';
import UzitkovePng from '../catg img/uzitkove.png';
import ViacmiestneIconImg from '../catg img/viacmiestne.png';
import SliderImg1 from '../vasen.webp';
import SliderImg2 from '../hero_car_orange.jpg';
import SliderImg3 from '../autouver.jpg';

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

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Slider images - fallback to static images if API fails
  const sliderImages = [AudiS6Img, MaseratiImg, BMW840iImg];

  // Car classes for filtering
  const carClasses = [
    { name: 'Sedan', value: 'sedan', icon: SedanIconImg },
    { name: 'Kombi', value: 'kombi', icon: KombiIconImg },
    { name: 'Sport', value: 'sport', icon: SportIconImg },
    { name: 'SUV', value: 'suv', icon: SUVIconImg },
    { name: 'Premium', value: 'premium', icon: CoupeIconImg },
    { name: 'Viacmiestne', value: 'viacmiestne', icon: ViacmiestneIconImg },
    { name: 'Elektro', value: 'elektro', icon: ElektroIconImg },
    { name: 'Úžitkové', value: 'uzitkove', icon: UzitkovePng }
  ];

  // Filters
  const [sortBy, setSortBy] = useState('availability');

  const [filters, setFilters] = useState({
    priceRange: 'all',
    transmission: 'all',
    fuelType: 'all',
    brand: 'all',
    sortBy: 'availability'
  });

  // Sort options for dropdown
  const sortOptions = [
    { value: 'price-asc', label: 'Od najlacnejšieho' },
    { value: 'price-desc', label: 'Od najdrahšieho' },
    { value: 'availability', label: 'Podľa dostupnosti' }
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  // Create slides from all banner images
  const allSlides = banners.length > 0
    ? banners.flatMap(banner =>
        banner.images && banner.images.length > 0
          ? banner.images
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) // Sort by sortOrder
              .map(image => {
                // Handle carId as either string or populated object
                const carIdValue = image.carId
                  ? (typeof image.carId === 'object' ? image.carId._id : image.carId)
                  : null;

                const slide = {
                  imageUrl: image.url,
                  title: image.title || banner.title || 'Prémiová flotila\nvozidiel',
                  subtitle: image.description || banner.subtitle || 'Luxusné vozidlá pre náročných klientov. Zažite komfort a štýl na každej ceste.',
                  alt: image.alt || image.title || banner.title || 'Premium car',
                  carId: carIdValue, // Store carId (string) for click-through
                  carData: typeof image.carId === 'object' ? image.carId : null // Store full car object if available
                };

                // Debug log each slide creation
                console.log('📸 Creating slide:', {
                  title: slide.title,
                  hasCarId: !!slide.carId,
                  carId: slide.carId,
                  carData: slide.carData ? `${slide.carData.brand} ${slide.carData.model}` : null
                });

                return slide;
              })
          : [{
              imageUrl: sliderImages[0], // fallback image
              title: banner.title || 'Prémiová flotila\nvozidiel',
              subtitle: banner.subtitle || 'Luxusné vozidlá pre náročných klientov. Zažite komfort a štýl na každej ceste.',
              alt: banner.title || 'Premium car',
              carId: null,
              carData: null
            }]
      )
    : sliderImages.map((img, idx) => ({
        imageUrl: img,
        title: 'Prémiová flotila\nvozidiel',
        subtitle: 'Luxusné vozidlá pre náročných klientov. Zažite komfort a štýl na každej ceste.',
        alt: 'Premium car',
        carId: null,
        carData: null
      }));

  // Debug: Log final allSlides array
  console.log('🎬 Final allSlides array:', allSlides.map(s => ({
    title: s.title,
    hasCarId: !!s.carId,
    carId: s.carId
  })));

  // Navigation functions for slider
  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const nextIndex = (prev + 1) % allSlides.length;
      console.log('Next slide:', prev, '->', nextIndex);
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const prevIndex = prev === 0 ? allSlides.length - 1 : prev - 1;
      console.log('Prev slide:', prev, '->', prevIndex);
      return prevIndex;
    });
  };

  // Auto-slide effect
  useEffect(() => {
    if (allSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [allSlides.length]);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);
        const carouselBanners = await bannersAPI.getByPosition('hero-section');
        console.log('🎨 Homepage banners loaded:', carouselBanners);

        // Debug: Log banner images with carId info
        if (carouselBanners && carouselBanners.length > 0) {
          console.log('=== BANNER DEBUG START ===');
          carouselBanners.forEach((banner, idx) => {
            console.log(`Banner ${idx}:`, banner.title);
            if (banner.images && banner.images.length > 0) {
              banner.images.forEach((img, imgIdx) => {
                console.log(`  Image ${imgIdx}:`, {
                  url: img.url,
                  title: img.title,
                  carId: img.carId,
                  carIdType: typeof img.carId,
                  hasCarId: !!img.carId,
                  carIdValue: img.carId?._id || img.carId
                });
              });
            }
          });
          console.log('=== BANNER DEBUG END ===');
        }

        setBanners(carouselBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const response = await fetch(`${config.API_BASE_URL}/api/public/users/${config.ADMIN_EMAIL}/brands-catalog`);
        const data = await response.json();
        if (data.success && data.data) {
          console.log(`🚗 Found ${data.count} brands from brands-catalog`);

          // Transform API data to match the format needed by the component
          const transformedBrands = data.data.map(brand => ({
            name: brand.name,
            value: brand.name.toLowerCase().replace(/\s+/g, '-'),
            logo: brand.logo,
            usageCount: brand.usageCount || 0
          }))
          // Sort brands alphabetically by name (A to Z)
          .sort((a, b) => a.name.localeCompare(b.name));

          setBrands(transformedBrands);
          console.log('🚗 Brands loaded (sorted A-Z):', transformedBrands);
        }
      } catch (error) {
        console.error('Error loading brands:', error);
        // Fallback to empty array if fetch fails
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // All cars data
  const allCars = [
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
      price: 90,
      type: 'Sedan',
      fuel: 'Benzín'
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
      price: 90,
      type: 'Sedan',
      fuel: 'Benzín'
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
      price: 90,
      type: 'Kombi',
      fuel: 'Nafta'
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
      price: 100,
      type: 'Kombi',
      fuel: 'Nafta'
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
      price: 130,
      type: 'SUV',
      fuel: 'Benzín'
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
      price: 140,
      type: 'Sedan',
      fuel: 'Benzín'
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
      price: 200,
      type: 'SUV',
      fuel: 'Nafta'
    }
  ];

  // Premium cars (higher priced cars)
  const premiumCars = allCars.filter(car => car.dailyRate >= 130);
  
  // Standard cars (lower priced cars)
  const standardCars = allCars.filter(car => car.dailyRate < 130);

  // Car brands for filter
  const carBrands = [
    { name: 'Všetky značky', value: 'all' },
    { name: 'Audi', value: 'audi' },
    { name: 'BMW', value: 'bmw' },
    { name: 'Mercedes-Benz', value: 'mercedes' },
    { name: 'Volkswagen', value: 'volkswagen' },
    { name: 'Škoda', value: 'skoda' },
    { name: 'Maserati', value: 'maserati' },
    { name: 'Porsche', value: 'porsche' }
  ];

  const priceRanges = [
    { name: 'Všetky ceny', value: 'all' },
    { name: '0€ - 50€', value: '0-50' },
    { name: '50€ - 100€', value: '50-100' },
    { name: '100€ - 150€', value: '100-150' },
    { name: '150€+', value: '150+' }
  ];

  const testimonials = [
    {
      year: 2024,
      text: "Prenájom aut cez Škola Octavia na výlet, a bol som nadmieru spokojný. Auto bolo ako nové, čisté číslov a personál veľmi ochotný, celá výkon na jedničku. Určite sa rád vrátim.",
      name: "Marek Kováč",
      rating: 5
    },
    {
      year: 2024, 
      text: "Skvelá skúsenosť s prenájmom Superb. Všetko prebehlo rýchlo a bez problémov, auto malo plnú nádrž a odovzdanie bolo tiež rýchlo a hladce. Odporúčam definitívne všetkým. Ďakujem! :)",
      name: "Zuzana Horváthová", 
      rating: 5
    },
    {
      year: 2025,
      text: "Profesionálny prístup a kvalitné vozidlá. Prenájom som si BMW x3 pozor Vitáška, a bol som veľmi spokojný služba aka aj z transparentnosti, s vozidlom. Jednoznačne odporúčam!",
      name: "Ján Petrík",
      rating: 5
    }
  ];

  // Add missing formData state
  const [formData, setFormData] = useState({});
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [heroFormUnavailableDates, setHeroFormUnavailableDates] = useState([]);
  const [heroFormLocations, setHeroFormLocations] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that a car is selected
    if (!formData.selectedCar) {
      alert('Prosím vyberte auto');
      return;
    }

    // Validate minimum 2-day reservation if both dates are selected
    if (pickupDate && returnDate) {
      const daysDifference = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
      if (daysDifference < 2) {
        alert('Minimálna dĺžka rezervácie sú 2 dni. Prosím vyberte dátumy s minimálnym rozdielom 2 dní.');
        return;
      }
    }

    // Build query parameters for booking page
    const queryParams = new URLSearchParams({
      car: formData.selectedCar
    });

    // Add pickup date if selected (format in local timezone to avoid date shift)
    if (pickupDate) {
      const year = pickupDate.getFullYear();
      const month = String(pickupDate.getMonth() + 1).padStart(2, '0');
      const day = String(pickupDate.getDate()).padStart(2, '0');
      queryParams.append('pickupDate', `${year}-${month}-${day}`);
    }

    // Add return date if selected (format in local timezone to avoid date shift)
    if (returnDate) {
      const year = returnDate.getFullYear();
      const month = String(returnDate.getMonth() + 1).padStart(2, '0');
      const day = String(returnDate.getDate()).padStart(2, '0');
      queryParams.append('returnDate', `${year}-${month}-${day}`);
    }

    // Add location if selected
    if (formData.location) {
      queryParams.append('pickupLocation', formData.location);
      queryParams.append('returnLocation', formData.location);
    }

    // Navigate to booking page with query parameters
    navigate(`/booking?${queryParams.toString()}`);
  };

  // Load cars from API
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cars from API
        const response = await carsAPI.getAvailableCars();
        console.log('Loaded cars from API:', response);

        // Extract car data from response
        const carsData = response.data || response;

        // If API returns no cars, fall back to static data
        if (carsData && carsData.length > 0) {
          // Fetch availability data for all cars for the next month (30 days)
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 30); // Next month

          const carsWithAvailability = await Promise.all(
            carsData.map(async (car) => {
              try {
                const availability = await carsAPI.getCarAvailability(
                  car._id,
                  startDate,
                  endDate
                );

                return {
                  ...car,
                  unavailableDates: availability?.unavailableDates || []
                };
              } catch (err) {
                console.warn(`Failed to load availability for car ${car._id}:`, err);
                return {
                  ...car,
                  unavailableDates: [] // Default to empty if API fails
                };
              }
            })
          );

          setCars(carsWithAvailability);
          setFilteredCars(carsWithAvailability);
        } else {
          console.log('No cars returned from API, using static data');
          // Static data doesn't have unavailableDates, so add empty array
          const staticCarsWithAvailability = allCars.map(car => ({
            ...car,
            unavailableDates: []
          }));
          setCars(staticCarsWithAvailability);
          setFilteredCars(staticCarsWithAvailability);
        }
      } catch (err) {
        console.error('Failed to load cars from API:', err);
        setError('Nepodarilo sa načítať autá. Používame statické dáta.');
        // Fallback to static data
        const staticCarsWithAvailability = allCars.map(car => ({
          ...car,
          unavailableDates: []
        }));
        setCars(staticCarsWithAvailability);
        setFilteredCars(staticCarsWithAvailability);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  // Load pickup locations from API for hero form
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const { locations: locs } = await locationsAPI.getPickupLocations();
        if (locs && locs.length > 0) {
          console.log('📍 Hero form - Loaded locations:', locs.length);
          setHeroFormLocations(locs);
        } else {
          console.warn('⚠️ No locations returned from API');
          setHeroFormLocations([]);
        }
      } catch (err) {
        console.error('❌ Error loading hero form locations:', err);
        setHeroFormLocations([]);
      }
    };

    loadLocations();
  }, []);

  // Fetch car availability when a car is selected in hero form
  useEffect(() => {
    const fetchHeroFormCarAvailability = async () => {
      if (!formData.selectedCar) {
        setHeroFormUnavailableDates([]);
        return;
      }

      try {
        console.log('🚗 Fetching availability for hero form car:', formData.selectedCar);

        // Get 6 months range for availability check
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);

        const availability = await carsAPI.getCarAvailability(
          formData.selectedCar,
          startDate,
          endDate
        );

        if (availability && availability.unavailableDates) {
          console.log('📅 Hero form - Loaded unavailable dates:', availability.unavailableDates.length);
          setHeroFormUnavailableDates(availability.unavailableDates);
        } else {
          setHeroFormUnavailableDates([]);
        }
      } catch (err) {
        console.error('❌ Error fetching hero form car availability:', err);
        setHeroFormUnavailableDates([]);
      }
    };

    fetchHeroFormCarAvailability();
  }, [formData.selectedCar]);

  // Apply filters
  useEffect(() => {
    let filtered = [...cars];

    // Car class filter (activeTab)
    if (activeTab !== 'all') {
      if (activeTab === 'sedan') {
        filtered = filtered.filter(car => car.category === 'sedan');
      } else if (activeTab === 'kombi') {
        filtered = filtered.filter(car => car.category === 'kombi');
      } else if (activeTab === 'sport') {
        filtered = filtered.filter(car => car.category === 'sport');
      } else if (activeTab === 'suv') {
        filtered = filtered.filter(car => car.category === 'suv');
      } else if (activeTab === 'premium') {
        filtered = filtered.filter(car => car.category === 'premium');
      } else if (activeTab === 'viacmiestne') {
        filtered = filtered.filter(car => car.category === 'viacmiestne');
      } else if (activeTab === 'elektro') {
        filtered = filtered.filter(car => car.category === 'elektro');
      } else if (activeTab === 'uzitkove') {
        filtered = filtered.filter(car => car.category === 'uzitkove');
      }
    }

    // Brand filter (single selection)
    if (selectedBrand) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(selectedBrand)
      );
    }

    // Sort based on sortBy state
    filtered.sort((a, b) => {
      if (sortBy === 'price-desc') {
        // Sort from highest to lowest price
        const priceA = a.pricing?.dailyRate || a.dailyRate || 0;
        const priceB = b.pricing?.dailyRate || b.dailyRate || 0;
        return priceB - priceA;
      } else if (sortBy === 'price-asc') {
        // Sort from lowest to highest price
        const priceA = a.pricing?.dailyRate || a.dailyRate || 0;
        const priceB = b.pricing?.dailyRate || b.dailyRate || 0;
        return priceA - priceB;
      } else if (sortBy === 'availability') {
        // Calculate available days for next month (31 days)
        const getAvailableDays = (car) => {
          const today = new Date();
          const oneMonthLater = new Date();
          oneMonthLater.setDate(today.getDate() + 30);

          const nextMonth = [];
          const currentDate = new Date(today);
          while (currentDate <= oneMonthLater) {
            nextMonth.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }

          const unavailableDates = car.unavailableDates || [];
          return nextMonth.filter(date => !unavailableDates.includes(date)).length;
        };

        const daysA = getAvailableDays(a);
        const daysB = getAvailableDays(b);

        // Sort by available days (most available first)
        if (daysB !== daysA) {
          return daysB - daysA;
        }

        // If same availability, sort by lower price first
        const priceA = a.pricing?.dailyRate || a.dailyRate || 0;
        const priceB = b.pricing?.dailyRate || b.dailyRate || 0;
        return priceA - priceB;
      } else {
        // Default: sort from lowest to highest price
        const priceA = a.pricing?.dailyRate || a.dailyRate || 0;
        const priceB = b.pricing?.dailyRate || b.dailyRate || 0;
        return priceA - priceB;
      }
    });

    setFilteredCars(filtered);
  }, [activeTab, selectedBrand, sortBy, cars]);

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .car-grid-item {
          animation: fadeIn 0.5s ease-out forwards;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .car-grid-container {
          display: grid;
          transition: all 0.3s ease-out;
        }

        .car-grid-item-exit {
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        /* Hide native date input text and make fully clickable */
        input[type="date"]::-webkit-datetime-edit {
          color: transparent;
          background: transparent;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          color: transparent;
          background: transparent;
          cursor: pointer;
        }
        input[type="date"]::-webkit-inner-spin-button {
          display: none;
        }
        input[type="date"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          color-scheme: dark;
        }
        input[type="date"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: transparent;
        }

        /* Modern calendar picker styling */
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          background: rgba(250, 146, 8, 0.1);
          border-radius: 8px;
        }

        /* Calendar dropdown - unfortunately very limited browser support for styling */
        input[type="date"]::-webkit-calendar-picker {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HeroImg})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 h-full px-4 md:px-8 lg:px-16 w-full flex flex-col justify-end pb-8 gap-8 max-[480px]:gap-4 max-[480px]:pb-4">
          {/* Top - Heading */}
          <div className="text-white ml-2 sm:ml-8 max-[480px]:ml-2 max-[480px]:mr-2 max-[480px]:relative max-[480px]:w-[90%] max-[480px]:mb-0" style={{width: '40%', maxWidth: '40%'}}>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-goldman font-medium leading-tight max-[480px]:text-3xl max-[480px]:leading-tight">
              <span className="hidden max-[480px]:inline">Autopožičovňa&nbsp;s<br />individuálnym prístupom</span>
              <span className="max-[480px]:hidden">Autopožičovňa s individuálnym prístupom</span>
            </h1>
          </div>

          {/* Bottom - Form only */}
          <div className="hidden lg:flex gap-6 ml-8 mr-16">
            {/* Form - horizontal layout with glass effect */}
            <div
              className="p-6 rounded-2xl flex items-center gap-6"
              style={{
                flex: '1',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              {/* Title on Left */}
              <div className="flex-shrink-0">
                <h2 className="text-2xl font-goldman font-bold text-white whitespace-nowrap">
                  Rýchla<br />rezervácia
                </h2>
              </div>

              {/* Form inputs in horizontal columns */}
              <form onSubmit={handleSubmit} className="flex items-center gap-4 flex-1">
                {/* Car Selection */}
                <select
                  name="selectedCar"
                  value={formData.selectedCar || ''}
                  onChange={handleInputChange}
                  className="flex-1 text-white px-4 py-3 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                  disabled={loading}
                >
                  <option value="">{loading ? 'Načítavam autá...' : 'Vyberte auto'}</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.brand} {car.model} - od {car.pricing?.dailyRate || car.dailyRate || 0}€/deň
                    </option>
                  ))}
                </select>

                {/* Location Selection */}
                <select
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="flex-1 text-white px-4 py-3 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                >
                  <option value="">Miesto vyzdvihnutia</option>
                  {heroFormLocations.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>

                {/* Date From */}
                <div className="flex-1">
                  <DatePicker
                    selectedDate={pickupDate}
                    onDateSelect={setPickupDate}
                    minDate={new Date()}
                    unavailableDates={heroFormUnavailableDates}
                    placeholder="Dátum prevzatia"
                    otherSelectedDate={returnDate}
                    isReturnPicker={false}
                    onOtherDateReset={() => setReturnDate(null)}
                  />
                </div>

                {/* Date To */}
                <div className="flex-1">
                  <DatePicker
                    selectedDate={returnDate}
                    onDateSelect={setReturnDate}
                    minDate={pickupDate || new Date()}
                    unavailableDates={heroFormUnavailableDates}
                    placeholder="Dátum vrátenia"
                    otherSelectedDate={pickupDate}
                    isReturnPicker={true}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="hover:opacity-90 px-8 py-3 font-bold text-sm transition-colors rounded-lg whitespace-nowrap"
                  style={{
                    backgroundColor: '#fa9208',
                    color: '#191919'
                  }}
                >
                  Rezervovať
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Form - vertical layout (only under 480px) */}
          <div className="hidden max-[480px]:flex max-[480px]:flex-col gap-4 mx-2">
            <div
              className="p-4 rounded-2xl flex flex-col gap-4"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              {/* Title */}
              <h2 className="text-xl font-goldman font-bold text-white text-center">
                Rýchla rezervácia
              </h2>

              {/* Form inputs in vertical rows */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Car Selection */}
                <select
                  name="selectedCar"
                  value={formData.selectedCar || ''}
                  onChange={handleInputChange}
                  className="w-full text-white px-4 py-3 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                  disabled={loading}
                >
                  <option value="">{loading ? 'Načítavam autá...' : 'Vyberte auto'}</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.brand} {car.model} - od {car.pricing?.dailyRate || car.dailyRate || 0}€/deň
                    </option>
                  ))}
                </select>

                {/* Location Selection */}
                <select
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full text-white px-4 py-3 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                >
                  <option value="">Miesto vyzdvihnutia</option>
                  {heroFormLocations.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>

                {/* Date From */}
                <div className="w-full">
                  <DatePicker
                    selectedDate={pickupDate}
                    onDateSelect={setPickupDate}
                    minDate={new Date()}
                    unavailableDates={heroFormUnavailableDates}
                    placeholder="Dátum prevzatia"
                    otherSelectedDate={returnDate}
                    isReturnPicker={false}
                    onOtherDateReset={() => setReturnDate(null)}
                  />
                </div>

                {/* Date To */}
                <div className="w-full">
                  <DatePicker
                    selectedDate={returnDate}
                    onDateSelect={setReturnDate}
                    minDate={pickupDate || new Date()}
                    unavailableDates={heroFormUnavailableDates}
                    placeholder="Dátum vrátenia"
                    otherSelectedDate={pickupDate}
                    isReturnPicker={true}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full hover:opacity-90 px-8 py-3 font-bold text-sm transition-colors rounded-lg"
                  style={{
                    backgroundColor: '#fa9208',
                    color: '#191919'
                  }}
                >
                  Rezervovať
                </button>
              </form>
            </div>
          </div>
        </div>

      </section>

      {/* Premium Fleet Section - Slider */}
      <section className="pb-0 pt-4 max-[480px]:pb-0 max-[480px]:pt-0 lg:py-12 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 max-[480px]:px-2">
          <div
            className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-0 items-center p-8 max-[480px]:p-3 max-[480px]:pt-4 max-[480px]:pb-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px 0 rgba(250, 146, 8, 0.37)'
            }}
          >

            {/* Left Side - Text Content */}
            <div className="order-1 max-[480px]:order-1 lg:order-1 flex items-center justify-center max-[480px]:justify-start lg:justify-start max-[480px]:min-h-0 min-h-[280px]" style={{zIndex: 2}}>
              <FadeInUp>
                <div className="max-[480px]:mt-0 h-[280px] flex flex-col justify-center overflow-hidden">
                  <h2
                    className="font-goldman font-medium leading-tight text-xl sm:text-2xl lg:text-2xl xl:text-3xl max-[480px]:text-left mb-3 max-[480px]:mb-2"
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, rgb(250, 146, 8) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      maxHeight: '140px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Use current slide title */}
                    {allSlides[currentSlide]?.title ? (
                      allSlides[currentSlide].title.split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))
                    ) : (
                      <>
                        <div>Prémiová flotila</div>
                        <div>vozidiel</div>
                      </>
                    )}
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base max-w-md max-[480px]:text-left max-[480px]:mb-0 leading-relaxed" style={{maxHeight: '140px', overflow: 'hidden'}}>
                    {/* Use current slide subtitle */}
                    {allSlides[currentSlide]?.subtitle || 'Luxusné vozidlá pre náročných klientov. Zažite komfort a štýl na každej ceste.'}
                  </p>
                </div>
              </FadeInUp>
            </div>

            {/* Right Side - Image Slider with Overlap */}
            <div className="order-2 max-[480px]:order-2 lg:order-2 relative max-[480px]:ml-0 max-[480px]:w-full lg:-ml-[10%]" style={{zIndex: 1}}>
              <FadeInUp delay={0.1}>
                <div
                  className="relative overflow-hidden rounded-2xl max-[480px]:mx-0 max-[480px]:w-full max-[480px]:aspect-video max-[480px]:h-auto max-[480px]:max-h-[200px]"
                  style={{
                    height: '280px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(250, 146, 8, 0.1)'
                  }}
                >
                  {/* Display all available images from banners */}
                  {allSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                        slide.carId ? 'cursor-pointer' : ''
                      } ${currentSlide !== index ? 'pointer-events-none' : ''}`}
                      style={{
                        opacity: currentSlide === index ? 1 : 0,
                        backgroundImage: `url(${slide.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: currentSlide === index ? 1 : 0
                      }}
                      onClick={() => {
                        if (slide.carId) {
                          console.log('🚗 Banner clicked - Navigating to car:', slide.carId);
                          if (slide.carData) {
                            console.log('   Car details:', slide.carData.brand, slide.carData.model);
                          }
                          navigate(`/car/${slide.carId}`);
                        } else {
                          console.log('⚠️ Banner clicked but no carId associated');
                        }
                      }}
                    >
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                    </div>
                  ))}

                  {/* Reflection/Light flare at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
                      opacity: 0.6
                    }}
                  ></div>

                  {/* Enhanced corner highlights */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at top left, rgba(250, 146, 8, 0.15) 0%, transparent 50%)'
                    }}
                  ></div>

                  {/* Navigation Arrows */}
                  {allSlides.length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevSlide();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group"
                        aria-label="Previous slide"
                      >
                        <ChevronLeftIcon className="w-6 h-6 text-white group-hover:text-[rgb(250,146,8)] transition-colors" />
                      </button>

                      {/* Right Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextSlide();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group"
                        aria-label="Next slide"
                      >
                        <ChevronRightIcon className="w-6 h-6 text-white group-hover:text-[rgb(250,146,8)] transition-colors" />
                      </button>
                    </>
                  )}

                  {/* Slider indicators */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {allSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index ? 'bg-[rgb(250,146,8)] w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </FadeInUp>
            </div>

          </div>
        </div>
      </section>

      {/* Car Categories Section */}
      <section id="cars" className="py-8 max-[480px]:pt-[15px]" style={{backgroundColor: '#000000', paddingTop: '50px', paddingBottom: '100px'}}>
        <div className="max-w-7xl mx-auto px-4">

          {/* Car Class Icons - 8 categories in 2 rows */}
          <FadeInUp>
            {/* Desktop View - Grid */}
            <div className="hidden sm:flex justify-center mb-8">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-4 w-full max-w-7xl">
                {carClasses.map((carClass) => (
                <button
                  key={carClass.value}
                  onClick={() => {
                    // Single selection only - clicking same category deselects it
                    setActiveTab(activeTab === carClass.value ? 'all' : carClass.value);
                  }}
                  className={`flex flex-col items-center p-2 sm:p-3 lg:p-4 transition-all duration-200 transform hover:scale-105 rounded-lg ${
                    activeTab === carClass.value
                      ? 'border-2 border-[rgb(250,146,8)] scale-105'
                      : 'border-2 border-transparent hover:border-[rgb(250,146,8)]'
                  }`}
                  style={{
                    backgroundColor: activeTab === carClass.value ? 'rgba(250,146,8,0.1)' : 'rgb(25, 25, 25)'
                  }}
                >
                  <img
                    src={carClass.icon}
                    alt={carClass.name}
                    className="w-12 h-8 sm:w-16 sm:h-10 lg:w-20 lg:h-12 mb-1 sm:mb-2 lg:mb-3 object-contain"
                  />
                  <span className={`font-goldman font-semibold text-xs sm:text-sm lg:text-base ${
                    activeTab === carClass.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                  }`}>
                    {carClass.name}
                  </span>
                </button>
              ))}
              </div>
            </div>

            {/* Mobile View - Dropdown */}
            <div className="sm:hidden mb-4 px-4">
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-lg text-white border border-gray-600"
                  style={{backgroundColor: 'rgb(25, 25, 25)'}}
                >
                  <span className="font-goldman font-medium">
                    Kategória: {carClasses.find(c => c.value === activeTab)?.name || 'Všetky'}
                  </span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 rounded-lg border border-gray-600 overflow-hidden" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                    {carClasses.map((carClass) => (
                      <button
                        key={carClass.value}
                        onClick={() => {
                          setActiveTab(activeTab === carClass.value ? 'all' : carClass.value);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-4 transition-all hover:bg-[rgba(250,146,8,0.1)] ${
                          activeTab === carClass.value ? 'bg-[rgba(250,146,8,0.1)]' : ''
                        }`}
                      >
                        <img
                          src={carClass.icon}
                          alt={carClass.name}
                          className="w-12 h-8 object-contain"
                        />
                        <span className={`font-goldman font-medium ${
                          activeTab === carClass.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                        }`}>
                          {carClass.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FadeInUp>

          {/* Brand Filter and Sort Dropdown Row */}
          <FadeInUp delay={0.2}>
            <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
            {/* Brand Filter - Desktop View */}
            <div className="hidden sm:flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-4 p-4 rounded-lg" style={{backgroundColor: 'rgb(35, 35, 35)'}}>
              {loadingBrands ? (
                <div className="text-gray-400 text-sm">Loading brands...</div>
              ) : brands.length === 0 ? (
                <div className="text-gray-400 text-sm">No brands available</div>
              ) : (
                brands.map((brand) => (
                  <button
                    key={brand.value}
                    onClick={() => {
                      // Single selection - clicking same brand deselects it
                      setSelectedBrand(selectedBrand === brand.value ? null : brand.value);
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      selectedBrand === brand.value
                        ? 'border-2 border-[rgb(250,146,8)] scale-105'
                        : 'border-2 border-transparent hover:border-[rgb(250,146,8)]'
                    }`}
                    style={{backgroundColor: selectedBrand === brand.value ? 'rgba(250,146,8,0.1)' : 'transparent'}}
                  >
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          // Fallback: hide image and show text only
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
                        {brand.name.charAt(0)}
                      </div>
                    )}
                    <span className={`text-sm font-goldman font-medium ${
                      selectedBrand === brand.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                    }`}>
                      {brand.name}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Brand Filter & Sort - Mobile Row */}
            <div className="sm:hidden w-full px-4 mb-8 flex gap-2">
              {/* Brand Filter - 70% width */}
              <div className="relative" style={{width: '70%'}}>
                <button
                  onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-lg text-white border border-gray-600"
                  style={{backgroundColor: 'rgb(35, 35, 35)'}}
                  disabled={loadingBrands}
                >
                  <span className="font-goldman font-medium">
                    {loadingBrands ? 'Loading...' : `Značka: ${brands.find(b => b.value === selectedBrand)?.name || 'Všetky'}`}
                  </span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBrandDropdownOpen && !loadingBrands && (
                  <div className="absolute z-50 w-full mt-2 rounded-lg border border-gray-600 overflow-hidden" style={{backgroundColor: 'rgb(35, 35, 35)'}}>
                    {brands.map((brand) => (
                      <button
                        key={brand.value}
                        onClick={() => {
                          setSelectedBrand(selectedBrand === brand.value ? null : brand.value);
                          setIsBrandDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-4 transition-all hover:bg-[rgba(250,146,8,0.1)] ${
                          selectedBrand === brand.value ? 'bg-[rgba(250,146,8,0.1)]' : ''
                        }`}
                      >
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
                            {brand.name.charAt(0)}
                          </div>
                        )}
                        <span className={`font-goldman font-medium ${
                          selectedBrand === brand.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                        }`}>
                          {brand.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Filter - 30% width */}
              <div className="relative dropdown-container" style={{width: '30%'}}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-full text-white p-4 border border-gray-600 rounded-lg flex items-center justify-center gap-1"
                  style={{backgroundColor: '#000000'}}
                >
                  {sortBy === 'price-asc' && (
                    <>
                      <span className="text-base">€</span>
                      <ArrowDownIcon className="h-4 w-4" />
                    </>
                  )}
                  {sortBy === 'price-desc' && (
                    <>
                      <span className="text-base">€</span>
                      <ArrowUpIcon className="h-4 w-4" />
                    </>
                  )}
                  {sortBy === 'availability' && (
                    <ClockIcon className="h-4 w-4" />
                  )}
                  <ChevronDownIcon
                    className={`h-4 w-4 text-white transition-transform ${
                      isDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 rounded-lg border border-gray-600 overflow-hidden" style={{backgroundColor: '#000000'}}>
                    <button
                      onClick={() => {
                        setSortBy('price-asc');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 p-3 transition-all hover:bg-[rgba(250,146,8,0.1)] ${
                        sortBy === 'price-asc' ? 'bg-[rgba(250,146,8,0.1)]' : ''
                      }`}
                    >
                      <span className="text-lg">€</span>
                      <ArrowDownIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('price-desc');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 p-3 transition-all hover:bg-[rgba(250,146,8,0.1)] ${
                        sortBy === 'price-desc' ? 'bg-[rgba(250,146,8,0.1)]' : ''
                      }`}
                    >
                      <span className="text-lg">€</span>
                      <ArrowUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('availability');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 p-3 transition-all hover:bg-[rgba(250,146,8,0.1)] ${
                        sortBy === 'availability' ? 'bg-[rgba(250,146,8,0.1)]' : ''
                      }`}
                    >
                      <ClockIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Sort Dropdown - Desktop */}
            <div className="relative dropdown-container hidden sm:block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white px-6 py-4 border border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 font-goldman text-lg font-medium"
                style={{backgroundColor: '#000000'}}
              >
                {sortBy === 'price-asc' && (
                  <>
                    <span className="text-2xl">€</span>
                    <ArrowDownIcon className="h-6 w-6" />
                  </>
                )}
                {sortBy === 'price-desc' && (
                  <>
                    <span className="text-2xl">€</span>
                    <ArrowUpIcon className="h-6 w-6" />
                  </>
                )}
                {sortBy === 'availability' && (
                  <ClockIcon className="h-6 w-6" />
                )}
                <ChevronDownIcon
                  className={`h-5 w-5 text-white transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden animate-slideDown" style={{backgroundColor: '#000000', minWidth: '280px'}}>
                  {sortOptions.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full px-3 py-2 text-left hover:bg-[rgb(250,146,8)] hover:text-white transition-all duration-200 font-goldman text-xl font-medium leading-none whitespace-nowrap ${
                        sortBy === option.value ? 'bg-[rgba(250,146,8,0.1)] text-[rgb(250,146,8)]' : 'text-white'
                      } ${index !== sortOptions.length - 1 ? 'border-b border-gray-600' : ''}`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </FadeInUp>

          {/* Car Grid - Centered, 3 columns */}
          <div className="w-full max-w-7xl mx-auto">

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredCars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{
                      layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 }
                    }}
                    className="aspect-[4/3] relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: '8px'
                    }}
                  >
                    <div
                      onClick={() => window.location.href = `/car/${car._id}`}
                      className="flex flex-col w-full h-full cursor-pointer rounded-lg overflow-hidden"
                    >
                      {/* Top - Car Image */}
                      <div className="flex-1 relative overflow-hidden">
                        {car.image || (car.images && car.images[0] && car.images[0].url) ? (
                          <img
                            src={car.image || (car.images && car.images[0] && car.images[0].url)}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom - Glass Box with Content */}
                      <div className="p-4" style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 8px 32px 0 rgba(250, 146, 8, 0.37)'
                      }}>
                        <div className="flex items-center justify-between">
                          {/* Car name and specs together in left container */}
                          <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-goldman font-bold text-white uppercase">{car.brand} {car.model}</h3>
                            <div className="flex items-center gap-x-3 text-xs font-goldman text-white">
                              {/* Show Power (kW) - from MongoDB engine.power field or power field */}
                              {(car.engine?.power || car.power) && <span className="font-medium">{car.engine?.power || car.power} kW</span>}

                              {/* Show Fuel Type (moved to second position) */}
                              {(car.fuelType || car.fuel) && (
                                <span className="font-medium capitalize">
                                  {car.fuelType === 'gasoline' ? 'Benzín' :
                                   car.fuelType === 'diesel' ? 'Nafta' :
                                   car.fuelType === 'electric' ? 'Elektro' :
                                   car.fuelType === 'hybrid' ? 'Hybrid' :
                                   car.fuelType || car.fuel}
                                </span>
                              )}

                              {/* Show Transmission (moved to third position) */}
                              {car.transmission && <span className="font-medium capitalize">{car.transmission}</span>}

                              {/* Show Seats if available */}
                              {car.seats && <span className="font-medium">{car.seats} miest</span>}
                            </div>
                          </div>

                          {/* Rezervovat Button and Price */}
                          <div className="ml-4 flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/booking?car=${car._id}`;
                              }}
                              className="hover:opacity-90 text-xs font-goldman font-bold transition-colors px-3 py-1 rounded-lg whitespace-nowrap"
                              style={{
                                backgroundColor: '#fa9208',
                                color: '#191919'
                              }}
                            >
                              Rezervovať
                            </button>
                            <div className="text-sm font-goldman font-bold text-white text-center">
                              od {car.pricing?.dailyRate || car.dailyRate || 0}€
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Performance Stats Section */}
      <section className="py-16 lg:py-40 bg-black relative overflow-hidden">
        {/* Desktop Layout - Image on left, text on right */}
        <div className="hidden lg:block absolute left-0 top-0 w-1/3 h-full">
          <div className="relative w-full h-full">
            <img
              src={VasenImg}
              alt="Luxury car"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlays - top and bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, #000000 100%)'
              }}
            ></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Mobile Layout - Text first, image below */}
          <div className="lg:hidden mb-8">
            <FadeInUp>
              <h2 className="text-3xl sm:text-4xl font-medium text-white mb-6 font-goldman text-center">
                VÁŠEŇ PRE AUTÁ, ZÁVÄZOK VOČI ZÁKAZNÍKOM.
              </h2>
            </FadeInUp>

            <p className="text-gray-300 mb-8 text-center px-4">
              Individuálny, férový a ústretový prístup k našim zákazníkom. Dôraz na starostlivosť o náš vozový park. Čísla, ktoré hovoria za nás:
            </p>

            {/* Mobile Image */}
            <div className="mb-8 px-4">
              <img
                src={VasenImg}
                alt="Luxury car"
                className="w-full h-64 sm:h-80 object-cover rounded-lg"
              />
            </div>

            {/* Mobile Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-goldman font-bold text-[rgb(250,146,8)] mb-2">19</div>
                <div className="text-white font-goldman font-bold text-sm sm:text-base">Prémiových áut v našej flotile</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-goldman font-bold text-[rgb(250,146,8)] mb-2">
                  550<span className="text-2xl sm:text-3xl">tisíc+</span>
                </div>
                <div className="text-white font-goldman font-bold text-sm sm:text-base">Kilometrov najazdených šťastnými klientmi</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-goldman font-bold text-[rgb(250,146,8)] mb-2">120+</div>
                <div className="text-white font-goldman font-bold text-sm sm:text-base">Zákazníkov</div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Text on right */}
          <div className="hidden lg:flex justify-end">
            <div className="w-2/3 pl-12">
              <FadeInUp>
                <h2 className="text-4xl md:text-5xl font-medium text-white mb-8 font-goldman">
                  VÁŠEŇ PRE AUTÁ, ZÁVÄZOK VOČI ZÁKAZNÍKOM.
                </h2>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <p className="text-gray-300 font-goldman mb-12 max-w-2xl">
                  Individuálny, férový a ústretový prístup k našim zákazníkom. Dôraz na starostlivosť o náš vozový park. Čísla, ktoré hovoria za nás:
                </p>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="grid grid-cols-3 gap-8">
                <div className="text-left">
                  <div className="text-5xl font-goldman font-bold text-[rgb(250,146,8)] mb-2">19</div>
                  <div className="text-white font-goldman font-bold">Prémiových áut v našej flotile</div>
                </div>
                <div className="text-left">
                  <div className="text-5xl font-goldman font-bold text-[rgb(250,146,8)] mb-2">
                    550<span className="text-3xl">tisíc+</span>
                  </div>
                  <div className="text-white font-goldman font-bold">Kilometrov najazdených šťastnými klientmi</div>
                </div>
                <div className="text-left">
                  <div className="text-5xl font-goldman font-bold text-[rgb(250,146,8)] mb-2">120+</div>
                  <div className="text-white font-goldman font-bold">Zákazníkov</div>
                </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* O nás Section */}
      <section id="o-nas" className="py-24" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-medium text-white text-center mb-8 font-goldman">
              O NÁS
            </h2>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed text-center">
                Sme autopožičovňa zameraná na individuálne potreby klienta. K zákazníkom pristupujeme s cieľom vyhovieť každej ich požiadavke, aby bol zážitok z prenájmu výnimočný. Pre našich klientov zabezpečujeme profesionálne služby, či už ide o krátkodobý alebo dlhodobý prenájom automobilov, pristavenie vozidla na požadované miesto, preberanie a odovzdanie auta mimo otváracích hodín alebo doplnkové služby, ktoré si naši klienti vedia nastaviť podľa svojich požiadaviek. Kladieme dôraz na individualitu, pretože veríme, že naši klienti si zaslúžia len výnimočné služby šité na mieru.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      <ReviewsSection />


      <ContactMapSection />


    </div>
  );
};

export default HomePage;