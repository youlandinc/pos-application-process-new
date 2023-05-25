export const StyledTooltipStyles = {
  fontSize: 12,
  fontWeight: 400,
  '&.dark': {
    bgcolor: 'text.primary',
    '& .MuiTooltip-arrow': {
      color: 'text.primary',
    },
  },
} as const;
