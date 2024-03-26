import { ChangeEvent, DragEvent, useCallback, useState } from 'react';
import {
  CloseOutlined,
  DeleteForeverOutlined,
  FolderOpen,
  GetAppOutlined,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { useBreakpoints, useSessionStorageState, useSwitch } from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledLoading,
  StyledUploadBoxProps,
  StyledUploadBoxStyles,
  Transitions,
} from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { SUploadData } from '@/models/common/UploadFile';
import { POSFont } from '@/styles';
import { POSFormatDate } from '@/utils';

import { _downloadBrokerFile } from '@/requests';

import UPLOAD_SVG from '@/svg/upload/upload.svg';

export const StyledUploadBox = (props: StyledUploadBoxProps) => {
  const {
    onSuccess,
    children,
    fileList,
    onDelete,
    fileSize = 100, // MB
    uploadText = 'Upload file',
    accept = 'image/*,.pdf',
    loading,
  } = props;

  const { saasState } = useSessionStorageState('tenantConfig');
  const { enqueueSnackbar } = useSnackbar();
  const breakpoint = useBreakpoints();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState(false);

  const { open, visible, close } = useSwitch(false);
  const stopDefaults = (e: DragEvent) => {
    e.preventDefault();
  };

  const dragEvents = {
    onDragEnter: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(true);
    },
    onDragLeave: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(false);
    },
    onDragOver: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(true);
    },
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
      setIsDragging(false);
    },
    [onSuccess],
  );

  const validatorFileSize = useCallback(
    (files: FileList) => {
      let flag = true;
      Array.from(files).some((item) => {
        if (item.size / 1024 / 1024 > fileSize) {
          enqueueSnackbar('File size cannot exceed 100MB.', {
            header: 'Upload Failed',
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: false,
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
      onDelete(deleteIndex);
    } finally {
      setDeleteLoading(false);
      setTimeout(() => {
        close();
      }, 300);
    }
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
      <Box
        className={'uploadBox'}
        sx={{
          outline: isDragging
            ? `2px dashed hsla(${
                saasState?.posSettings?.h ?? 222
              },42%,55%,1) !important`
            : '1px dashed #D2D6E1 !important',
        }}
      >
        <StyledButton
          color={'inherit'}
          disabled={loading}
          sx={{
            '&.MuiButton-root.Mui-disabled': {
              bgcolor: 'transparent !important',
            },
          }}
        >
          {loading ? (
            <StyledLoading sx={{ color: 'text.grey' }} />
          ) : (
            <label
              className={'uploadBtn'}
              htmlFor="file-upload"
              {...dragEvents}
            >
              <Icon
                component={UPLOAD_SVG}
                sx={{
                  width: 200,
                  height: 140,
                  mr: { lg: 6, sx: 0 },
                  mb: { lg: 0, xs: 3 },
                  '& .upload_svg__pos_svg_theme_color': {
                    fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                  },
                }}
              />
              <Box className="upload_text">
                <Typography variant={'h5'}>{uploadText}</Typography>
                <Typography mt={1} variant={'body2'}>
                  {['xs', 'sm', 'md'].includes(breakpoint)
                    ? ''
                    : 'Drag and drop your file here, or  '}
                  <Box
                    component={'span'}
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {['xs', 'sm', 'md'].includes(breakpoint)
                      ? 'Click'
                      : 'click'}
                  </Box>{' '}
                  to browse your device.
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
              color={'info'}
              disabled={deleteLoading}
              onClick={close}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              autoFocus
              color={'error'}
              disabled={deleteLoading}
              onClick={onDialogConfirmDelete}
              size={'small'}
            >
              Confirm
            </StyledButton>
          </Stack>
        }
        header={
          <Stack alignItems={'center'} flexDirection={'row'}>
            <DeleteForeverOutlined
              sx={{
                mr: 1.5,
                lineHeight: '28px',
                verticalAlign: 'middle',
              }}
            />
            Delete?
          </Stack>
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
