import React, { CSSProperties, ReactNode, useCallback, useState } from 'react';

import { useSnackbar } from 'notistack';

import { _addTaskFile, _downloadBrokerFile } from '@/requests';
import { useSwitch } from '@/hooks';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFlex, POSFont, PSXTextEllipsis } from '@/styles';
import { Box, Dialog, SxProps } from '@mui/material';
import {
  CloudUploadOutlined,
  DeleteOutlineOutlined,
  FolderOpen,
  GetAppOutlined,
  PageviewOutlined,
} from '@mui/icons-material';
import { POSFormatDate } from '@/utils';
import { SUploadData } from '@/models/common/UploadFile';

export const StyledUploadBoxStyles: SxProps = {
  '& .icon': {
    verticalAlign: '-5px',
    cursor: 'pointer',
    '&:hover': {
      color: '#3F81E9',
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
    height: 192,
    border: '1px dashed rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    display: 'block',
    textAlign: 'center',
    borderRadius: 8,
  },
  '& .uploadBtn': {
    width: '100%',
    padding: '56px 0 24px 0',
    textTransform: 'none',
    cursor: 'pointer',
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
  onSuccess: (files: SUploadData[]) => void;
  onDelete: (index: number) => void;
  taskId?: string;
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
    taskId,
    fileSize = 5, // MB
    uploadText = 'Upload Documents',
    AcceptedText = '.jpg and .png or .pdf ',
    accept = 'image/*,.pdf',
    style,
    // onDrop,
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [uploadLoading, setUploadLoading] = useState(false);

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
      setUploadLoading(true);
      const formData = new FormData();
      Array.from(files, (item) => {
        formData.append('files', item);
      });
      try {
        const { data } = await _addTaskFile(formData, taskId as string);
        onSuccess(data);
        setUploadLoading(false);
      } catch (err) {
        setUploadLoading(false);
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      }
    },
    [onSuccess, enqueueSnackbar, taskId],
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
      <Box className={'uploadBox'} style={style}>
        <StyledButton disabled={uploadLoading} sx={{ width: '100%' }}>
          {uploadLoading ? (
            <StyledLoading />
          ) : (
            <label
              className={'uploadBtn'}
              htmlFor="file-upload"
              {...dragEvents}
            >
              <CloudUploadOutlined color="disabled" sx={{ fontSize: 48 }} />
              <Box>{uploadText}</Box>
              <Box>
                Accepted File Types:
                {AcceptedText
                  ? AcceptedText
                  : accept && accept !== '*'
                  ? accept.split(',').join(' ')
                  : 'all'}
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
