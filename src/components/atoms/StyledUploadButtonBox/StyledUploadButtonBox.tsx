import {
  CloseOutlined,
  CloudUploadOutlined,
  DeleteForeverOutlined,
  FolderOpen,
  GetAppOutlined,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useCallback, useState } from 'react';

import { useBreakpoints, useSwitch } from '@/hooks';
import { _downloadBrokerFile } from '@/requests';

import {
  StyledButton,
  StyledDialog,
  StyledUploadButtonBoxProps,
  Transitions,
} from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { SUploadData } from '@/models/common/UploadFile';
import { POSFormatDate } from '@/utils';

export const StyledUploadButtonBox = (props: StyledUploadButtonBoxProps) => {
  const {
    onSuccess,
    children,
    fileList,
    onDelete,
    label,
    fileSize = 5, // MB
    uploadText = 'Upload file',
    accept = 'image/*,.pdf',
    loading = false,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const breakpoints = useBreakpoints();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  const { open, visible, close } = useSwitch(false);

  const [innerLoading, setInnerLoading] = useState(loading);

  const handleUpload = useCallback(
    async (files: FileList) => {
      await onSuccess(files);
      setTimeout(() => setInnerLoading(false));
    },
    [onSuccess],
  );

  const validatorFileSize = useCallback(
    (files: FileList) => {
      let flag = true;
      Array.from(files).some((item) => {
        if (item.size / 1024 / 1024 > fileSize) {
          enqueueSnackbar(
            'The uploaded file is too large. Please select a smaller file and try again.',
            {
              header: 'Upload Failed',
              variant: 'error',
              autoHideDuration: AUTO_HIDE_DURATION,
              isSimple: false,
            },
          );
          flag = false;
          return true;
        }
      });
      return flag;
    },
    [fileSize, enqueueSnackbar],
  );

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.files && validatorFileSize(event.target.files)) {
        setInnerLoading(true);
        await handleUpload(event.target.files);
        // event.target.value = '';
      }
    },
    [handleUpload, validatorFileSize],
  );

  const onDownload = useCallback(
    async (fileData: SUploadData) => {
      const handler = (data: any, fileName?: string) => {
        // file export
        if (!data) {
          return;
        }
        const fileUrl = window.URL.createObjectURL(
          new Blob([data], { type: 'application/octet-stream' }),
        );
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = fileName || '';
        a.href = fileUrl;
        a.click();
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      };
      const { url, fileName } = fileData;
      const res = await _downloadBrokerFile({ url: url as string });
      handler(res.data, fileName);
    },
    // this function never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onDialogConfirmDelete = async () => {
    onDelete(deleteIndex);
    close();
  };

  return (
    <Box
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={3}
      p={3}
      width={'100%'}
    >
      <Stack
        alignItems={'center'}
        flexDirection={{ md: 'row', xs: 'column' }}
        gap={3}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Typography
          sx={{
            flexWrap: 'wrap',
            fontSize: { xs: 16, md: 20 },
            fontWeight: 600,
            lineHeight: 1,
            textAlign: { xs: 'center', md: 'left' },
            width: { md: 'calc(100% - 192px)', xs: '100%' },
            wordBreak: 'break-all',
          }}
        >
          {label}
        </Typography>
        <StyledButton
          color={'inherit'}
          component={'label'}
          disabled={innerLoading}
          loading={innerLoading}
          sx={{ minWidth: 164 }}
          variant={'outlined'}
        >
          <CloudUploadOutlined sx={{ mr: 1 }} />
          <input
            accept={accept}
            hidden
            multiple
            onChange={handleChange}
            style={{
              width: '100%',
            }}
            type="file"
          />
          {uploadText}
        </StyledButton>
      </Stack>
      {fileList.length !== 0 && (
        <Box mt={3}>
          <Transitions>
            {children
              ? children
              : fileList.map((item: SUploadData, index: number) => (
                  <Stack
                    alignItems={'center'}
                    border={'1px solid'}
                    borderColor={'text.primary'}
                    borderRadius={3}
                    className={'fileItem'}
                    color={'text.primary'}
                    flexDirection={'row'}
                    fontSize={14}
                    fontWeight={600}
                    gap={3}
                    justifyContent={'space-between'}
                    key={index}
                    lineHeight={1}
                    mt={3}
                    px={{ xl: 3, xs: 1.5 }}
                    py={1.5}
                    width={'100%'}
                  >
                    <Stack
                      alignItems={{ md: 'center', xs: 'flex-start' }}
                      flexDirection={{ xs: 'column', md: 'row' }}
                      justifyContent={'space-between'}
                      width={'calc(100% - 120px)'}
                    >
                      <Stack
                        alignItems={'center'}
                        flexDirection={'row'}
                        gap={1.5}
                        width={{ md: 'calc(100% - 240px)', xs: '100%' }}
                      >
                        <FolderOpen
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        />

                        <Typography
                          sx={{
                            width: 'calc(100% - 36px)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            webkitBoxOrient: 'vertical',
                            webkitLineClamp: 1,
                            whiteSpace: 'nowrap',
                          }}
                          variant={
                            ['md', 'lg', 'xl', 'xxl'].includes(breakpoints)
                              ? 'body1'
                              : 'body2'
                          }
                        >
                          {item.originalFileName}
                        </Typography>
                      </Stack>

                      <Typography
                        flexShrink={0}
                        variant={'body3'}
                        width={'fit-content(20em)'}
                      >
                        {POSFormatDate(
                          new Date(item.uploadTime as string),
                          'MM-dd-yyyy HH:mm:ss',
                        )}
                      </Typography>
                    </Stack>

                    <Stack flexDirection={'row'} gap={1.5}>
                      <RemoveRedEyeOutlined
                        onClick={() => window.open(item.url)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      />

                      <GetAppOutlined
                        onClick={() => onDownload(item)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      />

                      <CloseOutlined
                        onClick={() => {
                          setDeleteIndex(index);
                          open();
                        }}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                ))}
          </Transitions>
        </Box>
      )}

      <StyledDialog
        content={
          <Box
            color={'#9095A3'}
            fontSize={14}
            fontWeight={400}
            lineHeight={1.5}
            py={3}
            sx={{
              overflow: 'hidden',
              wordBreak: 'break-all',
            }}
          >
            {`Are you sure you want to delete ${fileList[deleteIndex]?.originalFileName}`}
          </Box>
        }
        footer={
          <Stack flexDirection={'row'} gap={1} mt={3}>
            <StyledButton
              autoFocus
              color={'info'}
              onClick={close}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              autoFocus
              color={'error'}
              onClick={onDialogConfirmDelete}
              size={'small'}
            >
              Confirm
            </StyledButton>
          </Stack>
        }
        header={
          <>
            <DeleteForeverOutlined
              sx={{
                mr: 1.5,
                lineHeight: '28px',
                verticalAlign: 'middle',
              }}
            />
            Delete?
          </>
        }
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            close();
          }
        }}
        open={visible}
        transitionDuration={300}
      />
    </Box>
  );
};
