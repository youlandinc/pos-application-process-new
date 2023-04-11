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
