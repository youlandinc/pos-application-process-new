import { useEffect, useState } from 'react';
import { PropertyOpt, UnitOpt } from '../types/options';
import { utils } from '@/common/utils';

export const useCheckLoanAmount = (
  firstAmount: number | undefined,
  secondAmount: number | undefined,
  propertyOpt: PropertyOpt,
  numberOfUnits: UnitOpt,
) => {
  const [firstAmountError, setFirstAmountError] = useState<string[]>(['']);
  const [secondAmountError, setSecondAmountError] = useState<string[]>(['']);

  useEffect(() => {
    let limit = 647200;
    if (propertyOpt) {
      if (propertyOpt === PropertyOpt.twoToFourFamily) {
        switch (numberOfUnits) {
          case UnitOpt.twoUnits:
            limit = 828700;
            break;
          case UnitOpt.threeUnits:
            limit = 1001650;
            break;
          case UnitOpt.fourUnits:
            limit = 1244850;
            break;
        }
      }
    }

    const loanAmount = firstAmount - secondAmount;
    const rate = utils.formatPercent(secondAmount / firstAmount);
    setFirstAmountError(
      firstAmount < 51814 ? ['Minimum purchase price is $51,814.'] : [''],
    );
    if (typeof secondAmount === 'undefined') {
      setSecondAmountError(['please enter your amount']);
      return;
    }
    if (loanAmount < 50000) {
      setSecondAmountError(['Minimum loan amount is $50,000.']);
    } else if (loanAmount > limit) {
      setSecondAmountError([
        `Maximum loan amount is ${utils.formatDollar(
          limit,
        )}. We suggest you increase your down payment to ${utils.formatDollar(
          firstAmount - limit,
        )}`,
      ]);
    } else {
      setSecondAmountError(
        parseFloat(rate) < 20
          ? [
              `Your total down payment is only ${rate} of the purchase price. The minimum to qualify is 20%`,
            ]
          : [''],
      );
    }
  }, [propertyOpt, numberOfUnits, firstAmount, secondAmount]);

  return {
    firstAmountError,
    secondAmountError,
  };
};
