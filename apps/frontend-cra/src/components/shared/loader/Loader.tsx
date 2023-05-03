import React from 'react';
import { Spin } from 'antd';
import styles from './loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <Spin tip="Loading" size="large" />
    </div>
  );
};
