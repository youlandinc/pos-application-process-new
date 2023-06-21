import { POSFlex, POSFont, POSTextEllipsis } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledUploadButtonBoxStyles: SxProps = {
  border: '1px solid',
  borderColor: 'background.border_default',
  p: 3,
  width: '100%',
  borderRadius: 2,
  '& .icon': {
    verticalAlign: '-5px',
    cursor: 'pointer',
    '&:hover': {
      color: 'primary.main',
    },
  },
  '& .upload_img': {
    width: '40%',
    height: '100%',
    mr: {
      lg: 6,
      sx: 0,
    },
    mb: {
      lg: 0,
      xs: 3,
    },
  },
  '& .upload_text': {
    textAlign: {
      lg: 'left',
      xs: 'center',
    },
    '& h5': {
      fontSize: {
        lg: 20,
        xs: 18,
      },
    },
    '& p': {
      color: 'text.secondary',
      fontSize: {
        lg: 14,
        xs: 12,
      },
    },
  },
  '& .fileItem': {
    ...POSFont(14, 400, 1, 'text.primary'),
    ...POSFlex('center', 'space-between', 'row'),
    width: '100%',
    py: 1.5,
    px: {
      lg: 3,
      xs: 1.5,
    },
    border: '1px solid',
    borderColor: 'text.primary',
    borderRadius: 2,
    mt: 3,
  },
  '& .fileName': {
    ...POSTextEllipsis({ xs: 140, md: 280, lg: 220, xl: 400 }),
  },
  '& .uploadBox': {
    width: '100%',
    ...POSFlex('center', 'space-between', { md: 'row', xs: 'column' }),
    '& >h4': {
      fontSize: { md: 24, xs: 18 },
    },
    '& >label': {
      mt: {
        md: 0,
        xs: 3,
      },
      width: { md: 168, xs: '100%' },
    },
  },

  ' input': {
    width: '100%',
  },
  '& .dialogWrap': {
    ...POSFlex('center', 'center', 'column'),
    width: 496,
    padding: '48px',
  },
  '& .dialogDetail': {
    ...POSFont(14, 400, 1, 'info.main'),
    textAlign: 'center',
    wordBreak: 'break-all',
  },
} as const;
