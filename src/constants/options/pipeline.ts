import { LoanSpecies, LoanStage } from '@/types';
import { PipelineLicenseTypeOpt } from '@/types/options';

export const OPTIONS_PIPELINE_LICENSE_TYPE: Option[] = [
  {
    label: 'NMLS',
    key: PipelineLicenseTypeOpt.nmls,
    value: PipelineLicenseTypeOpt.nmls,
  },
  {
    label: 'DRE Broker',
    key: PipelineLicenseTypeOpt.dre_broker,
    value: PipelineLicenseTypeOpt.dre_broker,
  },
  {
    label: 'DRE Sale Person',
    key: PipelineLicenseTypeOpt.dre_sale_person,
    value: PipelineLicenseTypeOpt.dre_sale_person,
  },
];

export const OPTIONS_LOAN_STAGE: Option[] = [
  {
    key: LoanStage.Application,
    value: LoanStage.Application,
    label: 'Application',
  },
  {
    key: LoanStage.PreApproved,
    value: LoanStage.PreApproved,
    label: 'Pre-approval',
  },
  {
    key: LoanStage.RateLocking,
    value: LoanStage.RateLocking,
    label: 'Rate Locking',
  },
  {
    key: LoanStage.RateLocked,
    value: LoanStage.RateLocked,
    label: 'Rate Locked',
  },
  {
    key: LoanStage.Approved,
    value: LoanStage.Approved,
    label: 'Approved',
  },
  {
    key: LoanStage.FinalClosing,
    value: LoanStage.FinalClosing,
    label: 'Final Closing',
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
];
