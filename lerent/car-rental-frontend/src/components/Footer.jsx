import { Link } from 'react-router-dom';
import Logo from '../logoRENT.svg';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">

          {/* Left Side - Logo */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
              <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                <img src={Logo} alt="Lerent" className="h-10 sm:h-12 w-auto" />
              </div>

              {/* Contact Information */}
              <div className="flex flex-col space-y-2 mb-6 lg:mb-8">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>+421 905 318 164</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>info@lerent.sk</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Levická 3, areál STS, Nitra</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>Po - Pia od 8:00 do 17:00</span>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Domov
              </Link>
              <Link to="/poistenie" className="text-gray-400 hover:text-white transition-colors text-sm">
                Poistenie
              </Link>
              <Link to="/autouvery" className="text-gray-400 hover:text-white transition-colors text-sm">
                Autoúvery
              </Link>
              <Link to="/sprostredkovanie" className="text-gray-400 hover:text-white transition-colors text-sm">
                Sprostredkovanie prenájmu aut
              </Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                Blog
              </Link>
              <a href="#reviews" className="text-gray-400 hover:text-white transition-colors text-sm">
                Recenzie
              </a>
              <a href="#booking" className="text-gray-400 hover:text-white transition-colors text-sm">
                Kontakt
              </a>
            </div>
          </div>

          {/* Right Side - Rezervovať Button */}
          <div className="flex justify-center lg:justify-end">
            <a
              href="#booking"
              className="text-black hover:opacity-90 text-black px-6 sm:px-8 py-3 font-bold text-base sm:text-lg transition-colors"
              style={{
                clipPath: 'polygon(0px 0px, 89% 0px, 100% 30%, 100% 100%, 10% 100%, 0px 70%)',
                borderRadius: '0px',
                backgroundColor: '#fa9208'
              }}
            >
              Rezervovať
            </a>
          </div>
        </div>

        {/* Social Media Icons - Above divider, center on mobile, right on desktop */}
        <div className="flex justify-center lg:justify-end mb-8">
          <div className="flex space-x-4 sm:space-x-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright left, Links right */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            {/* Left - Copyright */}
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © Lerent 2025. Všetky práva vyhradené.
            </p>
            
            {/* Right - Links */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-8 text-center sm:text-left">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Podmienky Používania
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Zásady ochrany osobných údajov
              </Link>
              <a 
                href="https://aebdigital.sk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors text-sm underline"
              >
                Tvorba stránky - AEB Digital
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;