import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import CarCard from '../components/CarCard';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';
import Carousel from '../components/Carousel';
import { carsAPI } from '../services/api';
import HeroImg from '../hero_lerent.avif';
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
import AudiLogo from '../audi-logo.png';
import MaseratiLogo from '../maserati-black-vector-logo.png';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Car classes for filtering
  const carClasses = [
    { name: 'Športové', value: 'sports', icon: SportIconImg },
    { name: 'Sedan', value: 'sedan', icon: SedanIconImg },
    { name: 'SUV', value: 'suv', icon: SUVIconImg },
    { name: 'Coupe', value: 'coupe', icon: CoupeIconImg }
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
      if (activeTab === 'sports') {
        filtered = filtered.filter(car => car.bodyType === 'Coupe' || car.brand === 'MASERATI');
      } else if (activeTab === 'sedan') {
        filtered = filtered.filter(car => car.bodyType === 'Sedan');
      } else if (activeTab === 'suv') {
        filtered = filtered.filter(car => car.bodyType === 'SUV');
      } else if (activeTab === 'coupe') {
        filtered = filtered.filter(car => car.bodyType === 'Coupe');
      }
    }

    // Brand filter (checkboxes)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(car => 
        selectedBrands.some(brand => car.brand.toLowerCase().includes(brand))
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
  }, [activeTab, selectedBrands, sortBy]);

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#0d0d0d'}}>
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
      `}</style>
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HeroImg})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end items-center text-center px-4" style={{ paddingBottom: '15vh' }}>
          <p className="text-xl md:text-2xl text-white mb-2">
            Bezkonkurenčné autá, nezabudnuteľné jednotky
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-8 font-goldman">
            PRENÁJMY ZÁŽITKOV
          </h1>
          <ChevronDownIcon className="h-8 w-8 text-white animate-bounce" />
        </div>
      </section>

      {/* Car Categories Section */}
      <section className="py-8" style={{backgroundColor: '#0d0d0d', paddingBottom: '100px'}}>
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Car Class Icons */}
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-4 gap-0 sm:gap-4 lg:gap-8">
              {carClasses.map((carClass) => (
                <button
                  key={carClass.value}
                  onClick={() => {
                    // Toggle the selection - if already selected, deselect to show all cars
                    setActiveTab(activeTab === carClass.value ? 'all' : carClass.value);
                  }}
                  className={`flex flex-col items-center p-2 sm:p-4 lg:p-8 transition-all duration-200 transform hover:scale-105 rounded-lg ${
                    activeTab === carClass.value
                      ? 'border-2 border-[rgb(250,146,8)]'
                      : 'border border-transparent hover:border-gray-700'
                  }`}
                  style={{
                    backgroundColor: activeTab === carClass.value ? 'rgba(250,146,8,0.1)' : 'rgb(25, 25, 25)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== carClass.value) {
                      const button = e.currentTarget;
                      button.style.background = 'radial-gradient(circle at 50% 40%, rgba(250,146,8,0.3) 20%, rgba(250,146,8,0.15) 40%, rgb(25, 25, 25) 70%)';
                      button.style.borderColor = 'rgba(55, 65, 81, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== carClass.value) {
                      const button = e.currentTarget;
                      button.style.background = 'rgb(25, 25, 25)';
                      button.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <img
                    src={carClass.icon}
                    alt={carClass.name}
                    className="w-20 h-12 sm:w-28 sm:h-16 lg:w-40 lg:h-24 mb-2 sm:mb-3 lg:mb-4 object-contain"
                  />
                  <span className={`font-semibold text-sm sm:text-base lg:text-lg ${
                    activeTab === carClass.value ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                  }`}>
                    {carClass.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content with Brand Filter on Left and Centered Car Grid */}
          <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl" style={{marginLeft: '-150px'}}>
            {/* Brand Filter - Left Side */}
            <div className="w-full lg:w-64 lg:flex-shrink-0">
              <div className="rounded-lg p-6 lg:sticky lg:top-24" style={{backgroundColor: 'rgb(25, 25, 25)', marginTop: '-12px'}}>
                <div className="space-y-4 lg:space-y-4 flex lg:flex-col gap-4 lg:gap-0">
                  {brandFilters.map((brand) => (
                    <button
                      key={brand.value}
                      onClick={() => {
                        if (selectedBrands.includes(brand.value)) {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand.value));
                        } else {
                          setSelectedBrands([...selectedBrands, brand.value]);
                        }
                      }}
                      className={`flex items-center space-x-3 p-3 w-full lg:w-full rounded-lg transition-all duration-200 ${
                        selectedBrands.includes(brand.value)
                          ? 'border-2 border-[rgb(250,146,8)]'
                          : 'border-2 border-transparent hover:opacity-80'
                      }`}
                      style={{backgroundColor: selectedBrands.includes(brand.value) ? 'rgba(250,146,8,0.1)' : 'transparent'}}
                    >
                      <img
                        src={brand.value === 'bmw'
                          ? 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg'
                          : brand.value === 'audi'
                          ? AudiLogo
                          : MaseratiLogo
                        }
                        alt={brand.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          // Fallback: hide image and show text only
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className={`text-sm font-medium ${
                        selectedBrands.includes(brand.value) ? 'text-[rgb(250,146,8)]' : 'text-gray-300'
                      }`}>
                        {brand.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Grid - Right Side, Centered */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-5xl">
                {/* Custom Sort Dropdown - Aligned with brand filter */}
                <div className="flex justify-end mb-6 lg:-mb-16" style={{marginTop: '-7px'}}>
                  <div className="relative dropdown-container" style={{transform: 'translateY(-5px)'}}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-white px-6 py-4 border border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 min-w-80 flex items-center justify-between font-goldman text-lg font-medium"
                      style={{backgroundColor: '#0d0d0d'}}
                    >
                      <span>{sortOptions.find(option => option.value === sortBy)?.label}</span>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-white transition-transform duration-300 ${
                          isDropdownOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden animate-slideDown" style={{backgroundColor: '#0d0d0d'}}>
                        {sortOptions.map((option, index) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full px-6 py-4 text-left hover:bg-[rgb(250,146,8)] hover:text-white transition-all duration-200 font-goldman text-lg font-medium ${
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

                <div className="lg:grid lg:grid-cols-2 lg:gap-4" style={{marginTop: '3px'}}>
                  {/* Left Column */}
                  <div className="space-y-4" style={{marginTop: '-6px'}}>
                    {filteredCars.filter((_, index) => index % 2 === 0).map((car) => (
                      <div key={car._id} className="aspect-[4/3]">
                        <Link
                          to={`/car/${car._id}`}
                          className="relative overflow-hidden aspect-[4/3] block w-full h-full"
                          style={{
                            clipPath: 'polygon(0px 0px, 90% 0px, 100% 10%, 100% 100%, 10% 100%, 0px 90%)',
                            backgroundImage: `url(${car.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
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
                                    clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                                    borderRadius: '0px',
                                    backgroundColor: '#fa9208'
                                  }}
                                >
                                  Rezervovať
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 mt-16">
                    {filteredCars.filter((_, index) => index % 2 === 1).map((car) => (
                      <div key={car._id} className="aspect-[4/3]">
                        <Link
                          to={`/car/${car._id}`}
                          className="relative overflow-hidden aspect-[4/3] block w-full h-full"
                          style={{
                            clipPath: 'polygon(0px 0px, 90% 0px, 100% 10%, 100% 100%, 10% 100%, 0px 90%)',
                            backgroundImage: `url(${car.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
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
                                    clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                                    borderRadius: '0px',
                                    backgroundColor: '#fa9208'
                                  }}
                                >
                                  Rezervovať
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Performance Stats Section */}
      <section className="py-16 lg:py-40 bg-black relative overflow-hidden">
        {/* Desktop Layout - Image on left, text on right */}
        <div className="hidden lg:block absolute left-0 top-0 w-1/3 h-full">
          <img 
            src={VasenImg} 
            alt="Luxury car"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Mobile Layout - Text first, image below */}
          <div className="lg:hidden mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-goldman text-center">
              VÁŠEŇ PRE VÝKON, ZÁVÄZOK K DOKONALOSTI
            </h2>
            
            <p className="text-gray-300 mb-8 text-center px-4">
              Slúžime našim klientom už niekoľko rokov s neochvejným záväzkom k kvalite a spoľahlivosti. Od prvého dňa sme stáli na 
              princípoch profesionality a dôvery, čo nám umožnilo vybudovať silnú komunitu spokojných zákazníkov. Každé vozidlo v 
              našej flotile prechádza prísnou ochiranúou výberou, aby sme vám mohli ponúknuť len tie najspoľahlivejšie a najvyspelejšie 
              automobily.
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-goldman">
                VÁŠEŇ PRE VÝKON, ZÁVÄZOK K DOKONALOSTI
              </h2>
              
              <p className="text-gray-300 mb-12 max-w-2xl">
                Slúžime našim klientom už niekoľko rokov s neochvejným záväzkom k kvalite a spoľahlivosti. Od prvého dňa sme stáli na 
                princípoch profesionality a dôvery, čo nám umožnilo vybudovať silnú komunitu spokojných zákazníkov. Každé vozidlo v 
                našej flotile prechádza prísnou ochiranúou výberou, aby sme vám mohli ponúknuť len tie najspoľahlivejšie a najvyspelejšie 
                automobily.
              </p>
              
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
            </div>
          </div>
        </div>
      </section>


      <BookingFormSection />
      <ReviewsSection />

      {/* Carousel Section */}
      <section className="py-16" style={{backgroundColor: '#0d0d0d'}}>
        <div className="max-w-7xl mx-auto px-4">
          <Carousel
            images={[
              { src: AudiA6Img, alt: 'Audi A6' },
              { src: BMW540iImg, alt: 'BMW 540i xDrive' },
              { src: AudiS4Img, alt: 'Audi S4' },
              { src: AudiS6Img, alt: 'Audi S6' },
              { src: MaseratiImg, alt: 'Maserati Levante' },
              { src: BMW840iImg, alt: 'BMW 840i xDrive' },
              { src: BMWX7Img, alt: 'BMW X7 xDrive 40d' }
            ]}
            autoPlayInterval={3000}
            height="h-[500px]"
          />
        </div>
      </section>

      <ContactMapSection />


    </div>
  );
};

export default HomePage;