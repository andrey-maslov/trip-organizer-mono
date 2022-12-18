import React from 'react';
import { Layout } from 'antd';
import styles from './layot.module.scss';
import Link from 'antd/es/typography/Link';

const { Header, Content, Footer } = Layout;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  return (
    <Layout>
      <Header>
        <div>
          <Link href={'/'} className={styles.logo}>
            T<sub>rip</sub>O<sub>org</sub>
          </Link>
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: '0 50px', marginTop: 64 }}
      >
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 680 }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Footer</Footer>
    </Layout>
  );
};
