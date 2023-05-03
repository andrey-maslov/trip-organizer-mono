import { useSearchParams } from 'react-router-dom';
import { Layout, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import styles from './layout.module.scss';
import Link from 'antd/es/typography/Link';
import { currencyISONameList, DEFAULT_CURRENCY } from '@/shared/constants';

const { Header } = Layout;

export const PageHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currency = searchParams.get('currency');

  const items: MenuProps['items'] = currencyISONameList
    .filter((currency) => currency !== DEFAULT_CURRENCY)
    .map((currency) => ({
      key: currency,
      label: (
        <button
          onClick={() => setSearchParams({ currency: currency.toLowerCase() })}
          className={styles.currency}
        >
          {currency}
        </button>
      ),
    }));

  return (
    <Header className={styles.header}>
      <Link href={'/'} className={styles.logo}>
        T<sub>rip</sub>O<sub>org</sub>
      </Link>

      <Dropdown menu={{ items }}>
        <button className={styles.currencyChange}>
          <span>{(currency || DEFAULT_CURRENCY).toUpperCase()}</span>
        </button>
      </Dropdown>
    </Header>
  );
};
