import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/main/MainPage';
import { TripPage } from './pages/trip/TripPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PageLayout } from './components/Layout/PageLayout';

const queryClient = new QueryClient();

export function App(): JSX.Element {
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
