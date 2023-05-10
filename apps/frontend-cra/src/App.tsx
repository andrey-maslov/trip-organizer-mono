import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from './components/pages/main/MainPage';
import { TripPage } from './components/pages/trip/TripPage';
import { HealthPage } from './components/pages/health/HealthPage';
import { WaypointPage } from "./components/pages/waypoint/WaypointPage";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PageLayout } from './components/layout/PageLayout';
import './assets/scss/main.scss';
import 'antd/dist/reset.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <PageLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="trips/:id" element={<TripPage />} />
          <Route path="waypoints/:id" element={<WaypointPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="*" element={<p>There&apos;s nothing here: 404!</p>} />
        </Routes>
      </PageLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
