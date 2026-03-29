import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

// Fade In Up Animation Component
const FadeInUp = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ReviewsSection = () => {
  const { t, isEn, isHu } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const testimonials = [
    {
      year: 2025,
      text: "Úžasná komunikácia. Keď bol nejaký problém tak ho hneď riešili a komunikovali. Určite si aj v budúcnosti budeme požičiavať auta z tejto požičovne. Férová, ústretová a dole klobúk pred prístupom 👌",
      textEn: "Amazing communication. Whenever there was an issue, they resolved it immediately. We will definitely rent from them again in the future. Fair, accommodating, and hats off to their approach 👌",
      textHu: "Csodálatos kommunikáció. Ha bármilyen probléma adódott, azonnal megoldották. A jövőben biztosan ismét tőlük bérelünk autót. Korrekt, rugalmas és elismerésre méltó hozzáállás 👌",
      name: "Dávid Šmotlák",
      rating: 5
    },
    {
      year: 2025,
      text: "Ďakujem za super služby. Príjemné vystupovanie a autíčka v super stave. Problém neexistoval, ale verím, že keby nastal je vyriešený k mojej spokojnosti. Takto by to malo fungovať všade. Určite keď budem potrebovať auto, tak určite sa obráti opäť na LeRent. Ďakujem",
      textEn: "Thank you for the great service. Pleasant staff and cars in excellent condition. There were no issues, but I'm sure any problem would be resolved to my satisfaction. This is how it should work everywhere. I will definitely turn to LeRent again. Thank you.",
      textHu: "Köszönöm a kiváló szolgáltatást. Kellemes kiszolgálás és kitűnő állapotú autók. Nem volt semmi probléma, de biztos vagyok benne, hogy ha lett volna, megoldották volna. Így kellene mindenütt működni. Legközelebb is biztosan a LeRent-et választom. Köszönöm.",
      name: "Ladislav Frniak",
      rating: 5
    },
    {
      year: 2025,
      text: "Požičiaval som už 2krát a musím povedať že som vždy na 100% spokojný !! Autá sú rýchle a vždy v dokonalom stave 😃",
      textEn: "I've rented twice now and I have to say I'm always 100% satisfied!! The cars are fast and always in perfect condition 😃",
      textHu: "Már kétszer béreltem és mindig 100%-ban elégedett voltam!! Az autók gyorsak és mindig tökéletes állapotban vannak 😃",
      name: "Alexander Hidveghy",
      rating: 5
    },
    {
      year: 2025,
      text: "Spokojnosť, ako narodeninový darček som si to veľmi užil. Komunikáciu musím oceniť, nastal problém, ale všetko sa vyriešilo. Určite odporúčam 🤝",
      textEn: "As a birthday treat I really enjoyed it. I have to praise the communication — there was an issue, but everything got resolved. Definitely recommend 🤝",
      textHu: "Születésnapi ajándékként nagyon élveztem. A kommunikációt ki kell emelni — volt egy probléma, de minden megoldódott. Határozottan ajánlom 🤝",
      name: "Radovan Fuňak",
      rating: 5
    },
    {
      year: 2025,
      text: "Parádne autá, super služby aj s pristavením auta a bezproblémová komunikácia, odporúčam",
      textEn: "Great cars, excellent service including vehicle delivery, and smooth communication. Highly recommend.",
      textHu: "Remek autók, kiváló szolgáltatás házhozszállítással és gördülékeny kommunikáció. Melegen ajánlom.",
      name: "Peter Bobák",
      rating: 5
    }
  ];

  const nextReviews = () => {
    if (currentIndex < testimonials.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevReviews = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Mobile swipe handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < testimonials.length - 1) {
      // Swipe left = next review
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      // Swipe right = previous review
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Get 3 reviews to display starting from currentIndex (desktop)
  const visibleReviews = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <section id="reviews" className="py-24" style={{backgroundColor: '#000000'}}>
      <div className="max-w-7xl mx-auto px-4">
        <FadeInUp>
          <h2 className="text-4xl md:text-5xl font-medium text-white text-center mb-4 font-goldman">
            {t('reviews.title')}
          </h2>
        </FadeInUp>

        {/* Reviews Container with Navigation */}
        <div className="relative mt-12">
          {/* Left Arrow */}
          <button
            onClick={prevReviews}
            disabled={currentIndex === 0}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 items-center justify-center rounded-full transition-all duration-200 group ${
              currentIndex === 0
                ? 'bg-gray-800 cursor-not-allowed opacity-50'
                : 'bg-black/50 hover:bg-black/70'
            }`}
            aria-label="Previous reviews"
          >
            <ChevronLeftIcon className={`w-6 h-6 transition-colors ${
              currentIndex === 0
                ? 'text-gray-600'
                : 'text-white group-hover:text-[rgb(250,146,8)]'
            }`} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextReviews}
            disabled={currentIndex >= testimonials.length - 3}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 items-center justify-center rounded-full transition-all duration-200 group ${
              currentIndex >= testimonials.length - 3
                ? 'bg-gray-800 cursor-not-allowed opacity-50'
                : 'bg-black/50 hover:bg-black/70'
            }`}
            aria-label="Next reviews"
          >
            <ChevronRightIcon className={`w-6 h-6 transition-colors ${
              currentIndex >= testimonials.length - 3
                ? 'text-gray-600'
                : 'text-white group-hover:text-[rgb(250,146,8)]'
            }`} />
          </button>

          {/* Desktop Reviews Grid */}
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-3 gap-8"
              >
                {visibleReviews.map((testimonial, index) => (
                  <motion.div
                    key={currentIndex + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div
                      className="rounded-lg p-6 relative h-full"
                      style={{
                        background: 'linear-gradient(143deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)'
                      }}
                    >
                      {/* Top left - Year only */}
                      <div className="mb-4">
                        <span className="text-white font-bold text-lg">{testimonial.year}</span>
                      </div>

                      {/* Review text */}
                      <p className="text-white mb-16 text-sm leading-relaxed">
                        {isEn ? testimonial.textEn : isHu ? testimonial.textHu : testimonial.text}
                      </p>

                      {/* Bottom right - Name and Stars */}
                      <div className="absolute bottom-6 right-6 text-right">
                        <p className="text-white font-semibold text-sm mb-2">{testimonial.name}</p>
                        <div className="flex justify-end space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} style={{color: '#fc9200', fontSize: '14px'}}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Reviews - Single review with swipe */}
          <div
            className="md:hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <div
                  className="rounded-lg p-6 relative min-h-[320px]"
                  style={{
                    background: 'linear-gradient(143deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)'
                  }}
                >
                  {/* Top left - Year only */}
                  <div className="mb-4">
                    <span className="text-white font-bold text-lg">{testimonials[currentIndex].year}</span>
                  </div>

                  {/* Review text */}
                  <p className="text-white mb-16 text-sm leading-relaxed">
                    {isEn ? testimonials[currentIndex].textEn : isHu ? testimonials[currentIndex].textHu : testimonials[currentIndex].text}
                  </p>

                  {/* Bottom right - Name and Stars */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <p className="text-white font-semibold text-sm mb-2">{testimonials[currentIndex].name}</p>
                    <div className="flex justify-end space-x-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <span key={i} style={{color: '#fc9200', fontSize: '14px'}}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Navigation Dots - One for each review */}
          <div className="flex md:hidden justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-[rgb(250,146,8)] w-6' : 'bg-white/30'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;