/**
 * Generate PayBySquare data string according to Slovak PayBySquare standard
 * https://github.com/bysquare/bysquare
 */

/**
 * Generate variable symbol in format: YYYYMMNN
 * Example: 20251101 for first invoice in November 2025, 20251102 for second, etc.
 */
export const generateVariableSymbol = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const yearMonth = `${year}${month}`;

  // Get current count for this month from localStorage or start at 1
  const storageKey = `payBySquareCounter_${yearMonth}`;
  const currentCount = parseInt(localStorage.getItem(storageKey) || '0');
  const nextCount = currentCount + 1;

  // Save next count for this month
  localStorage.setItem(storageKey, nextCount.toString());

  // Format: YYYYMM + padded number (01, 02, etc.)
  const paddedNumber = nextCount.toString().padStart(2, '0');
  return `${yearMonth}${paddedNumber}`;
};

/**
 * Format date to YYYYMMDD
 */
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Generate PayBySquare data string
 * @param {Object} params
 * @param {number} params.amount - Amount in EUR
 * @param {string} params.iban - Bank account IBAN
 * @param {string} params.swift - SWIFT/BIC code
 * @param {string} params.beneficiaryName - Name of the beneficiary
 * @param {string} params.variableSymbol - Variable symbol
 * @param {string} params.paymentNote - Payment reference/note
 * @param {Date|string} params.dueDate - Due date for payment
 * @returns {string} PayBySquare formatted string
 */
export const generatePayBySquareData = ({
  amount,
  iban,
  swift,
  beneficiaryName,
  variableSymbol,
  paymentNote,
  dueDate
}) => {
  // Remove spaces from IBAN
  const cleanIban = iban.replace(/\s/g, '');

  // Format amount to 2 decimal places
  const formattedAmount = amount.toFixed(2);

  // Format due date
  const formattedDueDate = formatDate(dueDate);

  // Using EPC QR Code format (SEPA standard) which is compatible with Slovak banking apps
  // This format is widely supported and works with most Slovak mobile banking apps
  // Reference: https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation

  const lines = [
    'BCD',                                  // Service Tag
    '002',                                  // Version
    '1',                                    // Character set (1 = UTF-8)
    'SCT',                                  // Identification (SEPA Credit Transfer)
    swift || '',                            // BIC
    beneficiaryName,                        // Beneficiary name (max 70 chars)
    cleanIban,                              // Beneficiary account
    `EUR${formattedAmount}`,                // Amount (EUR prefix)
    '',                                     // Purpose (empty)
    variableSymbol || '',                   // Structured reference (Variable Symbol)
    paymentNote || '',                      // Unstructured remittance (Payment note)
    ''                                      // Beneficiary to originator information (empty)
  ];

  // Join with newlines as per EPC QR standard
  return lines.join('\n');
};

/**
 * Generate complete PayBySquare payment info
 * @param {Object} reservationData
 * @param {string} reservationData.carBrand - Car brand
 * @param {string} reservationData.carModel - Car model
 * @param {Date|string} reservationData.pickupDate - Pickup date
 * @param {Date|string} reservationData.dropoffDate - Dropoff date
 * @param {number} reservationData.totalAmount - Total amount in EUR
 * @param {string} reservationData.variableSymbol - Optional: Pre-generated variable symbol
 * @returns {Object} Payment info with QR data and display details
 */
export const generatePaymentInfo = (reservationData) => {
  const {
    carBrand,
    carModel,
    pickupDate,
    dropoffDate,
    totalAmount,
    variableSymbol: providedVariableSymbol
  } = reservationData;

  // Use provided variable symbol or generate a new one
  const variableSymbol = providedVariableSymbol || generateVariableSymbol();

  // Format dates for payment note
  const formatDateForNote = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('sk-SK');
  };

  // Generate payment note
  const paymentNote = `Prenajom ${carBrand} ${carModel}, od ${formatDateForNote(pickupDate)} do ${formatDateForNote(dropoffDate)}`;

  // Company bank details
  const bankDetails = {
    iban: 'SK73 1100 0000 0029 4315 7379',
    swift: 'TATRSKBX',
    beneficiaryName: 'LeRent s. r. o.',
    amount: totalAmount,
    variableSymbol,
    paymentNote,
    dueDate: pickupDate
  };

  // Generate QR data string
  const qrData = generatePayBySquareData(bankDetails);

  return {
    qrData,
    displayDetails: {
      ...bankDetails,
      formattedAmount: `${totalAmount.toFixed(2)} €`,
      formattedDueDate: formatDateForNote(pickupDate)
    }
  };
};
