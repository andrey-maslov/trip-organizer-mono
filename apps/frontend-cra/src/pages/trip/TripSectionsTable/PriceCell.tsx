import React from 'react';
import { Section } from '@/shared/models';
import { currencies, DEFAULT_CURRENCY } from '@/shared/constants';

type PriceCellProps = Pick<Section, 'payments'>;

export const PriceCell: React.FC<PriceCellProps> = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return <div>-</div>;
  }

  const paymentTotalAmount = payments
    .map((payment) => payment.price?.amount || 0)
    .reduce((a, b) => a + b);

  // TODO fix approach of choosing currency inside one section (???)
  // user should chose one currency ... or ...
  const currency = payments[0]?.price?.currency || DEFAULT_CURRENCY;

  return (
    <div>
      {paymentTotalAmount}
      {currencies[currency].symbol}
    </div>
  );
};
