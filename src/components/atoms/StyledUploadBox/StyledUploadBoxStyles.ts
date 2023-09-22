import { POSFlex, POSFont, POSTextEllipsis } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledUploadBoxStyles: SxProps = {
  width: '100%',
  '& .icon': {
    verticalAlign: '-5px',
    cursor: 'pointer',
    '&:hover': {
      color: 'primary.main',
    },
  },
  '& .upload_img': {},
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
    ...POSTextEllipsis({ xs: 200, lg: 260, xl: 400 }),
  },
  '& .uploadBox': {
    width: '100%',
    border: '1px dashed',
    borderColor: 'background.border_default',
    overflow: 'hidden',
    display: 'block',
    textAlign: 'center',
    bgcolor: 'transparent',
    borderRadius: 2,
    lineHeight: '236px',
    minHeight: 236,
  },
  '& .MuiButton-root': {
    p: '0 !important',
  },
  '& button': {
    width: '100%',
    bgcolor: 'transparent',
    minHeight: 236,
    height: '100%',
  },
  '& .uploadBtn': {
    width: '100%',
    p: { md: 6, xs: 3 },
    textTransform: 'none',
    cursor: 'pointer',
    ...POSFlex('center', 'center', { lg: 'row', xs: 'column' }),
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
