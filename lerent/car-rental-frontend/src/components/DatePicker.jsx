import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

const DatePicker = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  unavailableDates = [],
  placeholder = "Vyberte dátum",
  otherSelectedDate = null, // The other date in the range (pickup or return)
  isReturnPicker = false, // Flag to indicate if this is the return date picker
  onOtherDateReset = null, // Callback to reset the other date picker
  showYearMonthSelectors = false // Flag to show year/month dropdowns for easier navigation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Slovak month names
  const monthNames = [
    'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
    'Júl', 'August', 'September', 'Október', 'November', 'December'
  ];

  // Slovak day names
  const dayNames = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('sk-SK');
  };

  // Format date to YYYY-MM-DD in local timezone (avoids timezone shift issues)
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date) => {
    const dateStr = formatDateLocal(date);

    // Check if date is before minimum date
    if (minDate && date < minDate) return true;

    // Check if date is after maximum date
    if (maxDate && date > maxDate) return true;

    // Check if date is in unavailable dates
    if (unavailableDates.includes(dateStr)) return true;

    // For return picker: Check if selecting this date would create less than 2-day reservation
    if (isReturnPicker && otherSelectedDate) {
      const pickupDate = otherSelectedDate;
      const daysDifference = Math.ceil((date - pickupDate) / (1000 * 60 * 60 * 24));
      if (daysDifference < 2) return true;
    }

    // For pickup picker: Check if selecting this date would create less than 2-day reservation with current return date
    if (!isReturnPicker && otherSelectedDate) {
      const returnDate = otherSelectedDate;
      const daysDifference = Math.ceil((returnDate - date) / (1000 * 60 * 60 * 24));
      if (daysDifference < 2) return true;
    }

    return false;
  };

  const isDateUnavailable = (date) => {
    const dateStr = formatDateLocal(date);
    return unavailableDates.includes(dateStr);
  };

  // Check if there are any unavailable dates between two dates
  const hasUnavailableDatesBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure start is before end
    if (start > end) return false;

    // Check each date in the range
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = formatDateLocal(currentDate);
      if (unavailableDates.includes(dateStr)) {
        return true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return false;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0, Sunday = 6
    let startDay = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const handleYearChange = (year) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(parseInt(year));
      return newMonth;
    });
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(parseInt(month));
      return newMonth;
    });
  };

  // Generate year options (100 years range centered on current year or based on min/max dates)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const minYear = minDate ? minDate.getFullYear() : currentYear - 100;
    const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 10;
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) {
      return;
    }

    // If this is the return picker and we have a pickup date, validate the range
    if (isReturnPicker && otherSelectedDate) {
      const pickupDate = otherSelectedDate;
      const returnDate = date;

      // Check for minimum 2-day reservation
      const daysDifference = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
      if (daysDifference < 2) {
        alert('Minimálna dĺžka rezervácie sú 2 dni. Prosím vyberte dátum vrátenia minimálne 2 dni po dátume prevzatia.');
        return;
      }

      if (hasUnavailableDatesBetween(pickupDate, returnDate)) {
        alert('Nemôžete vybrať tento dátum, pretože v rozsahu sú nedostupné dni. Prosím vyberte iný dátum.');
        return;
      }
    }

    // If this is the pickup picker and we have a return date, check if we need to reset return date
    if (!isReturnPicker && otherSelectedDate) {
      const pickupDate = date;
      const returnDate = otherSelectedDate;

      // If pickup date is on or after return date, reset the return date
      if (pickupDate >= returnDate) {
        if (onOtherDateReset) {
          onOtherDateReset(); // Reset the return date
        }
      } else {
        // Check for minimum 2-day reservation
        const daysDifference = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
        if (daysDifference < 2) {
          alert('Minimálna dĺžka rezervácie sú 2 dni. Prosím vyberte dátum prevzatia minimálne 2 dni pred dátumom vrátenia.');
          return;
        }

        if (hasUnavailableDatesBetween(pickupDate, returnDate)) {
          alert('Nemôžete vybrať tento dátum, pretože v rozsahu sú nedostupné dni. Prosím vyberte iný dátum.');
          return;
        }
      }
    }

    onDateSelect(date);
    setIsOpen(false);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative" ref={containerRef}>
      {/* Input Field */}
      <div
        className="w-full px-3 py-2 rounded-md border border-gray-700 cursor-pointer focus-within:ring-2"
        style={{backgroundColor: '#191919'}}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={selectedDate ? 'text-white' : 'text-gray-400'}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          <CalendarIcon className="h-5 w-5" style={{color: '#fa9208'}} />
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div
          className={`absolute bottom-full mb-1 w-80 rounded-lg shadow-lg z-50 border border-gray-700`}
          style={{
            backgroundColor: 'rgb(25, 25, 25)',
            ...(isReturnPicker ? { right: 0, transform: 'translateX(0)' } : { left: 0 })
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            {showYearMonthSelectors ? (
              // Year and Month Dropdowns
              <div className="flex items-center justify-center gap-2 w-full">
                <select
                  value={currentMonth.getMonth()}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="px-2 py-1 rounded text-sm text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)]"
                  style={{backgroundColor: '#2a2a2a'}}
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                <select
                  value={currentMonth.getFullYear()}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="px-2 py-1 rounded text-sm text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[rgb(250,146,8)]"
                  style={{backgroundColor: '#2a2a2a'}}
                >
                  {getYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            ) : (
              // Navigation Arrows with Month/Year Display
              <>
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-300" />
                </button>

                <h3 className="text-lg font-goldman font-semibold text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-300" />
                </button>
              </>
            )}
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-0 px-4 py-2 border-b border-gray-700">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-300 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 p-4">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    onClick={() => handleDateClick(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded transition-colors ${
                      selectedDate && date.toDateString() === selectedDate.toDateString()
                        ? 'text-white font-semibold'
                        : isDateUnavailable(date)
                        ? 'text-gray-300 bg-gray-800 cursor-not-allowed opacity-50'
                        : isDateDisabled(date)
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-white hover:bg-gray-700'
                    }`}
                    style={selectedDate && date.toDateString() === selectedDate.toDateString() ? {backgroundColor: '#fa9208'} : {}}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default DatePicker; 