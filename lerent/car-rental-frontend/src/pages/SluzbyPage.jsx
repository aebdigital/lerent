import React, { useEffect, useRef } from 'react';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import HeroImg from '../newhero.jpg';
import CarGarageImg from '../car_garage.jpg';
import LongtermCarImg from '../longterm_car.jpg';
import CarKeysImg from '../car_keys.jpg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PrenajomPage = () => {
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (lineRef.current && containerRef.current) {
      const line = lineRef.current;
      const pathLength = line.getTotalLength();

      // Initial setup - line is hidden
      line.style.strokeDasharray = pathLength;
      line.style.strokeDashoffset = pathLength;

      // Main scroll animation - draws line as you scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          // Draw line based on scroll progress
          const drawLength = pathLength - (pathLength * self.progress);
          line.style.strokeDashoffset = drawLength;

          // Velocity-based glow
          const velocity = Math.abs(self.getVelocity()) / 1000;
          gsap.to(line.parentElement, {
            filter: `drop-shadow(0 0 ${15 + velocity * 25}px #fa9208)`,
            duration: 0.2,
            overwrite: 'auto'
          });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
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

      {/* Container for all three sections - trigger for scroll animation */}
      <div ref={containerRef} style={{position: 'relative'}}>
        {/* Orange Line Overlay - Only in 3 sections */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20px',
            width: '60px',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'visible'
          }}
        >
          <svg
            style={{
              height: '100%',
              width: '6px',
              filter: 'drop-shadow(0 0 15px #fa9208)',
              opacity: 0.9
            }}
            viewBox="0 0 10 1000"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d="M5 0 L5 1000"
              stroke="#fa9208"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>

      {/* Krátkodobý prenájom Section */}
      <section className="py-16 relative" style={{backgroundColor: '#000000'}}>
        {/* Background Image - Left Side Only */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            backgroundImage: `url(${CarGarageImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />

        {/* Dark Overlay - Left Side Only */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        />

        {/* Fade to Black on Right Side */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            background: 'linear-gradient(to right, transparent 0%, transparent 70%, #000000 100%)',
            zIndex: 2
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative" style={{zIndex: 2}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div></div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                KRÁTKODOBÝ PRENÁJOM
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                Je služba, ktorá umožňuje našim zákazníkom požičať si automobil na obmedzený čas – zvyčajne od niekoľkých dní až po niekoľko týždňov. Tento typ prenájmu má nasledovné výhody:
              </h3>
              <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Flexibilita</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Auto si možno požičať presne na čas, keď je potrebné – bez dlhodobých záväzkov.</li>
                    <li>Možnosť výberu typu vozidla podľa aktuálnej potreby (malé mestské auto, SUV, dodávka a pod.).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Finančná výhodnosť v krátkom horizonte</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nie je nutné kupovať vlastné auto alebo platiť dlhodobý leasing.</li>
                    <li>Platí sa len za reálne využitý čas – ideálne pre ľudí, ktorí auto nepotrebujú denne.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Okamžitá dostupnosť</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Vozidlo je možné získať rýchlo, často aj bez nutnosti rezervácie dlhšie vopred.</li>
                    <li>V 90% prípadov je auto dostupné do hodiny</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Vhodné pre cestovanie</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ideálne riešenie pre turistov, služobné cesty alebo keď je vlastné auto v servise.</li>
                    <li>Možnosť vrátiť auto na inom mieste.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dlhodobý prenájom Section */}
      <section className="py-16 relative" style={{backgroundColor: 'rgb(25, 25, 25)'}}>
        {/* Background Image - Right Side Only */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            backgroundImage: `url(${LongtermCarImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />

        {/* Dark Overlay - Right Side Only */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        />

        {/* Fade to Background on Left Side */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            background: 'linear-gradient(to left, transparent 0%, transparent 70%, rgb(25, 25, 25) 100%)',
            zIndex: 2
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative" style={{zIndex: 3}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                DLHODOBÝ PRENÁJOM
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                (Inak nazývaný aj ako operatívny leasing) je forma využívania automobilu na obdobie dlhšie ako dva mesiace. Ide o alternatívu k nákupu vozidla alebo klasickému finančnému leasingu. Tento typ prenájmu má nasledovné výhody:
              </h3>
              <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Finančná predvídateľnosť</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Pevná mesačná splátka zahŕňa všetky náklady spojené s prevádzkou vozidla.</li>
                    <li>Odpadá potreba investovať veľkú sumu do kúpy auta.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Bezstarostná prevádzka</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ako prenajímateľ zabezpečujeme servis, poistenie, údržbu, výmenu pneumatík, STK aj havarijné opravy.</li>
                    <li>Vy ako nájomca len tankujete palivo a využívate vozidlo.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Bez rizika poklesu hodnoty vozidla</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Po skončení prenájmu auto jednoducho vrátite – Vy nenesiete riziko znehodnotenia alebo problém s predajom ojazdeného vozidla.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Flexibilita a moderný vozový park</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Možnosť výmeny vozidla po skončení zmluvy za novší model.</li>
                    <li>Vhodné pre firmy a ľudí, ktorí chcú mať moderné, spoľahlivé a reprezentatívne vozidlá</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Daňové výhody (pre firmy a SZČO)</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Mesačné splátky možno zahrnúť do daňovo uznateľných nákladov.</li>
                    <li>Žiadny odpis majetku, jednoduchšie účtovanie.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Možnosť prispôsobenia zmluvy</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Prenájom možno upraviť podľa Vašej potreby (počet kilometrov, trvanie, doplnkové služby).</li>
                  </ul>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </section>

      {/* Pristavenie vozidla Section */}
      <section className="py-16 relative" style={{backgroundColor: '#000000'}}>
        {/* Background Image - Left Side Only */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            backgroundImage: `url(${CarKeysImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />

        {/* Dark Overlay - Left Side Only */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        />

        {/* Fade to Black on Right Side */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block"
          style={{
            background: 'linear-gradient(to right, transparent 0%, transparent 70%, #000000 100%)',
            zIndex: 2
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative" style={{zIndex: 2}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div></div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                PRISTAVENIE VOZIDLA
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                Je doplnková služba, ktorú ponúkame našim zákazníkom vzhľadom na ich individuálne potreby byť na určitom mieste v určitom čase bez nutnosti návštevy pobočky.
              </h3>
              <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Pohodlie a úspora času</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nemusíte chodiť do požičovne, čakať v rade ani riešiť presuny.</li>
                    <li>Auto Vám doručíme tam, kde ho práve potrebujete – často priamo k dverám.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Flexibilita</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Možnosť zvoliť si presný čas a miesto odovzdania.</li>
                    <li>Vhodné pre ľudí s nabitým programom, cestovateľov či firemných zákazníkov.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Komfort pri cestovaní</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Na letisku alebo vlakovej stanici si môžete auto prevziať rovno po príchode.</li>
                    <li>Po skončení prenájmu môžete vozidlo jednoducho odovzdať na Vami zvolenom mieste – bez nutnosti návratu do požičovne.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Reprezentatívny servis</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Pri firemných zákazníkoch alebo VIP klientoch pôsobí služba profesionálne a šetrí čas manažérom.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default PrenajomPage;