import { PipelineLicenseType, PipelineLoanStageEnum } from '@/types';

export const OPTIONS_LOAN_STAGE: Option[] = [
  {
    key: PipelineLoanStageEnum.inactive,
    value: PipelineLoanStageEnum.inactive,
    label: 'Inactive',
  },
  {
    key: PipelineLoanStageEnum.not_submitted,
    value: PipelineLoanStageEnum.not_submitted,
    label: 'Not submitted',
  },
  {
    key: PipelineLoanStageEnum.scenario,
    value: PipelineLoanStageEnum.scenario,
    label: 'Submitted',
  },
  {
    key: PipelineLoanStageEnum.pre_approved,
    value: PipelineLoanStageEnum.pre_approved,
    label: 'Under review',
  },
  {
    key: PipelineLoanStageEnum.processing,
    value: PipelineLoanStageEnum.processing,
    label: 'Processing',
  },
  {
    key: PipelineLoanStageEnum.initial_approval,
    value: PipelineLoanStageEnum.initial_approval,
    label: 'Initial approval',
  },
  {
    key: PipelineLoanStageEnum.preparing_docs,
    value: PipelineLoanStageEnum.preparing_docs,
    label: 'Final approval',
  },
  {
    key: PipelineLoanStageEnum.docs_out,
    value: PipelineLoanStageEnum.docs_out,
    label: 'Docs out',
  },
  {
    key: PipelineLoanStageEnum.funded,
    value: PipelineLoanStageEnum.funded,
    label: 'Funded',
  },
  {
    key: PipelineLoanStageEnum.on_hold,
    value: PipelineLoanStageEnum.on_hold,
    label: 'On hold',
  },
  {
    key: PipelineLoanStageEnum.rejected,
    value: PipelineLoanStageEnum.rejected,
    label: 'Rejected',
  },
];

export const OPTIONS_LICENSE_TYPE: Option[] = [
  {
    key: PipelineLicenseType.NMLS_LICENSE,
    value: PipelineLicenseType.NMLS_LICENSE,
    label: 'NMLS license',
  },
  {
    key: PipelineLicenseType.DRE_LICENSE,
    value: PipelineLicenseType.DRE_LICENSE,
    label: 'DRE license',
  },
];
