import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig, i18n} = useDocusaurusContext();

  const translations = {
    fr: {
      title: 'Bienvenue sur la documentation',
      subtitle: 'Explorez nos ressources',
      getStarted: 'Commencer',
      intro: 'intro',
    },
    en: {
      title: 'Welcome to the Documentation',
      subtitle: 'Explore our resources',
      getStarted: 'Get Started',
      intro: 'en/intro',
    },
  };

  const {title, subtitle, getStarted, intro} = translations[i18n.currentLocale];

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {title}
        </Heading>
        <p className="hero__subtitle">{subtitle}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to={`/docs/${intro}`}>
            {getStarted} 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Centralized Project Documentation for Digital Drifter">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

