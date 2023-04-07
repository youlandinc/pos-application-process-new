import { FC, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ArrowRightAlt, MoveToInbox } from '@mui/icons-material';

import {
  StyledButton,
  StyledTextField,
  StyledTextFieldNumber,
  StyledTextFieldPassword,
} from '@/components/atoms';

const ButtonDemo: FC = () => {
  const [value, setValue] = useState('123');
  const [number, setNumber] = useState(1000.99);

  return (
    <Box
      sx={{
        p: 15,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          border: '1px dashed rgba(145, 158, 171, 0.32)',
          borderRadius: 8,
          p: 5,
        }}
      >
        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          TextField
        </Typography>

        <StyledTextField
          disabled
          label={'disabled'}
          onChange={(e) => setValue(e.target.value)}
          placeholder={'disabled'}
          sx={{ width: 180 }}
          value={value}
        />

        <StyledTextField
          label={'error array'}
          onChange={(e) => setValue(e.target.value)}
          placeholder={'error array'}
          sx={{ width: 180, mx: 2 }}
          validate={['error 1', 'error 2']}
          value={value}
        />

        <StyledTextField
          label={'error'}
          onChange={(e) => setValue(e.target.value)}
          placeholder={'error'}
          sx={{ width: 180 }}
          validate={['error 1']}
          value={value}
        />

        <StyledTextField
          label={'static'}
          onChange={(e) => setValue(e.target.value)}
          placeholder={'static'}
          sx={{ width: 180, ml: 2 }}
          value={value}
        />

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Text Field Number
        </Typography>

        <StyledTextFieldNumber
          label={'dollar'}
          onValueChange={(v) => {
            setNumber(v.floatValue ?? 0);
          }}
          placeholder={'dollar'}
          prefix={'$'}
          sx={{ width: 180 }}
          value={number}
        />

        <StyledTextFieldNumber
          decimalScale={3}
          label={'percentage'}
          onValueChange={(v) => {
            setNumber(v.floatValue ?? 0);
          }}
          placeholder={'percentage'}
          suffix={'%'}
          sx={{ width: 180, ml: 2 }}
          value={number}
        />

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Text Field Password
        </Typography>
        <StyledTextFieldPassword
          label={'password'}
          onChange={(e) => setValue(e.target.value)}
          placeholder={'placeholder'}
          sx={{ width: 380 }}
          value={value}
        />

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Contained Button
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              color
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="contained">
              Primary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="info" variant="contained">
              Cancel
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="secondary" variant="contained">
              Secondary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="success" variant="contained">
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="warning" variant="contained">
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="error" variant="contained">
              Error
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              sx={{
                bgcolor: '#fff',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: '#fff',
                },
              }}
              variant="contained"
            >
              white
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              States
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="contained">
              Enabled
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="contained">
              Hover
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" disabled variant="contained">
              Disabled
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              icon
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              startIcon={<MoveToInbox />}
              variant="contained"
            >
              Export
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              endIcon={<ArrowRightAlt />}
              variant="contained"
            >
              Get started
            </StyledButton>
          </Grid>
        </Grid>

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Outlined Button
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              color
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="outlined">
              Primary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="secondary" variant="outlined">
              Secondary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="success" variant="outlined">
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="warning" variant="outlined">
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="error" variant="outlined">
              Error
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              States
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="outlined">
              Enabled
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="outlined">
              Hover
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" disabled variant="outlined">
              Disabled
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              icon
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              startIcon={<MoveToInbox />}
              variant="outlined"
            >
              Export
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              endIcon={<ArrowRightAlt />}
              variant="outlined"
            >
              Get started
            </StyledButton>
          </Grid>
        </Grid>

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Text Button
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              color
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="text">
              Primary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="secondary" variant="text">
              Secondary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="success" variant="text">
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="warning" variant="text">
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="error" variant="text">
              Error
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              States
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="text">
              Enabled
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="text">
              Hover
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" disabled variant="text">
              Disabled
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              icon
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              startIcon={<MoveToInbox />}
              variant="text"
            >
              Export
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              endIcon={<ArrowRightAlt />}
              variant="text"
            >
              Get started
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ButtonDemo;
