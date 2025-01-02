import { FC } from 'react';

import { format, parseISO } from 'date-fns';
import { Icon, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';

import {
  StyledAvatar,
  StyledButton,
  StyledDialog,
  StyledLoading,
  UploadButtonDialog,
} from '@/components/atoms';

import { DashboardDocumentComment } from '@/types';

import ICON_NO_HISTORY from './assets/icon_no_history.svg';
import ICON_REFRESH from './assets/icon_refresh.svg';

interface DialogHistoriesProps extends UploadButtonDialog {
  histories: DashboardDocumentComment[];
  fileName: string;
  loading: boolean;
  onTrigger: (type: string) => void;
}

export const DialogHistories: FC<DialogHistoriesProps> = observer(
  ({ visible, onClose, histories, fileName, loading, onTrigger }) => {
    //const store = useMst();

    const reducedName = (item: DashboardDocumentComment) => {
      const { firstName, lastName, name } = item;
      if (firstName || lastName) {
        return `${firstName} ${lastName}`;
      }
      return name;
    };

    return (
      <StyledDialog
        content={
          <>
            {!loading ? (
              histories?.length && histories.length > 0 ? (
                histories?.map((item, index) => (
                  <Stack
                    borderBottom={'1px solid #D2D6E1'}
                    key={`history-${index}`}
                    mt={1.5}
                    pb={1.5}
                    sx={{
                      '&:last-of-type': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                    >
                      <Stack
                        alignItems={'center'}
                        flexDirection={'row'}
                        gap={1.5}
                      >
                        <StyledAvatar
                          avatar={item.avatar || ''}
                          backgroundColor={item.backgroundColor || ''}
                          firstName={item.firstName || ''}
                          fontSize={12}
                          height={32}
                          isSelf={false}
                          lastName={item.lastName || ''}
                          width={32}
                        />
                        <Typography
                          color={'text.primary'}
                          pb={1}
                          variant={'subtitle2'}
                        >
                          {reducedName(item)}
                        </Typography>
                      </Stack>
                      <Typography
                        color={'text.secondary'}
                        pb={1}
                        variant={'body3'}
                      >
                        {item.operationTime &&
                          format(
                            parseISO(item.operationTime),
                            "MMMM dd, yyyy 'at' h:mm a",
                          )}
                      </Typography>
                    </Stack>
                    <Typography
                      color={'text.primary'}
                      ml={5.5}
                      variant={'body3'}
                    >
                      {item.note}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Stack
                  alignItems={'center'}
                  gap={3}
                  height={'100%'}
                  justifyContent={'center'}
                  width={'100%'}
                >
                  <Icon
                    component={ICON_NO_HISTORY}
                    sx={{ width: 206, height: 120 }}
                  />
                  <Typography color={'text.secondary'} variant={'h6'}>
                    No comments added yet
                  </Typography>
                </Stack>
              )
            ) : (
              <Stack
                alignItems={'center'}
                height={'100%'}
                justifyContent={'center'}
                width={'100%'}
              >
                <StyledLoading
                  size={48}
                  sx={{
                    color: '#E3E3EE',
                  }}
                />
              </Stack>
            )}
          </>
        }
        footer={
          <Stack flexDirection={'row'} gap={1} pt={2}>
            <StyledButton
              autoFocus
              color={'info'}
              onClick={() => {
                //if (
                //  store.notificationDocuments.categoryKey &&
                //  store.notificationDocuments.fileId &&
                //  store.notificationDocuments.fileName
                //) {
                //  store.setNotificationDocument({
                //    categoryKey: '',
                //    fileId: 0,
                //    fileName: '',
                //  });
                //}
                onClose();
              }}
              size={'small'}
              sx={{ width: 80 }}
              variant={'outlined'}
            >
              Close
            </StyledButton>
          </Stack>
        }
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pb={2}
          >
            <Typography component={'div'} variant={'subtitle1'}>
              Notes
              <Typography
                color={'text.secondary'}
                component={'span'}
                ml={1.5}
                variant={'body2'}
              >
                {fileName}
              </Typography>
            </Typography>

            <Icon
              component={ICON_REFRESH}
              onClick={onTrigger}
              sx={{
                cursor: 'pointer',
                '& > path': {
                  fill: loading ? '#BABCBE' : '#231F20',
                },
              }}
            />
          </Stack>
        }
        onClose={() => {
          //if (
          //  store.notificationDocuments.categoryKey &&
          //  store.notificationDocuments.fileId &&
          //  store.notificationDocuments.fileName
          //) {
          //  store.setNotificationDocument({
          //    categoryKey: '',
          //    fileId: 0,
          //    fileName: '',
          //  });
          //}
          onClose();
        }}
        open={visible}
        PaperProps={{
          sx: { maxWidth: '800px !important', height: 600 },
        }}
      />
    );
  },
);
