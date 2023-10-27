import {
  LoanPurpose,
  LoanSpecies,
  LoanStage,
  PipelineACHAccountType,
  PipelineLicenseType,
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
    key: LoanStage.Application,
    value: LoanStage.Application,
    label: 'Manual entry',
  },
  {
    key: LoanStage.PreApproved,
    value: LoanStage.PreApproved,
    label: 'Pre-approval',
  },
  //{
  //  key: LoanStage.RateLocking,
  //  value: LoanStage.RateLocking,
  //  label: 'Rate locking',
  //},
  //{
  //  key: LoanStage.RateLocked,
  //  value: LoanStage.RateLocked,
  //  label: 'Rate locked',
  //},
  {
    key: LoanStage.Approved,
    value: LoanStage.Approved,
    label: 'Approved',
  },
  {
    key: LoanStage.FinalClosing,
    value: LoanStage.FinalClosing,
    label: 'Final closing',
  },
  {
    key: LoanStage.Refusal,
    value: LoanStage.Refusal,
    label: 'Rejected',
  },
];

export const OPTIONS_LOAN_SPECIES: Option[] = [
  {
    key: LoanSpecies.Mortgage,
    value: LoanSpecies.Mortgage,
    label: 'Mortgage',
  },
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
  {
    key: LoanSpecies.GroundUpConstruction,
    value: LoanSpecies.GroundUpConstruction,
    label: 'Ground-up Construction',
  },
];

export const OPTIONS_LOAN_PURPOSE: Option[] = [
  {
    key: LoanPurpose.Purchase,
    value: LoanPurpose.Purchase,
    label: 'Purchase',
  },
  {
    key: LoanPurpose.Refinance,
    value: LoanPurpose.Refinance,
    label: 'Refinance',
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
