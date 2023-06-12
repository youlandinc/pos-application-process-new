import { ChangeEvent, DragEvent, useCallback, useState } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import {
  CloseOutlined,
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
  StyledLoading,
  StyledUploadBoxProps,
  StyledUploadBoxStyles,
  Transitions,
} from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { POSFont } from '@/styles';
import { POSFormatDate } from '@/utils';
import { SUploadData } from '@/models/common/UploadFile';

import UPLOAD_SVG from '@/svg/upload/upload.svg';

export const StyledUploadBox = (props: StyledUploadBoxProps) => {
  const {
    onSuccess,
    children,
    fileList,
    onDelete,
    fileSize = 5, // MB
    uploadText = 'Select files',
    accept = 'image/*,.pdf',
    loading,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const breakpoint = useBreakpoints();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { open, visible, close } = useSwitch(false);
  const stopDefaults = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragEvents = {
    onDragEnter: (e: DragEvent) => {
      stopDefaults(e);
    },
    onDragLeave: (e: DragEvent) => {
      stopDefaults(e);
    },
    onDragOver: stopDefaults,
    onDrop: async (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      if (e.dataTransfer.files && validatorFileSize(e.dataTransfer.files)) {
        await handleUpload(e.dataTransfer.files);
      }
    },
  };

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
    setDeleteLoading(true);
    try {
      await onDelete(deleteIndex);
    } finally {
      setDeleteLoading(false);
    }

    close();
  };

  return (
    <Box sx={StyledUploadBoxStyles}>
      <input
        accept={accept}
        className={'input'}
        hidden
        id="file-upload"
        multiple
        onChange={handleChange}
        type="file"
      />
      <Box className={'uploadBox'}>
        <StyledButton color={'inherit'} disabled={loading}>
          {loading ? (
            <StyledLoading sx={{ color: 'primary.main' }} />
          ) : (
            <label
              className={'uploadBtn'}
              htmlFor="file-upload"
              {...dragEvents}
            >
              <Icon className="upload_img" component={UPLOAD_SVG} />
              <Box className="upload_text">
                <Typography variant={'h5'}>{uploadText}</Typography>
                <Typography variant={'body2'}>
                  {['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'Click '
                    : 'Drop files here or click '}
                  <Box className="link_style" component={'span'}>
                    browse
                  </Box>{' '}
                  thorough your machine.
                </Typography>
              </Box>
            </label>
          )}
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
              disabled={deleteLoading}
              onClick={onDialogConfirmDelete}
              size="small"
              variant="contained"
            >
              Delete
            </StyledButton>
            <StyledButton
              autoFocus
              color="info"
              disabled={deleteLoading}
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
      />
    </Box>
  );
};
