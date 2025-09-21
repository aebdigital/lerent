import React from 'react';

const ReviewsSection = () => {
  const testimonials = [
    {
      year: 2024,
      text: "Prenájom aut cez Škola Octavia na výlet, a bol som nadmieru spokojný. Auto bolo ako nové, čisté číslov a personál veľmi ochotný, celá výkon na jedničku. Určite sa rád vrátim.",
      name: "Marek Kováč",
      rating: 5
    },
    {
      year: 2024, 
      text: "Skvelá skúsenosť s prenájmom Superb. Všetko prebehlo rýchlo a bez problémov, auto malo plnú nádrž a odovzdanie bolo tiež rýchlo a hladko. Odporúčam definitívne všetkým. Ďakujem! :)",
      name: "Zuzana Horváthová", 
      rating: 5
    },
    {
      year: 2025,
      text: "Profesionálny prístup a kvalitné vozidlá. Prenájom som si BMW x3 pozor Vitáška, a bol som veľmi spokojný služba aka aj z transparentnosti, s vozidlom. Jednoznačne odporúčam!",
      name: "Ján Petrík",
      rating: 5
    }
  ];

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-4 font-goldman">
          SKÚSENOSTI, KTORÉ HOVORIA SAMY ZA SEBA
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="rounded-lg p-6 relative"
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
              }}
            >
              {/* Top left - R8 above Year */}
              <div className="mb-4">
                <div className="text-black font-bold text-4xl mb-1 font-goldman">R8</div>
                <span className="text-black font-bold text-lg">{testimonial.year}</span>
              </div>
              
              {/* Review text */}
              <p className="text-gray-600 mb-16 text-sm leading-relaxed">
                {testimonial.text}
              </p>
              
              {/* Bottom right - Name and Stars */}
              <div className="absolute bottom-6 right-6 text-right">
                <p className="text-black font-semibold text-sm mb-2">{testimonial.name}</p>
                <div className="flex justify-end space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-orange-500 text-sm">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;