import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledRadio } from '@/components/atoms';

const RadioComponent: FC = () => {
  const router = useRouter();

  const [value, setValue] = useState('option2');

  return (
    <Box
      sx={{
        m: 4,
        p: 4,
        width: '50%',
        border: '1px solid rgba(145, 158, 171, 0.32)',
        borderRadius: 4,
        '& .component_wrap': {
          '& .divider': {
            my: 2,
          },
          '& .component_item': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '1px 1px 3px 1px rgba(0,0,0,.38)',
            p: 4,
            borderRadius: 4,
          },
        },
      }}
    >
      <StyledButton
        onClick={() => router.back()}
        sx={{
          my: 3,
        }}
        variant={'outlined'}
      >
        back to components
      </StyledButton>

      <Box className={'component_wrap'}>
        <Typography variant={'h4'}>Radio Group</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <StyledRadio
              label="Label"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue((event.target as HTMLInputElement).value);
              }}
              options={[
                { value: 'option1', label: 'option1' },
                { value: 'option2', label: 'option2' },
                { value: 'option3', label: 'option3' },
                { value: 'option4', label: 'option4' },
              ]}
              value={value}
            />
          </Box>
          <Box>
            <StyledRadio
              label="Label"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue((event.target as HTMLInputElement).value);
              }}
              options={[
                { value: 'option1', label: 'option1' },
                { value: 'option2', label: 'option2' },
                { value: 'option3', label: 'option3' },
                { value: 'option4', label: 'option4', disabled: true },
              ]}
              row
              value={value}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default RadioComponent;
