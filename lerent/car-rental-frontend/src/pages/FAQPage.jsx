import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const { t } = useLanguage();

  const faqs = t('faq.questions');

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
      {/* Hero Section */}
      <section className="pt-32 pb-8" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 font-goldman">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-4">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8" style={{backgroundColor: '#000000'}}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {Array.isArray(faqs) && faqs.map((faq, index) => (
              <div
                key={index}
                className="border-2 border-gray-800 rounded-lg overflow-hidden"
                style={{backgroundColor: '#111111'}}
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-900 transition-colors duration-200"
                >
                  <h3 className="text-lg font-bold text-white pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-[rgb(250,146,8)] transition-transform duration-300 flex-shrink-0 ${
                      openQuestion === index ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {openQuestion === index && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podmienky prenájmu Section */}
      <section className="py-16" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-goldman">
            {t('faq.rentalConditionsTitle')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/terms"
              className="inline-block hover:opacity-90 px-8 py-3 text-base font-bold transition-colors duration-200 border border-gray-600 rounded-lg"
              style={{
                backgroundColor: '#fa9208',
                color: '#191919'
              }}
            >
              {t('faq.termsButton')}
            </a>
            <a
              href="/cennik-poplatkov"
              className="hover:opacity-90 px-5 py-3 text-base transition-colors duration-200 border-2 rounded-lg"
              style={{
                backgroundColor: '#000000',
                borderColor: '#fa9208',
                color: '#fa9208',
                fontWeight: 700
              }}
            >
              {t('faq.feesButton')}
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16" style={{backgroundColor: '#000000'}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
            {t('faq.notFoundTitle')}
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            {t('faq.notFoundText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            <a
              href="mailto:info@lerent.sk"
              className="hover:opacity-90 px-5 py-3 text-base transition-colors duration-200 border-2 rounded-lg"
              style={{
                backgroundColor: '#000000',
                borderColor: '#fa9208',
                color: '#fa9208',
                fontWeight: 700
              }}
            >
              info@lerent.sk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
