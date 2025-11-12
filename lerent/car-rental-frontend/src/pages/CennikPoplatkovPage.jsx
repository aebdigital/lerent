import HeroImg from '../test.png';

const CennikPoplatkovPage = () => {
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
            Cenník poplatkov
          </h1>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg shadow-lg p-8" style={{backgroundColor: 'rgb(18, 18, 18)'}}>
            <div className="text-white space-y-8">
              <h1 className="text-3xl font-bold text-center mb-8">Cenník poplatkov</h1>

              <section>
                <div className="space-y-4">
                  <p>Poplatok za prevzatie/odovzdanie auta mimo otváracích hodín je 30 € za prevzatie a zvlášť 30 € za odovzdanie.</p>

                  <p>Prevzatie a odovzdanie auta mimo dohodnutý čas v zmluve - každá začatá hodina čakania navyše (okrem prvých 30 min) je spoplatnená 5 € (ak je čas prevzatia 15:00 a zákazník príde 15:31, tak mu bude účtovaný poplatok 5 €).</p>

                  <p>Vrátenie nedotankovaného vozidla - výška poplatku bude rovnaká ako cena dotankovania vozidla do plna na najbližšej čerpacej stanici + 5 € za náš čas strávený dotankovaním (cesta, tankovanie).</p>

                  <p>Natankovanie nesprávneho paliva bude spoplatnené podľa zistenej škody na aute spôsobenej nesprávnym palivom.</p>

                  <p>Vrátenie viditeľne neumytého vozidla je spoplatnené sumou 20 €.</p>

                  <p>Vrátenie znečisteného vozidla je spoplatnené v závislo od znečistenia. Za vysávanie je poplatok 20 €. Ak je vozidlo potrebné aj čistiť, ale nie tepovať, tak je poplatok 100 €. Ak je potrebné aj tepovanie, tak je za každé sedadlo, ktoré musí byť tepované, účtovaný poplatok 30 €.</p>

                  <p>Fajčenie vo vozidle je prísne zakázané a pri jeho porušení bude účtovaný nájomcovi poplatok 200 € za čistenie.</p>

                  <p>Poškodenie interiéru bude spoplatnené podľa poškodenia resp. sumy potrebnej na opravu alebo výmenu poškodenej časti interiéru.</p>

                  <p>Strata kľúčov je za poplatok, ktorý sa rovná sume obstarania nového kľúča + 30 € za náš čas strávený vybavovaním nového kľúča.</p>

                  <p>Strata dokladov je za poplatok 200 €.</p>

                  <p>Strata povinnej výbavy je za poplatok 30 €.</p>

                  <p>Škodová udalosť, pri ktorej je na vine/spoluvine nájomca vozidla, je spoplatnená spoluúčasťou vo výške 10% z ceny opravy prenajatého vozidla, minimálne však sumou 400 €.</p>

                  <p>V prípade, ak bude po škodovej udalosti, ktorú zavinil/bol spoluvinníkom nájomca, auto dlhšie ako 7 kalendárnych dní nepojazdné, tak nájomca platí za každý začatý deň, kedy je auto nepojazdné, 50 % z bežnej ceny prenájmu daného vozidla (počíta sa denná sadzba po spočítaní všetkých dní odkedy bolo auto napojazdné, napríklad ak sa stalo nepojazdným 1.1.2026 a bolo nepojazdné až do 10.1.2026, tak nájomca musí zaplatiť poplatok vo výške 50% z ceny prenájmu vozidla, ktorá sa bude počítať z sadzby 4-10 dní, konkrétne za 10 dní).</p>

                  <p>Nezakúpenie diaľničnej známky v zahraničí bude spoplatnené podľa výšky pokuty za daný priestupok v zahraničí.</p>

                  <p>Spracovanie akejkoľvek pokuty, ktorú zapríčinil nájomca počas doby prenájmu, je spoplatnené sumou 20 €. Nájomcovi bude účtovaný poplatok vo výške sumy pokuty + 20 € za jej spracovanie.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Sections */}
    </div>
  );
};

export default CennikPoplatkovPage;