import React from 'react';

const Reviews = () => {
  const reviewsData = [
    {
      name: "Zuzana Valkovičová",
      rating: 5,
      time: "pred týždňom",
      text: "Bola som výnimočne spokojná. Profesionálny servis, rýchla komunikácia a jednanie. Určite v budúcnosti využijem znova."
    },
    {
      name: "Branislav Babinjec", 
      rating: 5,
      time: "pred 6 mesiacmi",
      text: "Všetko bolo perfektné. Prístup profesionálny dohoda a komunikácia ľahká a rýchla. Jedine je trochu ťažšie trafiť sa na prvú, tak odporúčam nech len postavia nejaký výraznejší znak."
    },
    {
      name: "Jaroslav",
      rating: 5, 
      time: "pred 3 mesiacmi",
      text: "100% spokojnosť. Veľmi profesionálny a priateľsky prístup. Odporúčam každému kto si potrebuje požičať auto."
    }
  ];

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-left">Recenzie</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="flex text-cyan-400 text-2xl mr-3">
              {'★'.repeat(5)}
            </div>
            <span className="text-2xl font-bold text-white">5.0</span>
            <span className="text-gray-300 ml-2 text-lg">(Google recenzie)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((review, index) => (
            <div key={index} className="rounded-2xl p-6" style={{backgroundColor: 'rgb(18, 18, 18)'}}>
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-white text-lg">{review.name}</p>
                <div className="flex text-cyan-400 text-lg">
                  {'★'.repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-300 mb-3">
                "{review.text}"
              </p>
              <p className="text-xs text-gray-500">{review.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;