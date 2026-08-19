export const blockPreviewResetCss = {
  '& h1, & h2, & h3, & h4, & p, & ul, & ol, & blockquote, & pre': {
    marginTop: 0,
    marginBottom: 0,
  },
};

export const hideScrollbarCss = {
  '&::-webkit-scrollbar': {
    width: '0px',
    background: 'transparent',
    display: 'none',
  },
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none',
};
