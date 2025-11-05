import config from '../config/config';

class PaymentService {
  /**
   * Create a reservation
   */
  async createReservation(reservationData) {
    // Debug: Log what we're about to send
    console.log('💼 PaymentService.createReservation called');
    console.log('💼 reservationData.selectedAdditionalInsurance:', reservationData.selectedAdditionalInsurance);
    console.log('💼 Type:', typeof reservationData.selectedAdditionalInsurance);
    console.log('💼 IsArray:', Array.isArray(reservationData.selectedAdditionalInsurance));

    // Create the body string
    const bodyString = JSON.stringify(reservationData);
    console.log('💼 Body string preview (first 1000 chars):', bodyString.substring(0, 1000));

    // Check if selectedAdditionalInsurance appears as string in the body
    const insuranceMatch = bodyString.match(/"selectedAdditionalInsurance":"?\[/);
    console.log('💼 Insurance in body starts with:', insuranceMatch ? insuranceMatch[0] : 'NOT FOUND');

    const response = await fetch(
      `${config.API_BASE_URL}/api/public/users/${config.ADMIN_EMAIL}/reservations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyString
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create reservation');
    }

    return response.json();
  }

  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(paymentData) {
    const response = await fetch(
      `${config.API_BASE_URL}/api/payments/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: config.ADMIN_EMAIL,
          amount: paymentData.amount,
          currency: paymentData.currency || 'EUR',
          description: paymentData.description,
          reservationId: paymentData.reservationId,
          successUrl: `${config.SITE_URL}/payment-success`,
          cancelUrl: `${config.SITE_URL}/payment-cancelled`,
          customerInfo: {
            email: paymentData.customerEmail
          },
          metadata: paymentData.metadata // Pass metadata to store reservation data
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  }

  /**
   * Verify payment status
   */
  async verifyPayment(paymentId, sessionId) {
    const response = await fetch(
      `${config.API_BASE_URL}/api/payments/verify/${paymentId}?session_id=${sessionId}`
    );

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return response.json();
  }

  /**
   * Update reservation status (e.g., from pending_payment to confirmed)
   */
  async updateReservationStatus(reservationId, status) {
    const response = await fetch(
      `${config.API_BASE_URL}/api/public/users/${config.ADMIN_EMAIL}/reservations/${reservationId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update reservation status');
    }

    return response.json();
  }

  /**
   * Link payment to reservation (update payment record with reservationId)
   */
  async linkPaymentToReservation(paymentId, reservationId) {
    const response = await fetch(
      `${config.API_BASE_URL}/api/payments/${paymentId}/link-reservation`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to link payment to reservation');
    }

    return response.json();
  }
}

export default new PaymentService();
