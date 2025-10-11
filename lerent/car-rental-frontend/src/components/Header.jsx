import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, HomeIcon } from '@heroicons/react/24/outline';
import Logo from '../logoRENT.svg';
import Sidebar from './Sidebar';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [forceBlackMobile, setForceBlackMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check if body has the force black header class
    const checkForceBlackMobile = () => {
      setForceBlackMobile(document.body.classList.contains('force-black-header-mobile'));
    };

    // Initial check
    checkForceBlackMobile();

    // Set up observers
    window.addEventListener('scroll', handleScroll);

    // Observer for class changes on body
    const observer = new MutationObserver(checkForceBlackMobile);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navigation = [
    { name: 'Kontakt', href: '#contact' },
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
        isScrolled || forceBlackMobile ? 'shadow-lg' : 'bg-transparent'
      }`}
        style={{
          backgroundColor: isScrolled || forceBlackMobile ? 'rgb(25, 25, 25)' : 'transparent'
        }}>
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center lg:grid lg:grid-cols-3 lg:gap-4">

          {/* Logo - Left */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Nitra Car" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center space-x-10">
            
            {/* O nás Link */}
            <button
              onClick={() => handleNavClick('/o-nas')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('/o-nas')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('/o-nas') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              O nás
            </button>
            
            {/* Prenájom Link */}
            <button
              onClick={() => handleNavClick('/prenajom')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('/prenajom')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('/prenajom') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Prenájom
            </button>

            {/* HOME Icon */}
            <button
              onClick={() => handleNavClick('/')}
              className="transition-colors duration-200 hover:opacity-80"
              aria-label="Home"
              style={{marginTop: '-4px'}}
            >
              <HomeIcon className="h-7 w-7" style={{color: '#fa9208'}} />
            </button>

            {/* FAQ Link */}
            <button
              onClick={() => handleNavClick('/faq')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('/faq')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('/faq') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              FAQ
            </button>
            
            {/* Rest of navigation */}
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`font-medium transition-colors duration-200 relative pb-1 ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white hover:text-gray-300'
                }`}
                style={{
                  fontSize: '19px',
                  borderBottom: isActive(item.href) ? '2px solid #02cdff' : '2px solid transparent'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right section - Email + Phone */}
          <div className="hidden lg:flex items-center justify-end space-x-4">
            {/* Napíšte nám Email Link */}
            <div className="flex items-center space-x-2 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <a
                href="mailto:info@lerent.sk"
                className="flex flex-col hover:text-gray-300 transition-colors"
              >
                <span className="font-medium" style={{fontSize: '19px'}}>Napíšte nám</span>
                <span className="text-sm text-gray-300">info@lerent.sk</span>
              </a>
            </div>

            {/* Phone Button */}
            <a
              href="tel:+421905318164"
              className="hover:opacity-90 px-5 py-3 text-base transition-colors duration-200"
              style={{
                clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                borderRadius: '0px',
                backgroundColor: '#fa9208',
                color: '#191919',
                fontWeight: 700
              }}
            >
              +421 905 318 164
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