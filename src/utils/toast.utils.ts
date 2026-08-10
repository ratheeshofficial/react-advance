import { toaster } from '../components/ui/toaster';

export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showToast = {
  success: (title: string, description?: string, duration = 1000) => {
    toaster.create({
      title,
      description,
      type: 'success',
      duration,
    });
  },
  error: (title: string, description?: string, duration = 1000) => {
    toaster.create({
      title,
      description,
      type: 'error',
      duration,
    });
  },
  info: (title: string, description?: string, duration = 1000) => {
    toaster.create({
      title,
      description,
      type: 'info',
      duration,
    });
  },
  warning: (title: string, description?: string, duration = 1500) => {
    toaster.create({
      title,
      description,
      type: 'warning',
      duration,
    });
  },
};
