import React from 'react';
import ContactMapSection from '../components/ContactMapSection';

const AboutPage = () => {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#000000' }}>
      {/* Hero Section */}
      <section className="pt-32 pb-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 font-goldman">
            O NÁS
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-4">
            Spoznajte náš tím a naše hodnoty
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="border-2 border-gray-800 rounded-lg p-8 md:p-12" style={{ backgroundColor: '#111111' }}>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              Sme autopožičovňa zameraná na individuálne potreby klienta. K zákazníkom pristupujeme s cieľom vyhovieť každej ich požiadavke, aby bol zážitok z prenájmu výnimočný. Pre našich klientov zabezpečujeme profesionálne služby, či už ide o krátkodobý alebo dlhodobý prenájom automobilov, pristavenie vozidla na požadované miesto, preberanie a odovzdanie auta mimo otváracích hodín alebo doplnkové služby, ktoré si naši klienti vedia nastaviť podľa svojich požiadaviek. Kladieme dôraz na individualitu, pretože veríme, že naši klienti si zaslúžia len výnimočné služby šité na mieru.
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder for future image/content */}
      {/* TODO: Add image and additional text here */}

      {/* Contact Section */}
      <ContactMapSection />
    </div>
  );
};

export default AboutPage;
