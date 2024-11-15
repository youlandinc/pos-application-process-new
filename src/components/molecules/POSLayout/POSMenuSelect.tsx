import { FC, ReactNode, useRef, useState } from 'react';
import { Menu, MenuItem, Stack } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

import { useSessionStorageState } from '@/hooks';

export interface POSMenuSelectProps {
  options: {
    label: string;
    path: string;
    key: string;
    icon: ReactNode;
  }[];
  onChange: (path: string, key: string) => void;
  value?: string;
}

export const POSMenuSelect: FC<POSMenuSelectProps> = ({
  options = [],
  onChange,
  value,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);

  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Stack
        alignItems={'center'}
        border={'1px solid'}
        borderRadius={2}
        flexDirection={'row'}
        gap={1.5}
        height={48}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        order={{ xs: 2, lg: 1 }}
        px={1.5}
        ref={elementRef}
        sx={{
          borderColor: anchorEl ? '#202939' : '#D2D6E1',
          cursor: 'pointer',
          '&:hover': {
            borderColor: '#202939',
          },
        }}
        width={'100%'}
      >
        {options.find((item) => item.key === value)!.icon}
        {options.find((item) => item.key === value)!.label}
        <ArrowDropDown
          sx={{
            ml: 'auto',
            transform: `rotate(${anchorEl ? '-.5' : '0'}turn)`,
            '& path': {
              fill: 'rgba(0, 0, 0, 0.54)',
            },
          }}
        />
      </Stack>
      <Menu
        anchorEl={anchorEl}
        MenuListProps={{
          sx: {
            width: elementRef?.current?.offsetWidth || 'auto',
            p: 0,
            mt: 0,
            '& .MuiMenuItem-root:hover': {
              bgcolor: 'rgba(144, 149, 163, 0.1) !important',
            },
            '& .MuiMenuItem-root.Mui-selected': {
              bgcolor: `hsla(${
                saasState?.posSettings?.h ?? 222
              },100%,95%,1) !important`,
            },
            '& .Mui-selected:hover': {
              bgcolor: `hsla(${
                saasState?.posSettings?.h ?? 222
              },100%,92%,1) !important`,
            },
            '& .MuiMenuItem-root': {
              fontSize: 14,
              color: 'text.primary',
              bgcolor: 'transparent !important',
            },
            '& .MuiButtonBase-root': {
              '& .MuiFormControlLabel-root': {
                width: 'auto',
              },
            },
          },
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
          },
        }}
        transitionDuration={300}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.key}
            onClick={() => {
              setAnchorEl(null);
              onChange(opt.key, opt.path);
            }}
            sx={{
              height: 45,
              gap: 1.5,
              '&:hover': {
                color: 'primary.main',
                '& .icon_appraisal_svg__theme-color, & svg > path, & .icon_loan_terms_svg__theme-color':
                  {
                    fill: (theme) => theme.palette.primary.main,
                  },
                '': {
                  fill: (theme) => theme.palette.primary.main,
                },
              },
            }}
            value={opt.path}
          >
            {opt.icon} {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
