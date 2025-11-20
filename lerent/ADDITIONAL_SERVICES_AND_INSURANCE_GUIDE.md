# Guide: Additional Services & Insurance Integration via Public API

## Overview
This guide explains how to fetch, display, and submit additional services (including insurance) through the public API in a car rental booking system.

---

## 1. API Endpoints

### 1.1 Fetch Additional Services
**Endpoint:** `GET /api/public/users/{tenantEmail}/services`

**Purpose:** Retrieves all available services including both additional services and insurance options.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service123",
      "name": "gps",
      "nameSk": "GPS Navigácia",
      "displayName": "GPS Navigation",
      "description": "Modern GPS system with Slovakia and Europe maps",
      "descriptionSk": "Moderný GPS systém s mapami Slovenska a Európy",
      "type": "additional_service",
      "category": "equipment",
      "pricing": {
        "type": "per_day",
        "amount": 5
      },
      "isActive": true
    },
    {
      "_id": "insurance456",
      "name": "collision_damage_waiver",
      "nameSk": "Poistenie proti poškodeniu",
      "displayName": "Collision Damage Waiver",
      "description": "Comprehensive collision damage coverage",
      "descriptionSk": "Komplexné krytie poškodenia vozidla",
      "type": "insurance",
      "category": "insurance",
      "pricing": {
        "type": "per_day",
        "amount": 15
      },
      "isActive": true
    }
  ]
}
```

**Pricing Types:**
- `per_day` - Price per rental day (e.g., 5€/day)
- `fixed` - One-time fixed price (e.g., 50€ total)
- `percentage` - Percentage of rental cost (e.g., 10% of total)

---

## 2. Frontend Implementation

### 2.1 Fetching Services and Insurance

```javascript
// services/api.js
export const servicesAPI = {
  getServices: async () => {
    try {
      const response = await fetch(
        `${API_BASE}/public/users/${encodeURIComponent(TENANT_EMAIL)}/services`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
    return [];
  }
};
```

### 2.2 Separating Services and Insurance

```javascript
// In your booking component (e.g., BookingPage.jsx)
useEffect(() => {
  const loadServicesAndInsurance = async () => {
    try {
      // Fetch all services
      const services = await servicesAPI.getServices();

      // Filter for regular additional services (excluding insurance)
      const additionalServices = services.filter(service =>
        service.type !== 'insurance' &&
        service.category !== 'insurance' &&
        !service.name?.toLowerCase().includes('poistenie') &&
        !service.name?.toLowerCase().includes('insurance')
      );

      // Filter for insurance services
      const insuranceOptions = services.filter(service =>
        service.type === 'insurance' ||
        service.category === 'insurance' ||
        service.name?.toLowerCase().includes('poistenie') ||
        service.name?.toLowerCase().includes('insurance')
      );

      setAdditionalServices(additionalServices);
      setInsuranceOptions(insuranceOptions);

    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  loadServicesAndInsurance();
}, []);
```

### 2.3 State Management

```javascript
const [formData, setFormData] = useState({
  // Insurance selections (Step 1)
  selectedInsurance: [], // Array of insurance objects

  // Additional service checkboxes (Step 2)
  gps: false,
  childSeat: false,
  // ... dynamically created from additionalServices

  // Other form fields...
});
```

### 2.4 Handling Insurance Selection

```javascript
const handleInsuranceToggle = (insurance) => {
  setFormData(prev => {
    const isSelected = prev.selectedInsurance.some(
      ins => ins._id === insurance._id || ins.name === insurance.name
    );

    if (isSelected) {
      // Remove insurance
      return {
        ...prev,
        selectedInsurance: prev.selectedInsurance.filter(
          ins => ins._id !== insurance._id && ins.name !== insurance.name
        )
      };
    } else {
      // Add insurance (store full object)
      return {
        ...prev,
        selectedInsurance: [...prev.selectedInsurance, insurance]
      };
    }
  });
};
```

### 2.5 Rendering Insurance Options (Step 1)

```jsx
<div className="space-y-4">
  {insuranceOptions && insuranceOptions.length > 0 ? (
    insuranceOptions.map((insurance) => {
      const isSelected = formData.selectedInsurance.some(
        ins => ins._id === insurance._id || ins.name === insurance.name
      );

      return (
        <div
          key={insurance._id}
          onClick={() => handleInsuranceToggle(insurance)}
          className={`rounded-lg p-6 cursor-pointer border ${
            isSelected ? 'border-orange-500' : 'border-gray-800'
          }`}
        >
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleInsuranceToggle(insurance)}
              className="w-5 h-5 mt-1"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {insurance.nameSk || insurance.displayName || insurance.name}
              </h3>
              <p className="text-sm mt-1">
                {insurance.descriptionSk || insurance.description}
              </p>
            </div>
            <div className="text-orange-500 font-bold ml-4">
              {insurance.pricing?.type === 'per_day' && insurance.pricing?.amount
                ? `+${insurance.pricing.amount}€/deň`
                : insurance.pricing?.type === 'fixed' && insurance.pricing?.amount
                ? `+${insurance.pricing.amount}€`
                : insurance.pricing?.type === 'percentage' && insurance.pricing?.amount
                ? `+${insurance.pricing.amount}%`
                : 'Cena na vyžiadanie'}
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <p>Žiadne dostupné poistenia</p>
  )}
</div>
```

### 2.6 Rendering Additional Services (Step 2)

```jsx
<div className="space-y-4">
  {additionalServices && additionalServices.length > 0 ? (
    additionalServices.map((service) => (
      <label
        key={service._id || service.name}
        className="rounded-lg p-6 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name={service.name}
            checked={formData[service.name] || false}
            onChange={handleInputChange}
            className="w-5 h-5"
          />
          <div>
            <h3 className="text-lg font-semibold">
              {service.nameSk || service.displayName || service.name}
            </h3>
            <p className="text-sm">
              {service.descriptionSk || service.description}
            </p>
          </div>
        </div>
        <span className="text-orange-500 font-bold">
          {service.pricing?.type === 'per_day' && service.pricing?.amount
            ? `+${service.pricing.amount}€/deň`
            : service.pricing?.type === 'fixed' && service.pricing?.amount
            ? `+${service.pricing.amount}€`
            : service.pricing?.type === 'percentage' && service.pricing?.amount
            ? `+${service.pricing.amount}%`
            : 'Cena na vyžiadanie'}
        </span>
      </label>
    ))
  ) : (
    <p>Žiadne dostupné služby</p>
  )}
</div>
```

---

## 3. Submitting Reservation with Services

### 3.1 Calculate Service Costs

```javascript
const calculateDays = () => {
  if (!formData.pickupDate || !formData.returnDate) return 0;
  const diffTime = Math.abs(formData.returnDate - formData.pickupDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const calculateServiceCost = (service, days) => {
  let cost = 0;

  if (service.pricing?.type === 'per_day' && service.pricing?.amount) {
    cost = service.pricing.amount * days;
  } else if (service.pricing?.type === 'fixed' && service.pricing?.amount) {
    cost = service.pricing.amount;
  } else if (service.pricing?.type === 'percentage' && service.pricing?.amount) {
    const rentalCost = getPricePerDay(days) * days;
    cost = (rentalCost * service.pricing.amount) / 100;
  }

  return Number(cost);
};
```

### 3.2 Build Reservation Payload

**IMPORTANT:** The key point is that insurance from Step 1 is now included in the `selectedServices` array along with additional services from Step 2.

```javascript
const submitReservation = async () => {
  const days = calculateDays();

  const reservationData = {
    // Customer information
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,

    // Reservation details
    carId: selectedCarId,
    startDate: pickupDateTime.toISOString(),
    endDate: returnDateTime.toISOString(),

    // Combined additional services (includes BOTH regular services AND insurance)
    selectedServices: [
      // Regular additional services from Step 2
      ...additionalServices
        .filter(service => formData[service.name])
        .map(service => ({
          id: service._id || service.id,
          name: service.name,
          totalPrice: calculateServiceCost(service, days)
        })),

      // Insurance from Step 1
      ...(Array.isArray(formData.selectedInsurance)
        ? formData.selectedInsurance.map(insurance => ({
            id: insurance._id || insurance.id,
            name: insurance.name,
            totalPrice: calculateServiceCost(insurance, days)
          }))
        : [])
    ],

    servicesTotal: calculateAdditionalServicesCost(),

    // Optional: Keep separate insurance field for backward compatibility
    selectedAdditionalInsurance: Array.isArray(formData.selectedInsurance)
      ? formData.selectedInsurance.map(insurance => ({
          id: insurance._id || insurance.id,
          name: insurance.name,
          totalPrice: calculateServiceCost(insurance, days)
        }))
      : [],

    insuranceTotal: calculateInsuranceCost(),

    // Other fields...
    totalPrice: calculateTotal(),
    paymentType: 'stripe', // or 'prevod'
    status: 'pending_payment'
  };

  // Submit to backend
  const response = await paymentService.createReservation(reservationData);
  return response;
};
```

### 3.3 Reservation API Call

**Endpoint:** `POST /api/public/users/{tenantEmail}/reservations`

**Request Body Example:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+421901234567",
  "carId": "car123",
  "startDate": "2025-12-01T08:00:00.000Z",
  "endDate": "2025-12-05T08:00:00.000Z",
  "selectedServices": [
    {
      "id": "service123",
      "name": "gps",
      "totalPrice": 20
    },
    {
      "id": "service124",
      "name": "childSeat",
      "totalPrice": 12
    },
    {
      "id": "insurance456",
      "name": "collision_damage_waiver",
      "totalPrice": 60
    }
  ],
  "servicesTotal": 92,
  "selectedAdditionalInsurance": [
    {
      "id": "insurance456",
      "name": "collision_damage_waiver",
      "totalPrice": 60
    }
  ],
  "insuranceTotal": 60,
  "totalPrice": 252,
  "paymentType": "stripe",
  "status": "pending_payment"
}
```

**Key Points:**
1. **`selectedServices`** - Contains ALL selected services including:
   - Regular additional services (GPS, child seat, etc.)
   - Insurance options (collision damage waiver, theft protection, etc.)

2. **`selectedAdditionalInsurance`** - Optional separate field for backward compatibility, contains only insurance

3. Each service/insurance object includes:
   - `id` - Service/insurance ID from the database
   - `name` - Service/insurance name
   - `totalPrice` - Calculated total cost for the rental period

4. Prices are calculated based on:
   - `per_day`: `amount × numberOfDays`
   - `fixed`: `amount` (one-time fee)
   - `percentage`: `(rentalCost × amount) / 100`

---

## 4. Backend Expectations

The backend should:
1. Accept `selectedServices` array containing both services and insurance
2. Optionally accept `selectedAdditionalInsurance` for backward compatibility
3. Validate that service/insurance IDs exist in the database
4. Recalculate prices server-side to prevent manipulation
5. Store selected services with the reservation

---

## 5. Key Implementation Details

### 5.1 Why Combine Services and Insurance?

Insurance is treated as a special type of additional service because:
- Both have similar data structures
- Both need price calculation
- Both are optional selections
- Backend can handle them uniformly in `selectedServices`

### 5.2 Two-Step Flow

**Step 1 - Insurance Selection:**
- User selects insurance options
- Stored in `formData.selectedInsurance` array
- Full insurance objects stored for price calculation

**Step 2 - Additional Services:**
- User selects regular services (GPS, child seat, etc.)
- Stored as boolean flags in `formData` (e.g., `formData.gps = true`)

**On Submit:**
- Both are combined into `selectedServices` array
- Each item transformed to `{id, name, totalPrice}` format

### 5.3 Price Calculation

Always calculate prices on the frontend for display, but backend should:
- Validate the prices sent
- Recalculate server-side
- Use server-calculated prices for the actual reservation

---

## 6. Complete Integration Checklist

- [ ] Fetch services from `/api/public/users/{tenantEmail}/services`
- [ ] Separate services into insurance and additional services
- [ ] Display insurance options in Step 1 with checkboxes
- [ ] Display additional services in Step 2 with checkboxes
- [ ] Store insurance selections in array, services as boolean flags
- [ ] Calculate costs for each service/insurance based on pricing type
- [ ] Combine insurance and services into `selectedServices` array
- [ ] Include service ID, name, and totalPrice for each item
- [ ] Send reservation to `/api/public/users/{tenantEmail}/reservations`
- [ ] Include both `selectedServices` and `selectedAdditionalInsurance`
- [ ] Display selected services in booking summary
- [ ] Show correct pricing in total calculation

---

## 7. Testing

### Test Cases:
1. Select only insurance → Check `selectedServices` contains insurance
2. Select only additional services → Check `selectedServices` contains services
3. Select both → Check `selectedServices` contains both
4. Select none → Check `selectedServices` is empty array
5. Per-day pricing → Verify calculation: `amount × days`
6. Fixed pricing → Verify calculation: `amount`
7. Percentage pricing → Verify calculation: `(rentalCost × percentage) / 100`

---

## 8. Common Issues and Solutions

**Issue:** Insurance not appearing in `selectedServices`
**Solution:** Ensure insurance array is spread into services array using `...formData.selectedInsurance.map(...)`

**Issue:** Price calculation incorrect
**Solution:** Verify pricing type and use correct formula for per_day, fixed, or percentage

**Issue:** Services API returns empty array
**Solution:** Check that services are marked as `isActive: true` in the backend database

**Issue:** Backend rejects payload
**Solution:** Verify service IDs exist in database and match the format expected by backend

---

## 9. Example Files

- **API Service:** `/car-rental-frontend/src/services/api.js` - `servicesAPI`
- **Booking Page:** `/car-rental-frontend/src/pages/BookingPage.jsx` - Lines 588-673
- **Payment Service:** `/car-rental-frontend/src/services/paymentService.js` - `createReservation()`

---

## Summary

The key innovation is **combining insurance and additional services into a single `selectedServices` array** in the reservation payload, while maintaining separate UI flows for better UX:

1. Fetch all services via public API
2. Filter into insurance (Step 1) and additional services (Step 2)
3. Store selections separately during form completion
4. Combine both into `selectedServices` array on submission
5. Send unified payload to backend with calculated prices

This approach provides:
- Clean separation of concerns in UI
- Unified backend handling
- Flexible pricing models (per-day, fixed, percentage)
- Easy maintenance and extension
