import { LoanAnswerEnum, LoanFicoScoreEnum } from '@/types';

export const APPLICATION_ESTIMATE_RATE_FICO_SCORE: Option[] = [
  {
    label: 'FICO not available',
    key: LoanFicoScoreEnum.fico_not_available,
    value: LoanFicoScoreEnum.fico_not_available,
  },
  {
    label: 'Below 600',
    key: LoanFicoScoreEnum.below_600,
    value: LoanFicoScoreEnum.below_600,
  },
  {
    label: '600-649',
    key: LoanFicoScoreEnum.between_600_649,
    value: LoanFicoScoreEnum.between_600_649,
  },
  {
    label: '650-699',
    key: LoanFicoScoreEnum.between_650_699,
    value: LoanFicoScoreEnum.between_650_699,
  },
  {
    label: '700-749',
    key: LoanFicoScoreEnum.between_700_749,
    value: LoanFicoScoreEnum.between_700_749,
  },
  {
    label: '750-799',
    key: LoanFicoScoreEnum.between_750_799,
    value: LoanFicoScoreEnum.between_750_799,
  },
  {
    label: '800+',
    key: LoanFicoScoreEnum.above_800,
    value: LoanFicoScoreEnum.above_800,
  },
];

export const APPLICATION_ESTIMATE_RATE_LIQUIDITY: Option[] = [
  {
    label: 'Fill out liquidity amount',
    key: LoanAnswerEnum.yes,
    value: LoanAnswerEnum.yes,
  },
  {
    label: 'Not sure',
    key: LoanAnswerEnum.no,
    value: LoanAnswerEnum.no,
  },
];
