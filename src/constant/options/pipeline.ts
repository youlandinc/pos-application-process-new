import { Options } from '@/types/options'

export const OPTIONS_PIPELINE_LICENSE_TYPE: Option[] = [
  {
    label: 'NMLS',
    key: Options.PipelineLicenseTypeOpt.nmls,
    value: Options.PipelineLicenseTypeOpt.nmls,
  },
  {
    label: 'DRE Broker',
    key: Options.PipelineLicenseTypeOpt.dre_broker,
    value: Options.PipelineLicenseTypeOpt.dre_broker,
  },
  {
    label: 'DRE Sale Person',
    key: Options.PipelineLicenseTypeOpt.dre_sale_person,
    value: Options.PipelineLicenseTypeOpt.dre_sale_person,
  },
]
