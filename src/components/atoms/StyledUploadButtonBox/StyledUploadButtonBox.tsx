import {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import {
  CloseOutlined,
  ContentCopy,
  DeleteForeverOutlined,
  GetAppOutlined,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { useBreakpoints, useSessionStorageState, useSwitch } from '@/hooks';
import { _downloadBrokerFile } from '@/requests';

import {
  StyledButton,
  StyledDialog,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';
import { AUTO_HIDE_DURATION } from '@/constants';

import { SUploadData } from '@/models/common/UploadFile';
import { _deleteFile, _uploadFile } from '@/requests/base';
import { HttpError } from '@/types';
import {
  getFilesWebkitDataTransferItems,
  POSFormatDate,
  POSGetParamsFromUrl,
  renameFile,
} from '@/utils';

import ICON_IMAGE from './icon_image.svg';
import ICON_FILE from './icon_file.svg';

interface StyledUploadButtonBoxProps {
  files: SUploadData[];
  fileName: string;
  fileKey: string;
  templateName: string;
  templateUrl: string;
  loanId?: number | string | undefined;
  // custom
  accept?: string;
  fileSize?: number;
  uploadText?: string;
  children?: ReactNode;
  refresh?: () => Promise<void>;
  // los
  status?: string;
  required?: boolean;
  collapse?: boolean;
  // only can delete
  deleteOnly?: boolean;
  onDelete?: (index: number) => Promise<void>;
  onUpload?: (file: FileList | any[]) => Promise<void>;
  // popup insurance
  popup?: string;
  isFromLOS?: boolean;
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
    accept = 'image/*,.pdf,.doc,.docx',
    fileSize = 100,
    uploadText = 'Upload',
    children,
    popup,
    deleteOnly = false,
    loanId,
    isFromLOS = false,
    refresh,
    onDelete,
    onUpload,
  } = props;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();
  const { saasState } = useSessionStorageState('tenantConfig');
  const { open, visible, close } = useSwitch(false);
  const {
    open: popupOpen,
    visible: popUpVisible,
    close: popupClose,
  } = useSwitch(false);

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const [innerLoading, setInnerLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [fileList, setFileList] = useState(files);

  const [isDragging, setIsDragging] = useState(false);

  const { processId } = POSGetParamsFromUrl(location.href);

  const handleUpload = useCallback(
    async (files: FileList | any[]) => {
      setIsDragging(false);
      setInnerLoading(true);

      try {
        if (onUpload) {
          await onUpload(files);
          return;
        }
        const formData = new FormData();
        formData.append('fileKey', fileKey);
        Array.from(files, (item) => {
          formData.append('files', item);
        });
        const { data } = await _uploadFile(
          formData,
          router.query.loanId as string,
        );
        setFileList([...fileList, ...data]);
        await refresh?.();
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
    [
      enqueueSnackbar,
      fileKey,
      fileList,
      onUpload,
      refresh,
      router.query.taskId,
    ],
  );

  const validatorFileSize = useCallback(
    (files: FileList | any[]) => {
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
      if (onDelete) {
        await onDelete(deleteIndex);
        close();
        return;
      }
      await _deleteFile(router.query.loanId as string, {
        fileKey: fileKey,
        fileUrl: fileList[deleteIndex].url,
      });
      await refresh?.();
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
    onDelete,
    refresh,
    router.query.taskId,
  ]);

  useEffect(() => {
    setFileList(files);
  }, [files]);

  return (
    <Box
      borderRadius={2}
      maxWidth={'100%'}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDrop={async (e) => {
        e.preventDefault();

        const fileList = await getFilesWebkitDataTransferItems(
          e.dataTransfer.items,
        );

        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const reducedFileList = fileList
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          .filter((item) => item.name !== '.DS_Store')
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          .map((file) => {
            if (file?.name === file?.filepath) {
              return file;
            }

            return renameFile(file, file.filepath);
          });

        await handleUpload(reducedFileList);
      }}
      px={3}
      py={2}
      sx={{
        outline: isDragging
          ? `2px solid hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`
          : '1px solid #D2D6E1',
      }}
      width={'100%'}
    >
      <Stack
        alignItems={'center'}
        flexDirection={{ md: 'row', xs: 'column' }}
        gap={1}
        justifyContent={'space-between'}
        maxWidth={'100%'}
        width={'100%'}
      >
        <Stack
          alignItems={{ md: 'unset', xs: 'center' }}
          maxWidth={'100%'}
          px={1.5}
          width={{ md: 'calc(100% - 76px)', xs: '100%' }}
        >
          <Typography
            sx={{
              flexWrap: 'wrap',
              fontSize: { xs: 16, md: 18 },
              fontWeight: 600,
              lineHeight: 1.5,
              textAlign: { xs: 'center', md: 'left' },
              wordBreak: 'break-word',
              color: 'text.primary',
            }}
          >
            {fileName}
          </Typography>

          {isFromLOS
            ? popup === 'COLLATERAL_DOCS_Evidence_of_insurance' && (
                <Typography
                  color={'primary.main'}
                  onClick={popupOpen}
                  sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    width: 'fit-content',
                  }}
                  variant={'body1'}
                >
                  View requirements
                </Typography>
              )
            : fileKey === 'COLLATERAL_DOCS_Evidence_of_insurance' && (
                <Typography
                  color={'primary.main'}
                  onClick={popupOpen}
                  sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    width: 'fit-content',
                  }}
                  variant={'body1'}
                >
                  View requirements
                </Typography>
              )}
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
          sx={{
            minWidth: 76,
            width: 76,
            height: 36,
            borderWidth: '2px !important',
          }}
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
        <Box maxWidth={'100%'} mt={0.5} width={'100%'}>
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
                    mt={0.5}
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
                            item.originalFileName!.split('.')[1] === 'pdf' ||
                            item.originalFileName!.split('.')[1] === 'doc' ||
                            item.originalFileName!.split('.')[1] === 'docx'
                              ? ICON_FILE
                              : ICON_IMAGE
                          }
                          sx={{ width: 20, height: 20 }}
                        />

                        <StyledTooltip title={`${item.originalFileName}`}>
                          <Typography
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              webkitBoxOrient: 'vertical',
                              webkitLineClamp: 1,
                              whiteSpace: 'nowrap',
                              fontSize: 14,
                              color: '#9095A3',
                              wordBreak: 'break-word',
                              maxWidth: {
                                xs: '100%',
                                lg: 340,
                                xl: '100%',
                              },
                              mr: {
                                xs: 0,
                                md: 3,
                                lg: 0,
                                xl: 3,
                              },
                            }}
                          >
                            {item.originalFileName}
                          </Typography>
                        </StyledTooltip>
                      </Stack>

                      <Transitions style={{ marginRight: 8 }}>
                        {activeIndex === index && (
                          <Stack flexDirection={'row'} gap={1}>
                            {!deleteOnly && (
                              <>
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
                              </>
                            )}

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
                            'M-dd-yyyy',
                          )}
                        </Typography>

                        {['xs', 'sm'].includes(breakpoints) && (
                          <Stack flexDirection={'row'} gap={1} pl={3}>
                            {!deleteOnly && (
                              <>
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
                              </>
                            )}

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

      <StyledDialog
        content={
          <Stack gap={3} my={3}>
            <Stack>
              <Typography variant={'subtitle2'}>
                Mortgagee information
              </Typography>
              <Stack flexDirection={'row'} gap={1} mt={1.5}>
                <Typography variant={'body3'}>
                  {saasState?.organizationName || 'YouLand Inc'}. ISAOA/ATIMA
                </Typography>
                <ContentCopy
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${
                        saasState?.organizationName || 'YouLand Inc'
                      }. ISAOA/ATIMA ${
                        saasState?.address?.address || '236 Kingfisher Avenue'
                      }, ${saasState?.address?.city || 'Alameda'}, ${
                        saasState?.address?.state || 'CA'
                      } ${saasState?.address?.postcode || '94501'}`,
                    );
                    enqueueSnackbar('Copied data to clipboard', {
                      variant: 'success',
                    });
                  }}
                  sx={{ fontSize: 18, cursor: 'pointer' }}
                />
              </Stack>
              <Typography variant={'body3'}>
                {saasState?.address?.address || '236 Kingfisher Avenue'},
              </Typography>
              <Typography variant={'body3'}>
                {saasState?.address?.city || 'Alameda'},{' '}
                {saasState?.address?.state || 'CA'}{' '}
                {saasState?.address?.postcode || '94501'}
              </Typography>
            </Stack>
            <Stack gap={1.5}>
              <Typography variant={'subtitle2'}>Loan number</Typography>
              <Stack flexDirection={'row'} gap={1}>
                <Typography variant={'body3'}>
                  {isFromLOS ? loanId : processId}
                </Typography>
                <ContentCopy
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      isFromLOS ? (loanId as string) : (processId as string),
                    );
                    enqueueSnackbar('Copied data to clipboard', {
                      variant: 'success',
                    });
                  }}
                  sx={{ fontSize: 18, cursor: 'pointer' }}
                />
              </Stack>
            </Stack>
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1}>
            <StyledButton
              autoFocus
              color={'info'}
              onClick={popupClose}
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
          >
            Insurance requirements
            <CloseOutlined
              onClick={popupClose}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            />
          </Stack>
        }
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            popupClose();
          }
        }}
        open={popUpVisible}
        PaperProps={{
          sx: { maxWidth: '600px !important' },
        }}
      />
    </Box>
  );
};
