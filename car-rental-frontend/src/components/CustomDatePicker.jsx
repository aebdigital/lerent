import { useState, useRef, useEffect } from 'react';

const CustomDatePicker = ({ value, onChange, placeholder, minDate, otherSelectedDate, isReturnPicker, onOtherDateReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
    'Júl', 'August', 'September', 'Október', 'November', 'December'
  ];

  const dayNames = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // We want Monday = 0, so adjust
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6;

    return { daysInMonth, firstDayOfWeek };
  };

  const { daysInMonth, firstDayOfWeek } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    // Check for minimum 2-day reservation if this is return picker or if we have another selected date
    if (otherSelectedDate) {
      let pickupDate, returnDate;

      if (isReturnPicker) {
        pickupDate = new Date(otherSelectedDate);
        returnDate = selectedDate;

        // Check for minimum 2-day reservation
        const daysDifference = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
        if (daysDifference < 2) {
          alert('Minimálna dĺžka rezervácie sú 2 dni. Prosím vyberte dátum vrátenia minimálne 2 dni po dátume prevzatia.');
          return;
        }
      } else {
        pickupDate = selectedDate;
        returnDate = new Date(otherSelectedDate);

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
        }
      }
    }

    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    // Check if date is before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check if date is before minDate
    if (minDate && date < minDate) return true;

    // For return picker: Check if selecting this date would create less than 2-day reservation
    if (isReturnPicker && otherSelectedDate) {
      const pickupDate = new Date(otherSelectedDate);
      const daysDifference = Math.ceil((date - pickupDate) / (1000 * 60 * 60 * 24));
      if (daysDifference < 2) return true;
    }

    // For pickup picker: Check if selecting this date would create less than 2-day reservation with current return date
    if (!isReturnPicker && otherSelectedDate) {
      const returnDate = new Date(otherSelectedDate);
      const daysDifference = Math.ceil((returnDate - date) / (1000 * 60 * 60 * 24));
      if (daysDifference < 2) return true;
    }

    return false;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Generate calendar days
  const calendarDays = [];

  // Empty cells before first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square"></div>);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(day);
    calendarDays.push(
      <div key={day} className="aspect-square">
        <button
          disabled={disabled}
          onClick={() => !disabled && handleDateSelect(day)}
          className={`w-full h-full flex items-center justify-center text-sm rounded transition-colors ${
            disabled
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-[rgb(250,146,8)] hover:text-white'
          }`}
        >
          {day}
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-700 focus-within:border-orange-500 cursor-pointer"
        style={{ backgroundColor: 'rgba(25, 25, 25, 0.8)' }}
      >
        <div className="flex items-center justify-between h-full">
          <span className={`text-sm ${value ? 'text-white' : 'text-gray-400'}`}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-80 border border-gray-700 rounded-lg shadow-lg z-[9999]" style={{ backgroundColor: 'rgb(25, 25, 25)' }}>
          {/* Header with month navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-0 px-4 py-2 border-b border-gray-800">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0 p-4">
            {calendarDays}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
