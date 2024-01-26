import { ChangeEvent, FC, ReactNode, useCallback, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import {
  CloseOutlined,
  DeleteForeverOutlined,
  GetAppOutlined,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { useBreakpoints, useSwitch } from '@/hooks';
import { _downloadBrokerFile } from '@/requests';

import { StyledButton, StyledDialog, Transitions } from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { SUploadData } from '@/models/common/UploadFile';
import { HttpError } from '@/types';
import { _deleteTaskFile, _uploadTaskFile } from '@/requests/dashboard';
import { POSFormatDate } from '@/utils';

import ICON_IMAGE from './icon_image.svg';
import ICON_PDF from './icon_pdf.svg';

interface StyledUploadButtonBoxProps {
  files: SUploadData[];
  fileName: string;
  fileKey: string;
  templateName: string;
  templateUrl: string;
  id?: number;
  // custom
  accept?: string;
  fileSize?: number;
  uploadText?: string;
  children?: ReactNode;
  refresh: () => Promise<void>;
  // los
  status?: string;
  required?: boolean;
  collapse?: boolean;
}

export const StyledUploadButtonBox: FC<StyledUploadButtonBoxProps> = (
  props,
) => {
  const {
    //id,
    files,
    fileName,
    fileKey,
    templateName,
    templateUrl,
    accept = 'image/*,.pdf',
    fileSize = 100,
    uploadText = 'Upload',
    children,
    refresh,
  } = props;

  const { open, visible, close } = useSwitch(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const [innerLoading, setInnerLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [fileList, setFileList] = useState(files);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setInnerLoading(true);

      const formData = new FormData();

      formData.append('fieldName', fileKey);
      Array.from(files, (item) => {
        formData.append('files', item);
      });
      try {
        const { data } = await _uploadTaskFile(
          formData,
          router.query.taskId as string,
        );
        setFileList([...fileList, ...data]);
        await refresh();
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setInnerLoading(false);
      }
    },
    [enqueueSnackbar, fileKey, fileList, refresh, router.query.taskId],
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

  const onDialogConfirmDelete = useCallback(async () => {
    setDeleteLoading(true);
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: fileKey,
        fileUrl: fileList[deleteIndex].url,
      });
      await refresh();
      close();
      const temp = JSON.parse(JSON.stringify(fileList));
      temp.splice(deleteIndex, 1);
      setTimeout(() => {
        setFileList(temp);
      }, 100);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setDeleteLoading(false);
      setActiveIndex(-1);
      setDeleteIndex(-1);
    }
  }, [
    close,
    deleteIndex,
    enqueueSnackbar,
    fileKey,
    fileList,
    refresh,
    router.query.taskId,
  ]);

  return (
    <Box border={'1px solid #D2D6E1'} borderRadius={2} p={3} width={'100%'}>
      <Stack
        alignItems={'center'}
        flexDirection={{ md: 'row', xs: 'column' }}
        gap={1.5}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Stack
          alignItems={{ md: 'unset', xs: 'center' }}
          width={{ md: 'calc(100% - 76px)', xs: '100%' }}
        >
          <Typography
            sx={{
              flexWrap: 'wrap',
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1,
              textAlign: { xs: 'center', md: 'left' },
              wordBreak: 'break-all',
            }}
          >
            {fileName}
          </Typography>
          {templateName && (
            <Typography
              color={'primary.main'}
              onClick={() => window.open(templateUrl)}
              sx={{
                textDecoration: 'underline',
                cursor: 'pointer',
                width: 'fit-content',
              }}
              variant={'body1'}
            >
              {templateName}
            </Typography>
          )}
        </Stack>

        <StyledButton
          color={'primary'}
          component={'label'}
          disabled={innerLoading}
          loading={innerLoading}
          size={'small'}
          sx={{ minWidth: 76, width: 76, height: 36 }}
          variant={'outlined'}
        >
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
        <Box mt={1.5}>
          <Transitions>
            {children
              ? children
              : fileList.map((item: SUploadData, index: number) => (
                  <Stack
                    alignItems={'center'}
                    borderRadius={3}
                    color={'text.primary'}
                    flex={1}
                    flexDirection={'row'}
                    fontSize={14}
                    fontWeight={600}
                    gap={3}
                    justifyContent={'space-between'}
                    key={index}
                    lineHeight={1}
                    maxWidth={'auto'}
                    mt={1.5}
                    onMouseEnter={() => {
                      if (['xs', 'sm'].includes(breakpoints)) {
                        return;
                      }
                      setActiveIndex(index);
                    }}
                    onMouseLeave={() => {
                      if (['xs', 'sm'].includes(breakpoints)) {
                        return;
                      }
                      setActiveIndex(-1);
                    }}
                    px={1.5}
                    py={1}
                    sx={{
                      '&:hover': {
                        bgcolor: { md: 'primary.lightest', xs: 'transparent' },
                      },
                      transition: 'all .3s',
                    }}
                    width={'100%'}
                  >
                    <Stack
                      alignItems={{ md: 'center', xs: 'flex-start' }}
                      flexDirection={{ xs: 'column', md: 'row' }}
                      gap={{ md: 0, xs: 1 }}
                      justifyContent={'space-between'}
                      width={'100%'}
                    >
                      <Stack
                        alignItems={'center'}
                        flex={1}
                        flexDirection={'row'}
                        gap={1}
                        width={{ md: 'calc(100% - 240px)', xs: '100%' }}
                      >
                        <Icon
                          component={
                            item.originalFileName!.split('.')[1] === 'pdf'
                              ? ICON_PDF
                              : ICON_IMAGE
                          }
                        />

                        <Typography
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            webkitBoxOrient: 'vertical',
                            webkitLineClamp: 1,
                            whiteSpace: 'nowrap',
                            fontSize: 14,
                            color: '#9095A3',
                            wordBreak: 'break-all',
                            flexShrink: 0,
                            maxWidth: '300px',
                          }}
                        >
                          {item.originalFileName}
                        </Typography>
                      </Stack>

                      <Transitions style={{ marginRight: 8 }}>
                        {activeIndex === index && (
                          <Stack flexDirection={'row'} gap={1}>
                            <RemoveRedEyeOutlined
                              onClick={() => window.open(item.url)}
                              sx={{
                                color: '#9095A3',
                                fontSize: 20,
                                cursor: 'pointer',
                                '&:hover': {
                                  color: 'primary.main',
                                },
                              }}
                            />

                            <GetAppOutlined
                              onClick={() => onDownload(item)}
                              sx={{
                                fontSize: 20,
                                color: '#9095A3',
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
                                fontSize: 20,
                                color: '#9095A3',
                                cursor: 'pointer',
                                '&:hover': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                          </Stack>
                        )}
                      </Transitions>

                      <Stack
                        alignItems={'center'}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        width={{ md: 'fit-content', xs: '100%' }}
                      >
                        <Typography color={'#9095A3'} variant={'body3'}>
                          {POSFormatDate(
                            new Date(item.uploadTime as string),
                            'MM-dd-yyyy',
                          )}
                        </Typography>

                        {['xs', 'sm'].includes(breakpoints) && (
                          <Stack flexDirection={'row'} gap={1}>
                            <RemoveRedEyeOutlined
                              onClick={() => window.open(item.url)}
                              sx={{
                                color: '#9095A3',
                                fontSize: 20,
                                cursor: 'pointer',
                                '&:hover': {
                                  color: 'primary.main',
                                },
                              }}
                            />

                            <GetAppOutlined
                              onClick={() => onDownload(item)}
                              sx={{
                                fontSize: 20,
                                color: '#9095A3',
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
                                fontSize: 20,
                                color: '#9095A3',
                                cursor: 'pointer',
                                '&:hover': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                          </Stack>
                        )}
                      </Stack>
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
              sx={{ width: 88 }}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              autoFocus
              color={'error'}
              disabled={deleteLoading}
              loading={deleteLoading}
              onClick={onDialogConfirmDelete}
              size={'small'}
              sx={{ width: 88 }}
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
            setDeleteIndex(-1);
            setActiveIndex(-1);
          }
        }}
        open={visible}
      />
    </Box>
  );
};
