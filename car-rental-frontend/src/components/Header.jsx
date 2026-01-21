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
              onClick={() => handleNavClick('#o-nas')}
              className={`font-medium transition-colors duration-200 relative pb-1 ${
                isActive('#o-nas')
                  ? 'text-white'
                  : 'text-white hover:text-gray-300'
              }`}
              style={{
                fontSize: '19px',
                borderBottom: isActive('#o-nas') ? '2px solid #02cdff' : '2px solid transparent'
              }}
            >
              O nás
            </button>
          </div>

          {/* Right section - WhatsApp + Telegram + Signal + Phone */}
          <div className="hidden lg:flex items-center justify-end space-x-4">
            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/421905318164"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity duration-200"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Telegram Icon */}
            <a
              href="https://t.me/+421905318164"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity duration-200"
              aria-label="Telegram"
            >
              <svg className="w-6 h-6 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </a>

            {/* Signal Icon */}
            <a
              href="https://signal.me/#p/+421905318164"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity duration-200"
              aria-label="Signal"
            >
              <svg className="w-6 h-6 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 9.038c-.102 5.375-2.77 8.106-8.187 8.106h-.001c-1.355 0-2.635-.355-3.738-.969l-2.636.691.704-2.571c-.726-1.192-1.142-2.588-1.142-4.089C2.562 5.831 5.293 3.1 10.625 3.1h.001c2.57 0 4.986 1.002 6.8 2.818 1.814 1.814 2.813 4.228 2.813 6.795 0 .107-.002.214-.005.325zM16.688 13.8c-.289-.145-1.706-.842-1.97-.938-.264-.096-.456-.145-.65.145-.192.289-.746.938-.913 1.131-.168.192-.336.216-.625.072-.289-.145-1.219-.449-2.321-1.432-.858-.765-1.437-1.71-1.605-1.999-.168-.289-.018-.446.126-.59.13-.13.289-.336.433-.504.145-.168.192-.289.289-.481.096-.192.048-.361-.024-.504-.072-.145-.65-1.566-.891-2.145-.234-.562-.472-.485-.65-.494-.168-.008-.361-.01-.553-.01s-.505.072-.769.361c-.264.289-1.008.985-1.008 2.401s1.032 2.785 1.176 2.977c.145.192 2.033 3.104 4.926 4.352.688.297 1.225.474 1.644.606.691.218 1.32.187 1.816.114.554-.083 1.706-.697 1.946-1.371.241-.673.241-1.25.169-1.371-.072-.12-.264-.192-.553-.336z"/>
              </svg>
            </a>

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