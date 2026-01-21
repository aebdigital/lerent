import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import BankTransferInfo from '../components/BankTransferInfo';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const BankTransferInfoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId, reservationNumber, totalAmount } = location.state || {};

  useEffect(() => {
    // If no reservation data, redirect to home
    if (!reservationId) {
      navigate('/');
    }
  }, [reservationId, navigate]);

  if (!reservationId) {
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Rezervácia bola úspešne vytvorená!
          </h1>
          <p className="text-gray-400 text-lg">
            Číslo rezervácie: <span className="text-[rgb(250,146,8)] font-semibold">{reservationNumber}</span>
          </p>
        </div>

        {/* Bank Transfer Info Component */}
        <div className="mb-8">
          <BankTransferInfo
            reservationId={reservationNumber}
            totalAmount={totalAmount}
          />
        </div>

        {/* Additional Info */}
        <div className="rounded-lg border border-gray-700 p-6 mb-8" style={{ backgroundColor: '#191919' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Ďalšie kroky</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(250,146,8)] flex items-center justify-center text-white text-sm font-bold">
                1
              </span>
              <span>Vykonajte platbu na vyššie uvedený účet do 24 hodín</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(250,146,8)] flex items-center justify-center text-white text-sm font-bold">
                2
              </span>
              <span>Skontrolujte si e-mail pre potvrdenie rezervácie</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(250,146,8)] flex items-center justify-center text-white text-sm font-bold">
                3
              </span>
              <span>Po prijatí platby Vám zašleme potvrdenie</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(250,146,8)] flex items-center justify-center text-white text-sm font-bold">
                4
              </span>
              <span>V deň prenájmu sa dostavte na dohodnuté miesto s občianskym a vodičským preukazom</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-[rgb(250,146,8)] hover:bg-[rgb(230,126,0)] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
          >
            Späť na hlavnú stránku
          </Link>
          <button
            onClick={() => window.print()}
            className="border border-gray-600 hover:border-[rgb(250,146,8)] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Vytlačiť údaje
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-gray-400">
          <p>Máte otázky? Kontaktujte nás na</p>
          <a href="mailto:info@lerent.sk" className="text-[rgb(250,146,8)] hover:text-[rgb(230,126,0)]">
            info@lerent.sk
          </a>
          {' '}alebo{' '}
          <a href="tel:+421123456789" className="text-[rgb(250,146,8)] hover:text-[rgb(230,126,0)]">
            +421 123 456 789
          </a>
        </div>
      </div>
    </div>
  );
};

export default BankTransferInfoPage;
