import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/main/MainPage';
import { TripPage } from './pages/trip/TripPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PageLayout } from './components/Layout/PageLayout';
import './assets/scss/main.scss';
import 'antd/dist/reset.css';
import { fetchCurrencyRates } from './api/apiExternal';

const queryClient = new QueryClient();

export function App(): JSX.Element {
  useEffect(() => {
    const getCurrencyRates = async () => {
      try {
        const result = await fetchCurrencyRates();
        if (result?.success) {
          window.localStorage.setItem('currencyRates', JSON.stringify(result))
        }
      } catch (e) {
        console.error('Error', e);
      }
    };

    // TODO check the date
    if (window.localStorage.currencyRates === undefined) {
      void getCurrencyRates();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PageLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="trip/:id" element={<TripPage />} />
          <Route path="*" element={<p>There&apos;s nothing here: 404!</p>} />
        </Routes>
      </PageLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
