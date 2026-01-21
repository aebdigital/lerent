import React from 'react';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import PrenajomImg from '../prenajom.jpeg'; // keeping this as it might not be converted or is small enough? Wait, finding said prenajom.jpeg is 400KB. Is it converted? 
// Checking convert command: 'npx -y sharp-cli ...' I did NOT convert prenajom.jpeg.
// I only converted: bmw540i, bmw840i, test, audia6, audis6, maseratilevante, bmwx7, car_garage.
// So for SprostredkovaniePage, only test.png should be replaced.
import TestImg from '../test.webp';

const SprostredkovaniePage = () => {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Hero Section */}
      <section
        className="relative h-[50vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${PrenajomImg})`
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-goldman">Sprostredkovanie prenájmu aut</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6 font-goldman">Naše služby</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Ponúkame profesionálne služby sprostredkovania prenájmu aut. Kontaktujte nás pre viac informácií.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Naše služby zahŕňajú kompletnú starostlivosť o vaše potreby. Využívame
              moderné technológie, vystavovanie kolies a oprav defektov. Sme vybavení modernými
              technológiami a skúsenými mechanikmi pre všetky značky vozidiel a presné služby. Vaša spokojnosť
              má u nás význam. Naše profesionálne riešenia vyhovujú všetkým
              požiadavkam na bezpečnosť, au čo najviac produktívny výsledok. Spoľahnite sa na
              naše odborné skúsenosti a využívanie iba originálnych náhradných dielov a
              certifikovaných značiek. Nevyhájte nás kontaktovať a presvedčte sa sami o našej profesionalite a
              spoľahlivosti. Vaša spokojnosť je pre nás prioritou.
            </p>
          </div>
        </div>
      </section>

      {/* Global Sections */}
      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default SprostredkovaniePage;