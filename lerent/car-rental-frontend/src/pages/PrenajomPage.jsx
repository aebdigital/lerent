import React from 'react';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import HeroImg from '../newhero.jpg';

const PrenajomPage = () => {
  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
      {/* Hero Section */}
      <section className="pt-32 pb-16" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 font-goldman">
            PRENÁJOM VOZIDIEL
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
            Kompletné riešenia prenájmu automobilov pre všetky vaše potreby
          </p>
        </div>
      </section>

      {/* Krátkodobý prenájom Section */}
      <section className="py-16" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={HeroImg} 
                alt="Krátkodobý prenájom" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                KRÁTKODOBÝ PRENÁJOM
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                Flexibilné riešenia pre vaše potreby
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dlhodobý prenájom Section */}
      <section className="py-16" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                DLHODOBÝ PRENÁJOM
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                Výhodné podmienky pre dlhšie obdobia
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src={HeroImg} 
                alt="Dlhodobý prenájom" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pristavenie vozidla Section */}
      <section className="py-16" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={HeroImg} 
                alt="Pristavenie vozidla" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                PRISTAVENIE VOZIDLA
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                Pohodlné prevzatie na vašom mieste
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Podmienky prenájmu Section */}
      <section className="py-16" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-goldman">
            PODMIENKY PRENÁJMU
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      </section>

      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default PrenajomPage;