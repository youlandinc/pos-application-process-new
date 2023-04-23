import { POSTypeOf } from './TypeOf';
import { format } from 'date-fns';

export const POSFormatDollar = (
  amount: number | undefined,
  radix = 2,
): string => {
  if (!amount) {
    return '$0.00';
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: radix,
  });
};

export const POSFormatPercent = (
  percentageValue: number | undefined,
  radix = 3,
): string => {
  if (!percentageValue) {
    return '0.000%';
  }
  return (
    ((Math.floor(percentageValue * 1000000) / 1000000) * 100).toFixed(radix) +
    '%'
  );
};

export const POSFormatLocalPercent = (
  percentageValue: number | undefined,
  radix = 3,
): string => {
  if (!percentageValue) {
    return '0.000%';
  }
  return percentageValue.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: radix,
  });
};

export const POSFormatUSPhone = (entry = '') => {
  if (POSTypeOf(entry) === 'Null') {
    return '';
  }
  const cleaned = entry + '';
  const match =
    cleaned
      .replace(/\D+/g, '')
      .replace(/^0/, '')
      .match(/([^\d]*\d[^\d]*){1,10}$/)?.[0] || '';
  const part1 = match.length > 2 ? `${match.substring(0, 3)} - ` : match;
  const part2 = match.length > 3 ? `${match.substring(3, 6)}` : '';
  const part3 = match.length > 6 ? ` - ${match.substring(6, 10)}` : '';
  return `${part1}${part2}${part3}`;
};

export const POSFormatDate = (
  date: string | Date,
  timeFormat = 'yyyy-MM-dd HH:mm:ss O',
  options?: {
    locale?: Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: number;
    useAdditionalWeekYearTokens?: boolean;
    useAdditionalDayOfYearTokens?: boolean;
  },
): string => {
  return format(new Date(date), timeFormat, options);
};
