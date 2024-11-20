import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
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

import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

import { useBreakpoints, useSessionStorageState, useSwitch } from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';
import {
  getFilesWebkitDataTransferItems,
  POSFormatDate,
  POSGetParamsFromUrl,
  renameFile,
} from '@/utils';
import { SUploadData } from '@/models/common/UploadFile';
import {
  DashboardDocumentComment,
  DashboardDocumentStatus,
  HttpError,
} from '@/types';

import { _deleteFile, _uploadFile } from '@/requests/base';
import { _fetchLoanDocumentComments } from '@/requests/dashboard';
import { _downloadBrokerFile } from '@/requests';

import {
  StyledButton,
  StyledDialog,
  StyledLoading,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';
import { StyledHistoryItem } from './StyledHistoryItem';

import ICON_IMAGE from './icon_image.svg';
import ICON_FILE from './icon_file.svg';
import ICON_HISTORY from './icon_history.svg';
import ICON_REFRESH from './icon_refresh.svg';
import ICON_NO_HISTORY from './icon_no_history.svg';

interface StyledUploadButtonBoxProps {
  id?: number | string;
  files: SUploadData[];
  fileName: string;
  fileKey: string;
  templateName: string;
  templateUrl: string;
  loanId?: number | string | undefined;
  loanNumber?: string;
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
  isShowHistory?: boolean;
  redDotFlag?: boolean;
}

export const StyledUploadButtonBox: FC<StyledUploadButtonBoxProps> = observer(
  ({
    id,
    files,
    fileName,
    fileKey,
    templateName,
    templateUrl,
    loanNumber,
    accept = 'image/*,.pdf,.doc,.docx,.csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,',
    fileSize = 100,
    uploadText = 'Upload',
    children,
    popup,
    status,
    deleteOnly = false,
    // loanId,
    isFromLOS = false,
    refresh,
    onDelete,
    onUpload,
    isShowHistory = true,
    redDotFlag = false,
  }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const store = useMst();

    const breakpoints = useBreakpoints();
    const { saasState } = useSessionStorageState('tenantConfig');
    const { open, visible, close } = useSwitch(false);
    const {
      open: popupOpen,
      visible: popUpVisible,
      close: popupClose,
    } = useSwitch(false);
    const {
      open: historyOpen,
      visible: historyVisible,
      close: historyClose,
    } = useSwitch(false);

    const [deleteIndex, setDeleteIndex] = useState<number>(-1);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const [innerLoading, setInnerLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [fileList, setFileList] = useState(files);

    const [fetchHistoryLoading, setFetchHistoryLoading] = useState(false);
    const [refreshHistoryLoading, setRefreshHistoryLoading] = useState(false);
    const [histories, setHistories] = useState<DashboardDocumentComment[]>([
      //{
      //  firstName: 'John',
      //  lastName: 'Doe',
      //  name: 'John Doe',
      //  avatar: '',
      //  backgroundColor: '#FFC107',
      //  note: 'This is a note',
      //  operationTime: '2024-07-31T07:11:06.603414Z',
      //},
    ]);

    const [isDragging, setIsDragging] = useState(false);

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
        router.query.loanId,
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
        await _deleteFile({
          fileKey: fileKey,
          fileUrl: fileList[deleteIndex].url,
          loanId: router.query.loanId as string,
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
      router.query.loanId,
    ]);

    const renderStatus = useMemo(() => {
      if (fileList.length === 0) {
        return null;
      }

      const result = {
        bgColor: '',
        text: '',
      };

      switch (status) {
        case DashboardDocumentStatus.approve:
          result.bgColor = '#4CAF50';
          result.text = 'Approved';
          break;
        case DashboardDocumentStatus.in_review:
          result.bgColor = '#A1A4AF';
          result.text = 'In review';
          break;
        case DashboardDocumentStatus.flag:
          result.bgColor = '#DE6449';
          result.text = 'Flagged';
          break;
        default:
          return null;
      }

      return (
        <Stack
          alignItems={'center'}
          bgcolor={result.bgColor}
          borderRadius={1}
          color={'#ffffff'}
          flexShrink={0}
          fontSize={12}
          height={24}
          justifyContent={'center'}
          width={72}
        >
          {result.text}
        </Stack>
      );
    }, [fileList.length, status]);

    const onClickShowHistory = useCallback(
      async (condition: 'inside' | 'outside') => {
        if (fetchHistoryLoading || refreshHistoryLoading) {
          return;
        }
        const { loanId } = POSGetParamsFromUrl(window.location.href);
        if (!loanId) {
          return;
        }
        const postData = {
          loanId,
          fileId: id as number | string,
        };
        condition === 'outside'
          ? setFetchHistoryLoading(true)
          : setRefreshHistoryLoading(true);
        try {
          const {
            data: { content },
          } = await _fetchLoanDocumentComments(postData);
          setHistories(content);
          if (!historyVisible) {
            historyOpen();
          }
        } catch (err) {
          const { header, message, variant } = err as HttpError;
          enqueueSnackbar(message, {
            variant: variant || 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: !header,
            header,
          });
        } finally {
          condition === 'outside'
            ? setFetchHistoryLoading(false)
            : setRefreshHistoryLoading(false);
          await refresh?.();
        }
      },
      [
        enqueueSnackbar,
        fetchHistoryLoading,
        historyOpen,
        historyVisible,
        id,
        refresh,
        refreshHistoryLoading,
      ],
    );

    useEffect(() => {
      setFileList(files);
    }, [files]);

    useEffect(
      () => {
        if (store.notificationDocuments.fileId === id) {
          onClickShowHistory('outside');
        }
      },
      //eslint-disable-next-line react-hooks/exhaustive-deps
      [
        store.notificationDocuments.categoryKey,
        store.notificationDocuments.fileId,
        store.notificationDocuments.fileName,
      ],
    );

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

          try {
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
          } catch (err) {
            //eslint-disable-next-line no-console
            console.log(err);
          } finally {
            setIsDragging(false);
          }
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
            maxWidth={'100%'}
            width={{ md: 'calc(100% - 204px)', xs: '100%' }}
          >
            <Stack flexDirection={'row'} gap={1.5} width={'100%'}>
              <StyledTooltip
                placement={'bottom-start'}
                title={fileName}
                tooltipSx={{
                  width: 'fit-content',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    fontWeight: 600,
                    lineHeight: 1.5,
                    textAlign: 'left',
                    wordBreak: 'break-word',
                    color: 'text.primary',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fileName}
                </Typography>
              </StyledTooltip>
              {['xs', 'sm'].includes(breakpoints) && renderStatus}
            </Stack>

            {isFromLOS
              ? popup === 'COLLATERAL_DOCS_Evidence_of_insurance' &&
                !['xs', 'sm'].includes(breakpoints) && (
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
              : fileKey === 'COLLATERAL_DOCS_Evidence_of_insurance' &&
                !['xs', 'sm'].includes(breakpoints) && (
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
            {templateName && !['xs', 'sm'].includes(breakpoints) && (
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

          <Stack
            alignItems={'center'}
            flex={1}
            flexDirection={'row'}
            gap={1.5}
            justifyContent={'flex-end'}
            width={'100%'}
          >
            {!['xs', 'sm'].includes(breakpoints) && renderStatus}

            {isFromLOS
              ? popup === 'COLLATERAL_DOCS_Evidence_of_insurance' &&
                ['xs', 'sm'].includes(breakpoints) && (
                  <Typography
                    color={'primary.main'}
                    onClick={popupOpen}
                    sx={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      width: 'fit-content',
                      mr: 'auto',
                      alignSelf: 'flex-start',
                    }}
                    variant={'body1'}
                  >
                    View requirements
                  </Typography>
                )
              : fileKey === 'COLLATERAL_DOCS_Evidence_of_insurance' &&
                ['xs', 'sm'].includes(breakpoints) && (
                  <Typography
                    color={'primary.main'}
                    onClick={popupOpen}
                    sx={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      width: 'fit-content',
                      mr: 'auto',
                      alignSelf: 'flex-start',
                    }}
                    variant={'body1'}
                  >
                    View requirements
                  </Typography>
                )}
            {templateName && ['xs', 'sm'].includes(breakpoints) && (
              <Typography
                color={'primary.main'}
                onClick={() => window.open(templateUrl)}
                sx={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  width: 'fit-content',
                  mr: 'auto',
                  alignSelf: 'flex-start',
                }}
                variant={'body1'}
              >
                {templateName}
              </Typography>
            )}

            {isShowHistory &&
              (fetchHistoryLoading ? (
                <StyledLoading
                  size={24}
                  sx={{
                    color: '#E3E3EE',
                  }}
                />
              ) : (
                <Stack
                  alignItems={'center'}
                  height={24}
                  justifyContent={'center'}
                  position={'relative'}
                  sx={{
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: redDotFlag ? '#FF5630' : 'transparent',
                    },
                  }}
                  width={24}
                >
                  <Icon
                    component={ICON_HISTORY}
                    onClick={() => onClickShowHistory('outside')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Stack>
              ))}
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
                          bgcolor: {
                            md: 'primary.lightest',
                            xs: 'transparent',
                          },
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

                          <StyledTooltip
                            placement={'bottom-start'}
                            title={`${item.originalFileName}`}
                            tooltipSx={{
                              width: 'fit-content',
                            }}
                          >
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
              <Stack gap={1.5}>
                <Typography variant={'subtitle2'}>
                  Coverage requirements
                </Typography>
                <Typography variant={'body3'}>
                  Dwelling coverage must cover the loan amount or the
                  replacement cost estimate (RCE), whichever of the two is
                  lower.
                </Typography>
              </Stack>
              <Stack>
                <Typography variant={'subtitle2'}>
                  Mortgagee information
                </Typography>
                <Stack flexDirection={'row'} gap={1} mt={1.5}>
                  <Typography variant={'body3'}>
                    {saasState?.organizationName || 'YouLand Inc.'} ISAOA/ATIMA
                  </Typography>
                  <ContentCopy
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${saasState?.organizationName || 'YouLand Inc.'} ISAOA/ATIMA
${saasState?.address?.address}${
                          saasState?.address.aptNumber
                            ? `, ${saasState?.address.aptNumber}`
                            : ''
                        }.
${saasState?.address?.city ? `${saasState?.address?.city}, ` : ''}${
                          saasState?.address?.state
                            ? `${saasState?.address?.state}, `
                            : ''
                        }${
                          saasState?.address?.postcode
                            ? `${saasState?.address?.postcode}`
                            : ''
                        }`,
                      );
                      enqueueSnackbar('Copied data to clipboard', {
                        variant: 'success',
                      });
                    }}
                    sx={{ fontSize: 18, cursor: 'pointer' }}
                  />
                </Stack>
                <Typography variant={'body3'}>
                  {`${saasState?.address?.address}${
                    saasState?.address.aptNumber
                      ? `, ${saasState?.address.aptNumber}`
                      : ''
                  }`}
                </Typography>
                <Typography variant={'body3'}>
                  {`${
                    saasState?.address?.city
                      ? `${saasState?.address?.city}, `
                      : ''
                  }${
                    saasState?.address?.state
                      ? `${saasState?.address?.state}, `
                      : ''
                  }${
                    saasState?.address?.postcode
                      ? `${saasState?.address?.postcode}`
                      : ''
                  }`}
                </Typography>
              </Stack>
              <Stack gap={1.5}>
                <Typography variant={'subtitle2'}>Loan number</Typography>
                <Stack flexDirection={'row'} gap={1}>
                  <Typography variant={'body3'}>{loanNumber}</Typography>
                  <ContentCopy
                    onClick={async () => {
                      await navigator.clipboard.writeText(loanNumber!);
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
            sx: { maxWidth: '800px !important' },
          }}
        />

        <StyledDialog
          content={
            <>
              {!refreshHistoryLoading ? (
                histories?.length && history.length > 0 ? (
                  histories?.map((item, index) => (
                    <StyledHistoryItem
                      key={`history-item-${index}`}
                      {...item}
                    />
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
                  if (
                    store.notificationDocuments.categoryKey &&
                    store.notificationDocuments.fileId &&
                    store.notificationDocuments.fileName
                  ) {
                    store.setNotificationDocument({
                      categoryKey: '',
                      fileId: 0,
                      fileName: '',
                    });
                  }
                  historyClose();
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
                onClick={() => onClickShowHistory('inside')}
                sx={{
                  cursor: 'pointer',
                  '& > path': {
                    fill: refreshHistoryLoading ? '#BABCBE' : '#231F20',
                  },
                }}
              />
            </Stack>
          }
          onClose={() => {
            if (
              store.notificationDocuments.categoryKey &&
              store.notificationDocuments.fileId &&
              store.notificationDocuments.fileName
            ) {
              store.setNotificationDocument({
                categoryKey: '',
                fileId: 0,
                fileName: '',
              });
            }
            historyClose();
          }}
          open={historyVisible}
          PaperProps={{
            sx: { maxWidth: '800px !important', height: 600 },
          }}
        />
      </Box>
    );
  },
);
