import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
      <div className="text-center text-white p-8 max-w-2xl">
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Platba zrušená</h1>
        <p className="text-xl text-gray-300 mb-4">
          Vaša platba bola zrušená. Z vášho účtu nebola stiahnutá žiadna suma.
        </p>
        <p className="text-gray-400 mb-8">
          Môžete skúsiť rezerváciu znova alebo nás kontaktovať, ak potrebujete pomoc.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 font-bold rounded-lg transition-colors border-2"
            style={{
              borderColor: '#fa9208',
              color: '#fa9208'
            }}
          >
            Skúsiť znova
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 font-bold rounded-lg transition-colors"
            style={{
              backgroundColor: '#fa9208',
              color: '#191919'
            }}
          >
            Späť na domovskú stránku
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelled;
