import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const BankTransferInfo = ({ reservationId, totalAmount }) => {
  const [copiedField, setCopiedField] = useState(null);

  const bankDetails = {
    bankName: 'Tatra banka, a.s.',
    accountNumber: 'SK31 1100 0000 0029 4103 7541',
    iban: 'SK31 1100 0000 0029 4103 7541',
    swift: 'TATRSKBX',
    beneficiary: 'LERENT s.r.o.',
    amount: totalAmount,
    currency: 'EUR',
    variableSymbol: reservationId || '000000',
    message: `Rezervácia ${reservationId || '000000'}`
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoRow = ({ label, value, field }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-white font-medium">{value}</span>
        <button
          onClick={() => copyToClipboard(value, field)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title="Kopírovať"
        >
          {copiedField === field ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ backgroundColor: '#191919' }}>
      <div className="bg-[rgb(250,146,8)] px-6 py-4">
        <h2 className="text-xl font-bold text-white">Údaje na platbu</h2>
        <p className="text-sm text-white/90 mt-1">
          Prosím, vykonajte platbu na nižšie uvedený účet
        </p>
      </div>

      <div className="p-6 space-y-1">
        <InfoRow
          label="Banka"
          value={bankDetails.bankName}
          field="bank"
        />
        <InfoRow
          label="IBAN"
          value={bankDetails.iban}
          field="iban"
        />
        <InfoRow
          label="SWIFT/BIC"
          value={bankDetails.swift}
          field="swift"
        />
        <InfoRow
          label="Prijímateľ"
          value={bankDetails.beneficiary}
          field="beneficiary"
        />
        <InfoRow
          label="Suma"
          value={`${bankDetails.amount.toFixed(2)} ${bankDetails.currency}`}
          field="amount"
        />
        <InfoRow
          label="Variabilný symbol"
          value={bankDetails.variableSymbol}
          field="vs"
        />
        <InfoRow
          label="Správa pre príjemcu"
          value={bankDetails.message}
          field="message"
        />
      </div>

      <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[rgb(250,146,8)] flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Dôležité informácie:</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Uveďte prosím správny variabilný symbol pre identifikáciu platby</li>
              <li>• Rezervácia bude potvrdená po prijatí platby na účet</li>
              <li>• Platbu prosím vykonajte do 24 hodín</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferInfo;
