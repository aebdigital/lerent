import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  CogIcon, 
  GlobeAltIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import CarImage from './CarImage';

const CarCard = ({ car, selectedDates, unavailableDates = [], isPromo = false }) => {
  // API data structure mapping
  const {
    _id: id,
    brand,
    model,
    year,
    dailyRate,
    deposit,
    category,
    features,
    transmission,
    fuelType,
    seats,
    description,
    status,
    power,
    images
  } = car;

  // Combine brand and model for display name
  const carName = `${brand} ${model}`;
  
  // Show only available cars or all cars in fleet view
  const isAvailable = status === 'available';

  // Check if car is available for selected dates
  const isAvailableForDates = selectedDates?.pickupDate && selectedDates?.returnDate ? 
    (() => {
      const currentDate = new Date(selectedDates.pickupDate);
      while (currentDate <= selectedDates.returnDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (unavailableDates.includes(dateStr)) {
          return false;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return true;
    })() : true;

  // Build URL with selected dates as query parameters
  const buildCarUrl = () => {
    const baseUrl = `/car/${id}`;
    if (selectedDates?.pickupDate && selectedDates?.returnDate) {
      const params = new URLSearchParams({
        pickupDate: selectedDates.pickupDate.toISOString().split('T')[0],
        returnDate: selectedDates.returnDate.toISOString().split('T')[0]
      });
      return `${baseUrl}?${params.toString()}`;
    }
    return baseUrl;
  };

  // Build booking URL with prefilled data for direct reservation
  const buildBookingUrl = () => {
    const params = new URLSearchParams({
      car: id
    });
    
    if (selectedDates?.pickupDate) {
      params.append('pickupDate', selectedDates.pickupDate.toISOString().split('T')[0]);
    }
    
    if (selectedDates?.returnDate) {
      params.append('returnDate', selectedDates.returnDate.toISOString().split('T')[0]);
    }
    
    if (selectedDates?.pickupTime) {
      params.append('pickupTime', selectedDates.pickupTime);
    }
    
    if (selectedDates?.returnTime) {
      params.append('returnTime', selectedDates.returnTime);
    }
    
    return `/booking?${params.toString()}`;
  };

  // Get fuel type display
  const getFuelDisplay = () => {
    switch(fuelType) {
      case 'petrol': return 'benzín';
      case 'diesel': return 'diesel';
      case 'electric': return 'elektrické';
      case 'hybrid': return 'hybrid';
      default: return fuelType?.toLowerCase() || 'diesel';
    }
  };

  // Get transmission display
  const getTransmissionDisplay = () => {
    switch(transmission) {
      case 'manual': return 'manuál';
      case 'automatic': return 'auto.';
      default: return transmission?.toLowerCase() || 'auto.';
    }
  };

  // Get fuel consumption display
  const getFuelConsumption = () => {
    // Mock data for fuel consumption - in real app this would come from API
    return '5.1 l / 100 km';
  };

  return (
    <Link to={buildCarUrl()} className="block">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 relative mb-6">
        {/* AKCIA Banner */}
        {isPromo && (
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-red-600 text-white px-4 py-2 text-sm font-bold transform -rotate-45 -translate-x-3 -translate-y-1 origin-top-left">
              AKCIA
            </div>
          </div>
        )}

        {/* Car Layout */}
        <div className="flex" style={{backgroundColor: 'rgb(250,146,8)'}}>
          {/* LEFT CONTAINER - Car Name and Specs */}
          <div className="w-3/5 p-6">
            {/* Car Name ON TOP */}
            <h2 className="text-2xl font-bold text-white mb-6">
              {brand} {model}
            </h2>

            {/* Car Specifications BELOW NAME */}
            <div className="grid grid-cols-2 grid-rows-3 rounded-lg overflow-hidden" style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
              {/* Seats */}
              <div className="flex items-center space-x-2 p-3 border-r border-b border-gray-200">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <UsersIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">{seats || 5}</span>
              </div>

              {/* Fuel Consumption */}
              <div className="flex items-center space-x-2 p-3 border-b border-gray-200">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm">{getFuelConsumption()}</span>
              </div>

              {/* Transmission */}
              <div className="flex items-center space-x-2 p-3 border-r border-b border-gray-200">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <CogIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">{getTransmissionDisplay()}</span>
              </div>

              {/* Fuel Type */}
              <div className="flex items-center space-x-2 p-3 border-b border-gray-200">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">{getFuelDisplay()}</span>
              </div>

              {/* Number of Doors */}
              <div className="flex items-center space-x-2 p-3 border-r">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm">4</span>
              </div>

              {/* Power */}
              <div className="flex items-center space-x-2 p-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm">{power || '140kW'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER - Image, Button, Price */}
          <div className="w-2/5 flex flex-col">
            {/* Car Image */}
            <div className="flex-1 min-h-[200px] bg-gray-50 relative">
              {images && images.length > 0 ? (
                <img 
                  src={images[0].url || images[0]} 
                  alt={carName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Button and Price Section */}
            <div className="p-6 text-center">
              {/* Rezervovat Button */}
              <Link
                to={buildBookingUrl()}
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-black px-8 py-3 rounded font-semibold hover:opacity-90 transition-colors duration-200 block mb-4"
              >
                rezervovat
              </Link>

              {/* Price */}
              <div className="text-2xl font-bold text-white">
                od {dailyRate || 40} eur
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
  
export default CarCard; 