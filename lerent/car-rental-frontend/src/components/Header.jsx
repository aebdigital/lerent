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
            <div
              onClick={() => {
                if (location.pathname === '/') {
                  // On homepage, scroll to top
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                } else {
                  // On other pages, navigate to homepage and scroll to top
                  navigate('/');
                  setTimeout(() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                  }, 100);
                }
              }}
              className="flex items-center cursor-pointer"
            >
              <img src={Logo} alt="Nitra Car" className="h-14 w-auto" />
            </div>

          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center space-x-10">
            {/* Ponuka Link */}
            <button
              onClick={() => handleNavClick('#cars')}
              className={`font-medium transition-colors duration-200 relative pb-1 whitespace-nowrap ${
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
              className={`font-medium transition-colors duration-200 relative pb-1 whitespace-nowrap ${
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
              className={`font-medium transition-colors duration-200 relative pb-1 whitespace-nowrap ${
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
              className={`font-medium transition-colors duration-200 relative pb-1 whitespace-nowrap ${
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

            {/* Blog Link */}
            <button
              onClick={() => handleNavClick('/blog')}
              className={`font-medium transition-colors duration-200 relative pb-1 whitespace-nowrap ${
                isActive('/blog')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('/blog') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Blog
            </button>

            {/* Kontakt Link */}
            <button
              onClick={() => handleNavClick('/kontakt')}
              className={`font-medium transition-colors duration-200 relative pb-1 whitespace-nowrap ${
                isActive('/kontakt')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('/kontakt') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              Kontakt
            </button>
          </div>

          {/* Right section - Phone */}
          <div className="hidden lg:flex items-center justify-end">
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