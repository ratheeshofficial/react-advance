import type { IPost } from './posts';

export type PostStatus =
  'Draft' | 'In Review' | 'Approved' | 'Scheduled' | 'Published';

export interface PublishValidationCheck {
  id: string;
  label: string;
  passed: boolean;
  missingMessage: string;
}

export interface PublishValidationResult {
  isValid: boolean;
  checks: PublishValidationCheck[];
  missingItems: string[];
}

export interface StatusTransitionConfig {
  actionLabel: string;
  targetStatus: PostStatus;
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle';
  colorPalette?: string;
  requiresValidation?: boolean;
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
}

export const WORKFLOW_TRANSITIONS: Record<
  PostStatus,
  StatusTransitionConfig[]
> = {
  Draft: [
    {
      actionLabel: 'Submit for Review',
      targetStatus: 'In Review',
      variant: 'outline',
      colorPalette: 'amber',
    },
    {
      actionLabel: 'Schedule',
      targetStatus: 'Scheduled',
      variant: 'outline',
      colorPalette: 'purple',
      requiresValidation: true,
    },
    {
      actionLabel: 'Publish Now',
      targetStatus: 'Published',
      variant: 'solid',
      colorPalette: 'green',
      requiresValidation: true,
    },
  ],
  'In Review': [
    {
      actionLabel: 'Approve Post',
      targetStatus: 'Approved',
      variant: 'solid',
      colorPalette: 'blue',
    },
    {
      actionLabel: 'Request Changes',
      targetStatus: 'Draft',
      variant: 'outline',
      colorPalette: 'red',
      requiresConfirmation: true,
      confirmTitle: 'Request Changes?',
      confirmMessage:
        'This post will be reverted back to Draft status so the author can make requested updates.',
    },
  ],
  Approved: [
    {
      actionLabel: 'Schedule',
      targetStatus: 'Scheduled',
      variant: 'outline',
      colorPalette: 'purple',
      requiresValidation: true,
    },
    {
      actionLabel: 'Publish Now',
      targetStatus: 'Published',
      variant: 'solid',
      colorPalette: 'green',
      requiresValidation: true,
    },
    {
      actionLabel: 'Revert to Draft',
      targetStatus: 'Draft',
      variant: 'ghost',
      colorPalette: 'gray',
      requiresConfirmation: true,
      confirmTitle: 'Revert to Draft?',
      confirmMessage:
        'Are you sure you want to revert this approved post back to Draft status?',
    },
  ],
  Scheduled: [
    {
      actionLabel: 'Publish Now',
      targetStatus: 'Published',
      variant: 'solid',
      colorPalette: 'green',
      requiresValidation: true,
    },
    {
      actionLabel: 'Unschedule',
      targetStatus: 'Draft',
      variant: 'outline',
      colorPalette: 'red',
      requiresConfirmation: true,
      confirmTitle: 'Unschedule Post?',
      confirmMessage:
        'This will cancel the scheduled publish date and revert the post to Draft status.',
    },
  ],
  Published: [
    {
      actionLabel: 'Unpublish',
      targetStatus: 'Draft',
      variant: 'outline',
      colorPalette: 'red',
      requiresConfirmation: true,
      confirmTitle: 'Unpublish Post?',
      confirmMessage:
        'This will revert the published post to Draft status. It will no longer be visible as published.',
    },
  ],
};

export function validatePostForPublish(
  post?: Partial<IPost> | null,
  blocksCount?: number,
): PublishValidationResult {
  const checks: PublishValidationCheck[] = [
    {
      id: 'title',
      label: 'Post Title',
      passed: Boolean(
        post?.title &&
        post.title.trim().length > 0 &&
        post.title.trim() !== 'Untitled',
      ),
      missingMessage: 'Title must be provided and cannot be "Untitled"',
    },
    {
      id: 'excerpt',
      label: 'Post Excerpt',
      passed: Boolean(post?.excerpt && post.excerpt.trim().length > 0),
      missingMessage: 'Excerpt is required for post previews',
    },
    {
      id: 'cover_image',
      label: 'Cover Image',
      passed: Boolean(post?.cover_image && post.cover_image.trim().length > 0),
      missingMessage: 'Cover image must be uploaded or provided',
    },
    {
      id: 'category',
      label: 'Category Selection',
      passed: Boolean(post?.category && post.category.trim().length > 0),
      missingMessage: 'Category must be selected',
    },
    {
      id: 'author',
      label: 'Author Name',
      passed: Boolean(post?.author && post.author.trim().length > 0),
      missingMessage: 'Author must be specified',
    },
    {
      id: 'slug',
      label: 'SEO URL Slug',
      passed: Boolean(
        post?.slug &&
        post.slug.trim().length > 0 &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug.trim()),
      ),
      missingMessage: 'Valid kebab-case slug is required (e.g. my-first-post)',
    },
    {
      id: 'content',
      label: 'Post Content',
      passed: blocksCount !== undefined ? blocksCount > 0 : true,
      missingMessage: 'At least one content block must be added to the post',
    },
    {
      id: 'attachments_ready',
      label: 'File Attachments Uploaded',
      passed: !post?.blocks?.some(
        (b) =>
          (b.type === 'attachment' || b.type === 'image') &&
          (b.uploadStatus === 'uploading' || b.uploadStatus === 'error'),
      ),
      missingMessage:
        'All file attachments and uploads must complete before publishing',
    },
  ];

  const missingItems = checks
    .filter((c) => !c.passed)
    .map((c) => c.missingMessage);
  const isValid = checks.every((c) => c.passed);

  return {
    isValid,
    checks,
    missingItems,
  };
}
