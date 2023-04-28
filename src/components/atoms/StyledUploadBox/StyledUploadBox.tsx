import React, { CSSProperties, ReactNode, useCallback, useState } from 'react';

import { useSnackbar } from 'notistack';

import { _addTaskFile, _downloadBrokerFile } from '@/requests';
import { useSwitch } from '@/hooks';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFlex, POSFont, PSXTextEllipsis } from '@/styles';
import { Box, Dialog, Icon, SxProps, Typography } from '@mui/material';
import {
  CloudUploadOutlined,
  DeleteOutlineOutlined,
  FolderOpen,
  GetAppOutlined,
  PageviewOutlined,
} from '@mui/icons-material';
import { POSFormatDate } from '@/utils';
import { SUploadData } from '@/models/common/UploadFile';

import UPLOAD_SVG from '@/svg/Upload/Upload.svg';

export const StyledUploadBoxStyles: SxProps = {
  '& .icon': {
    verticalAlign: '-5px',
    cursor: 'pointer',
    '&:hover': {
      // color: '#3F81E9',
    },
  },
  '& .upload_img': {
    width: '40%',
    height: '100%',
    mr: {
      md: 6,
      sx: 0,
    },
    mb: {
      md: 0,
      xs: 3,
    },
  },
  '& .upload_text': {
    textAlign: {
      md: 'left',
      xs: 'center',
    },
    '& h5': {
      fontSize: {
        md: 20,
        xs: 18,
      },
    },
    '& p': {
      color: 'text.secondary',
      fontSize: {
        md: 14,
        xs: 12,
      },
    },
  },
  '& .fileItem': {
    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.87)'),
    ...POSFlex('center', 'space-between', 'row'),
    width: '100%',
    padding: '16px 30px 16px 14px',
    border: '1px solid rgba(0, 0, 0, 0.6);',
    borderRadius: 8,
    marginBottom: 24,
  },
  '& .fileName': {
    ...PSXTextEllipsis(400),
  },
  '& .uploadBox': {
    width: '100%',
    // height: 192,
    border: '1px dashed',
    borderColor: 'background.border_default',
    overflow: 'hidden',
    display: 'block',
    textAlign: 'center',
    bgcolor: 'action.hover',
    borderRadius: 2,
    lineHeight: '236px',
    minHeight: 236,
  },
  '& .MuiButton-root': {
    p: '0 !important',
  },
  '& button': {
    width: '100%',
    bgcolor: 'action.hover',
  },
  '& .uploadBtn': {
    width: '100%',
    p: { md: 6, xs: 3 },
    textTransform: 'none',
    cursor: 'pointer',
    ...POSFlex('center', 'space-between', { md: 'row', xs: 'column' }),
  },
  ' input': {
    width: '100%',
  },
  '& .dialogWrap': {
    ...POSFlex('center', 'center', 'column'),
    width: 496,
    padding: '48px',
  },
  '& .dialogDetail': {
    ...POSFont(24, 400, 1.5, 'rgba(0,0,0,.87)'),
    textAlign: 'center',
    wordBreak: 'break-all',
  },
} as const;

interface StyledUploadBoxProps {
  fileList: SUploadData[];
  onSuccess: (files: FileList) => void;
  onDelete: (index: number) => void;
  loading?: boolean;
  fileSize?: number;
  style?: CSSProperties;
  children?: ReactNode;
  accept?: string;
  uploadText?: string;
  AcceptedText?: string;
}

export const StyledUploadBox = (props: StyledUploadBoxProps) => {
  const {
    onSuccess,
    children,
    fileList,
    onDelete,
    fileSize = 5, // MB
    uploadText = 'Select files',
    AcceptedText = '.jpg and .png or .pdf ',
    accept = 'image/*,.pdf',
    loading,
    // onDrop,
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  const { open, visible, close } = useSwitch(false);
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e);
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e);
    },
    onDragOver: stopDefaults,
    onDrop: async (e: React.DragEvent<HTMLElement>) => {
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
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && validatorFileSize(event.target.files)) {
        await handleUpload(event.target.files);
        event.target.value = '';
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
                {/* <Typography variant={'body1'}>
                Accepted File Types:
                {AcceptedText
                  ? AcceptedText
                  : accept && accept !== '*'
                  ? accept.split(',').join(' ')
                  : 'all'}
              </Typography> */}
                <Typography variant={'body2'}>
                  Drop files here or click{' '}
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
        <Box mt={'48px'}>
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
                    </Box>
                    <Box>
                      {POSFormatDate(
                        new Date(item.uploadTime as string),
                        'MM-dd-yyyy HH:mm:ss',
                      )}

                      <PageviewOutlined
                        className={'icon'}
                        onClick={() => window.open(item.url)}
                        style={{ marginLeft: 50 }}
                      />

                      <GetAppOutlined
                        className={'icon'}
                        onClick={() => onDownload(item)}
                        style={{ margin: '0 12px' }}
                      />

                      <DeleteOutlineOutlined
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

      <Dialog
        maxWidth={false}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            close();
          }
        }}
        open={visible}
        transitionDuration={300}
      >
        <Box className={'dialogWrap'}>
          <Box className={'dialogDetail'}>
            {`Are you sure you want to delete ${fileList[deleteIndex]?.originalFileName}`}
          </Box>
          <Box mt={'24px'}>
            <StyledButton onClick={() => close()} style={{ width: 120 }}>
              Cancel
            </StyledButton>
            <StyledButton
              onClick={onDialogConfirmDelete}
              style={{ width: 120 }}
            >
              Delete
            </StyledButton>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
