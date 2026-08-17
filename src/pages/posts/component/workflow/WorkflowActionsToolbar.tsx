import { useState } from 'react';
import { HStack, Button, Text, Box } from '@chakra-ui/react';
import { FiCheckSquare, FiClock } from 'react-icons/fi';
import { usePosts } from '../../../../hooks/usePosts';
import type { IPost } from '../../../../types/posts/posts';
import {
  WORKFLOW_TRANSITIONS,
  validatePostForPublish,
  type PostStatus,
  type StatusTransitionConfig,
} from '../../../../types/posts/workflow';
import { showToast } from '../../../../utils/toast.utils';
import PublishChecklistModal from './PublishChecklistModal';
import ScheduleModal from './ScheduleModal';
import ConfirmModal from '../../../../components/common/ConfirmModal';
import { formatDate } from '../../../../utils/date.utils';

export interface WorkflowActionsToolbarProps {
  postId?: string;
  post?: IPost | null;
  blocksCount?: number;
}

const getStatusStyles = (status?: string) => {
  const s = (status || 'draft').toLowerCase();
  if (s === 'published')
    return { bg: 'status.published.subtle', color: 'status.published.fg' };
  if (s === 'in review' || s === 'review' || s === 'inreview')
    return { bg: 'status.review.subtle', color: 'status.review.fg' };
  if (s === 'approved')
    return { bg: 'status.approved.subtle', color: 'status.approved.fg' };
  if (s === 'scheduled')
    return { bg: 'status.scheduled.subtle', color: 'status.scheduled.fg' };
  return { bg: 'status.draft.subtle', color: 'status.draft.fg' };
};

export function WorkflowActionsToolbar({
  postId,
  post,
  blocksCount,
}: WorkflowActionsToolbarProps) {
  const { update } = usePosts();

  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [pendingTransition, setPendingTransition] =
    useState<StatusTransitionConfig | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!postId || !post) return null;

  const currentStatus: PostStatus = post.status || 'Draft';
  const transitions = WORKFLOW_TRANSITIONS[currentStatus] || [];
  const validationResult = validatePostForPublish(post, blocksCount);
  const statusStyle = getStatusStyles(currentStatus);

  const handleActionClick = (transition: StatusTransitionConfig) => {
    // Validation check for Publish or Schedule
    if (transition.requiresValidation) {
      if (!validationResult.isValid) {
        setIsChecklistOpen(true);
        return;
      }
    }

    // Schedule modal requirement
    if (transition.targetStatus === 'Scheduled') {
      setIsScheduleOpen(true);
      return;
    }

    // Confirmation dialog requirement
    if (transition.requiresConfirmation) {
      setPendingTransition(transition);
      setIsConfirmOpen(true);
      return;
    }

    // Direct transition execution
    executeStatusUpdate(transition.targetStatus, transition.actionLabel);
  };

  const executeStatusUpdate = async (
    targetStatus: PostStatus,
    actionName: string,
    publishDateIso?: string,
  ) => {
    try {
      const payload: IPost = {
        ...post,
        status: targetStatus,
        lastUpdated: new Date().toISOString(),
      };

      if (targetStatus === 'Scheduled' && publishDateIso) {
        payload.publishDate = publishDateIso;
      } else if (targetStatus === 'Published' && !payload.publishDate) {
        payload.publishDate = new Date().toISOString();
      }

      await update(postId, payload);
      showToast.success(
        'Status Updated',
        `Post status changed to ${targetStatus} (${actionName}).`,
      );
    } catch (err) {
      console.error(err);
      showToast.error(
        'Update Failed',
        'Failed to update post workflow status.',
      );
    }
  };

  const handleConfirmTransition = () => {
    if (pendingTransition) {
      executeStatusUpdate(
        pendingTransition.targetStatus,
        pendingTransition.actionLabel,
      );
      setPendingTransition(null);
    }
    setIsConfirmOpen(false);
  };

  const handleConfirmSchedule = (publishDateIso: string) => {
    executeStatusUpdate('Scheduled', 'Schedule Post', publishDateIso);
  };

  const handleDirectPublish = () => {
    executeStatusUpdate('Published', 'Publish Now');
  };

  return (
    <HStack gap='3' align='center' wrap='wrap'>
      {/* Current Workflow Status Stamp Badge */}
      <HStack gap='2' align='center'>
        <HStack
          bg={statusStyle.bg}
          color={statusStyle.color}
          px='3'
          py='1.5'
          borderRadius='full'
          fontSize='12px'
          fontWeight='700'
          fontFamily="'Inter', sans-serif"
          letterSpacing='0.02em'
          gap='6px'
          shadow='sm'
        >
          <Box w='6px' h='6px' borderRadius='full' bg={statusStyle.color} />
          <Text>{currentStatus}</Text>
        </HStack>

        {currentStatus === 'Scheduled' && post.publishDate && (
          <HStack
            color='status.scheduled.fg'
            bg='status.scheduled.subtle'
            px='2.5'
            py='1.5'
            borderRadius='full'
            fontSize='11.5px'
            fontFamily="'IBM Plex Mono', monospace"
            fontWeight='500'
            gap='5px'
          >
            <FiClock size={12} />
            <Text>{formatDate(post.publishDate)}</Text>
          </HStack>
        )}
      </HStack>

      {/* Publish Checklist Trigger Button */}
      <Button
        size='sm'
        variant='outline'
        borderColor='border.default'
        bg='bg.surface'
        color='text.secondary'
        fontSize='12.5px'
        fontWeight='500'
        fontFamily="'Inter', sans-serif"
        borderRadius='8px'
        px='3'
        py='1.5'
        h='auto'
        _hover={{ bg: 'bg.subtle' }}
        onClick={() => setIsChecklistOpen(true)}
      >
        <HStack gap='6px' align='center'>
          <Box color={validationResult.isValid ? 'status.published.fg' : 'stamp.fg'}>
            <FiCheckSquare size={13} />
          </Box>
          <Text>
            Checklist ({validationResult.checks.filter((c) => c.passed).length}/
            {validationResult.checks.length})
          </Text>
        </HStack>
      </Button>

      {/* Workflow Transition Action Buttons */}
      {transitions.map((t) => {
        const targetTheme = getStatusStyles(t.targetStatus);
        return (
          <Button
            key={t.actionLabel}
            size='sm'
            bg={targetTheme.color}
            color='text.inverse'
            fontFamily="'Inter', sans-serif"
            fontSize='12.5px'
            fontWeight='600'
            borderRadius='8px'
            px='3.5'
            py='1.5'
            h='auto'
            shadow='sm'
            transition='all 0.12s ease'
            _hover={{ opacity: 0.9, transform: 'translateY(-1px)' }}
            onClick={() => handleActionClick(t)}
          >
            {t.actionLabel}
          </Button>
        );
      })}

      {/* Publish Checklist Modal */}
      <PublishChecklistModal
        open={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        post={post}
        blocksCount={blocksCount}
        onPublishNow={handleDirectPublish}
        onOpenScheduleModal={() => setIsScheduleOpen(true)}
      />

      {/* Schedule Future Date Modal */}
      <ScheduleModal
        open={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        initialDate={post.publishDate}
        onConfirmSchedule={handleConfirmSchedule}
      />

      {/* Confirmation Dialog */}
      <ConfirmModal
        open={isConfirmOpen}
        onOpenChange={(details) => !details.open && setIsConfirmOpen(false)}
        onClose={() => setIsConfirmOpen(false)}
        title={pendingTransition?.confirmTitle || 'Confirm Workflow Action'}
        description={
          pendingTransition?.confirmMessage ||
          `Are you sure you want to proceed with ${pendingTransition?.actionLabel}?`
        }
        confirmText='Confirm'
        confirmColorScheme={pendingTransition?.colorPalette || 'red'}
        onConfirm={handleConfirmTransition}
      />
    </HStack>
  );
}

export default WorkflowActionsToolbar;

