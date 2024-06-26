import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import {
  StyledButton,
  StyledLoading,
  StyledTextFieldNumber,
} from '@/components/atoms';

export const TasksRehabInfo: FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [arv, setArv] = useState<number | undefined>();
  const [square, setSquare] = useState<number | undefined>();

  const isFormDataValid = useMemo(() => {
    return true;
  }, []);

  const handleSave = async () => {
    console.log(123);
  };

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        alignItems={'center'}
        gap={6}
        justifyContent={'flex-start'}
        maxWidth={648}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          color={'text.primary'}
          fontSize={{ xs: 20, lg: 24 }}
          textAlign={'center'}
          variant={'h5'}
        >
          Rehab info
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            variant={'body1'}
          >
            Please provide some more information about the value of the property
            as it is now and the planned after-repair square footage.
          </Typography>
        </Typography>

        <Stack gap={3} width={'100%'}>
          <StyledTextFieldNumber
            label={'After repair value (ARV)'}
            onValueChange={({ floatValue }) => setArv(floatValue)}
            placeholder={'After repair value (ARV)'}
            prefix={'$'}
            value={arv}
          />

          <StyledTextFieldNumber
            label={'After-repair square footage'}
            onValueChange={({ floatValue }) => setSquare(floatValue)}
            placeholder={'After-repair square footage'}
            suffix={' sq ft'}
            value={square}
          />
        </Stack>

        <Stack
          flexDirection={{ xs: 'unset', md: 'row' }}
          gap={3}
          maxWidth={600}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            onClick={async () => {
              await router.push({
                pathname: '/dashboard/tasks',
                query: { loanId: router.query.loanId },
              });
            }}
            sx={{ flex: 1, width: '100%' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading || !isFormDataValid}
            loading={saveLoading}
            onClick={handleSave}
            sx={{ flex: 1, width: '100%' }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
