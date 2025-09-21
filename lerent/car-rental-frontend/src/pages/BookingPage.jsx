import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  CheckIcon,
  ShieldCheckIcon,
  PlusIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import CarImage from '../components/CarImage';
import DatePicker from '../components/DatePicker';
import { carsAPI, bookingAPI, authAPI } from '../services/api';
import HeroImg from '../test.png';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCarId = searchParams.get('car');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  
  // Generate time slots in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  const [formData, setFormData] = useState({
    // Rental details (always visible on right side)
    pickupDate: null,
    returnDate: null,
    pickupTime: '08:00',
    returnTime: '08:00',
    pickupLocation: {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'SK'
    },
    returnLocation: {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'SK'
    },
    
    // Step 1: Personal Information (for new customers)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '',
    licenseNumber: '',
    driverLicenseNumber: '',
    licenseExpiry: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'SK'
    },
    
    // Step 1: Insurance
    insuranceType: '',
    
    // Step 2: Additional Services
    additionalDrivers: [],
    specialRequests: '',
    gps: false,
    childSeat: false,
    fullInsurance: false,
    
    // Document uploads
    idCardFront: null,
    idCardBack: null,
    driverLicenseFront: null,
    driverLicenseBack: null
  });

  const steps = [
    { number: 1, title: 'Poistenie', icon: ShieldCheckIcon },
    { number: 2, title: 'Doplnkové služby', icon: PlusIcon },
    { number: 3, title: 'Osobné údaje', icon: UserIcon },
    { number: 4, title: 'Potvrdenie', icon: DocumentTextIcon }
  ];

  // Predefined locations - Slovak locations (Bratislava)
  const locations = [
    {
      name: 'Centrum - Bratislava',
      address: 'Hlavná 123',
      city: 'Bratislava',
      state: 'Bratislavský kraj',
      postalCode: '821 08',
      country: 'SK'
    },
    {
      name: 'Letisko - M. R. Štefánika',
      address: 'Letisko M. R. Štefánika',
      city: 'Bratislava',
      state: 'Bratislavský kraj',
      postalCode: '823 05',
      country: 'SK'
    },
    {
      name: 'Petržalka - Bratislava',
      address: 'Petržalská 456',
      city: 'Bratislava',
      state: 'Bratislavský kraj',
      postalCode: '851 01',
      country: 'SK'
    },
    {
      name: 'Ružinov - Bratislava',
      address: 'Ružinovská 789',
      city: 'Bratislava',
      state: 'Bratislavský kraj',
      postalCode: '821 01',
      country: 'SK'
    },
    {
      name: 'Nové Mesto - Bratislava',
      address: 'Nové Mesto 321',
      city: 'Bratislava',
      state: 'Bratislavský kraj',
      postalCode: '831 01',
      country: 'SK'
    }
  ];

  // Load selected car and current user
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Parse URL parameters for pre-filled data
        const pickupDateParam = searchParams.get('pickupDate');
        const returnDateParam = searchParams.get('returnDate');
        const pickupTimeParam = searchParams.get('pickupTime');
        const returnTimeParam = searchParams.get('returnTime');
        const pickupLocationParam = searchParams.get('pickupLocation');
        const returnLocationParam = searchParams.get('returnLocation');
        
        // Load current user if logged in
        const user = await authAPI.getCurrentUser();
        setCurrentUser(user);
        
        // If user is logged in, pre-fill form data
        if (user) {
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
            licenseNumber: user.licenseNumber || '',
            licenseExpiry: user.licenseExpiry ? user.licenseExpiry.split('T')[0] : '',
            address: user.address || prev.address
          }));
        }
        
        // Pre-fill dates, times and locations from URL parameters
        setFormData(prev => ({
          ...prev,
          pickupDate: pickupDateParam ? new Date(pickupDateParam) : prev.pickupDate,
          returnDate: returnDateParam ? new Date(returnDateParam) : prev.returnDate,
          pickupTime: pickupTimeParam || prev.pickupTime,
          returnTime: returnTimeParam || prev.returnTime,
          pickupLocation: pickupLocationParam ? 
            locations.find(loc => loc.name === pickupLocationParam) || { name: pickupLocationParam, address: '', city: 'Bratislava', state: 'Bratislavský kraj', postalCode: '', country: 'SK' } : 
            prev.pickupLocation,
          returnLocation: returnLocationParam ? 
            locations.find(loc => loc.name === returnLocationParam) || { name: returnLocationParam, address: '', city: 'Bratislava', state: 'Bratislavský kraj', postalCode: '', country: 'SK' } : 
            prev.returnLocation,
        }));
        
        // Load selected car
        if (selectedCarId) {
          const car = await carsAPI.getCarDetails(selectedCarId);
          setSelectedCar(car);
          
          // Load initial availability for next 6 months
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 6);
          
          try {
            const availability = await carsAPI.getCarAvailability(selectedCarId, startDate, endDate);
            setUnavailableDates(availability.unavailableDates || []);
          } catch (err) {
            console.warn('Nepodarilo sa načítať údaje rezervácie:', err);
            setUnavailableDates([]);
          }
        } else {
          setError('Nebol vybratý žiadny automobil');
        }
      } catch (err) {
        console.error('Chyba pri načítavaní dát:', err);
        setError('Chyba pri načítavaní dát');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCarId, searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDateSelect = (field, date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleLocationChange = (locationType, locationIndex) => {
    if (locationIndex === '' || locationIndex < 0) {
      setFormData(prev => ({
        ...prev,
        [locationType]: { name: '', address: '', city: '', state: '', postalCode: '', country: 'SK' }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [locationType]: locations[locationIndex]
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep1Valid = () => {
    return formData.insuranceType !== '';
  };

  const isStep2Valid = () => {
    return true; // Additional services are optional
  };

  const isStep3Valid = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone && 
           formData.dateOfBirth && formData.licenseNumber && formData.driverLicenseNumber &&
           formData.address.street && formData.address.city && formData.address.postalCode &&
           formData.pickupDate && formData.returnDate && formData.pickupLocation.name && formData.returnLocation.name;
  };

  const canNavigateToStep = (stepNumber) => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return isStep1Valid();
    if (stepNumber === 3) return isStep1Valid() && isStep2Valid();
    if (stepNumber === 4) return isStep1Valid() && isStep2Valid() && isStep3Valid();
    return false;
  };

  const goToStep = (stepNumber) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCar || !isStep3Valid()) {
      setError('Prosím vyplňte všetky požadované údaje');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare booking data
      const bookingData = {
        selectedCarId: selectedCarId,
        startDate: formData.pickupDate.toISOString(),
        endDate: formData.returnDate.toISOString(),
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.returnLocation,
        additionalDrivers: formData.additionalDrivers,
        specialRequests: formData.specialRequests
      };

      // Prepare customer data (if new customer)
      const customerData = currentUser ? null : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        address: formData.address
      };

      // Complete booking
      const result = await bookingAPI.completeBooking(bookingData, customerData);
      setBookingResult(result);
      setCurrentStep(5); // Go to success step
      
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'Rezervácia neúspešná. Skúste to prosím znova.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedCar || !formData.pickupDate || !formData.returnDate) return 0;
    const days = Math.ceil((formData.returnDate - formData.pickupDate) / (1000 * 60 * 60 * 24));
    return selectedCar.dailyRate * days;
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    return Math.ceil((formData.returnDate - formData.pickupDate) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[rgb(250,146,8)] mx-auto"></div>
          <p className="mt-4 text-black">Načítavajú sa detaily rezervácie...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedCar) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">Chyba rezervácie</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/fleet')}>
            Späť na flotilu
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation step
  if (currentStep === 5 && bookingResult) {
    return (
      <div className="min-h-screen bg-white text-black" style={{fontFamily: 'AvantGarde, sans-serif'}}>
        {/* Mini Hero Section */}
        <div 
          className="relative h-[30vh] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${HeroImg})`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Rezervácia</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Car Summary Container */}
          <div className="rounded-lg shadow-sm p-8 mb-8 bg-white border border-gray-200">
            {/* Thank You Section - Inside Container */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[rgba(250,146,8,0.1)] rounded-full mb-6">
                <CheckCircleIcon className="w-12 h-12 text-[rgb(250,146,8)]" />
              </div>
              <h1 className="text-5xl font-bold text-black mb-4">
                Ďakujeme!
              </h1>
              
              {/* Contact Notification */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-700 text-sm">
                  <strong>Kontaktujeme Vás na mailovej adrese:</strong><br />
                  <span className="font-semibold text-[rgb(250,146,8)]">{formData.email}</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black" style={{fontFamily: 'AvantGarde, sans-serif'}}>
      {/* Mini Hero Section */}
      <div 
        className="relative h-[30vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${HeroImg})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Rezervácia</h1>
        </div>
      </div>

      {/* Progress Steps at Top */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Step boxes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const isAccessible = canNavigateToStep(step.number);
                
                return (
                  <div 
                    key={step.number}
                    onClick={() => goToStep(step.number)}
                    className={`
                      relative rounded-xl p-4 cursor-pointer transition-all duration-300 flex items-center space-x-3
                      ${isActive 
                        ? 'bg-[rgb(250,146,8)] text-white shadow-lg shadow-[rgba(250,146,8,0.5)] transform scale-105' 
                        : isCompleted
                        ? 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200'
                        : isAccessible
                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
                      }
                    `}
                    style={{
                      boxShadow: isActive ? '0 0 20px rgba(250, 146, 8, 0.6)' : 'none'
                    }}
                  >
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center
                      ${isActive 
                        ? 'text-white' 
                        : isCompleted
                        ? 'text-[rgb(250,146,8)]'
                        : isAccessible
                        ? 'text-gray-600'
                        : 'text-gray-400'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    
                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className={`
                        text-sm font-semibold truncate
                        ${isActive 
                          ? 'text-white' 
                          : isCompleted
                          ? 'text-black'
                          : isAccessible
                          ? 'text-gray-700'
                          : 'text-gray-400'
                        }
                      `}>
                        {step.title}
                      </div>
                      <div className={`
                        text-xs
                        ${isActive 
                          ? 'text-white/70' 
                          : isCompleted
                          ? 'text-gray-600'
                          : isAccessible
                          ? 'text-gray-500'
                          : 'text-gray-400'
                        }
                      `}>
                        Krok {step.number}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Form Content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg shadow-sm p-8 bg-white border border-gray-200">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="text-red-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Chyba</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1: Insurance */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6 text-left">
                      Vyberte si poistenie
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <label className="rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 bg-white border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="insuranceType"
                            value="basic"
                            checked={formData.insuranceType === 'basic'}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[rgb(250,146,8)] bg-white border-gray-300 focus:ring-[rgb(250,146,8)]"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black">Základné poistenie</h3>
                            <p className="text-gray-600 text-sm mt-1">Zákonné poistenie zodpovednosti + kasko poistenie s spoluúčasťou 1000€</p>
                            <p className="text-[rgb(250,146,8)] font-semibold mt-2">Zahrnuté v cene</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className="rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 bg-white border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="insuranceType"
                            value="premium"
                            checked={formData.insuranceType === 'premium'}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[rgb(250,146,8)] bg-white border-gray-300 focus:ring-[rgb(250,146,8)]"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black">Prémiové poistenie</h3>
                            <p className="text-gray-600 text-sm mt-1">Komplexné poistenie s nulovou spoluúčasťou + poistenie skiel a pneumatík</p>
                            <p className="text-[rgb(250,146,8)] font-semibold mt-2">+15€/deň</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className="rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 bg-white border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="insuranceType"
                            value="full"
                            checked={formData.insuranceType === 'full'}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[rgb(250,146,8)] bg-white border-gray-300 focus:ring-[rgb(250,146,8)]"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black">Úplné poistenie</h3>
                            <p className="text-gray-600 text-sm mt-1">Maximálna ochrana - nulová spoluúčasť + krádež + vandalizmus + poistenie osobných vecí</p>
                            <p className="text-[rgb(250,146,8)] font-semibold mt-2">+25€/deň</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <div></div>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStep1Valid()}
                        className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                      >
                        Pokračovať
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Additional Services */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6 text-left">
                      Doplnkové služby
                    </h2>
                    
                    <div className="space-y-4">
                      <label className="rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 flex items-center justify-between bg-white border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="gps"
                            checked={formData.gps}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[rgb(250,146,8)] bg-white border-gray-300 rounded focus:ring-[rgb(250,146,8)]"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-black">GPS Navigácia</h3>
                            <p className="text-gray-600 text-sm">Moderný GPS systém s mapami Slovenska a Európy</p>
                          </div>
                        </div>
                        <span className="text-[rgb(250,146,8)] font-semibold">+5€/deň</span>
                      </label>
                      
                      <label className="rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 flex items-center justify-between bg-white border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="childSeat"
                            checked={formData.childSeat}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[rgb(250,146,8)] bg-white border-gray-300 rounded focus:ring-[rgb(250,146,8)]"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-black">Detská sedačka</h3>
                            <p className="text-gray-600 text-sm">Bezpečnostná detská sedačka pre deti 9-36 kg</p>
                          </div>
                        </div>
                        <span className="text-[rgb(250,146,8)] font-semibold">+3€/deň</span>
                      </label>
                      
                      <div className="rounded-lg p-6 bg-white border border-gray-200">
                        <label className="block text-sm font-medium text-black mb-2">
                          Špeciálne požiadavky
                        </label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white" 
                          placeholder="Napíšte nám vaše špeciálne požiadavky..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="border border-gray-300 text-black px-6 py-3 rounded-lg font-semibold transition-colors duration-200 hover:bg-gray-50"
                      >
                        Späť
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                      >
                        Pokračovať
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Customer Information */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6 text-left">
                      Osobné údaje
                    </h2>
                    
                    {currentUser && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <p className="text-green-700">Vitajte späť, {currentUser.firstName}! Vaše údaje sú predvyplnené nižšie.</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Meno*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                                              <div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Priezvisko*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Telefónne číslo*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="E-mail*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          placeholder="Číslo občianskeho preukazu*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          placeholder="Rodné číslo (bez lomítka)*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="driverLicenseNumber"
                          value={formData.driverLicenseNumber || ''}
                          onChange={handleInputChange}
                          placeholder="Číslo vodičského preukazu*"
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4 text-left">Kontaktné údaje *</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                            placeholder="Adresa*"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                            required
                            disabled={!!currentUser}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            placeholder="Mesto*"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                            required
                            disabled={!!currentUser}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleInputChange}
                            placeholder="Smerovacíe číslo*"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                            required
                            disabled={!!currentUser}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            placeholder="Krajina*"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)] bg-white"
                            required
                            disabled={!!currentUser}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-black mb-4 text-left">Identifikačné údaje</h3>
                      <div className="space-y-3">
                        <label className="border border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors bg-white">
                          <div className="text-left">
                            <p className="text-gray-700 text-sm">Občiansky preukaz - predná strana</p>
                            <p className="text-gray-500 text-xs">
                              {formData.idCardFront ? formData.idCardFront.name : 'Súbor nebol nahratý'}
                            </p>
                          </div>
                          <span className="text-[rgb(250,146,8)] text-sm hover:text-[rgb(230,126,0)]">Choose file</span>
                          <input 
                            type="file" 
                            name="idCardFront"
                            accept="image/*,.pdf"
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                        <label className="border border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors bg-white">
                          <div className="text-left">
                            <p className="text-gray-700 text-sm">Občiansky preukaz - zadná strana</p>
                            <p className="text-gray-500 text-xs">
                              {formData.idCardBack ? formData.idCardBack.name : 'Súbor nebol nahratý'}
                            </p>
                          </div>
                          <span className="text-[rgb(250,146,8)] text-sm hover:text-[rgb(230,126,0)]">Choose file</span>
                          <input 
                            type="file" 
                            name="idCardBack"
                            accept="image/*,.pdf"
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                        <label className="border border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors bg-white">
                          <div className="text-left">
                            <p className="text-gray-700 text-sm">Vodičský preukaz - predná strana</p>
                            <p className="text-gray-500 text-xs">
                              {formData.driverLicenseFront ? formData.driverLicenseFront.name : 'Súbor nebol nahratý'}
                            </p>
                          </div>
                          <span className="text-[rgb(250,146,8)] text-sm hover:text-[rgb(230,126,0)]">Choose file</span>
                          <input 
                            type="file" 
                            name="driverLicenseFront"
                            accept="image/*,.pdf"
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                        <label className="border border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors bg-white">
                          <div className="text-left">
                            <p className="text-gray-700 text-sm">Vodičský preukaz - zadná strana</p>
                            <p className="text-gray-500 text-xs">
                              {formData.driverLicenseBack ? formData.driverLicenseBack.name : 'Súbor nebol nahratý'}
                            </p>
                          </div>
                          <span className="text-[rgb(250,146,8)] text-sm hover:text-[rgb(230,126,0)]">Choose file</span>
                          <input 
                            type="file" 
                            name="driverLicenseBack"
                            accept="image/*,.pdf"
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Agreement Section */}
                    <div className="mt-8">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="businessTerms"
                          className="w-4 h-4 text-[rgb(250,146,8)] bg-white border-gray-300 rounded focus:ring-[rgb(250,146,8)] mt-0.5"
                          required
                        />
                        <label htmlFor="businessTerms" className="text-black text-sm text-left">
                          Súhlasím so <Link to="/terms" className="text-[rgb(250,146,8)] underline hover:text-[rgb(230,126,0)]">všeobecnými obchodnými podmienkami</Link> *
                        </label>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="dataProcessing"
                            className="w-4 h-4 text-[rgb(250,146,8)] bg-white border-gray-300 rounded focus:ring-[rgb(250,146,8)] mt-0.5"
                            required
                          />
                          <label htmlFor="dataProcessing" className="text-black text-sm text-left">
                            Súhlasím so <Link to="/privacy" className="text-[rgb(250,146,8)] underline hover:text-[rgb(230,126,0)]">spracovaním osobných údajov</Link> *
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 hover:bg-gray-700"
                      >
                        Späť
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStep3Valid()}
                        className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                      >
                        Pokračovať
                      </button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Right Side - Rental Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-sm sticky overflow-hidden bg-white border border-gray-200" style={{ top: '140px' }}>
              {/* Selected Car */}
              {selectedCar && (
                <div>
                  <CarImage
                    car={selectedCar}
                    size="medium"
                    className="w-full h-64 object-cover"
                  />
                  <div className="px-6 pt-6 pb-4">
                    <h4 className="text-xl font-bold text-black">{selectedCar.brand} {selectedCar.model}</h4>
                  </div>
                </div>
              )}

              {/* 6 Select Fields in 3 Rows of 2 Columns */}
              <div className="px-6 space-y-4 mb-6">
                {/* Row 1: Location Selects */}
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.pickupLocation.name ? locations.findIndex(loc => loc.name === formData.pickupLocation.name) : ''}
                    onChange={(e) => handleLocationChange('pickupLocation', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none bg-white" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                    required
                  >
                    <option value="">Vyberte miesto prevzatia</option>
                    {locations.map((location, index) => (
                      <option key={index} value={index}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.returnLocation.name ? locations.findIndex(loc => loc.name === formData.returnLocation.name) : ''}
                    onChange={(e) => handleLocationChange('returnLocation', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none bg-white" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                    required
                  >
                    <option value="">Vyberte miesto vrátenia</option>
                    {locations.map((location, index) => (
                      <option key={index} value={index}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 2: Date Selects */}
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    selectedDate={formData.pickupDate}
                    onDateSelect={(date) => handleDateSelect('pickupDate', date)}
                    minDate={new Date()}
                    unavailableDates={unavailableDates}
                    carId={selectedCarId}
                    className="w-full"
                  />
                  <DatePicker
                    selectedDate={formData.returnDate}
                    onDateSelect={(date) => handleDateSelect('returnDate', date)}
                    minDate={formData.pickupDate ? new Date(formData.pickupDate.getTime() + 86400000) : new Date()}
                    unavailableDates={unavailableDates}
                    carId={selectedCarId}
                    className="w-full"
                  />
                </div>

                {/* Row 3: Time Selects */}
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.pickupTime}
                    onChange={(e) => handleInputChange({ target: { name: 'pickupTime', value: e.target.value } })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none bg-white" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <select
                    value={formData.returnTime}
                    onChange={(e) => handleInputChange({ target: { name: 'returnTime', value: e.target.value } })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none bg-white" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Summary */}
              {selectedCar && formData.pickupDate && formData.returnDate && (
                <div className="px-6 pt-4 pb-6" style={{borderTop: '0.5px solid #d1d5db'}}>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Denná sadzba:</span>
                      <span className="font-medium text-black">{selectedCar.dailyRate}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Počet dní:</span>
                      <span className="font-medium text-black">{calculateDays()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cena prenájmu:</span>
                      <span className="font-medium text-black">{calculateTotal()}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Depozit:</span>
                      <span className="font-medium text-black">{selectedCar.deposit}€</span>
                    </div>
                    <div className="pt-3" style={{borderTop: '0.5px solid #d1d5db'}}>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-black">Cena:</span>
                        <span className="text-[rgb(250,146,8)]">{calculateTotal() + selectedCar.deposit}€</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Button */}
                  {currentStep === 3 && (
                    <div className="px-6 mt-6 pb-6">
                      <Button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={!isStep3Valid() || loading}
                        fullWidth
                      >
                        {loading ? 'Spracováva sa...' : 'Objednať'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shared Sections */}
    </div>
  );
};

export default BookingPage; 