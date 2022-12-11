import React from 'react';
import { Layout } from 'antd';
import styles from './layot.module.scss';

const { Header, Content, Footer } = Layout;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  return (
    <Layout>
      <Header>
        <div className={styles.logo} />
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 680 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Footer</Footer>
    </Layout>
  );
};
