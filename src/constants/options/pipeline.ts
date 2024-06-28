import { PipelineLicenseType, PipelineLoanStageEnum } from '@/types';

export const OPTIONS_LOAN_STAGE: Option[] = [
  {
    key: PipelineLoanStageEnum.not_submitted,
    value: PipelineLoanStageEnum.not_submitted,
    label: 'Unsubmitted',
  },
  {
    key: PipelineLoanStageEnum.scenario,
    value: PipelineLoanStageEnum.scenario,
    label: 'Submitted',
  },
  {
    key: PipelineLoanStageEnum.initial_approval,
    value: PipelineLoanStageEnum.initial_approval,
    label: 'Initial approval',
  },
  {
    key: PipelineLoanStageEnum.preparing_docs,
    value: PipelineLoanStageEnum.preparing_docs,
    label: 'Preparing docs',
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
    key: PipelineLoanStageEnum.rejected,
    value: PipelineLoanStageEnum.rejected,
    label: 'Rejected',
  },
  {
    key: PipelineLoanStageEnum.inactive,
    value: PipelineLoanStageEnum.inactive,
    label: 'Inactive',
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
