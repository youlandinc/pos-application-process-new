import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '@/models/Root';
import { usePersistFn } from '@/hooks';
import { DetectActiveService } from '@/services/DetectActive';
import { userpool } from '@/constants';
import { LoginType, UserType } from '@/types/enum';

export const ProviderDetectActive: FC = observer((props) => {});
