import styles from '@/styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'hilalyilmaz.net',
    href: 'https://hilalyilmaz.net',
  },
  {
    social: 'email',
    link: 'hilalyilmaz.eng@gmail.com',
    href: 'mailto:hilalyilmaz.eng@gmail.com',
  },
  {
    social: 'github',
    link: 'YilmazHilal',
    href: 'https://github.com/YilmazHilal',
  },
  {
    social: 'linkedin',
    link: 'hilalyilmaz23',
    href: 'https://www.linkedin.com/in/hilalyilmaz23/',
  },
  {
    social: 'twitter',
    link: '@aksiyonalindi',
    href: 'https://x.com/aksiyonalindi',
  },
  {
    social: 'instagram',
    link: 'hilal_yilmaz23',
    href: 'https://www.instagram.com/hilal_yilmaz23/',
  },
  {
    social: 'medium',
    link: 'hilalyilmaz',
    href: 'https://medium.com/@Hilal_Yilmaz',
  },
  {
    social: 'peerlist',
    link: 'hilalyilmaz',
    href: 'https://peerlist.io/hilalyilmaz',
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
