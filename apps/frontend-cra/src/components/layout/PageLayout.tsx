import React from 'react';
import { Layout } from 'antd';
import { Spin } from 'antd';
import styles from './layout.module.scss';
import { PageHeader } from './PageHeader';
import { PageFooter } from './PageFooter';

const { Content } = Layout;

export type PageLayoutProps = {
  loading?: boolean;
  children: React.ReactNode;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  loading,
}): JSX.Element => {
  return (
    <Layout className={styles.layout}>
      <PageHeader />
      <Content className={styles.content}>
        {loading ? (
          <div className={styles.spinner}>
            <Spin />
          </div>
        ) : (
          <div>{children}</div>
        )}
      </Content>
      <PageFooter />
    </Layout>
  );
};
