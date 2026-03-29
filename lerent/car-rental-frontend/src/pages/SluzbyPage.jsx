import React, { useEffect, useRef } from 'react';
import ReviewsSection from '../components/ReviewsSection';
import ContactMapSection from '../components/ContactMapSection';
import { useLanguage } from '../context/LanguageContext';
import HeroImg from '../newhero.jpg';
import CarGarageImg from '../car_garage.webp';
import LongtermCarImg from '../longterm_car.jpg';
import CarKeysImg from '../car_keys.jpg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PrenajomPage = () => {
  const { t } = useLanguage();
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (lineRef.current && containerRef.current) {
      const line = lineRef.current;
      const pathLength = line.getTotalLength();

      line.style.strokeDasharray = pathLength;
      line.style.strokeDashoffset = pathLength;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const drawLength = pathLength - (pathLength * self.progress);
          line.style.strokeDashoffset = drawLength;

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

  const renderServiceSection = (sectionKey, bgColor, imageSrc, imagePosition) => {
    const section = t(`services.${sectionKey}`);
    const isLeft = imagePosition === 'left';

    const subsections = [];
    const sectionObj = typeof section === 'object' ? section : {};

    // Collect subsection keys dynamically
    const knownKeys = ['title', 'intro'];
    Object.keys(sectionObj).forEach(key => {
      if (!knownKeys.includes(key) && !key.endsWith('Items')) {
        const itemsKey = `${key}Items`;
        if (sectionObj[itemsKey]) {
          subsections.push({ title: sectionObj[key], items: sectionObj[itemsKey] });
        }
      }
    });

    return (
      <section className="py-16 relative" style={{ backgroundColor: bgColor }}>
        {/* Background Image */}
        <div
          className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-1/2 hidden lg:block`}
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: isLeft ? 'center' : 'right center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />
        <div
          className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-1/2 hidden lg:block`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }}
        />
        <div
          className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-1/2 hidden lg:block`}
          style={{
            background: isLeft
              ? `linear-gradient(to right, transparent 0%, transparent 70%, ${bgColor} 100%)`
              : `linear-gradient(to left, transparent 0%, transparent 70%, ${bgColor} 100%)`,
            zIndex: 2
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative" style={{ zIndex: isLeft ? 2 : 3 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {isLeft ? <div></div> : null}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-goldman">
                {sectionObj.title}
              </h2>
              <h3 className="text-xl text-[rgb(250,146,8)] mb-4">
                {sectionObj.intro}
              </h3>
              <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                {subsections.map((sub, i) => (
                  <div key={i}>
                    <h4 className="text-white font-semibold mb-2">{sub.title}</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {Array.isArray(sub.items) && sub.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {!isLeft ? <div></div> : null}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#000000' }}>
      {/* Hero Section */}
      <section className="pt-32 pb-8 md:pb-16" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 md:mb-8 font-goldman">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-12">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Orange Line Overlay */}
        <div
          className="hidden lg:flex"
          style={{
            position: 'absolute',
            top: 0,
            left: '20px',
            width: '60px',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
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

        {renderServiceSection('shortTerm', '#000000', CarGarageImg, 'left')}
        {renderServiceSection('longTerm', 'rgb(25, 25, 25)', LongtermCarImg, 'right')}
        {renderServiceSection('delivery', '#000000', CarKeysImg, 'left')}
      </div>

      <ReviewsSection />
      <ContactMapSection />
    </div>
  );
};

export default PrenajomPage;
