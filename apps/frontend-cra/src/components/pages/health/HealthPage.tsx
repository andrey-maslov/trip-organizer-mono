import React from 'react';
import { checkAPIHealth, checkAPIVars } from '../../../api/apiTrips';

export const HealthPage: React.FC = (): JSX.Element => {
  return (
    <div style={{ padding: '40px' }}>
      <button
        onClick={() => {
          void checkAPIHealth();
        }}
      >
        API Health
      </button>
      <br />
      <br />
      <button
        onClick={() => {
          void checkAPIVars();
        }}
      >
        API Vars
      </button>
    </div>
  );
};
