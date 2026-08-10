import { useState } from 'react';
import { HStack, Button, Badge, Text } from '@chakra-ui/react';
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
import { getBadgePalette } from '../../../../constant/PostsConfigProps';

export interface WorkflowActionsToolbarProps {
  postId?: string;
  post?: IPost | null;
  blocksCount?: number;
}

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
      {/* Current Workflow Status Badge */}
      <HStack gap='1.5' align='center'>
        <Badge
          colorPalette={getBadgePalette(currentStatus)}
          variant='solid'
          px='3'
          py='1'
          borderRadius='full'
          fontSize='xs'
          fontWeight='bold'
          textTransform='uppercase'
        >
          {currentStatus}
        </Badge>
        {currentStatus === 'Scheduled' && post.publishDate && (
          <HStack color='purple.300' fontSize='xs' gap='1'>
            <FiClock />
            <Text>{formatDate(post.publishDate)}</Text>
          </HStack>
        )}
      </HStack>

      {/* Publish Checklist Trigger Button */}
      <Button
        size='xs'
        variant='ghost'
        colorPalette={validationResult.isValid ? 'green' : 'amber'}
        onClick={() => setIsChecklistOpen(true)}
        px='2.5'
        py='1'
        borderRadius='md'
      >
        <HStack gap='1.5'>
          <FiCheckSquare />
          <Text fontSize='xs' fontWeight='medium'>
            Checklist ({validationResult.checks.filter((c) => c.passed).length}/
            {validationResult.checks.length})
          </Text>
        </HStack>
      </Button>

      {/* Workflow Transition Action Buttons */}
      {transitions.map((t) => (
        <Button
          key={t.actionLabel}
          size='xs'
          variant={t.variant || 'solid'}
          colorPalette={t.colorPalette || 'purple'}
          onClick={() => handleActionClick(t)}
          borderRadius='full'
          px='3'
        >
          {t.actionLabel}
        </Button>
      ))}

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
