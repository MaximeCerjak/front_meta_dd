import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  const {siteConfig, i18n} = useDocusaurusContext();

  const translations = {
    en: {
      centralDocTitle: 'Centralized Documentation',
      centralDoc: 'All project documentation is centralized here for ease of access and collaboration. Explore coding standards, workflows, and best practices.',
      devGuideTitle: 'Developer Guidelines',
      devGuide: 'Access comprehensive guidelines for code quality, version control, and team collaboration to ensure seamless development workflows.',
      secStandTitle: 'Security Standards',
      secStand: 'Stay updated on the latest security protocols, including secrets management, data protection, and secure CI/CD pipelines.',
    },
    fr: {
      centralDocTitle: 'Documentation Centralisée',
      centralDoc: 'Toute la documentation du projet est centralisée ici pour faciliter l\'accès et la collaboration. Explorez les normes de codage, les flux de travail et les meilleures pratiques.',
      devGuideTitle: 'Directives pour les développeurs',
      devGuide: 'Accédez à des directives complètes pour la qualité du code, le contrôle de version et la collaboration d\'équipe pour garantir des flux de travail de développement sans faille.',
      secStandTitle: 'Normes de sécurité',
      secStand: 'Restez informé des derniers protocoles de sécurité, y compris la gestion des secrets, la protection des données et les pipelines CI/CD sécurisés.',
    },
  };

  const FeatureList = [
    {
      title: translations[i18n.currentLocale].centralDocTitle,
      Svg: require('@site/static/img/undraw_resume.svg').default,
      description: (
        <>
          {translations[i18n.currentLocale].centralDoc}
        </>
      ),
    },
    {
      title: translations[i18n.currentLocale].devGuideTitle,
      Svg: require('@site/static/img/undraw_developer_activity.svg').default,
      description: (
        <>
          {translations[i18n.currentLocale].devGuide}
        </>
      ),
    },
    {
      title: translations[i18n.currentLocale].secStandTitle,
      Svg: require('@site/static/img/undraw_secure_server.svg').default,
      description: (
        <>
          {translations[i18n.currentLocale].secStand}
        </>
      ),
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
