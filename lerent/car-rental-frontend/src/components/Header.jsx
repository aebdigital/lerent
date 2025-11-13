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

  const navigation = [];


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
        navigate('/' + href);
        // Use multiple attempts to ensure element is loaded
        const scrollToElement = (attempts = 0) => {
          if (attempts > 10) return; // Give up after 10 attempts

          setTimeout(() => {
            const element = document.querySelector(href);
            if (element) {
              const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            } else {
              scrollToElement(attempts + 1);
            }
          }, 200 + (attempts * 100));
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
          backgroundColor: isScrolled || forceBlackMobile ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
          backdropFilter: isScrolled || forceBlackMobile ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled || forceBlackMobile ? 'blur(20px)' : 'none'
        }}>
      <nav className="px-4 md:px-8 lg:px-16">
        <div className="flex h-20 items-center justify-between lg:grid lg:grid-cols-3 lg:gap-4">

          {/* Logo + Social Media - Left */}
          <div className="flex items-center justify-start max-[390px]:ml-0 space-x-4">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Nitra Car" className="h-14 w-auto" />
            </Link>

            {/* Social Media Icons */}
            <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-gray-600">
              <a
                href="https://www.instagram.com/lerent.sk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/Lerentsk/61582767697078/#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@lerent.sk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center space-x-10">

            {/* Ponuka Link */}
            <button
              onClick={() => handleNavClick('#cars')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('#cars')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('#cars') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Ponuka
            </button>

            {/* Služby Link */}
            <button
              onClick={() => handleNavClick('/sluzby')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('/sluzby')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('/sluzby') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Služby
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
          </div>

          {/* Right section - Kontakt + Phone */}
          <div className="hidden lg:flex items-center justify-end space-x-4">
            {/* Kontakt Link */}
            <button
              onClick={() => handleNavClick('#contact')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('#contact')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('#contact') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Kontakt
            </button>

            {/* Phone Button */}
            <a
              href="tel:+421905318164"
              className="hover:opacity-90 px-5 py-3 text-base transition-colors duration-200 border border-gray-600 rounded-lg"
              style={{
                backgroundColor: '#fa9208',
                color: '#191919',
                fontWeight: 700
              }}
            >
              +421 905 318 164
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden max-[390px]:mr-0">
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