import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Recenzie', href: '#reviews' },
    { name: 'Kontakt', href: '#booking' },
  ];

  const servicesDropdown = [
    { name: 'Poistenie', href: '/poistenie' },
    { name: 'Autoúvery', href: '/autouvery' },
    { name: 'Sprostredkovanie prenájmu aut', href: '/sprostredkovanie' },
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      // Check if the target section exists on current page
      const element = document.querySelector(href);
      if (element) {
        // Section exists on current page, scroll to it with offset for fixed header
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        // Section doesn't exist on current page, navigate to home page
        navigate('/' + href);
      }
    } else {
      // Check if we're already on the target page
      if (location.pathname === href) {
        // Already on the page, scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Navigate to different page
        navigate(href);
      }
    }
    onClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-black text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 border-b border-gray-800">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center">
              <img src={Logo} alt="Lerent" className="h-14 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col py-6">
          {/* Domov */}
          <button
            onClick={() => handleNavClick('/')}
            className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
              isActive('/') ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            Domov
          </button>

          {/* Služby Dropdown */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className="w-full px-6 py-4 text-left text-lg font-medium text-white hover:text-gray-300 hover:bg-gray-900 flex items-center justify-between transition-colors"
            >
              Služby
              <ChevronDownIcon className={`h-5 w-5 transform transition-transform duration-200 ${
                servicesDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {/* Dropdown Menu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              servicesDropdownOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="bg-gray-900">
                {servicesDropdown.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full text-left px-8 py-3 text-base transition-colors ${
                      isActive(item.href) ? 'text-[rgb(250,146,8)] bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog */}
          <button
            onClick={() => handleNavClick('/blog')}
            className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
              isActive('/blog') ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            Blog
          </button>

          {/* Recenzie & Kontakt */}
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
                isActive(item.href) ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
              }`}
            >
              {item.name}
            </button>
          ))}

          {/* Rezervovať Button */}
          <div className="px-6 py-6">
            <button
              onClick={() => handleNavClick('#booking')}
              className="w-full text-black hover:opacity-90 px-6 py-4 font-bold text-lg transition-colors"
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
    </>
  );
};

export default Sidebar;