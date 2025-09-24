import React from 'react';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import BookingFormSection from '../components/BookingFormSection';
import PoistenieImg from '../poistenie.jpg';
import TestImg from '../test.png';

const PoisteniePage = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${PoistenieImg})`
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-goldman">Poistenie</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-12">
            {/* Left Side - Image */}
            <div className="w-1/3">
              <img 
                src={TestImg} 
                alt="Poistenie" 
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            {/* Right Side - Content */}
            <div className="w-2/3">
              <h2 className="text-3xl font-bold text-black mb-6 font-goldman">Naše služby</h2>
              <p className="text-gray-600 leading-relaxed">
                Ponúkame profesionálne služby poistenia. Kontaktujte nás pre viac informácií.
              </p>
              <br />
              <p className="text-gray-600 leading-relaxed">
                Naše služby zahŕňajú kompletnú starostlivosť o vaše potreby. Využívame 
                pneumatiky, vystavovanie kolies a oprav defektov. Sme vybavení modernými 
                technológiami a skúsenými mechanikmi pre všetky značky vozidiel a presné služby. Vaša ochrana 
                má u nás význam. Naše profesionálne riešenia vyhovujú všetkým 
                požiadavkam na bezpečnosť, au čo najviac produktívny výsledok. Spoľahnite sa na 
                naše odborné skúsenosti a využívanie iba originálnych náhradných dielov a 
                certifikovaných značiek. Nevyhájte nás kontaktovať a presvedčte sa sami o našej profesionalite a 
                spoľahlivosti. Vaša spokojnosť je pre nás prioritou.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Sections */}
      <BookingFormSection />
      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default PoisteniePage;