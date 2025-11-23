import { Link, useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();


  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      // Check if we're on homepage
      if (location.pathname === '/') {
        // On homepage, check if element exists
        const element = document.querySelector(href);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } else {
        // Not on homepage, navigate there first then scroll
        navigate('/');
        // Wait for page to fully load including dynamic content (cars) before scrolling
        // Use multiple attempts and re-scroll to handle content loading shifts
        const scrollToElement = (attempts = 0) => {
          if (attempts > 20) return; // Give up after 20 attempts

          setTimeout(() => {
            const element = document.querySelector(href);
            if (element) {
              const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
              // Re-scroll after a delay to handle dynamic content loading
              if (attempts < 5) {
                scrollToElement(attempts + 1);
              }
            } else {
              scrollToElement(attempts + 1);
            }
          }, attempts === 0 ? 800 : 400 + (attempts * 150));
        };
        scrollToElement();
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

          {/* Ponuka */}
          <button
            onClick={() => handleNavClick('#cars')}
            className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
              isActive('#cars') ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            Ponuka
          </button>

          {/* O nás */}
          <button
            onClick={() => handleNavClick('#o-nas')}
            className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
              isActive('#o-nas') ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            O nás
          </button>

          {/* Služby */}
          <button
            onClick={() => handleNavClick('/sluzby')}
            className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
              isActive('/sluzby') ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            Služby
          </button>

          {/* FAQ */}
          <button
            onClick={() => handleNavClick('/faq')}
            className={`px-6 py-4 text-left text-lg font-medium transition-colors border-b border-gray-800 ${
              isActive('/faq') ? 'text-[rgb(250,146,8)] bg-gray-900' : 'text-white hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            FAQ
          </button>


          {/* Rezervovať Button */}
          <div className="px-6 py-6">
            <button
              onClick={() => handleNavClick('/')}
              className="w-full hover:opacity-90 px-5 py-3 text-base transition-colors duration-200 border border-gray-600 rounded-lg"
              style={{
                backgroundColor: '#fa9208',
                color: '#191919',
                fontWeight: 700
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