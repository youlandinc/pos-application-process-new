import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

interface TasksListCard {
  tasksKey: string;
  isComplete: boolean;
  header: string;
}

export const TasksListCard: FC<TasksListCard> = ({
  tasksKey,
  isComplete,
  header,
}) => {
  return (
    <Stack>
      <Typography>{header}</Typography>
      <Stack></Stack>
    </Stack>
  );
};
