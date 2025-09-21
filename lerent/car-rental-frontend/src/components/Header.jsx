import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';
import Sidebar from './Sidebar';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    // Remove all active styling
    return false;
  };

  return (
    <>
      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-lg' : 'bg-transparent'
      }`}>
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Nitra Car" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-10">
            {/* Domov */}
            <button
              onClick={() => handleNavClick('/')}
              className={`text-lg font-medium transition-colors duration-200 relative pb-1 ${
                isActive('/')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                borderBottom: isActive('/') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Domov
            </button>
            
            {/* Služby Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                className="text-lg font-medium transition-colors duration-200 relative pb-1 text-white hover:text-gray-300 flex items-center"
              >
                Služby
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50">
                  <div className="bg-black border border-gray-600 rounded-lg shadow-lg">
                    {servicesDropdown.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          handleNavClick(item.href);
                          setServicesDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Blog Link */}
            <button
              onClick={() => handleNavClick('/blog')}
              className={`text-lg font-medium transition-colors duration-200 relative pb-1 ${
                isActive('/blog')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                borderBottom: isActive('/blog') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Blog
            </button>
            
            {/* Rest of navigation */}
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-lg font-medium transition-colors duration-200 relative pb-1 ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white hover:text-gray-300'
                }`}
                style={{
                  borderBottom: isActive(item.href) ? '2px solid #02cdff' : '2px solid transparent'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side - Rezervovať Button */}
          <div className="hidden lg:flex items-center">
            {/* Rezervovať Button */}
            <a
              href="#booking"
              className="text-black hover:opacity-90 text-black px-5 py-3 text-base font-medium transition-colors duration-200"
              style={{
                clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                borderRadius: '0px',
                backgroundColor: '#fa9208'
              }}
            >
              Rezervovať
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-white hover:text-gray-300 p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>

      </nav>
      </header>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header; 