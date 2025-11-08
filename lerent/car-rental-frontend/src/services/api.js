// API base URL from environment variables (Vite uses VITE_ prefix)
// If VITE_API_BASE_URL is empty or undefined, use relative path for Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = API_BASE_URL
  ? `${API_BASE_URL}/api`  // Production: use full URL
  : '/api';                 // Development: use relative path (Vite proxy)

// Tenant email from environment variables
const TENANT_EMAIL = import.meta.env.VITE_TENANT_EMAIL || 'lerent@lerent.sk';

// Import car images as modules for production compatibility
import ArkanaImg from '../test.png';
import OctaviaImg from '../test.png';
import ScalaImg from '../test.png';
import MonteCarloImg from '../test.png';
import CorollaImg from '../test.png';
import TarracoImg from '../test.png';
import TouranImg from '../test.png';

// API Configuration
const API_CONFIG = {
  // Use tenant-specific endpoints when available
  useTenantEndpoints: true,
  // Fallback to general endpoints if tenant-specific fail
  enableFallback: true,
  // Use mock data for development (controlled by environment variable)
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true'
};

// Log configuration on load
console.log('🚀 API Configuration:');
console.log('  Base URL:', API_BASE);
console.log('  Tenant:', TENANT_EMAIL);
console.log('  Using Mock Data:', API_CONFIG.useMockData);

// Mock data for development/fallback
const mockCarsData = [
  // Renault Arkana AT
  {
    _id: 'ark1',
    brand: 'Renault',
    model: 'Arkana AT',
    year: 2024,
    category: 'stredna',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    dailyRate: 37,
    weeklyRate: 280,
    monthlyRate: 1100,
    power: '110kW',
    status: 'available',
    deposit: 700,
    pricing: {
      deposit: 700,
      dailyRate: 37
    },
    description: 'Elegantný crossover coupe s automatickou prevodovkou.',
    features: ['air-conditioning', 'gps', 'bluetooth', 'rear-camera'],
    images: [
      {
        url: ArkanaImg,
        description: 'Renault Arkana AT',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  },
  
  // Škoda Octavia 4 Combi AT
  {
    _id: 'oct1',
    brand: 'Škoda',
    model: 'Octavia 4 Combi AT',
    year: 2024,
    category: 'stredna',
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    dailyRate: 37,
    weeklyRate: 320,
    monthlyRate: 1250,
    power: '110kW',
    status: 'available',
    deposit: 800,
    pricing: {
      deposit: 800,
      dailyRate: 37
    },
    description: 'Najnovšie kombi Škoda s veľkým batožinovým priestorom a modernou technikou.',
    features: ['air-conditioning', 'gps', 'bluetooth', 'cruise-control', 'extra-luggage'],
    images: [
      {
        url: OctaviaImg,
        description: 'Škoda Octavia 4 Combi AT',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  },
  
  // Škoda Scala Ambition AT
  {
    _id: 'sca1',
    brand: 'Škoda',
    model: 'Scala Ambition AT',
    year: 2023,
    category: 'ekonomicka',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    dailyRate: 30,
    weeklyRate: 230,
    monthlyRate: 900,
    power: '85kW',
    status: 'available',
    deposit: 600,
    pricing: {
      deposit: 600,
      dailyRate: 37
    },
    description: 'Moderný kompaktný liftback s automatickou prevodovkou a bohatým vybavením.',
    features: ['air-conditioning', 'bluetooth', 'usb-ports', 'cruise-control'],
    images: [
      {
        url: ScalaImg,
        description: 'Škoda Scala Ambition AT',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  },
  
  // Škoda Scala MonteCarlo AT
  {
    _id: 'mon1',
    brand: 'Škoda',
    model: 'Scala MonteCarlo AT',
    year: 2024,
    category: 'stredna',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    dailyRate: 30,
    weeklyRate: 260,
    monthlyRate: 1020,
    power: '110kW',
    status: 'available',
    deposit: 700,
    pricing: {
      deposit: 700,
      dailyRate: 37
    },
    description: 'Športová verzia Scala s dizajnom MonteCarlo a výkonným motorom.',
    features: ['air-conditioning', 'gps', 'bluetooth', 'heated-seats', 'sport-package'],
    images: [
      {
        url: MonteCarloImg,
        description: 'Škoda Scala MonteCarlo AT',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  },
  
  // Toyota Corolla AT
  {
    _id: 'cor1',
    brand: 'Toyota',
    model: 'Corolla AT',
    year: 2023,
    category: 'ekonomicka',
    fuelType: 'hybrid',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    dailyRate: 34,
    weeklyRate: 240,
    monthlyRate: 950,
    power: '90kW',
    status: 'available',
    deposit: 600,
    pricing: {
      deposit: 600,
      dailyRate: 37
    },
    description: 'Spoľahlivý hybridný sedan s nízkou spotrebou paliva.',
    features: ['air-conditioning', 'bluetooth', 'rear-camera', 'hybrid'],
    images: [
      {
        url: CorollaImg,
        description: 'Toyota Corolla AT',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  },
  
  // Seat Tarraco FR 4WD AT (moved to 6th position)
  {
    _id: 'tar1',
    brand: 'Seat',
    model: 'Tarraco FR 4WD AT',
    year: 2023,
    category: 'vyssia',
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 7,
    doors: 4,
    dailyRate: 60,
    weeklyRate: 450,
    monthlyRate: 1800,
    power: '150kW',
    status: 'available',
    deposit: 1000,
    pricing: {
      deposit: 1000,
      dailyRate: 37
    },
    description: 'Výkonné 7-miestne SUV s pohonom všetkých kolies a športovým paketom FR.',
    features: ['air-conditioning', 'gps', 'bluetooth', 'heated-seats', '4x4', 'leather-seats'],
    images: [
      {
        url: TarracoImg,
        description: 'Seat Tarraco FR 4WD AT',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  },
  
  // VW Touran Highline AT, 7 miestne (moved to last position)
  {
    _id: 'tou1',
    brand: 'Volkswagen',
    model: 'Touran Highline AT, 7 miestne',
    year: 2024,
    category: 'viacmiestne',
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 7,
    doors: 4,
    dailyRate: 42,
    weeklyRate: 420,
    monthlyRate: 1650,
    power: '110kW',
    status: 'available',
    deposit: 900,
    pricing: {
      deposit: 900,
      dailyRate: 37
    },
    description: 'Priestranný 7-miestny rodinný van s prémiovým vybavením Highline.',
    features: ['air-conditioning', 'gps', 'bluetooth', 'heated-seats', 'extra-luggage', 'cruise-control'],
    images: [
      {
        url: TouranImg,
        description: 'VW Touran Highline AT, 7 miestne',
        isPrimary: true
      }
    ],
    location: {
      name: 'Bratislava',
      address: {
        street: 'Záhradnícka 68',
        city: 'Bratislava',
        zipCode: '821 08',
        country: 'Slovensko'
      }
    }
  }
];

// Helper function to get auth token
const getToken = () => localStorage.getItem('authToken');

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Authentication API
export const authAPI = {
  // Register a new customer
  register: async (customerData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...customerData,
        role: 'customer', // Always set to customer
      })
    });

    const result = await handleResponse(response);
    
    if (result.success) {
      localStorage.setItem('authToken', result.token);
      return result.user;
    } else {
      throw new Error(result.message);
    }
  },

  // Login customer
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const result = await handleResponse(response);
    
    if (result.success) {
      localStorage.setItem('authToken', result.token);
      return result.user;
    } else {
      throw new Error(result.message);
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const result = await handleResponse(response);
      return result.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
  }
};

// Cars API (Using Tenant-Specific Public Endpoints)
export const carsAPI = {
  // Get all available cars for RIVAL tenant
  getAvailableCars: async (filters = {}) => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for cars');
      return mockCarsData;
    }

    const queryParams = new URLSearchParams({
      ...filters
    });

    // Try tenant-specific endpoint first
    if (API_CONFIG.useTenantEndpoints) {
      try {
        const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/cars?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await handleResponse(response);
          console.log('Cars returned from tenant API:', result.data?.length || 0, 'cars');
          console.log('Additional services from API:', result.filters?.additionalServices || []);
          // Return full result object with data and filters
          return {
            data: result.data || [],
            filters: result.filters || {}
          };
        }
      } catch (error) {
        console.warn('Tenant-specific API failed, trying fallback:', error.message);
      }
    }

    // Fallback to general endpoint or mock data
    if (API_CONFIG.enableFallback) {
      try {
        const response = await fetch(`${API_BASE}/public/cars?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await handleResponse(response);
        console.log('Cars returned from fallback API:', result.data?.length || 0, 'cars');
        return result.data || [];
      } catch (error) {
        console.warn('Fallback API also failed, using mock data:', error.message);
        // Return mock data for development
        return mockCarsData;
      }
    }

    return [];
  },

  // Get single car details for RIVAL tenant
  getCarDetails: async (carId) => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for car details');
      return mockCarsData.find(car => car._id === carId) || mockCarsData[0];
    }

    // Try tenant-specific endpoint first
    if (API_CONFIG.useTenantEndpoints) {
      try {
        const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/cars/${carId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await handleResponse(response);
          return result.data;
        }
      } catch (error) {
        console.warn('Tenant-specific car details failed, trying fallback:', error.message);
      }
    }

    // Fallback to general endpoint or mock data
    if (API_CONFIG.enableFallback) {
      try {
        const response = await fetch(`${API_BASE}/public/cars/${carId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await handleResponse(response);
        return result.data;
      } catch (error) {
        console.warn('Fallback car details also failed, using mock data:', error.message);
        // Return mock data
        return mockCarsData.find(car => car._id === carId) || mockCarsData[0];
      }
    }

    return null;
  },

  // Get car availability for date range for RIVAL tenant
  getCarAvailability: async (carId, startDate, endDate) => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for car availability');
      return { isAvailable: true, status: 'available' };
    }

    const queryParams = new URLSearchParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    // Try tenant-specific endpoint first
    if (API_CONFIG.useTenantEndpoints) {
      try {
        const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/cars/${carId}/availability?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await handleResponse(response);
          console.log('✅ Car availability data from API:', result.data);
          console.log('   Unavailable dates:', result.data?.unavailableDates);

          // If backend doesn't return unavailableDates, fetch calendar to build it
          if (!result.data?.unavailableDates) {
            console.warn('⚠️ Backend availability API does not return unavailableDates array');
            console.warn('   Fetching calendar to build unavailableDates...');

            try {
              // Fetch calendar for this car using the correct endpoint
              const calendarResponse = await fetch(
                `${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/cars/${carId}/calendar?startDate=${queryParams.get('startDate')}&endDate=${queryParams.get('endDate')}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                }
              );

              if (calendarResponse.ok) {
                const calendarResult = await handleResponse(calendarResponse);
                const calendar = calendarResult.data?.calendar;
                console.log('📅 Found calendar data for car:', calendar);

                // Build unavailableDates array from booked dates
                const unavailableDates = [];

                if (calendar && calendar.bookedDates && Array.isArray(calendar.bookedDates)) {
                  calendar.bookedDates.forEach(bookedDate => {
                    // Extract just the date part (YYYY-MM-DD) from the ISO string
                    const dateStr = bookedDate.date.split('T')[0];
                    if (!unavailableDates.includes(dateStr)) {
                      unavailableDates.push(dateStr);
                    }
                  });
                }

                console.log('🔴 Generated unavailable dates from calendar:', unavailableDates);
                console.log('   Total booked days:', unavailableDates.length);

                return {
                  ...result.data,
                  unavailableDates: unavailableDates
                };
              }
            } catch (calendarError) {
              console.warn('Failed to fetch calendar for unavailable dates:', calendarError);
            }
          }

          return result.data || { isAvailable: true, status: 'available' };
        }
      } catch (error) {
        console.warn('Tenant-specific availability check failed, trying fallback:', error.message);
      }
    }

    // Fallback to general endpoint or assume available
    if (API_CONFIG.enableFallback) {
      try {
        const response = await fetch(`${API_BASE}/public/cars/${carId}/availability?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await handleResponse(response);
        return result.data || { isAvailable: true, status: 'available' };
      } catch (error) {
        console.warn('Fallback availability check failed, assuming available:', error.message);
      }
    }

    // Default to available
    return { isAvailable: true, status: 'available' };
  },

  // Get cars by category for RIVAL tenant
  getCarsByCategory: async (category) => {
    const response = await fetch(`${API_BASE}/public/users/${TENANT_EMAIL}/cars/category/${category}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await handleResponse(response);
    return result.data || [];
  },

  // Get available features for RIVAL tenant
  getFeatures: async () => {
    const response = await fetch(`${API_BASE}/public/users/${TENANT_EMAIL}/features`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await handleResponse(response);
    return result.data || [];
  }
};

// Additional Services API
export const servicesAPI = {
  // Get all services for a tenant
  getServices: async () => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for services');
      return [];
    }

    try {
      const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/services`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await handleResponse(response);
        console.log('📋 Services from API:', result.data || []);
        return result.data || [];
      }
    } catch (error) {
      console.warn('Failed to fetch services:', error.message);
      return [];
    }

    return [];
  },

  // Get services for a specific vehicle
  getServicesForVehicle: async (vehicleId) => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for vehicle services');
      return [];
    }

    try {
      const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/services/vehicle/${vehicleId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await handleResponse(response);
        console.log('📋 Vehicle services from API:', result.data || []);
        return result.data || [];
      }
    } catch (error) {
      console.warn('Failed to fetch vehicle services:', error.message);
      return [];
    }

    return [];
  },

  // Calculate service price
  calculateServicePrice: async (serviceData) => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for service price calculation');
      return { totalPrice: 0, breakdown: [] };
    }

    try {
      const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/services/calculate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });

      if (response.ok) {
        const result = await handleResponse(response);
        console.log('💰 Service price calculation:', result.data || {});
        return result.data || { totalPrice: 0, breakdown: [] };
      }
    } catch (error) {
      console.warn('Failed to calculate service price:', error.message);
      return { totalPrice: 0, breakdown: [] };
    }

    return { totalPrice: 0, breakdown: [] };
  }
};

// Insurance API
export const insuranceAPI = {
  // Get extended insurance for a specific car
  getExtendedInsurance: async (carId) => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for insurance');
      return [];
    }

    try {
      const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/cars/${carId}/extended-insurance`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await handleResponse(response);
        console.log('🛡️ Insurance options from API:', result.data || []);
        return result.data || [];
      }
    } catch (error) {
      console.warn('Failed to fetch insurance options:', error.message);
      return [];
    }

    return [];
  }
};

// Reservations API
export const reservationsAPI = {
  // Create a new reservation using RIVAL tenant-specific endpoint
  createPublicReservation: async (reservationData) => {
    console.log('Sending reservation data to RIVAL backend:', reservationData);
    
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      console.log('Using mock data for reservation creation');
      // Return mock successful reservation
      return {
        reservation: {
          _id: 'mock-reservation-' + Date.now(),
          ...reservationData,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          totalAmount: 150
        },
        car: mockCarsData.find(car => car._id === reservationData.carId) || mockCarsData[0],
        customer: {
          _id: 'mock-customer-' + Date.now(),
          firstName: reservationData.firstName,
          lastName: reservationData.lastName,
          email: reservationData.email,
          phone: reservationData.phone
        },
        pricing: {
          rentalCost: 150,
          deposit: 0,
          totalCost: 150,
          days: Math.ceil((new Date(reservationData.endDate) - new Date(reservationData.startDate)) / (1000 * 60 * 60 * 24))
        }
      };
    }
    
    // Try tenant-specific endpoint first
    if (API_CONFIG.useTenantEndpoints) {
      try {
        const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData)
        });

        if (response.ok) {
          const result = await handleResponse(response);
          return result.data;
        }
      } catch (error) {
        console.warn('Tenant-specific reservation creation failed, trying fallback:', error.message);
      }
    }

    // Fallback to general endpoint
    if (API_CONFIG.enableFallback) {
      try {
        const response = await fetch(`${API_BASE}/public/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData)
        });

        const result = await handleResponse(response);
        return result.data;
      } catch (error) {
        console.error('All reservation endpoints failed:', error.message);
        throw new Error('Rezervácia momentálne nie je možná. Skúste to neskôr alebo nás kontaktujte telefonicky.');
      }
    }

    throw new Error('Rezervácia nie je k dispozícii.');
  },

  // Create a new reservation (authenticated)
  create: async (reservationData) => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
    });

    const result = await handleResponse(response);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  },

  // Get customer's reservations
  getMyReservations: async () => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE}/reservations?populate=car`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await handleResponse(response);
    return result.data || [];
  },

  // Cancel reservation
  cancel: async (reservationId, reason) => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE}/reservations/${reservationId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason })
    });

    const result = await handleResponse(response);
    return result.data;
  }
};

// Utility functions for booking flow
export const bookingAPI = {
  // Complete booking process using PUBLIC API
  completeBooking: async (bookingData, customerData = null) => {
    try {
      let user = await authAPI.getCurrentUser();

      // If no user is logged in, use public reservation endpoint
      if (!user && customerData) {
        // Use public reservation API which auto-creates customer
        const publicReservationData = {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          licenseNumber: customerData.licenseNumber,
          carId: bookingData.selectedCarId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          pickupLocation: {
            name: bookingData.pickupLocation.name || 'Pickup Location',
            address: {
              street: bookingData.pickupLocation.address || bookingData.pickupLocation.street || '123 Main St',
              city: bookingData.pickupLocation.city || 'New York',
              state: bookingData.pickupLocation.state || 'NY',
              postalCode: bookingData.pickupLocation.postalCode || '10001',
              country: bookingData.pickupLocation.country || 'US'
            }
          },
          dropoffLocation: {
            name: bookingData.dropoffLocation.name || 'Dropoff Location',
            address: {
              street: bookingData.dropoffLocation.address || bookingData.dropoffLocation.street || '123 Main St',
              city: bookingData.dropoffLocation.city || 'New York',
              state: bookingData.dropoffLocation.state || 'NY',
              postalCode: bookingData.dropoffLocation.postalCode || '10001',
              country: bookingData.dropoffLocation.country || 'US'
            }
          },
          specialRequests: bookingData.specialRequests || '',
          // Optional fields
          dateOfBirth: customerData.dateOfBirth,
          licenseExpiry: customerData.licenseExpiry,
          address: customerData.address
        };

        const result = await reservationsAPI.createPublicReservation(publicReservationData);
        
        // The public API should return reservation details and created user info
        return {
          reservation: result.reservation,
          car: result.car || await carsAPI.getCarDetails(bookingData.selectedCarId),
          costs: result.pricing || {
            rentalCost: result.reservation.totalAmount || 0,
            deposit: 0,
            totalCost: result.reservation.totalAmount || 0,
            days: Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))
          },
          user: result.customer,
          credentials: result.credentials // Login credentials for new user
        };
      }

      // If user is logged in, use authenticated endpoint
      if (user) {
        // Get selected car details
        const car = await carsAPI.getCarDetails(bookingData.selectedCarId);

        // Calculate costs
        const days = Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24));
        const rentalCost = car.dailyRate * days;
        const totalCost = rentalCost + (car.deposit || 0);

        // Create reservation using authenticated endpoint
        const reservation = await reservationsAPI.create({
          customer: user._id || user.id,
          car: bookingData.selectedCarId,
          startDate: new Date(bookingData.startDate).toISOString(),
          endDate: new Date(bookingData.endDate).toISOString(),
          pickupLocation: bookingData.pickupLocation,
          dropoffLocation: bookingData.dropoffLocation,
          additionalDrivers: bookingData.additionalDrivers || [],
          specialRequests: bookingData.specialRequests || ''
        });

        return {
          reservation,
          car,
          costs: {
            rentalCost,
            deposit: car.deposit || 0,
            totalCost,
            days
          },
          user
        };
      }

      throw new Error('Authentication required or customer data missing');

    } catch (error) {
      console.error('Booking failed:', error.message);
      throw error;
    }
  }
};

// Locations API
export const locationsAPI = {
  // Get pickup and dropoff locations for the tenant
  getPickupLocations: async () => {
    try {
      console.log('📍 Fetching pickup locations from API...');

      const response = await fetch(
        `${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/pickup-locations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const result = await handleResponse(response);

      if (result.success && result.data && result.data.pickupLocations) {
        console.log('✅ Pickup locations loaded:', result.data.pickupLocations.length, 'locations');
        return {
          locations: result.data.pickupLocations,
          defaultLocation: result.data.defaultLocation
        };
      }

      throw new Error('Invalid response format from pickup locations API');
    } catch (error) {
      console.error('❌ Error fetching pickup locations:', error);

      // Return empty array as fallback
      return {
        locations: [],
        defaultLocation: null
      };
    }
  },

  // Get default location from locations array
  getDefaultLocation: (locations) => {
    if (!locations || locations.length === 0) return null;
    return locations.find(loc => loc.isDefault) || locations[0];
  },

  // Find location by ID
  findLocationById: (locations, locationId) => {
    if (!locations || !locationId) return null;
    return locations.find(loc => loc.id === locationId);
  },

  // Find location by name
  findLocationByName: (locations, locationName) => {
    if (!locations || !locationName) return null;
    return locations.find(loc => loc.name === locationName);
  }
};

// Banners API
export const bannersAPI = {
  // Get all active banners
  getAll: async () => {
    try {
      console.log('🎨 Fetching banners from API...');

      const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/banners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn('⚠️ Failed to fetch banners from API');
        return { success: false, data: [] };
      }

      const data = await response.json();
      console.log('✅ Banners loaded:', data.data?.length || 0, 'banners');
      return data;

    } catch (error) {
      console.error('❌ Error fetching banners:', error);
      return { success: false, data: [] };
    }
  },

  // Get banners by position
  getByPosition: async (position) => {
    try {
      console.log(`🎨 Fetching banners for position "${position}" from API...`);

      const response = await fetch(`${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/banners?position=${position}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch banners for position "${position}"`);
        return [];
      }

      const data = await response.json();
      console.log(`✅ Banners loaded for position "${position}":`, data.data?.length || 0, 'banners');
      return data.data || [];

    } catch (error) {
      console.error(`❌ Error filtering banners for position "${position}":`, error);
      return [];
    }
  }
};

export default {
  auth: authAPI,
  cars: carsAPI,
  reservations: reservationsAPI,
  booking: bookingAPI,
  services: servicesAPI,
  insurance: insuranceAPI,
  locations: locationsAPI,
  banners: bannersAPI
}; 