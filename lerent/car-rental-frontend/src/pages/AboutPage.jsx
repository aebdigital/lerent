import React from 'react';
import ContactMapSection from '../components/ContactMapSection';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#000000' }}>
      {/* Hero Section */}
      <section className="pt-32 pb-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 font-goldman">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-4">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="border-2 border-gray-800 rounded-lg p-8 md:p-12" style={{ backgroundColor: '#111111' }}>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              {t('about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactMapSection />
    </div>
  );
};

export default AboutPage;
