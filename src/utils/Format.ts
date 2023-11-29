import { POSTypeOf } from './TypeOf';
import { format } from 'date-fns';

export const POSFormatDollar = (
  amount: number | undefined | string,
  radix = 2,
): string => {
  if (!amount) {
    return '$0.00';
  }
  let target = amount;
  if (POSTypeOf(target) === 'String') {
    target = parseFloat(target as string);
  }
  return target.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: radix,
  });
};

export const POSFormatPercent = (
  percentageValue: number | undefined | string,
  radix = 3,
): string => {
  if (!percentageValue) {
    if (radix === 0) {
      return '0%';
    }
    return '0.000%';
  }
  let target = percentageValue;
  if (POSTypeOf(target) === 'String') {
    target = parseFloat(target as string);
  }
  return (
    ((Math.floor((target as number) * 1000000) / 1000000) * 100).toFixed(
      radix,
    ) + '%'
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

export const POSFormatUSPhoneToText = (entry = '') => {
  if (POSTypeOf(entry) === 'Null') {
    return '';
  }
  const cleaned: string = ('' + entry).replace(/\D/g, '');
  const match: RegExpMatchArray | null = cleaned.match(
    /^(\d{3})?(\d{3})(\d{4})$/,
  );
  if (match) {
    const areaCode: string = match[1] ? `(${match[1]}) ` : '';
    const formattedNumber = `${areaCode}${match[2]}-${match[3]}`;
    return formattedNumber;
  }
  return cleaned;
};

export const POSFormatUrl = (url: string): string => {
  if (/^https?:\/\//.test(url)) {
    return url;
  } else if (url.startsWith('https')) {
    return 'https://' + url.substring(5);
  }
  return 'https://' + url;
};
