import SEOHead from './SEOHead';
import { seoData } from '../utils/seoData';

const SEOWrapper = ({ page = 'home', children, customSEO = {} }) => {
  const seoProps = {
    ...seoData[page],
    ...customSEO
  };

  return (
    <>
      <SEOHead {...seoProps} />
      {children}
    </>
  );
};

export default SEOWrapper;