import React from 'react';
import { Layout } from 'antd';
import styles from './layot.module.scss';
import Link from 'antd/es/typography/Link';

const { Header, Content, Footer } = Layout;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  return (
    <Layout className={styles.layout}>
      <Header>
        <Link href={'/'} className={styles.logo}>
          T<sub>rip</sub>O<sub>org</sub>
        </Link>
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Footer</Footer>
    </Layout>
  );
};
