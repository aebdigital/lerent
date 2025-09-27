import Header from '../components/Header';
import Footer from '../components/Footer';

const DefaultLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col text-white" style={{backgroundColor: '#0d0d0d'}}>
      <Header />
      <main className="flex-grow relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout; 