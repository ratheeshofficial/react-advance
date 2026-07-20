export const hideScrollbarCss = {
  '&::-webkit-scrollbar': {
    width: '0px',
    background: 'transparent',
    display: 'none',
  },
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none',
};
