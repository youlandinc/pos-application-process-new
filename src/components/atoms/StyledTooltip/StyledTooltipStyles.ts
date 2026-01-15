export const StyledTooltipStyles = {
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.5,
  bgcolor: 'background.white',
  color: 'text.primary',
  border: '1px solid #E6E8ED',
  p: 1.5,
  borderRadius: 2,
  '&.darker': {
    bgcolor: 'text.primary',
    color: 'white',
    '& .MuiTooltip-arrow': {
      color: 'text.primary',
    },
  },
} as const;
