import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import ScrollToTop from './components/ScrollToTop';
import ApiStatus from './components/ApiStatus';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import CarDetailsPage from './pages/CarDetailsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PoisteniePage from './pages/PoisteniePage';
import AutouveryPage from './pages/AutouveryPage';
import SprostredkovaniePage from './pages/SprostredkovaniePage';
import './index.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car/:id" element={<CarDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/poistenie" element={<PoisteniePage />} />
          <Route path="/autouvery" element={<AutouveryPage />} />
          <Route path="/sprostredkovanie" element={<SprostredkovaniePage />} />
        </Routes>
      </DefaultLayout>
      <ApiStatus />
    </Router>
  );
}

export default App;
