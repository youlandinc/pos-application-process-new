import {
  LoanSpecies,
  PipelineACHAccountType,
  PipelineLicenseType,
  PipelineLoanStageEnum,
} from '@/types';
import { PipelineLicenseTypeOpt } from '@/types/options';

export const OPTIONS_PIPELINE_LICENSE_TYPE: Option[] = [
  {
    label: 'NMLS',
    key: PipelineLicenseTypeOpt.nmls,
    value: PipelineLicenseTypeOpt.nmls,
  },
  {
    label: 'DRE broker',
    key: PipelineLicenseTypeOpt.dre_broker,
    value: PipelineLicenseTypeOpt.dre_broker,
  },
  {
    label: 'DRE sale person',
    key: PipelineLicenseTypeOpt.dre_sale_person,
    value: PipelineLicenseTypeOpt.dre_sale_person,
  },
];

export const OPTIONS_LOAN_STAGE: Option[] = [
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

export const OPTIONS_LOAN_SPECIES: Option[] = [
  // {
  //   key: LoanSpecies.Mortgage,
  //   value: LoanSpecies.Mortgage,
  //   label: 'Mortgage',
  // },
  {
    key: LoanSpecies.Bridge,
    value: LoanSpecies.Bridge,
    label: 'Bridge',
  },
  {
    key: LoanSpecies.FixAndFlip,
    value: LoanSpecies.FixAndFlip,
    label: 'Fix and Flip',
  },
  // {
  //   key: LoanSpecies.GroundUpConstruction,
  //   value: LoanSpecies.GroundUpConstruction,
  //   label: 'Ground-up Construction',
  // },
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

export const OPTIONS_ACCOUNT_TYPE: Option[] = [
  {
    key: PipelineACHAccountType.CHECKING,
    value: PipelineACHAccountType.CHECKING,
    label: 'Checking',
  },
  {
    key: PipelineACHAccountType.SAVINGS,
    value: PipelineACHAccountType.SAVINGS,
    label: 'Savings',
  },
];
