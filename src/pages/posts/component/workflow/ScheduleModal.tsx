import { useState, useMemo } from 'react';
import {
  Dialog,
  Button,
  Text,
  HStack,
  VStack,
  Portal,
  Input,
  Box,
} from '@chakra-ui/react';
import { FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { formatToDateTimeLocal } from '../../../../utils/common.utils';

export interface ScheduleModalProps {
  open: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  onClose: () => void;
  initialDate?: string;
  onConfirmSchedule: (publishDateIso: string) => void;
}

export function ScheduleModal({
  open,
  onOpenChange,
  onClose,
  initialDate,
  onConfirmSchedule,
}: ScheduleModalProps) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevInitialDate, setPrevInitialDate] = useState(initialDate);
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (open !== prevOpen || initialDate !== prevInitialDate) {
    setPrevOpen(open);
    setPrevInitialDate(initialDate);
    if (open) {
      const now = new Date();
      const defaultDate = initialDate
        ? new Date(initialDate)
        : new Date(now.getTime() + 24 * 60 * 60 * 1000);

      setSelectedDateTime(formatToDateTimeLocal(defaultDate));
      setErrorMsg('');
    }
  }

  const minDateTime = useMemo(() => {
    if (!open) return '';
    return formatToDateTimeLocal(new Date());
  }, [open]);

  const handleDateTimeChange = (val: string) => {
    setSelectedDateTime(val);
    if (!val) {
      setErrorMsg('Please select a valid date and time.');
      return;
    }
    const chosenTime = new Date(val).getTime();
    const nowTime = Date.now();
    if (chosenTime <= nowTime) {
      setErrorMsg('Scheduled time must be in the future.');
    } else {
      setErrorMsg('');
    }
  };

  const handleConfirm = () => {
    if (!selectedDateTime) {
      setErrorMsg('Please select a valid date and time.');
      return;
    }
    const chosenTime = new Date(selectedDateTime).getTime();
    if (chosenTime <= Date.now()) {
      setErrorMsg('Scheduled time must be in the future.');
      return;
    }

    const isoString = new Date(selectedDateTime).toISOString();
    onConfirmSchedule(isoString);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size='sm'>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius='xl' p='4'>
            <Dialog.Header>
              <HStack gap='2' align='center'>
                <Box color='purple.600' fontSize='xl'>
                  <FiCalendar />
                </Box>
                <Dialog.Title fontSize='md' fontWeight='bold' color='gray.800'>
                  Schedule Publication
                </Dialog.Title>
              </HStack>
            </Dialog.Header>

            <Dialog.Body py='3'>
              <VStack align='stretch' gap='3'>
                <Text fontSize='xs' color='gray.600'>
                  Choose the future date and time when this post should be automatically published.
                </Text>

                <Box>
                  <Text fontSize='xs' fontWeight='bold' mb='1' color='gray.700'>
                    Publish Date & Time
                  </Text>
                  <Input
                    type='datetime-local'
                    value={selectedDateTime}
                    min={minDateTime}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                    borderRadius='md'
                    size='sm'
                  />
                </Box>

                {errorMsg && (
                  <HStack color='red.600' fontSize='xs' gap='1.5' align='center'>
                    <FiAlertCircle />
                    <Text fontWeight='medium'>{errorMsg}</Text>
                  </HStack>
                )}
              </VStack>
            </Dialog.Body>

            <Dialog.Footer pt='3'>
              <HStack justify='flex-end' gap='2' w='100%'>
                <Button size='sm' variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  size='sm'
                  colorPalette='purple'
                  disabled={Boolean(errorMsg) || !selectedDateTime}
                  onClick={handleConfirm}
                >
                  Schedule Post
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default ScheduleModal;
