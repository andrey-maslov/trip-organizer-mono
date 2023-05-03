import { Layout } from 'antd';
import styles from './layout.module.scss';

const { Footer } = Layout;

export const PageFooter = () => {
  return <Footer className={styles.footer}>Footer</Footer>;
};
