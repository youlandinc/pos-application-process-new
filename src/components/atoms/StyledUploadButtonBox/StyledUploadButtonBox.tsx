import { ChangeEvent, useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  CloseOutlined,
  CloudUploadOutlined,
  DeleteForeverOutlined,
  FolderOpen,
  GetAppOutlined,
  PageviewOutlined,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { _downloadBrokerFile } from '@/requests';
import { useBreakpoints, useSwitch } from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledUploadButtonBoxProps,
  StyledUploadButtonBoxStyles,
  Transitions,
} from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { POSFont } from '@/styles';
import { POSFormatDate } from '@/utils';
import { SUploadData } from '@/models/common/UploadFile';

export const StyledUploadButtonBox = (props: StyledUploadButtonBoxProps) => {
  const {
    onSuccess,
    children,
    fileList,
    onDelete,
    label,
    fileSize = 5, // MB
    uploadText = 'Select files',
    accept = 'image/*,.pdf',
    loading,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const breakpoint = useBreakpoints();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  const { open, visible, close } = useSwitch(false);

  const handleUpload = useCallback(
    async (files: FileList) => {
      onSuccess(files);
    },
    [onSuccess],
  );

  const validatorFileSize = useCallback(
    (files: FileList) => {
      let flag = true;
      Array.from(files).some((item) => {
        if (item.size / 1024 / 1024 > fileSize) {
          enqueueSnackbar(`Avatar picture size can not exceed ${fileSize}MB!`, {
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
          });
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
    await onDelete(deleteIndex);
    close();
  };

  return (
    <Box sx={StyledUploadButtonBoxStyles}>
      <Box className={'uploadBox'}>
        <Typography variant={'h4'}>{label}</Typography>
        <StyledButton
          color={'inherit'}
          component={'label'}
          disabled={loading}
          loading={loading}
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

                      <PageviewOutlined
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
          <>
            <StyledButton
              color="error"
              onClick={onDialogConfirmDelete}
              size="small"
              variant="contained"
            >
              Delete
            </StyledButton>
            <StyledButton
              autoFocus
              color="info"
              onClick={close}
              size="small"
              sx={{ ml: 3 }}
              variant="outlined"
            >
              Cancel
            </StyledButton>
          </>
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
      ></StyledDialog>
    </Box>
  );
};
