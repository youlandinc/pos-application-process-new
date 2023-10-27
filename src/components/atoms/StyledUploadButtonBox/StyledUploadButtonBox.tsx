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
  StyledUploadButtonBoxStyles,
  Transitions,
} from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { SUploadData } from '@/models/common/UploadFile';
import { POSFont } from '@/styles';
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
  const breakpoint = useBreakpoints();

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
    <Box sx={StyledUploadButtonBoxStyles}>
      <Box className={'uploadBox'}>
        <Typography
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
          variant={'h4'}
        >
          {label}
        </Typography>
        <StyledButton
          color={'inherit'}
          component={'label'}
          disabled={innerLoading}
          loading={innerLoading}
          startIcon={<CloudUploadOutlined />}
          sx={{ minWidth: 164 }}
          variant={'outlined'}
        >
          <input
            accept={accept}
            className={'input'}
            hidden
            // id="file-upload"
            multiple
            onChange={handleChange}
            type="file"
          />
          {uploadText}
        </StyledButton>
      </Box>
      {fileList.length !== 0 && (
        <Box mt={3}>
          <Transitions>
            {children
              ? children
              : fileList.map((item: SUploadData, index: number) => (
                  <Box className={'fileItem'} key={index}>
                    <Box className={'fileName'}>
                      <FolderOpen
                        className={'icon'}
                        style={{ marginRight: 10 }}
                      />
                      {item.originalFileName}
                      {['xs', 'sm', 'md'].includes(breakpoint) && (
                        <Box sx={{ mt: 1.5 }}>
                          {POSFormatDate(
                            new Date(item.uploadTime as string),
                            'MM-dd-yyyy HH:mm:ss',
                          )}
                        </Box>
                      )}
                    </Box>

                    <Box>
                      {['lg', 'xl', 'xxl'].includes(breakpoint) &&
                        POSFormatDate(
                          new Date(item.uploadTime as string),
                          'MM-dd-yyyy HH:mm:ss',
                        )}

                      <RemoveRedEyeOutlined
                        className={'icon'}
                        onClick={() => window.open(item.url)}
                        sx={{
                          ml: {
                            lg: 6,
                            xs: 0,
                          },
                        }}
                      />

                      <GetAppOutlined
                        className={'icon'}
                        onClick={() => onDownload(item)}
                        style={{ margin: '0 12px' }}
                      />

                      <CloseOutlined
                        className={'icon'}
                        onClick={() => {
                          setDeleteIndex(index);
                          open();
                        }}
                      />
                    </Box>
                  </Box>
                ))}
          </Transitions>
        </Box>
      )}

      <StyledDialog
        content={
          <Box
            sx={{
              ...POSFont(14, 400, 1.5, 'info.main'),
              wordBreak: 'break-all',
              py: 3,
              overflow: 'hidden',
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
