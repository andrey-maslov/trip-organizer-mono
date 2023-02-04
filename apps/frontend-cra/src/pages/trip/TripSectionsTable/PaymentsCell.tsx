import React from 'react';
import { Section } from '@/shared/models';
import { FaExternalLinkAlt } from 'react-icons/fa';

type PaymentsCellProps = Pick<Section, 'payments'>;

export const PaymentsCell: React.FC<PaymentsCellProps> = ({ payments }) => {
  return (
    <div>
      {payments &&
        payments.map((payment, i) =>
          payment.link ? (
            <div key={i}>
              <a href={payment.link} target={'_blank'} rel="noreferrer">
                {payment.name || `-`} <FaExternalLinkAlt />
              </a>
            </div>
          ) : (
            <div key={i}>{payment.name || `-`}</div>
          )
        )}
    </div>
  );
};
