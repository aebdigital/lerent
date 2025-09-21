import HeroImg from '../test.png';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Mini Hero Section */}
      <div 
        className="relative h-[30vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${HeroImg})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Ochrana osobných údajov (GDPR)
          </h1>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg shadow-lg p-8" style={{backgroundColor: 'rgb(18, 18, 18)'}}>
            <div className="text-white space-y-8">
              <h1 className="text-3xl font-bold text-center mb-8">Ochrana osobných údajov (GDPR)</h1>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Základné informácie</h2>
                <p className="mb-4">Táto politika ochrany osobných údajov upravuje spôsob, akým spracúvame osobné údaje v súlade s nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR).</p>
                <p><strong>Správca údajov:</strong> [Názov spoločnosti], IČO: [IČO], sídlo: [Adresa]</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. Rozsah spracovávaných údajov</h2>
                
                <h3 className="text-lg font-semibold mb-3">2.1 Formuláre na webovej stránke</h3>
                <div className="mb-4">
                  <p className="font-semibold mb-2">Kontaktný formulár:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Povinné údaje: Meno, e-mail, správa</li>
                    <li>Voliteľné údaje: Telefónne číslo</li>
                    <li>Účel spracovania: odpoveď na dotaz</li>
                    <li>Doba uchovávania: 24 mesiacov od poslednej komunikácie</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold mb-2">Newsletter:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Povinné údaje: E-mail</li>
                    <li>Súhlas: Explicitný (opt-in)</li>
                    <li>Možnosť odhlásiť sa: V každom e-maile</li>
                    <li>Doba uchovávania: Do odvolania súhlasu</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-3">2.2 Automaticky zbierané údaje</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Technické údaje (IP adresa, typ prehliadača, verzia OS)</li>
                  <li>Údaje o návštevnosti (čas prístupu, prezerané stránky)</li>
                  <li>Cookies (viac v sekcii Cookies)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Právny základ a účel spracovania</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-600">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 p-3 text-left">Účel spracovania</th>
                        <th className="border border-gray-600 p-3 text-left">Právny základ</th>
                        <th className="border border-gray-600 p-3 text-left">Doba uchovávania</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-600 p-3">Plnenie zmluvy</td>
                        <td className="border border-gray-600 p-3">Čl. 6 ods. 1 b) GDPR</td>
                        <td className="border border-gray-600 p-3">Počas trvania zmluvy + 10 rokov</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-600 p-3">Marketing</td>
                        <td className="border border-gray-600 p-3">Čl. 6 ods. 1 a) GDPR (súhlas)</td>
                        <td className="border border-gray-600 p-3">Do odvolania súhlasu</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-600 p-3">Odpovede na dotazy</td>
                        <td className="border border-gray-600 p-3">Čl. 6 ods. 1 f) GDPR (oprávnený záujem)</td>
                        <td className="border border-gray-600 p-3">24 mesiacov</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Preposkytovanie údajov</h2>
                <p className="mb-2">Údaje môžu byť prevedené:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Spracovateľom služieb (IT poskytovatelia, hostingové spoločnosti)</li>
                  <li>Štatistickým službám (Google Analytics v anonymizovanej podobe)</li>
                  <li>Marketingovým platformám (len pri explicitnom súhlase)</li>
                  <li>Štátnym orgánom v prípade zákonnej povinnosti</li>
                </ul>
                <p>Všetci spracovatelia sú viazaní zmluvami o spracovaní údajov a zabezpečujú dostatočnú ochranu údajov.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. Zabezpečenie údajov</h2>
                <p className="mb-2">Implementovali sme technické a organizačné opatrenia na ochranu údajov:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Šifrovanie komunikácie (SSL/TLS)</li>
                  <li>Pravidelné aktualizácie a bezpečnostné audity</li>
                  <li>Obmedzený prístup k údajom</li>
                  <li>Pravidelné zálohovanie</li>
                  <li>Školenia zamestnancov</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Vaše práva</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Právo na prístup</h3>
                    <p>Môžete žiadať kópiu svojich osobných údajov.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Právo na opravu</h3>
                    <p>Môžete žiadať opravu nesprávnych údajov.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Právo na vymazanie</h3>
                    <p>Môžete žiadať vymazanie údajov ("právo byť zabudnutý").</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Právo na obmedzenie</h3>
                    <p>Môžete obmedziť spracovanie svojich údajov.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Právo na prenosnosť</h3>
                    <p>Môžete získať údaje v strojovo čitateľnom formáte.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Právo na námietku</h3>
                    <p>Môžete namietať proti spracovaniu údajov.</p>
                  </div>
                </div>
                <p className="mt-4">Na uplatnenie práv nás kontaktujte na gdpr@vasa-stranka.sk. Odpovedáme do 30 dní.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Kontaktné údaje</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Správca údajov:</h3>
                    <p>[Názov spoločnosti]</p>
                    <p>IČO: [IČO]</p>
                    <p>Adresa: [Adresa]</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Kontakt na DPO:</h3>
                    <p>E-mail: dpo@vasa-stranka.sk</p>
                    <p>Telefón: +421 XXX XXX XXX</p>
                  </div>
                </div>
                <p className="mt-4">Prípadné sťažnosti môžete podať aj Úradu na ochranu osobných údajov SR.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Platnosť a zmeny</h2>
                <p>Táto politika nadobúda účinnosť dňom 1.1.2024. Všetky zmeny budú zverejnené na tejto stránke.</p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Sections */}
    </div>
  );
};

export default PrivacyPage; 