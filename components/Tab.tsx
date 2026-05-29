import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from '@/styles/Tab.module.css';

interface TabProps {
  icon: string;
  filename: string;
  path: string;
  isExternal?: boolean;
}

const Tab = ({ icon, filename, path, isExternal }: TabProps) => {
  const router = useRouter();

  if (isExternal) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer">
        <div className={styles.tab}>
          <Image src={icon} alt={filename} height={18} width={18} />
          <p>{filename}</p>
        </div>
      </a>
    );
  }

  return (
    <Link href={path}>
      <div
        className={`${styles.tab} ${router.pathname === path && styles.active}`}
      >
        <Image src={icon} alt={filename} height={18} width={18} />
        <p>{filename}</p>
      </div>
    </Link>
  );
};

export default Tab;
