import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, FunnelIcon, ArrowDownIcon, ArrowUpIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CarCard from '../components/CarCard';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';
import Carousel from '../components/Carousel';
import { carsAPI } from '../services/api';
import HeroImg from '../main page final1.jpg';
import VasenImg from '../vasen.webp';
import Icon1 from '../icon1.svg';
import Icon2 from '../icon2.svg';
import Icon3 from '../icon3.svg';
import Icon4 from '../icon4.svg';
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
import AudiLogo from '../audi-logo.png';
import MaseratiLogo from '../maserati-black-vector-logo.png';
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
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider images - using car images from the grid
  const sliderImages = [AudiS6Img, MaseratiImg, BMW840iImg];
  
  // Car classes for filtering
  const carClasses = [
    { name: 'Sedan', value: 'sedan', icon: SedanIconImg },
    { name: 'Kombi', value: 'kombi', icon: KombiIconImg },
    { name: 'Šport', value: 'sport', icon: SportIconImg },
    { name: 'SUV', value: 'suv', icon: SUVIconImg },
    { name: 'Prémium', value: 'premium', icon: CoupeIconImg },
    { name: 'Viacmiestne', value: 'multiSeat', icon: ViacmiestneIconImg },
    { name: 'Elektro', value: 'electric', icon: ElektroIconImg },
    { name: 'Úžitkové', value: 'utility', icon: UzitkovePng }
  ];

  // Brand filters
  const brandFilters = [
    { name: 'BMW', value: 'bmw' },
    { name: 'Audi', value: 'audi' },
    { name: 'Maserati', value: 'maserati' }
  ];

  // Filters
  const [sortBy, setSortBy] = useState('price-asc');

  const [filters, setFilters] = useState({
    priceRange: 'all',
    transmission: 'all',
    fuelType: 'all',
    brand: 'all',
    sortBy: 'price-asc'
  });

  // Sort options for dropdown
  const sortOptions = [
    { value: 'price-asc', label: 'Zobraziť od najlacnejšieho' },
    { value: 'price-desc', label: 'Zobraziť od najdrahšieho' },
    { value: 'availability', label: 'Podľa dostupnosti' }
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
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

  // Load cars from static data
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setCars(allCars);
      setFilteredCars(allCars);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allCars];

    // Car class filter (activeTab)
    if (activeTab !== 'all') {
      if (activeTab === 'sedan') {
        filtered = filtered.filter(car => car.bodyType === 'Sedan');
      } else if (activeTab === 'kombi') {
        filtered = filtered.filter(car => car.bodyType === 'Kombi');
      } else if (activeTab === 'sport') {
        filtered = filtered.filter(car => car.bodyType === 'Coupe' || car.brand === 'MASERATI');
      } else if (activeTab === 'suv') {
        filtered = filtered.filter(car => car.bodyType === 'SUV');
      } else if (activeTab === 'premium') {
        filtered = filtered.filter(car => car.dailyRate >= 130);
      } else if (activeTab === 'multiSeat') {
        filtered = filtered.filter(car => car.bodyType === 'SUV');
      } else if (activeTab === 'electric') {
        filtered = filtered.filter(car => car.fuelType === 'Elektro');
      } else if (activeTab === 'utility') {
        filtered = filtered.filter(car => car.bodyType === 'Úžitkové');
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
        return b.dailyRate - a.dailyRate; // Descending
      } else if (sortBy === 'availability') {
        // Sort by availability (available cars first, then by price)
        if (a.status === 'available' && b.status !== 'available') return -1;
        if (a.status !== 'available' && b.status === 'available') return 1;
        return a.dailyRate - b.dailyRate; // Then by price ascending
      } else {
        return a.dailyRate - b.dailyRate; // Ascending (default)
      }
    });

    setFilteredCars(filtered);
  }, [activeTab, selectedBrand, sortBy]);

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
      <style jsx>{`
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
      `}</style>
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HeroImg})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 h-full px-4 md:px-8 lg:px-16 w-full flex items-end pb-8">
          {/* Left side - Text and Form */}
          <div className="text-white ml-8" style={{width: '40%', maxWidth: '40%'}}>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-medium leading-tight mb-6">
              Autopožičovňa s individuálnym prístupom
            </h1>

            {/* Compact Booking Form under heading */}
            <div className="w-full">
              <form className="space-y-3 bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 text-left">
                  Rýchla rezervácia
                </h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Meno"
                  className="w-full text-white px-4 py-2 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Váš telefón"
                  className="w-full text-white px-4 py-2 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  className="w-full text-white px-4 py-2 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                />

                <select
                  name="selectedCar"
                  className="w-full text-white px-4 py-2 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                >
                  <option value="">Vyberte auto</option>
                  <option value="audi-a6">AUDI A6 - od 90€/deň</option>
                  <option value="bmw-540i-xdrive">BMW 540I XDRIVE - od 90€/deň</option>
                  <option value="audi-s4">AUDI S4 - od 90€/deň</option>
                  <option value="audi-s6">AUDI S6 - od 100€/deň</option>
                  <option value="maserati-levante">MASERATI LEVANTE - od 130€/deň</option>
                  <option value="bmw-840i-xdrive">BMW 840I XDRIVE - od 140€/deň</option>
                  <option value="bmw-x7-xdrive-40d">BMW X7 XDRIVE 40D - od 200€/deň</option>
                </select>

                <select
                  name="location"
                  className="w-full text-white px-4 py-2 text-sm rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none appearance-none"
                  style={{backgroundColor: 'rgba(25, 25, 25, 0.8)'}}
                >
                  <option value="">Miesto vyzdvihnutia</option>
                  <option value="nitra">Nitra</option>
                  <option value="bratislava">Bratislava</option>
                  <option value="kosice">Košice</option>
                </select>

                <button
                  type="submit"
                  className="w-full hover:opacity-90 py-2 font-bold text-sm transition-colors rounded-lg"
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

          {/* Slider - moved to bottom right */}
          <div className="hidden lg:block absolute bottom-8 right-16 overflow-hidden rounded-lg shadow-2xl" style={{width: '522px', height: '30vh'}}>
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 w-full h-full transition-opacity duration-1000"
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Darker overlay */}
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}

            {/* Shadow overlays on all 4 sides - top/bottom - reduced intensity */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0) 85%, rgba(0, 0, 0, 0.4) 100%)'
              }}
            ></div>
            {/* Shadow overlays - left/right - reduced intensity */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0) 85%, rgba(0, 0, 0, 0.4) 100%)'
              }}
            ></div>

            {/* Slider indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-[rgb(250,146,8)] w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDownIcon className="h-8 w-8 text-white animate-bounce" />
        </div>
      </section>

      {/* Car Categories Section */}
      <section className="py-8" style={{backgroundColor: '#000000', paddingTop: '150px', paddingBottom: '100px'}}>
        <div className="max-w-7xl mx-auto px-4">

          {/* Car Class Icons - 8 categories in 2 rows */}
          <FadeInUp>
            <div className="flex justify-center mb-8">
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
                  <span className={`font-semibold text-xs sm:text-sm lg:text-base ${
                    activeTab === carClass.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                  }`}>
                    {carClass.name}
                  </span>
                </button>
              ))}
              </div>
            </div>
          </FadeInUp>

          {/* Brand Filter and Sort Dropdown Row */}
          <FadeInUp delay={0.2}>
            <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
            {/* Brand Filter - Left/Center */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6">
              {brandFilters.map((brand) => (
                <button
                  key={brand.value}
                  onClick={() => {
                    // Single selection - clicking same brand deselects it
                    setSelectedBrand(selectedBrand === brand.value ? null : brand.value);
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    selectedBrand === brand.value
                      ? 'border-2 border-[rgb(250,146,8)]'
                      : 'border-2 border-transparent hover:opacity-80'
                  }`}
                  style={{backgroundColor: selectedBrand === brand.value ? 'rgba(250,146,8,0.1)' : 'rgb(25, 25, 25)'}}
                >
                  <img
                    src={brand.value === 'bmw'
                      ? 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg'
                      : brand.value === 'audi'
                      ? AudiLogo
                      : MaseratiLogo
                    }
                    alt={brand.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      // Fallback: hide image and show text only
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className={`text-sm font-medium ${
                    selectedBrand === brand.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                  }`}>
                    {brand.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Sort Dropdown - Right */}
            <div className="relative dropdown-container">
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
                    transition={{
                      layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 }
                    }}
                    className="aspect-[4/3] relative p-[3px]"
                    style={{
                      backgroundColor: 'rgb(250,146,8)',
                      borderRadius: '8px'
                    }}
                  >
                    <Link
                      to={`/car/${car._id}`}
                      className="relative overflow-hidden aspect-[4/3] block w-full h-full"
                      style={{
                        backgroundImage: `url(${car.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '6px'
                      }}
                    >
                    {/* Dark overlay for images */}
                    <div className="absolute inset-0 bg-black opacity-20 z-5"></div>

                    <div className="relative z-10 h-full flex flex-col">
                      {/* Car name and price - top left */}
                      <div className="absolute top-6 left-6">
                        <h3 className="text-2xl font-bold text-white mb-2 uppercase" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{car.brand} {car.model}</h3>
                        <p className="text-lg text-white font-bold font-goldman" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>od {car.price}€/deň</p>
                      </div>

                      {/* Spacer for layout */}
                      <div className="flex-1"></div>

                      {/* Bottom section with car info and button */}
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        {/* Car info 2x2 grid with icons */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base text-white">
                          <div className="flex items-center space-x-3">
                            <img src={Icon1} alt="" className="w-6 h-6" style={{filter: 'brightness(0) invert(1) drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'}} />
                            <span className="font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.4)'}}>{car.power}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <img src={Icon2} alt="" className="w-6 h-6" style={{filter: 'brightness(0) invert(1) drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'}} />
                            <span className="font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.4)'}}>{car.transmission}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <img src={Icon3} alt="" className="w-6 h-6" style={{filter: 'brightness(0) invert(1) drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'}} />
                            <span className="font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.4)'}}>{car.type}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <img src={Icon4} alt="" className="w-6 h-6" style={{filter: 'brightness(0) invert(1) drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'}} />
                            <span className="font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.4)'}}>{car.fuel}</span>
                          </div>
                        </div>

                        {/* Button - positioned on the right with spacing */}
                        <div className="ml-8">
                          <button
                            className="text-black hover:opacity-90 text-black text-sm font-bold transition-colors px-8 py-3"
                            style={{
                              borderRadius: '8px',
                              backgroundColor: '#fa9208'
                            }}
                          >
                            Rezervovať
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
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
                <div className="text-4xl sm:text-5xl font-bold text-[rgb(250,146,8)] mb-2">10</div>
                <div className="text-white font-bold text-sm sm:text-base">Prémiových áut v našej flotile</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-[rgb(250,146,8)] mb-2">2.0M+</div>
                <div className="text-white font-bold text-sm sm:text-base">Kilometrov najazdených šťastnými klientmi</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-[rgb(250,146,8)] mb-2">580</div>
                <div className="text-white font-bold text-sm sm:text-base">Spokojných klientov</div>
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
                <p className="text-gray-300 mb-12 max-w-2xl">
                  Individuálny, férový a ústretový prístup k našim zákazníkom. Dôraz na starostlivosť o náš vozový park. Čísla, ktoré hovoria za nás:
                </p>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="grid grid-cols-3 gap-8">
                <div className="text-left">
                  <div className="text-5xl font-bold text-[rgb(250,146,8)] mb-2">10</div>
                  <div className="text-white font-bold">Prémiových áut v našej flotile</div>
                </div>
                <div className="text-left">
                  <div className="text-5xl font-bold text-[rgb(250,146,8)] mb-2">2.0M+</div>
                  <div className="text-white font-bold">Kilometrov najazdených šťastnými klientmi</div>
                </div>
                <div className="text-left">
                  <div className="text-5xl font-bold text-[rgb(250,146,8)] mb-2">580</div>
                  <div className="text-white font-bold">Spokojných klientov</div>
                </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>


      <ReviewsSection />


      <ContactMapSection />


    </div>
  );
};

export default HomePage;