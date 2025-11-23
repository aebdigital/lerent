import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckIcon,
  ShieldCheckIcon,
  PlusIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../components/Button';
import CarImage from '../components/CarImage';
import DatePicker from '../components/DatePicker';
import { carsAPI, bookingAPI, authAPI, servicesAPI, insuranceAPI, locationsAPI } from '../services/api';
import paymentService from '../services/paymentService';
import { generatePaymentInfo } from '../utils/payBySquare';
import config from '../config/config';

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
  const [additionalServices, setAdditionalServices] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [backendPaymentDetails, setBackendPaymentDetails] = useState(null);
  const [generatedVariableSymbol, setGeneratedVariableSymbol] = useState(null);
  
  // Generate time slots in 30-minute intervals
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
    birthNumber: '',
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
    
    // Step 1: Insurance (optional, can select multiple)
    selectedInsurance: [],
    
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
    driverLicenseBack: null,

    // Payment method
    paymentMethod: 'stripe', // 'stripe' or 'bank_transfer'

    // Step 3: Agreement checkboxes
    businessTerms: false,
    dataProcessing: false
  });

  const steps = [
    { number: 1, title: 'Poistenie', icon: ShieldCheckIcon },
    { number: 2, title: 'Doplnkové služby', icon: PlusIcon },
    { number: 3, title: 'Osobné údaje', icon: UserIcon },
    { number: 4, title: 'Potvrdenie', icon: DocumentTextIcon }
  ];

  // Load selected car, current user, and locations
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

        // Load pickup/dropoff locations from API
        let loadedLocations = [];
        try {
          const { locations: locs, defaultLocation } = await locationsAPI.getPickupLocations();
          if (locs && locs.length > 0) {
            console.log('📍 Loaded', locs.length, 'pickup locations from API');
            // Convert API location format to our internal format
            loadedLocations = locs.map(loc => ({
              id: loc.id,
              name: loc.name,
              address: loc.address,
              city: loc.address?.split(',')[1]?.trim() || '',
              state: '',
              postalCode: '',
              country: 'SK',
              openingHours: loc.openingHours,
              notes: loc.notes,
              isDefault: loc.isDefault
            }));
            setLocations(loadedLocations);
            console.log('✅ Locations set in state:', loadedLocations.length);
          } else {
            console.warn('⚠️ No locations returned from API');
          }
        } catch (err) {
          console.error('❌ Error loading pickup locations:', err);
        }

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
            loadedLocations.find(loc => loc.name === pickupLocationParam) || { name: pickupLocationParam, address: '', city: 'Bratislava', state: 'Bratislavský kraj', postalCode: '', country: 'SK' } :
            prev.pickupLocation,
          returnLocation: returnLocationParam ?
            loadedLocations.find(loc => loc.name === returnLocationParam) || { name: returnLocationParam, address: '', city: 'Bratislava', state: 'Bratislavský kraj', postalCode: '', country: 'SK' } :
            prev.returnLocation,
        }));
        
        // Load additional services from API (excluding insurance)
        try {
          // First try to load from dedicated services endpoint
          const services = await servicesAPI.getServices();
          if (services && services.length > 0) {
            console.log('📋 All services from services API:', services);

            // Filter out insurance services (they're handled in Step 1)
            const nonInsuranceServices = services.filter(service =>
              service.type !== 'insurance' &&
              service.category !== 'insurance' &&
              service.category !== 'insurance_assistance'
            );

            console.log('📋 Non-insurance services for Step 2:', nonInsuranceServices);
            setAdditionalServices(nonInsuranceServices);
          } else {
            // Fallback to loading from cars API response
            const response = await carsAPI.getAvailableCars();
            if (response && response.filters && response.filters.additionalServices) {
              console.log('📋 Additional services from cars API:', response.filters.additionalServices);
              setAdditionalServices(response.filters.additionalServices);
            } else {
              console.log('ℹ️ No additional services found in API response');
            }
          }
        } catch (err) {
          console.warn('Could not load additional services:', err);
        }

        // Load selected car
        if (selectedCarId) {
          const car = await carsAPI.getCarDetails(selectedCarId);
          setSelectedCar(car);

          // Load insurance options from additional services
          try {
            const services = await servicesAPI.getServices();
            console.log('📋 All services from API:', services);

            // Filter for insurance services (category === 'insurance_assistance')
            const insuranceServices = services.filter(service =>
              service.type === 'insurance' ||
              service.category === 'insurance' ||
              service.category === 'insurance_assistance'
            );

            if (insuranceServices && insuranceServices.length > 0) {
              console.log('🛡️ Insurance options loaded from services:', insuranceServices);
              setInsuranceOptions(insuranceServices);
            } else {
              console.warn('No insurance services found in additional services');
            }
          } catch (err) {
            console.warn('Could not load insurance options:', err);
          }

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

  // Fetch QR code when booking result is available for bank transfer
  useEffect(() => {
    const fetchQRCode = async () => {
      if (!bookingResult || !bookingResult.reservationId || formData.paymentMethod !== 'bank_transfer') {
        return;
      }

      const maxRetries = 5;
      const retryDelay = 5000; // 5 seconds
      const initialDelay = 2000; // 2 seconds initial wait

      // Wait 2 seconds before first attempt to allow backend to generate QR
      console.log('Waiting 2 seconds before fetching QR code...');
      await new Promise(resolve => setTimeout(resolve, initialDelay));

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          setQrLoading(true);
          console.log(`Fetching QR code for reservation (attempt ${attempt}/${maxRetries}):`, bookingResult.reservationId);

          const response = await fetch(
            `${config.API_BASE_URL}/api/public/users/${config.ADMIN_EMAIL}/reservations/${bookingResult.reservationId}/qr`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch QR code');
          }

          const result = await response.json();
          console.log('QR code response:', result);

          if (result.success && result.data?.qrCodes?.payBySquareRental) {
            let qrData = result.data.qrCodes.payBySquareRental;
            console.log('QR code data type:', typeof qrData);
            console.log('QR code data:', qrData);

            // Store payment details from backend
            if (result.data.paymentDetails) {
              console.log('Payment details from backend:', result.data.paymentDetails);
              setBackendPaymentDetails(result.data.paymentDetails);
            }

            // Handle if qrData is an object (extract the imageUrl property)
            if (typeof qrData === 'object' && qrData !== null) {
              console.log('QR data is an object, checking for imageUrl property...');
              // Extract the base64 image from imageUrl (not code!)
              qrData = qrData.imageUrl || qrData.base64 || qrData.data || qrData.image || qrData.qrCode || qrData.code;
              console.log('Extracted QR data:', typeof qrData, qrData?.substring?.(0, 100));
            }

            if (typeof qrData === 'string') {
              console.log('QR code data preview (first 100 chars):', qrData.substring(0, 100));
              setQrCodeData(qrData);
              console.log('QR code loaded successfully on attempt', attempt);
              setQrLoading(false);
              return; // Success - exit the loop
            } else {
              console.error('QR code data is not a string after extraction:', typeof qrData);
              throw new Error('Invalid QR code format');
            }
          } else {
            console.warn(`Attempt ${attempt}: No QR code available in response:`, result.message || 'Unknown reason');

            // If this was the last attempt, set qrCodeData to null and stop
            if (attempt === maxRetries) {
              console.error('Failed to fetch QR code after', maxRetries, 'attempts');
              setQrCodeData(null);
              setQrLoading(false);
              return;
            }

            // Wait before next retry
            console.log(`Waiting ${retryDelay / 1000} seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        } catch (err) {
          console.error(`Error fetching QR code (attempt ${attempt}/${maxRetries}):`, err);

          // If this was the last attempt, stop
          if (attempt === maxRetries) {
            console.error('Failed to fetch QR code after', maxRetries, 'attempts');
            setQrCodeData(null);
            setQrLoading(false);
            return;
          }

          // Wait before next retry
          console.log(`Waiting ${retryDelay / 1000} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    };

    fetchQRCode();
  }, [bookingResult, formData.paymentMethod]);

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

  const handleInsuranceToggle = (insurance) => {
    setFormData(prev => {
      const isSelected = prev.selectedInsurance.some(
        ins => ins._id === insurance._id || ins.name === insurance.name
      );

      if (isSelected) {
        // Remove insurance (deselect)
        return {
          ...prev,
          selectedInsurance: []
        };
      } else {
        // Select this insurance (only one allowed at a time)
        return {
          ...prev,
          selectedInsurance: [insurance]
        };
      }
    });
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
    return true; // Insurance is optional, step 1 is always valid
  };

  const isStep2Valid = () => {
    return true; // Additional services are optional
  };

  const isStep3Valid = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone &&
           formData.dateOfBirth && formData.licenseNumber && formData.driverLicenseNumber &&
           formData.address.street && formData.address.city && formData.address.postalCode &&
           formData.pickupDate && formData.returnDate && formData.pickupLocation.name && formData.returnLocation.name &&
           formData.businessTerms && formData.dataProcessing; // Both checkboxes must be checked
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

    // Validate minimum 2-day reservation
    if (formData.pickupDate && formData.returnDate) {
      const daysDifference = calculateDays();
      if (daysDifference < 2) {
        setError('Minimálna dĺžka rezervácie sú 2 dni. Prosím vyberte dátumy s minimálnym rozdielom 2 dní.');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Create reservation with payment service
      console.log('Creating reservation...');

      // Debug: Log location data
      console.log('Form Data Pickup Location:', formData.pickupLocation);
      console.log('Form Data Return Location:', formData.returnLocation);

      // Build location strings
      const pickupLocationStr = formData.pickupLocation.name ||
                                formData.pickupLocation.address ||
                                `${formData.pickupLocation.city}, ${formData.pickupLocation.state}`;
      const dropoffLocationStr = formData.returnLocation.name ||
                                 formData.returnLocation.address ||
                                 `${formData.returnLocation.city}, ${formData.returnLocation.state}`;

      console.log('Pickup Location String:', pickupLocationStr);
      console.log('Dropoff Location String:', dropoffLocationStr);

      // Combine date and time for pickup and return
      const pickupDateTime = new Date(formData.pickupDate);
      const [pickupHours, pickupMinutes] = formData.pickupTime.split(':');
      pickupDateTime.setHours(parseInt(pickupHours), parseInt(pickupMinutes), 0, 0);

      const returnDateTime = new Date(formData.returnDate);
      const [returnHours, returnMinutes] = formData.returnTime.split(':');
      returnDateTime.setHours(parseInt(returnHours), parseInt(returnMinutes), 0, 0);

      const reservationData = {
        // Customer details
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerEmail: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          postalCode: formData.address.postalCode,
          country: formData.address.country
        },
        licenseNumber: formData.licenseNumber || formData.driverLicenseNumber,
        ...(formData.licenseExpiry && { licenseExpiry: formData.licenseExpiry }),

        // Company details (optional)
        isCompany: false,

        // Reservation details
        carId: selectedCarId,
        startDate: pickupDateTime.toISOString(),
        endDate: returnDateTime.toISOString(),
        // Send location as object with nested address object
        pickupLocation: {
          name: formData.pickupLocation.name,
          address: {
            street: formData.pickupLocation.address,
            city: formData.pickupLocation.city,
            state: formData.pickupLocation.state,
            postalCode: formData.pickupLocation.postalCode,
            country: formData.pickupLocation.country
          }
        },
        dropoffLocation: {
          name: formData.returnLocation.name,
          address: {
            street: formData.returnLocation.address,
            city: formData.returnLocation.city,
            state: formData.returnLocation.state,
            postalCode: formData.returnLocation.postalCode,
            country: formData.returnLocation.country
          }
        },

        // Additional services (optional) - Send ID, name, and calculated price
        // This includes both regular services AND insurance from Step 1
        selectedServices: [
          // Regular additional services from Step 2
          ...additionalServices
            .filter(service => formData[service.name])
            .map(service => {
              const days = calculateDays();
              let cost = 0;

              // Calculate cost based on pricing type
              if (service.pricing?.type === 'per_day' && service.pricing?.amount) {
                cost = service.pricing.amount * days;
              } else if (service.pricing?.type === 'fixed' && service.pricing?.amount) {
                cost = service.pricing.amount;
              } else if (service.pricing?.type === 'percentage' && service.pricing?.amount) {
                const rentalCost = getPricePerDay(days) * days;
                cost = (rentalCost * service.pricing.amount) / 100;
              }

              return {
                id: service._id || service.id,
                name: service.name,
                totalPrice: Number(cost)
              };
            }),
          // Insurance from Step 1 (poistenie)
          ...(Array.isArray(formData.selectedInsurance)
            ? formData.selectedInsurance.map(insurance => {
                const days = calculateDays();
                let cost = 0;

                // Calculate cost based on pricing type
                if (insurance.pricing?.type === 'per_day' && insurance.pricing?.amount) {
                  cost = insurance.pricing.amount * days;
                } else if (insurance.pricing?.type === 'fixed' && insurance.pricing?.amount) {
                  cost = insurance.pricing.amount;
                } else if (insurance.pricing?.type === 'percentage' && insurance.pricing?.amount) {
                  const rentalCost = getPricePerDay(days) * days;
                  cost = (rentalCost * insurance.pricing.amount) / 100;
                }

                return {
                  id: insurance._id || insurance.id,
                  name: insurance.name,
                  totalPrice: Number(cost)
                };
              })
            : [])
        ],
        servicesTotal: calculateAdditionalServicesCost(),

        // Insurance (optional) - Send ID, name, and calculated price
        selectedAdditionalInsurance: Array.isArray(formData.selectedInsurance)
          ? formData.selectedInsurance.map(insurance => {
              const days = calculateDays();
              let cost = 0;

              console.log('🔍 Processing insurance:', insurance.name);
              console.log('🔍 Insurance pricing:', insurance.pricing);
              console.log('🔍 Number of days:', days);

              // Calculate cost based on pricing type
              if (insurance.pricing?.type === 'per_day' && insurance.pricing?.amount) {
                cost = insurance.pricing.amount * days;
                console.log('🔍 Per-day calculation:', insurance.pricing.amount, 'x', days, '=', cost);
              } else if (insurance.pricing?.type === 'fixed' && insurance.pricing?.amount) {
                cost = insurance.pricing.amount;
                console.log('🔍 Fixed calculation:', cost);
              } else if (insurance.pricing?.type === 'percentage' && insurance.pricing?.amount) {
                const rentalCost = getPricePerDay(days) * days;
                cost = (rentalCost * insurance.pricing.amount) / 100;
                console.log('🔍 Percentage calculation:', rentalCost, 'x', insurance.pricing.amount, '% =', cost);
              }

              const insuranceObj = {
                id: insurance._id || insurance.id,
                name: insurance.name,
                totalPrice: Number(cost)
              };
              console.log('🔍 Final insurance object:', insuranceObj);

              return insuranceObj;
            })
          : [],
        selectedExtendedInsurance: [],
        insuranceTotal: calculateInsuranceCost(),

        // Notes
        specialRequests: formData.specialRequests || '',
        notes: '',

        // Pricing
        totalPrice: Number(calculateTotal()) || 0,

        // Payment type - send 'stripe' or 'prevod' based on selection
        paymentType: formData.paymentMethod === 'stripe' ? 'stripe' : 'prevod',

        // Important: Mark as pending payment until Stripe payment is confirmed
        status: 'pending_payment'
      };

      // Step 1: Create reservation with pending_payment status
      console.log('Creating reservation...');

      // Debug: Check data before sending
      console.log('🔍 DEBUG - paymentType:', reservationData.paymentType);
      console.log('🔍 DEBUG - totalPrice:', reservationData.totalPrice);
      console.log('🔍 DEBUG - selectedServices:', reservationData.selectedServices);
      console.log('🔍 DEBUG - selectedAdditionalInsurance:', reservationData.selectedAdditionalInsurance);

      const reservationResponse = await paymentService.createReservation(reservationData);
      // Backend returns nested structure: {data: {reservation: {...}, customer: {...}}}
      const reservation = reservationResponse.data.reservation || reservationResponse.data;
      console.log('Reservation created:', reservation.reservationNumber);
      console.log('Full reservation object:', reservation);

      // Store the variable symbol from backend response
      if (reservation.reservationNumber) {
        setGeneratedVariableSymbol(reservation.reservationNumber);
        console.log('Variable symbol from backend:', reservation.reservationNumber);
      }

      // Store QR codes and payment details from backend if available
      if (reservation.qrCodes) {
        console.log('QR codes from backend:', reservation.qrCodes);
        setBackendPaymentDetails({
          variableSymbol: reservation.qrCodes.variableSymbol || reservation.reservationNumber,
          bankAccount: reservation.qrCodes.bankAccount,
          amount: reservation.qrCodes.amount,
          constantSymbol: reservation.qrCodes.constantSymbol,
          payBySquareRental: reservation.qrCodes.payBySquareRental,
          payBySquareDeposit: reservation.qrCodes.payBySquareDeposit
        });
      }

      // Step 2: Handle payment based on selected method
      if (formData.paymentMethod === 'stripe') {
        // Stripe payment flow
        console.log('Creating Stripe checkout session...');
        const totalAmount = calculateTotal();
        const days = calculateDays();

        const checkoutResponse = await paymentService.createCheckoutSession({
          amount: totalAmount,
          currency: 'EUR',
          description: `Prenájom vozidla: ${selectedCar.brand} ${selectedCar.model} (${days} ${days === 1 ? 'deň' : days < 5 ? 'dni' : 'dní'})`,
          reservationId: reservation._id,
          customerEmail: formData.email
        });

        // Step 3: Redirect to Stripe checkout page
        if (checkoutResponse.success) {
          console.log('Redirecting to Stripe checkout...');

          // Show test mode warning if applicable
          if (checkoutResponse.data.test_mode) {
            console.warn('⚠️ Test mode - use card 4242 4242 4242 4242');
          }

          // Redirect to Stripe checkout
          window.location.href = checkoutResponse.data.checkout_url;
        } else {
          throw new Error('Nepodarilo sa vytvoriť platobnú session');
        }
      } else if (formData.paymentMethod === 'bank_transfer') {
        // Bank transfer flow - show confirmation with payment details
        console.log('Bank transfer selected, showing payment details...');
        console.log('Reservation data:', reservation);

        setBookingResult({
          reservationId: reservation._id,
          reservationNumber: reservation.reservationNumber,
          totalAmount: calculateTotal()
        });
        setCurrentStep(5);
        setLoading(false);
      }

    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'Rezervácia neúspešná. Skúste to prosím znova.');
      setLoading(false);
    }
  };

  // Calculate price per day based on tiered pricing from API
  // Only use allowed tiers: 2-3days, 4-10days, 11-20days, 21-29days, 30-60days, 60plus
  const getPricePerDay = (days) => {
    if (!selectedCar) return 0;

    // If car has pricing.rates (tiered pricing), use it
    if (selectedCar.pricing?.rates) {
      const rates = selectedCar.pricing.rates;

      // Match the number of days to the appropriate tier (only allowed tiers)
      if (days >= 2 && days <= 3 && rates['2-3days']) return rates['2-3days'];
      if (days >= 4 && days <= 10 && rates['4-10days']) return rates['4-10days'];
      if (days >= 11 && days <= 20 && rates['11-20days']) return rates['11-20days'];
      if (days >= 21 && days <= 29 && rates['21-29days']) return rates['21-29days'];
      if (days >= 30 && days <= 60 && rates['30-60days']) return rates['30-60days'];
      // For 60+ days, use the 30-60days rate
      if (days > 60 && rates['30-60days']) return rates['30-60days'];

      // Fallback to 2-3days rate for 1 day or if no tier matches
      return rates['2-3days'] || selectedCar.pricing?.dailyRate || selectedCar.dailyRate || 0;
    }

    return selectedCar.dailyRate || 0;
  };

  const calculateInsuranceCost = () => {
    if (!formData.selectedInsurance || formData.selectedInsurance.length === 0) return 0;

    const days = calculateDays();
    let total = 0;

    formData.selectedInsurance.forEach(insurance => {
      if (insurance.pricing?.type === 'per_day' && insurance.pricing?.amount) {
        // Per day pricing: amount × days
        total += insurance.pricing.amount * days;
      } else if (insurance.pricing?.type === 'fixed' && insurance.pricing?.amount) {
        // Fixed pricing: just the amount
        total += insurance.pricing.amount;
      } else if (insurance.pricing?.type === 'percentage' && insurance.pricing?.amount) {
        // Percentage of rental cost
        const rentalCost = getPricePerDay(days) * days;
        total += (rentalCost * insurance.pricing.amount) / 100;
      } else if (insurance.pricePerDay) {
        // Legacy per day pricing
        total += insurance.pricePerDay * days;
      } else if (insurance.price) {
        // Legacy fixed pricing
        total += insurance.price;
      } else if (insurance.dailyRate) {
        // Legacy daily rate
        total += insurance.dailyRate * days;
      }
    });

    return total;
  };

  const calculateAdditionalServicesCost = () => {
    if (!additionalServices || additionalServices.length === 0) return 0;

    const days = calculateDays();
    let total = 0;

    additionalServices.forEach(service => {
      // Check if this service is selected in formData
      if (formData[service.name]) {
        if (service.pricing?.type === 'per_day' && service.pricing?.amount) {
          // Per day pricing: amount × days
          total += service.pricing.amount * days;
        } else if (service.pricing?.type === 'fixed' && service.pricing?.amount) {
          // Fixed pricing: just the amount
          total += service.pricing.amount;
        } else if (service.pricing?.type === 'percentage' && service.pricing?.amount) {
          // Percentage of rental cost
          const rentalCost = getPricePerDay(days) * days;
          total += (rentalCost * service.pricing.amount) / 100;
        } else if (service.pricePerDay) {
          // Legacy per day pricing
          total += service.pricePerDay * days;
        } else if (service.price) {
          // Legacy fixed pricing
          total += service.price;
        } else if (service.dailyRate) {
          // Legacy daily rate
          total += service.dailyRate * days;
        }
      }
    });

    return total;
  };

  const calculateLatePickupFee = () => {
    if (!formData.pickupTime) return 0;
    const [hours, minutes] = formData.pickupTime.split(':');
    const pickupHour = parseInt(hours);
    const pickupMinute = parseInt(minutes);
    const timeInMinutes = pickupHour * 60 + pickupMinute;

    // Fee applies for pickup from 17:30 (5:30 PM) onwards
    return timeInMinutes >= 17 * 60 + 30 ? 30 : 0;
  };

  const calculateLateDropoffFee = () => {
    if (!formData.returnTime) return 0;
    const [hours, minutes] = formData.returnTime.split(':');
    const returnHour = parseInt(hours);
    const returnMinute = parseInt(minutes);
    const timeInMinutes = returnHour * 60 + returnMinute;

    // Fee applies for dropoff from 17:30 (5:30 PM) onwards
    return timeInMinutes >= 17 * 60 + 30 ? 30 : 0;
  };

  // Location surcharge mapping (shared across functions)
  const getLocationFees = () => ({
    'bratislava': { fee: 50, displayName: 'Bratislava' },
    'trnava': { fee: 25, displayName: 'Trnava' },
    'trenčín': { fee: 50, displayName: 'Trenčín' },
    'trencin': { fee: 50, displayName: 'Trenčín' }, // Alternative spelling
    'žilina': { fee: 85, displayName: 'Žilina' },
    'zilina': { fee: 85, displayName: 'Žilina' }, // Alternative spelling
    'banská bystrica': { fee: 60, displayName: 'Banská Bystrica' },
    'banska bystrica': { fee: 60, displayName: 'Banská Bystrica' }, // Alternative spelling
    'liptovský mikuláš': { fee: 100, displayName: 'Liptovský Mikuláš' },
    'liptovsky mikulas': { fee: 100, displayName: 'Liptovský Mikuláš' }, // Alternative spelling
    'komárno': { fee: 35, displayName: 'Komárno' },
    'komarno': { fee: 35, displayName: 'Komárno' }, // Alternative spelling
    'prievidza': { fee: 45, displayName: 'Prievidza' }
  });

  const getLocationFeeDetails = (location) => {
    const locationStr = (location?.name || location?.city || '').toLowerCase();
    const locationFees = getLocationFees();

    for (const [city, details] of Object.entries(locationFees)) {
      if (locationStr.includes(city)) {
        return details;
      }
    }
    return null;
  };

  const calculateBratislavaLocationFee = () => {
    let totalFee = 0;

    // Check pickup location
    const pickupDetails = getLocationFeeDetails(formData.pickupLocation);
    if (pickupDetails) {
      totalFee += pickupDetails.fee;
    }

    // Check dropoff location
    const dropoffDetails = getLocationFeeDetails(formData.returnLocation);
    if (dropoffDetails) {
      totalFee += dropoffDetails.fee;
    }

    return totalFee;
  };

  const calculateTotal = () => {
    if (!selectedCar || !formData.pickupDate || !formData.returnDate) return 0;
    const days = calculateDays();
    const pricePerDay = getPricePerDay(days);
    const rentalCost = pricePerDay * days;
    const insuranceCost = calculateInsuranceCost();
    const additionalServicesCost = calculateAdditionalServicesCost();
    const latePickupFee = calculateLatePickupFee();
    const lateDropoffFee = calculateLateDropoffFee();
    const bratislavaLocationFee = calculateBratislavaLocationFee();
    return rentalCost + insuranceCost + additionalServicesCost + latePickupFee + lateDropoffFee + bratislavaLocationFee;
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;

    // Create full datetime objects with time
    const pickupDateTime = new Date(formData.pickupDate);
    const [pickupHours, pickupMinutes] = formData.pickupTime.split(':');
    pickupDateTime.setHours(parseInt(pickupHours), parseInt(pickupMinutes), 0, 0);

    const returnDateTime = new Date(formData.returnDate);
    const [returnHours, returnMinutes] = formData.returnTime.split(':');
    returnDateTime.setHours(parseInt(returnHours), parseInt(returnMinutes), 0, 0);

    // Calculate the difference in milliseconds and convert to days
    const timeDifference = returnDateTime - pickupDateTime;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Always round up to ensure minimum billing period
    // If return time is later than pickup time, it counts as +1 day
    return Math.ceil(daysDifference);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[rgb(250,146,8)] mx-auto"></div>
          <p className="mt-4 text-white">Načítavajú sa detaily rezervácie...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedCar) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Chyba rezervácie</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button onClick={() => navigate('/fleet')}>
            Späť na flotilu
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation step
  if (currentStep === 5 && bookingResult) {
    // Generate PayBySquare data if payment method is bank transfer
    let paymentInfo = null;
    if (formData.paymentMethod === 'bank_transfer' && selectedCar) {
      console.log('Generating PayBySquare for bank transfer');
      console.log('Payment method:', formData.paymentMethod);
      console.log('Selected car:', selectedCar);
      paymentInfo = generatePaymentInfo({
        carBrand: selectedCar.brand,
        carModel: selectedCar.model,
        pickupDate: formData.pickupDate,
        dropoffDate: formData.returnDate,
        totalAmount: parseFloat(calculateTotal()),
        variableSymbol: generatedVariableSymbol || bookingResult?.reservationNumber
      });
      console.log('Payment info generated:', paymentInfo);
    }

    return (
      <div className="min-h-screen text-white" style={{backgroundColor: '#000000', fontFamily: 'AvantGarde, sans-serif'}}>
        {/* Mini Hero Section */}
        <div
          className="relative h-[30vh] bg-cover bg-center"
          style={{
            backgroundColor: '#000000'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Rezervácia</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          {/* Car Summary Container */}
          <div className="rounded-lg shadow-sm p-4 md:p-8 mb-8 border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
            {/* Thank You Section - Inside Container */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[rgba(250,146,8,0.1)] rounded-full mb-6">
                <CheckCircleIcon className="w-12 h-12 text-[rgb(250,146,8)]" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Ďakujeme!
              </h1>

              {/* Contact Notification */}
              <div className="mt-6 p-4 border border-gray-600 rounded-lg" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <p className="text-gray-300 text-sm">
                  <strong>Kontaktujeme Vás na mailovej adrese:</strong><br />
                  <span className="font-semibold text-[rgb(250,146,8)]">{formData.email}</span>
                </p>
              </div>

              {/* Invoice Notification */}
              <div className="mt-4 p-4 border border-gray-600 rounded-lg" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <p className="text-gray-300 text-sm text-center">
                  Faktúra Vám bude zaslaná na kontaktný email.
                </p>
              </div>
            </div>

            {/* Bank Transfer Payment Details */}
            {paymentInfo && (
              <div className="mt-8 p-4 md:p-6 border border-gray-600 rounded-lg" style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Platobné údaje</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Payment Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">IBAN:</p>
                      <p className="text-white font-mono text-lg">{paymentInfo.displayDetails.iban}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Suma:</p>
                      <p className="text-white font-bold text-2xl text-[rgb(250,146,8)]">{paymentInfo.displayDetails.formattedAmount}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Variabilný symbol:</p>
                      <p className="text-white font-mono text-lg">
                        {paymentInfo.displayDetails.variableSymbol}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Príjemca:</p>
                      <p className="text-white">{paymentInfo.displayDetails.beneficiaryName}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">SWIFT:</p>
                      <p className="text-white font-mono">{paymentInfo.displayDetails.swift}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Splatnosť:</p>
                      <p className="text-white">{paymentInfo.displayDetails.formattedDueDate}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Správa pre príjemcu:</p>
                      <p className="text-white text-sm">{paymentInfo.displayDetails.paymentNote}</p>
                    </div>
                  </div>

                  {/* Right Column - QR Code */}
                  <div className="flex items-center justify-center">
                    {qrLoading ? (
                      <div className="text-center text-gray-400">
                        <p>Načítavam QR kód...</p>
                      </div>
                    ) : qrCodeData ? (
                      <div className="bg-white p-4 rounded-lg">
                        <img
                          src={qrCodeData.startsWith('data:') ? qrCodeData : `data:image/png;base64,${qrCodeData}`}
                          alt="PayBySquare QR Code"
                          className="w-full max-w-xs mx-auto"
                        />
                        <p className="text-center text-black text-xs mt-2">Naskenujte QR kód vo vašej bankovej aplikácii</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <p className="text-sm">QR kód nie je dostupný</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[rgba(250,146,8,0.1)] border border-[rgb(250,146,8)] rounded-lg">
                  <p className="text-gray-300 text-sm text-center">
                    <strong className="text-[rgb(250,146,8)]">Dôležité:</strong> Platbu prosím realizujte do {paymentInfo.displayDetails.formattedDueDate}.
                    Po prijatí platby Vás budeme kontaktovať na poskytnutej mailovej adrese.
                  </p>
                </div>
              </div>
            )}

            {/* Back to Homepage Button */}
            <div className="mt-8 text-center">
              <Link to="/">
                <Button variant="primary" size="lg">
                  Späť na hlavnú stránku
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000', fontFamily: 'AvantGarde, sans-serif'}}>
      {/* Mini Hero Section */}
      <div
        className="relative h-[30vh] md:h-[30vh] max-[480px]:h-[20vh] bg-cover bg-center"
        style={{
          backgroundColor: '#000000'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Rezervácia</h1>
        </div>
      </div>

      {/* Progress Steps at Top */}
      <div className="border-b border-gray-700" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
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
                        ? 'text-white border border-gray-600 hover:bg-gray-700'
                        : isAccessible
                        ? 'text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'text-gray-500 border border-gray-700 cursor-not-allowed opacity-50'
                      }
                    `}
                    style={{
                      backgroundColor: isActive ? undefined : isCompleted ? 'rgb(25, 25, 25)' : isAccessible ? 'rgb(25, 25, 25)' : 'rgba(25, 25, 25, 0.5)',
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
                        ? 'text-gray-300'
                        : 'text-gray-500'
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
                          ? 'text-white'
                          : isAccessible
                          ? 'text-gray-300'
                          : 'text-gray-500'
                        }
                      `}>
                        {step.title}
                      </div>
                      <div className={`
                        text-xs
                        ${isActive 
                          ? 'text-white/70' 
                          : isCompleted
                          ? 'text-gray-300'
                          : isAccessible
                          ? 'text-gray-400'
                          : 'text-gray-500'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Form Content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg shadow-sm p-4 md:p-8 border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
              {error && (
                <div className="border border-red-400 rounded-md p-4 mb-6" style={{backgroundColor: 'rgba(220, 38, 38, 0.1)'}}>
                  <div className="flex">
                    <div className="text-red-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-300">Chyba</h3>
                      <div className="mt-2 text-sm text-red-200">
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
                    <h2 className="text-2xl font-goldman font-bold text-white mb-6 text-left">
                      Vyberte si poistenie (voliteľné)
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">Môžete vybrať jedno alebo viac poistení, alebo pokračovať bez dodatočného poistenia.</p>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Render insurance options from API if available, otherwise use hardcoded fallback */}
                      {insuranceOptions && insuranceOptions.length > 0 ? (
                        insuranceOptions.map((insurance, index) => {
                          const isSelected = formData.selectedInsurance.some(
                            ins => ins._id === insurance._id || ins.name === insurance.name
                          );

                          return (
                            <div
                              key={insurance._id || insurance.name || index}
                              onClick={() => handleInsuranceToggle(insurance)}
                              className={`rounded-lg p-4 md:p-6 cursor-pointer transition-all duration-200 border ${
                                isSelected
                                  ? 'border-[rgb(250,146,8)] bg-gray-700'
                                  : 'border-gray-800 hover:bg-gray-700'
                              }`}
                              style={{backgroundColor: isSelected ? 'rgba(250, 146, 8, 0.1)' : 'rgb(25, 25, 25)'}}
                            >
                              <div className="flex items-start space-x-3">
                                <input
                                  type="radio"
                                  name="insurance-selection"
                                  checked={isSelected}
                                  onChange={() => handleInsuranceToggle(insurance)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-5 h-5 mt-1 text-[rgb(250,146,8)] border-gray-700 focus:ring-[rgb(250,146,8)]"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="text-lg font-semibold text-white">{insurance.nameSk || insurance.displayName || insurance.name || 'Poistenie'}</h3>
                                      <p className="text-gray-300 text-sm mt-1">{insurance.descriptionSk || insurance.description || ''}</p>
                                    </div>
                                    <div className="text-[rgb(250,146,8)] font-bold text-lg ml-4 whitespace-nowrap">
                                      {insurance.pricing?.type === 'per_day' && typeof insurance.pricing?.amount === 'number'
                                        ? `+${insurance.pricing.amount}€/deň`
                                        : insurance.pricing?.type === 'fixed' && typeof insurance.pricing?.amount === 'number'
                                        ? `+${insurance.pricing.amount}€`
                                        : insurance.pricing?.type === 'percentage' && typeof insurance.pricing?.amount === 'number'
                                        ? `+${insurance.pricing.amount}%`
                                        : typeof insurance.pricePerDay === 'number'
                                        ? `+${insurance.pricePerDay}€/deň`
                                        : typeof insurance.price === 'number'
                                        ? `+${insurance.price}€`
                                        : typeof insurance.dailyRate === 'number'
                                        ? `+${insurance.dailyRate}€/deň`
                                        : '0€'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          <p>Žiadne dostupné poistenia</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <div></div>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStep1Valid()}
                        className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-goldman font-semibold transition-colors duration-200"
                      >
                        Pokračovať
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Additional Services */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-goldman font-bold text-white mb-6 text-left">
                      Doplnkové služby
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Render additional services from API if available, otherwise use hardcoded fallback */}
                      {additionalServices && additionalServices.length > 0 ? (
                        additionalServices.map((service) => (
                          <label key={service._id || service.name} className="rounded-lg p-4 md:p-6 cursor-pointer transition-all duration-200 hover:bg-gray-700 flex items-center justify-between border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                name={service.name}
                                checked={formData[service.name] || false}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-[rgb(250,146,8)] border-gray-700 rounded focus:ring-[rgb(250,146,8)]"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-white">{service.nameSk || service.displayName || service.name}</h3>
                                <p className="text-gray-300 text-sm">{service.descriptionSk || service.description || ''}</p>
                              </div>
                            </div>
                            <span className="text-[rgb(250,146,8)] font-bold text-lg ml-4 whitespace-nowrap">
                              {service.pricing?.type === 'per_day' && service.pricing?.amount
                                ? `+${service.pricing.amount}€/deň`
                                : service.pricing?.type === 'fixed' && service.pricing?.amount
                                ? `+${service.pricing.amount}€`
                                : service.pricing?.type === 'percentage' && service.pricing?.amount
                                ? `+${service.pricing.amount}%`
                                : service.pricePerDay
                                ? `+${service.pricePerDay}€/deň`
                                : service.price
                                ? `+${service.price}€`
                                : service.dailyRate
                                ? `+${service.dailyRate}€/deň`
                                : 'Cena na vyžiadanie'}
                            </span>
                          </label>
                        ))
                      ) : (
                        <>
                          {/* Hardcoded fallback services */}
                          <label className="rounded-lg p-4 md:p-6 cursor-pointer transition-all duration-200 hover:bg-gray-700 flex items-center justify-between border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                name="gps"
                                checked={formData.gps}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-[rgb(250,146,8)] border-gray-700 rounded focus:ring-[rgb(250,146,8)]"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-white">GPS Navigácia</h3>
                                <p className="text-gray-300 text-sm">Moderný GPS systém s mapami Slovenska a Európy</p>
                              </div>
                            </div>
                            <span className="text-[rgb(250,146,8)] font-semibold">+5€/deň</span>
                          </label>

                          <label className="rounded-lg p-4 md:p-6 cursor-pointer transition-all duration-200 hover:bg-gray-700 flex items-center justify-between border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                name="childSeat"
                                checked={formData.childSeat}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-[rgb(250,146,8)] border-gray-700 rounded focus:ring-[rgb(250,146,8)]"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-white">Detská sedačka</h3>
                                <p className="text-gray-300 text-sm">Bezpečnostná detská sedačka pre deti 9-36 kg</p>
                              </div>
                            </div>
                            <span className="text-[rgb(250,146,8)] font-semibold">+3€/deň</span>
                          </label>
                        </>
                      )}
                      
                      <div className="rounded-lg p-4 md:p-6 border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                        <label className="block text-sm font-medium text-white mb-2">
                          Špeciálne požiadavky
                        </label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" 
                          style={{backgroundColor: '#191919', border: '1px solid #555'}} 
                          placeholder="Napíšte nám vaše špeciálne požiadavky..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="border border-gray-700 text-white px-6 py-3 rounded-lg font-goldman font-semibold transition-colors duration-200 hover:bg-gray-700"
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
                    <h2 className="text-2xl font-goldman font-bold text-white mb-6 text-left">
                      Osobné údaje
                    </h2>

                    {currentUser && (
                      <div className="border border-green-400 rounded-md p-4 mb-6" style={{backgroundColor: 'rgba(34, 197, 94, 0.1)'}}>
                        <p className="text-green-300">Vitajte späť, {currentUser.firstName}! Vaše údaje sú predvyplnené nižšie.</p>
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
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">
                          Dátum narodenia*
                        </label>
                        <DatePicker
                          selectedDate={formData.dateOfBirth}
                          onDateSelect={(date) => handleDateSelect('dateOfBirth', date)}
                          maxDate={new Date()}
                          showYearMonthSelectors={true}
                          className="w-full"
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-300 mb-2">
                          &nbsp;
                        </label>
                        <input
                          id="licenseNumber"
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          placeholder="Číslo občianskeho preukazu*"
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
                          required
                          disabled={!!currentUser}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="birthNumber"
                          value={formData.birthNumber || ''}
                          onChange={handleInputChange}
                          placeholder="Rodné číslo (bez lomítka)"
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                          className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                            className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                            placeholder="PSČ*"
                            className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                            className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
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
                            className="w-full border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] focus:border-[rgb(250,146,8)]" style={{backgroundColor: '#191919', border: '1px solid #555'}}
                            required
                            disabled={!!currentUser}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4 text-left">Spôsob platby *</h3>
                      <div className="space-y-3">
                        <label className="border border-gray-700 rounded-lg p-3 md:p-4 flex items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors" style={{backgroundColor: formData.paymentMethod === 'stripe' ? 'rgba(250,146,8,0.1)' : 'transparent', borderColor: formData.paymentMethod === 'stripe' ? 'rgb(250,146,8)' : '#555'}}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            checked={formData.paymentMethod === 'stripe'}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="sr-only"
                          />
                          <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors"
                               style={{
                                 borderColor: formData.paymentMethod === 'stripe' ? 'rgb(250,146,8)' : '#6b7280',
                                 backgroundColor: 'transparent'
                               }}>
                            {formData.paymentMethod === 'stripe' && (
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgb(250,146,8)'}}></div>
                            )}
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-white font-goldman font-medium">Stripe</p>
                            <p className="text-gray-400 text-sm">Platba kartou online</p>
                          </div>
                        </label>

                        <label className="border border-gray-700 rounded-lg p-3 md:p-4 flex items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors" style={{backgroundColor: formData.paymentMethod === 'bank_transfer' ? 'rgba(250,146,8,0.1)' : 'transparent', borderColor: formData.paymentMethod === 'bank_transfer' ? 'rgb(250,146,8)' : '#555'}}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_transfer"
                            checked={formData.paymentMethod === 'bank_transfer'}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="sr-only"
                          />
                          <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors"
                               style={{
                                 borderColor: formData.paymentMethod === 'bank_transfer' ? 'rgb(250,146,8)' : '#6b7280',
                                 backgroundColor: 'transparent'
                               }}>
                            {formData.paymentMethod === 'bank_transfer' && (
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'rgb(250,146,8)'}}></div>
                            )}
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-white font-goldman font-medium">Bankový prevod</p>
                            <p className="text-gray-400 text-sm">Platba bankovým prevodom</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4 text-left">Identifikačné údaje</h3>
                      {/* TEMPORARILY HIDDEN - File upload fields (will be re-enabled later) */}
                      <div className="space-y-3 hidden">
                        <label className="border border-gray-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors border border-gray-800">
                          <div className="text-left">
                            <p className="text-gray-300 text-sm">Občiansky preukaz - predná strana</p>
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
                        <label className="border border-gray-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors border border-gray-800">
                          <div className="text-left">
                            <p className="text-gray-300 text-sm">Občiansky preukaz - zadná strana</p>
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
                        <label className="border border-gray-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors border border-gray-800">
                          <div className="text-left">
                            <p className="text-gray-300 text-sm">Vodičský preukaz - predná strana</p>
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
                        <label className="border border-gray-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-[rgb(250,146,8)] transition-colors border border-gray-800">
                          <div className="text-left">
                            <p className="text-gray-300 text-sm">Vodičský preukaz - zadná strana</p>
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
                          name="businessTerms"
                          checked={formData.businessTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[rgb(250,146,8)] border-gray-700 rounded focus:ring-[rgb(250,146,8)] mt-0.5"
                          required
                        />
                        <label htmlFor="businessTerms" className="text-white text-sm text-left cursor-pointer">
                          Súhlasím so <Link to="/terms" className="text-[rgb(250,146,8)] underline hover:text-[rgb(230,126,0)]">všeobecnými obchodnými podmienkami</Link> *
                        </label>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="dataProcessing"
                            name="dataProcessing"
                            checked={formData.dataProcessing}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[rgb(250,146,8)] border-gray-700 rounded focus:ring-[rgb(250,146,8)] mt-0.5"
                            required
                          />
                          <label htmlFor="dataProcessing" className="text-white text-sm text-left cursor-pointer">
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
                        className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-goldman font-semibold transition-colors duration-200"
                      >
                        Pokračovať
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-goldman font-bold text-white mb-6 text-left">
                      Potvrdenie rezervácie
                    </h2>

                    <div className="space-y-6">
                      {/* Summary Information */}
                      <div className="rounded-lg p-4 md:p-6 border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                        <h3 className="text-lg font-semibold text-white mb-4">Osobné údaje</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Meno a priezvisko:</p>
                            <p className="text-white font-goldman font-medium">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Email:</p>
                            <p className="text-white font-goldman font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Telefón:</p>
                            <p className="text-white font-goldman font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Adresa:</p>
                            <p className="text-white font-goldman font-medium">{formData.address.street}, {formData.address.postalCode} {formData.address.city}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg p-4 md:p-6 border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                        <h3 className="text-lg font-semibold text-white mb-4">Detaily rezervácie</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Vozidlo:</p>
                            <p className="text-white font-goldman font-medium">{selectedCar?.brand} {selectedCar?.model}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Poistenie:</p>
                            {formData.selectedInsurance && formData.selectedInsurance.length > 0 ? (
                              <div className="space-y-1">
                                {formData.selectedInsurance.map((ins, idx) => {
                                  let priceDisplay = '';
                                  if (ins.pricing?.type === 'per_day' && ins.pricing?.amount) {
                                    priceDisplay = ` (+${ins.pricing.amount}€/deň)`;
                                  } else if (ins.pricing?.type === 'fixed' && ins.pricing?.amount) {
                                    priceDisplay = ` (+${ins.pricing.amount}€)`;
                                  } else if (ins.pricing?.type === 'percentage' && ins.pricing?.amount) {
                                    priceDisplay = ` (+${ins.pricing.amount}%)`;
                                  } else if (ins.pricePerDay) {
                                    priceDisplay = ` (+${ins.pricePerDay}€/deň)`;
                                  } else if (ins.price) {
                                    priceDisplay = ` (+${ins.price}€)`;
                                  } else if (ins.dailyRate) {
                                    priceDisplay = ` (+${ins.dailyRate}€/deň)`;
                                  }

                                  return (
                                    <p key={idx} className="text-white font-medium">
                                      {ins.nameSk || ins.displayName || ins.name}{priceDisplay}
                                    </p>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-white font-goldman font-medium">Žiadne dodatočné poistenie</p>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-400">Prevzatie:</p>
                            <p className="text-white font-goldman font-medium">
                              {formData.pickupDate?.toLocaleDateString('sk-SK')} {formData.pickupTime}
                            </p>
                            <p className="text-gray-400 text-xs">{formData.pickupLocation.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Vrátenie:</p>
                            <p className="text-white font-goldman font-medium">
                              {formData.returnDate?.toLocaleDateString('sk-SK')} {formData.returnTime}
                            </p>
                            <p className="text-gray-400 text-xs">{formData.returnLocation.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Spôsob platby:</p>
                            <p className="text-white font-goldman font-medium">
                              {formData.paymentMethod === 'stripe' ? 'Stripe (Karta online)' : 'Bankový prevod'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {formData.specialRequests && (
                        <div className="rounded-lg p-4 md:p-6 border border-gray-800" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
                          <h3 className="text-lg font-semibold text-white mb-2">Špeciálne požiadavky</h3>
                          <p className="text-gray-300 text-sm">{formData.specialRequests}</p>
                        </div>
                      )}

                      <div className="rounded-lg p-6 border border-[rgb(250,146,8)]" style={{backgroundColor: 'rgba(250, 146, 8, 0.1)'}}>
                        <p className="text-white text-sm">
                          {formData.paymentMethod === 'stripe'
                            ? 'Po kliknutí na tlačidlo "Rezervovať" budete presmerovaní na platobnú bránu Stripe, kde dokončíte platbu.'
                            : 'Po kliknutí na tlačidlo "Rezervovať" Vám zobraziť údaje na bankový prevod.'}
                        </p>
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
                        type="submit"
                        disabled={loading}
                        className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                      >
                        {loading ? 'Spracováva sa...' : 'Rezervovať'}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Right Side - Rental Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-sm sticky overflow-hidden border border-gray-800" style={{ top: '140px', backgroundColor: 'rgb(25, 25, 25)' }}>
              {/* Selected Car */}
              {selectedCar && (
                <div>
                  <CarImage
                    car={selectedCar}
                    size="medium"
                    className="w-full h-64 object-cover"
                  />
                  <div className="px-6 pt-6 pb-4">
                    <h4 className="text-xl font-bold text-white">{selectedCar.brand} {selectedCar.model}</h4>
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
                    className="w-full border border-gray-700 rounded-md px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none" style={{
                        backgroundColor: '#191919', 
                        border: '1px solid #555',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', 
                        backgroundPosition: 'right 0.5rem center', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundSize: '1.5em 1.5em'
                      }}
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
                    className="w-full border border-gray-700 rounded-md px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none" style={{
                        backgroundColor: '#191919', 
                        border: '1px solid #555',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', 
                        backgroundPosition: 'right 0.5rem center', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundSize: '1.5em 1.5em'
                      }}
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
                    otherSelectedDate={formData.returnDate}
                    isReturnPicker={false}
                    onOtherDateReset={() => handleDateSelect('returnDate', null)}
                    carId={selectedCarId}
                    className="w-full"
                  />
                  <DatePicker
                    selectedDate={formData.returnDate}
                    onDateSelect={(date) => handleDateSelect('returnDate', date)}
                    minDate={formData.pickupDate ? new Date(formData.pickupDate.getTime() + 86400000 * 2) : new Date()}
                    unavailableDates={unavailableDates}
                    otherSelectedDate={formData.pickupDate}
                    isReturnPicker={true}
                    carId={selectedCarId}
                    className="w-full"
                  />
                </div>

                {/* Row 3: Time Selects */}
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.pickupTime}
                    onChange={(e) => handleInputChange({ target: { name: 'pickupTime', value: e.target.value } })}
                    className="w-full border border-gray-700 rounded-md px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none" style={{
                        backgroundColor: '#191919', 
                        border: '1px solid #555',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', 
                        backgroundPosition: 'right 0.5rem center', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundSize: '1.5em 1.5em'
                      }}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <select
                    value={formData.returnTime}
                    onChange={(e) => handleInputChange({ target: { name: 'returnTime', value: e.target.value } })}
                    className="w-full border border-gray-700 rounded-md px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)] appearance-none" style={{
                        backgroundColor: '#191919', 
                        border: '1px solid #555',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fa9208\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', 
                        backgroundPosition: 'right 0.5rem center', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundSize: '1.5em 1.5em'
                      }}
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
                      <span className="text-gray-300">Počet dní:</span>
                      <span className="font-medium text-white">{calculateDays()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Cena za deň:</span>
                      <span className="font-medium text-white">{getPricePerDay(calculateDays()).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Cena prenájmu:</span>
                      <span className="font-medium text-white">{(getPricePerDay(calculateDays()) * calculateDays()).toFixed(2)}€</span>
                    </div>

                    {/* Insurance breakdown */}
                    {formData.selectedInsurance && formData.selectedInsurance.length > 0 && (
                      <div className="space-y-2 pt-2" style={{borderTop: '0.5px solid #444'}}>
                        <div className="text-sm text-gray-300 font-semibold">Poistenie:</div>
                        {formData.selectedInsurance.map((insurance, idx) => {
                          const days = calculateDays();
                          let cost = 0;
                          let priceText = '';

                          if (insurance.pricing?.type === 'per_day' && insurance.pricing?.amount) {
                            cost = insurance.pricing.amount * days;
                            priceText = `${insurance.pricing.amount}€ × ${days} dní`;
                          } else if (insurance.pricing?.type === 'fixed' && insurance.pricing?.amount) {
                            cost = insurance.pricing.amount;
                            priceText = 'jednorazový poplatok';
                          } else if (insurance.pricing?.type === 'percentage' && insurance.pricing?.amount) {
                            const rentalCost = getPricePerDay(days) * days;
                            cost = (rentalCost * insurance.pricing.amount) / 100;
                            priceText = `${insurance.pricing.amount}%`;
                          }

                          return (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                {insurance.nameSk || insurance.name}
                                <span className="text-gray-400 ml-1">({priceText})</span>
                              </span>
                              <span className="font-medium text-white">{cost.toFixed(2)}€</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between text-sm font-semibold pt-1">
                          <span className="text-gray-300">Celkom poistenie:</span>
                          <span className="text-white">{calculateInsuranceCost().toFixed(2)}€</span>
                        </div>
                      </div>
                    )}

                    {/* Additional Services breakdown */}
                    {additionalServices && additionalServices.length > 0 && additionalServices.some(service => formData[service.name]) && (
                      <div className="space-y-2 pt-2" style={{borderTop: '0.5px solid #444'}}>
                        <div className="text-sm text-gray-300 font-semibold">Doplnkové služby:</div>
                        {additionalServices.filter(service => formData[service.name]).map((service, idx) => {
                          const days = calculateDays();
                          let cost = 0;
                          let priceText = '';

                          if (service.pricing?.type === 'per_day' && service.pricing?.amount) {
                            cost = service.pricing.amount * days;
                            priceText = `${service.pricing.amount}€ × ${days} dní`;
                          } else if (service.pricing?.type === 'fixed' && service.pricing?.amount) {
                            cost = service.pricing.amount;
                            priceText = 'jednorazový poplatok';
                          } else if (service.pricing?.type === 'percentage' && service.pricing?.amount) {
                            const rentalCost = getPricePerDay(days) * days;
                            cost = (rentalCost * service.pricing.amount) / 100;
                            priceText = `${service.pricing.amount}%`;
                          } else if (service.pricePerDay) {
                            cost = service.pricePerDay * days;
                            priceText = `${service.pricePerDay}€ × ${days} dní`;
                          } else if (service.price) {
                            cost = service.price;
                            priceText = 'jednorazový poplatok';
                          } else if (service.dailyRate) {
                            cost = service.dailyRate * days;
                            priceText = `${service.dailyRate}€ × ${days} dní`;
                          }

                          return (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                {service.nameSk || service.displayName || service.name}
                                <span className="text-gray-400 ml-1">({priceText})</span>
                              </span>
                              <span className="font-medium text-white">{cost.toFixed(2)}€</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between text-sm font-semibold pt-1">
                          <span className="text-gray-300">Celkom služby:</span>
                          <span className="text-white">{calculateAdditionalServicesCost().toFixed(2)}€</span>
                        </div>
                      </div>
                    )}

                    {/* Late Fees breakdown */}
                    {(calculateLatePickupFee() > 0 || calculateLateDropoffFee() > 0) && (
                      <div className="space-y-2 pt-2" style={{borderTop: '0.5px solid #444'}}>
                        <div className="text-sm text-gray-300 font-semibold">Poplatky za čas mimo hodín:</div>

                        {calculateLatePickupFee() > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              Prevzatie od 17:30
                              <span className="text-gray-400 ml-1">({formData.pickupTime})</span>
                            </span>
                            <span className="font-medium text-white">{calculateLatePickupFee().toFixed(2)}€</span>
                          </div>
                        )}

                        {calculateLateDropoffFee() > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              Vrátenie od 17:30
                              <span className="text-gray-400 ml-1">({formData.returnTime})</span>
                            </span>
                            <span className="font-medium text-white">{calculateLateDropoffFee().toFixed(2)}€</span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm font-semibold pt-1">
                          <span className="text-gray-300">Celkom poplatky:</span>
                          <span className="text-white">{(calculateLatePickupFee() + calculateLateDropoffFee()).toFixed(2)}€</span>
                        </div>
                      </div>
                    )}

                    {/* Location Fee breakdown */}
                    {calculateBratislavaLocationFee() > 0 && (() => {
                      const pickupDetails = getLocationFeeDetails(formData.pickupLocation);
                      const dropoffDetails = getLocationFeeDetails(formData.returnLocation);

                      return (
                        <div className="space-y-2 pt-2" style={{borderTop: '0.5px solid #444'}}>
                          <div className="text-sm text-gray-300 font-semibold">Príplatok za lokalitu:</div>

                          {pickupDetails && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                Prevzatie v meste {pickupDetails.displayName}
                                <span className="text-gray-400 ml-1">({formData.pickupLocation.name})</span>
                              </span>
                              <span className="font-medium text-white">{pickupDetails.fee.toFixed(2)}€</span>
                            </div>
                          )}

                          {dropoffDetails && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                Vrátenie v meste {dropoffDetails.displayName}
                                <span className="text-gray-400 ml-1">({formData.returnLocation.name})</span>
                              </span>
                              <span className="font-medium text-white">{dropoffDetails.fee.toFixed(2)}€</span>
                            </div>
                          )}

                          <div className="flex justify-between text-sm font-semibold pt-1">
                            <span className="text-gray-300">Celkom príplatok:</span>
                            <span className="text-white">{calculateBratislavaLocationFee().toFixed(2)}€</span>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="pt-3" style={{borderTop: '0.5px solid #d1d5db'}}>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Celková cena:</span>
                        <span className="text-[rgb(250,146,8)]">{calculateTotal().toFixed(2)}€</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-300">Depozit:</span>
                      <span className="font-medium text-white">{(selectedCar.pricing?.deposit || selectedCar.deposit || 0).toFixed(2)}€</span>
                    </div>
                  </div>
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