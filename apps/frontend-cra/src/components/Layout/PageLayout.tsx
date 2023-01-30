import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import styles from './layot.module.scss';
import Link from 'antd/es/typography/Link';
import { currencyISONameList, DEFAULT_CURRENCY } from '@/shared/constants';

const { Header, Content, Footer } = Layout;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
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
    <Layout className={styles.layout}>
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
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Footer</Footer>
    </Layout>
  );
};
