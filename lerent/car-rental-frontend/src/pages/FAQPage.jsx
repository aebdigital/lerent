import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQPage = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "Aké sú základné požiadavky na prenájom vozidla?",
      answer: "Pre prenájom vozidla potrebujete mať minimálne 21 rokov, platný vodičský preukaz (minimálne 1 rok), občiansky preukaz alebo pas a kreditnú kartu pre zábezpeku. Pre vozidlá luxusnej kategórie môže byť požadovaný vyšší vek."
    },
    {
      question: "Aká je výška zábezpeky a kedy sa vráti?",
      answer: "Výška zábezpeky závisí od kategórie vozidla: 500€ pre ekonomickú triedu, 1000€ pre strednú triedu a 2000€ pre prémiovú triedu. Zábezpeka sa vráti do 7 pracovných dní po vrátení vozidla v pôvodnom stave."
    },
    {
      question: "Je možné predĺžiť prenájom počas trvania?",
      answer: "Áno, prenájom je možné predĺžiť, ale odporúčame kontaktovať nás aspoň 24 hodín vopred. Predĺženie závisí od dostupnosti vozidla a aktuálnych cien."
    },
    {
      question: "Čo je zahrnuté v cene prenájmu?",
      answer: "V cene prenájmu je zahrnuté poistenie zodpovednosti, technická podpora 24/7, plná nádrž paliva a základné vybavenie vozidla. Dodatočné služby ako GPS navigácia alebo detské sedačky sú za príplatok."
    },
    {
      question: "Môžem zrušiť rezerváciu a dostať späť platbu?",
      answer: "Rezervácie zrušené viac ako 24 hodín pred začiatkom prenájmu sú bezplatné. Pri zrušení menej ako 24 hodín pred začiatkom sa účtuje poplatok 50% z celkovej sumy."
    },
    {
      question: "Aké sú podmienky vrátenia vozidla?",
      answer: "Vozidlo je potrebné vrátiť s plnou nádržou paliva, v čistom stave a bez poškodení. Vrátenie je možné 24/7 na našich pobočkách alebo na dohodnutom mieste."
    },
    {
      question: "Je možné prenajať si vozidlo pre niekoho iného?",
      answer: "Vozidlo môže riadiť len osoba, ktorá je uvedená v zmluve o prenájme. Dodatočných vodičov je možné pridať za poplatok 10€/deň po predložení platných dokladov."
    },
    {
      question: "Čo sa stane v prípade nehody alebo poruchy?",
      answer: "V prípade nehody ihneď kontaktujte políciu a následne nás. Poskytujeme 24/7 asistenčnú službu. V prípade poruchy zabezpečíme náhradné vozidlo alebo opravu podľa situácie."
    },
    {
      question: "Môžem cestovať s prenajatým vozidlom do zahraničia?",
      answer: "Cestovanie do zahraničia je možné po predchádzajúcom súhlase a za dodatočný poplatok. Niektoré vozidlá majú obmedzenia na cestovanie do určitých krajín."
    },
    {
      question: "Aké formy platby prijímate?",
      answer: "Prijímame platby kreditnými kartami (Visa, MasterCard), bankovým prevodom a v hotovosti. Pre zábezpeku je vždy potrebná kreditná karta."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#000000'}}>
      {/* Hero Section */}
      <section className="pt-32 pb-8" style={{backgroundColor: '#000000'}}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 font-goldman">
            ČASTO KLADENÉ OTÁZKY
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-4">
            Odpovede na najčastejšie otázky o prenájme vozidiel
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8" style={{backgroundColor: '#000000'}}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
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
            PODMIENKY PRENÁJMU
          </h2>
          <a
            href="/terms"
            className="inline-block hover:opacity-90 px-8 py-3 text-base font-bold transition-colors duration-200 border border-gray-600 rounded-lg"
            style={{
              backgroundColor: '#fa9208',
              color: '#191919'
            }}
          >
            Všeobecné obchodné podmienky
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16" style={{backgroundColor: '#000000'}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
            NENAŠLI STE ODPOVEĎ?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Kontaktujte nás a radi vám odpovieme na všetky vaše otázky
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