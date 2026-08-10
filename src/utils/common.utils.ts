export const getInitials = (name: string) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export const slugify = (text: string, fallbackId = ''): string => {
  if (!text) return fallbackId ? `post-${fallbackId}` : '';
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || (fallbackId ? `post-${fallbackId}` : '');
};
