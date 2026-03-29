import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#000000' }}>
      {/* Hero Section */}
      <section className="pt-32 pb-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8 font-goldman">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-4">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="tel:+421905318164" className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-800 hover:border-[rgb(250,146,8)] transition-colors duration-200" style={{ backgroundColor: '#111111' }}>
              <svg className="w-8 h-8 mb-3" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span className="text-white font-semibold">+421 905 318 164</span>
              <span className="text-gray-400 text-sm mt-1">{t('contact.callUs')}</span>
            </a>
            <a href="mailto:info@lerent.sk" className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-800 hover:border-[rgb(250,146,8)] transition-colors duration-200" style={{ backgroundColor: '#111111' }}>
              <svg className="w-8 h-8 mb-3" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span className="text-white font-semibold">info@lerent.sk</span>
              <span className="text-gray-400 text-sm mt-1">{t('contact.emailUs')}</span>
            </a>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-800" style={{ backgroundColor: '#111111' }}>
              <svg className="w-8 h-8 mb-3" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="text-white font-semibold">Bratislavská 9, Nitra</span>
              <span className="text-gray-400 text-sm mt-1">{t('contact.ourBranch')}</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-800" style={{ backgroundColor: '#111111' }}>
              <svg className="w-8 h-8 mb-3" fill="#fa9208" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span className="text-white font-semibold">{t('contact.openHoursValue')}</span>
              <span className="text-gray-400 text-sm mt-1">{t('contact.openHours')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-12" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="rounded-lg p-8 border border-gray-800" style={{ backgroundColor: '#111111' }}>
              <h2 className="text-2xl font-semibold text-white mb-6 font-goldman">{t('contact.writeUs')}</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-[rgb(250,146,8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('contact.successTitle')}</h3>
                  <p className="text-gray-300 mb-6">{t('contact.successText')}</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    style={{ backgroundColor: '#fa9208', color: '#191919' }}
                  >
                    {t('contact.successButton')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">{t('contact.formName')}</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-[rgb(250,146,8)] focus:outline-none transition-colors"
                        placeholder={t('contact.formNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">{t('contact.formEmail')}</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-[rgb(250,146,8)] focus:outline-none transition-colors"
                        placeholder="jan@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">{t('contact.formPhone')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-[rgb(250,146,8)] focus:outline-none transition-colors"
                        placeholder="+421 9XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">{t('contact.formSubject')}</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white focus:border-[rgb(250,146,8)] focus:outline-none transition-colors"
                      >
                        <option value="">{t('contact.formSubjectPlaceholder')}</option>
                        <option value="reservation">{t('contact.formSubjectReservation')}</option>
                        <option value="info">{t('contact.formSubjectInfo')}</option>
                        <option value="complaint">{t('contact.formSubjectComplaint')}</option>
                        <option value="cooperation">{t('contact.formSubjectCooperation')}</option>
                        <option value="other">{t('contact.formSubjectOther')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">{t('contact.formMessage')}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-500 focus:border-[rgb(250,146,8)] focus:outline-none transition-colors resize-none"
                      placeholder={t('contact.formMessagePlaceholder')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-bold text-lg transition-colors duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#fa9208', color: '#191919' }}
                  >
                    {t('contact.formSubmit')}
                  </button>
                  <p className="text-gray-500 text-xs text-center mt-2">
                    {t('contact.formDisclaimer')}
                  </p>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-gray-800" style={{ backgroundColor: '#111111' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2596.325896779728!2d18.110927!3d48.3174613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b3f0017a7734b%3A0x5b52f8d9b7ea2f1!2sLeRent!5e0!3m2!1sen!2ssk!4v1699999999999!5m2!1sen!2ssk"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LeRent - Bratislavská 9, Nitra"
              ></iframe>
            </div>
          </div>

          {/* Mobile: Get Directions Button */}
          <div className="lg:hidden flex justify-center mt-6">
            <a
              href="https://www.google.com/maps/dir//LeRent,+Bratislavsk%C3%A1+9,+949+01+Nitra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-goldman font-bold text-black bg-[#fa9208] hover:bg-[#e08206] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('contact.navigate')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
