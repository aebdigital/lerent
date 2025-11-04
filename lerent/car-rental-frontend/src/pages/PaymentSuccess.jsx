import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const paymentId = searchParams.get('payment_id');

      if (!sessionId || !paymentId) {
        setStatus('failed');
        return;
      }

      try {
        console.log('Verifying payment...');
        const response = await paymentService.verifyPayment(paymentId, sessionId);

        if (response.success && response.data.is_paid) {
          console.log('Payment verified successfully!');

          // Update reservation status to confirmed if reservationId is present
          const reservationId = response.data.payment?.reservationId || searchParams.get('reservation_id');
          if (reservationId) {
            try {
              console.log('Updating reservation status to confirmed...', reservationId);
              await paymentService.updateReservationStatus(reservationId, 'confirmed');
              console.log('Reservation confirmed successfully!');
            } catch (updateError) {
              console.error('Failed to update reservation status:', updateError);
              // Don't fail the whole process if status update fails
            }
          }

          setStatus('success');
          setPaymentData(response.data.payment);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
        <div className="text-center text-white p-8">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[rgb(250,146,8)] mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Overovanie platby...</h2>
          <p className="text-gray-300">Prosím počkajte, kým potvrdíme vašu platbu.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
        <div className="text-center text-white p-8 max-w-2xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Platba úspešná!</h1>
          <p className="text-xl text-gray-300 mb-8">Vaša rezervácia bola potvrdená.</p>

          {paymentData && (
            <div
              className="p-6 rounded-xl mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              <h3 className="text-xl font-bold mb-4 text-[rgb(250,146,8)]">Detaily rezervácie</h3>
              <div className="space-y-2 text-left">
                <p className="flex justify-between">
                  <span className="text-gray-400">Zaplatená suma:</span>
                  <span className="font-bold">€{paymentData.amount?.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">ID platby:</span>
                  <span className="font-mono text-sm">{paymentData._id}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Stav:</span>
                  <span className="text-green-500 font-bold">Potvrdené</span>
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-300 mb-8">
            Na váš email vám príde potvrdzovací email so všetkými detailmi.
          </p>

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
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#000000'}}>
      <div className="text-center text-white p-8 max-w-2xl">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Overenie platby zlyhalo</h1>
        <p className="text-xl text-gray-300 mb-8">
          Nepodarilo sa overiť vašu platbu. Ak bola suma stiahnutá z účtu, kontaktujte nás prosím.
        </p>

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
  );
}

export default PaymentSuccess;
