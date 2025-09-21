import HeroImg from '../test.png';

const TermsPage = () => {
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
            Podmienky používania
          </h1>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg shadow-lg p-8" style={{backgroundColor: 'rgb(18, 18, 18)'}}>
            <div className="text-white space-y-8">
              <h1 className="text-3xl font-bold text-center mb-8">Podmienky používania</h1>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Úvodné ustanovenia</h2>
                <p className="mb-4">Tieto Všeobecné obchodné podmienky (ďalej len "Podmienky") upravujú vzťah medzi poskytovateľom služieb a používateľom webovej stránky.</p>
                <p>Používaním tejto webovej stránky vyjadrujete súhlas s týmito Podmienkami.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. Definície pojmov</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Poskytovateľ</strong> - subjekt, ktorý prevádzkuje túto webovú stránku</li>
                  <li><strong>Používateľ</strong> - každá fyzická alebo právnická osoba, ktorá využíva služby poskytované na tejto webovej stránke</li>
                  <li><strong>Obsah</strong> - všetky texty, obrázky, grafy, multimediálne prvky a ďalšie materiály zverejnené na webovej stránke</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Prístup a používanie</h2>
                <p className="mb-4">Webová stránka je sprístupnená bezplatne, s výnimkou špeciálnych služieb, ktoré môžu byť zpoplatnené.</p>
                <p className="mb-2">Používateľ nesmie:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Porušovať autorské práva alebo iné duševné vlastníctvo</li>
                  <li>Šíriť neoprávnený obsah alebo malware</li>
                  <li>Používať stránku na nelegálne účely</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Ochrana osobných údajov</h2>
                <p>Spracovanie osobných údajov sa riadi našimi Zásadami ochrany osobných údajov v súlade s nariadením GDPR.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. Zodpovednosť</h2>
                <p className="mb-2">Poskytovateľ nezodpovedá za:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Prípadné výpadky služieb z dôvodov technických porúch alebo údržby</li>
                  <li>Obsah externých odkazovaných stránok</li>
                  <li>Škody vzniknuté v dôsledku používania alebo nefungovania webovej stránky</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Zmeny podmienok</h2>
                <p>Poskytovateľ si vyhradzuje právo kedykoľvek meniť tieto Podmienky. Zmeny nadobudnú platnosť ich zverejnením na webovej stránke.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Záverečné ustanovenia</h2>
                <p className="mb-4">Tieto Podmienky sú platné a účinné od 13.4.2025.</p>
                <p className="mb-4">Všetky spory vzniknuté na základe týchto Podmienok budú riešené príslušnými súdmi Slovenskej republiky.</p>
                <p className="text-sm text-gray-400">Naposledy aktualizované: 13.4.2025</p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Sections */}
    </div>
  );
};

export default TermsPage; 