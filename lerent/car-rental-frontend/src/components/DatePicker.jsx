import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

const DatePicker = ({ 
  selectedDate, 
  onDateSelect, 
  minDate, 
  maxDate, 
  unavailableDates = [], 
  placeholder = "Vyberte dátum" 
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

  const isDateDisabled = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date is before minimum date
    if (minDate && date < minDate) return true;
    
    // Check if date is after maximum date
    if (maxDate && date > maxDate) return true;
    
    // Check if date is in unavailable dates
    if (unavailableDates.includes(dateStr)) return true;
    
    return false;
  };

  const isDateUnavailable = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateStr);
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

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
      setIsOpen(false);
    }
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
        <div className="absolute bottom-full left-0 mb-1 w-80 rounded-lg shadow-lg z-50 border border-gray-700" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-300" />
            </button>
            
            <h3 className="text-lg font-semibold text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-300" />
            </button>
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
                        ? 'text-red-400 bg-red-900 cursor-not-allowed'
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