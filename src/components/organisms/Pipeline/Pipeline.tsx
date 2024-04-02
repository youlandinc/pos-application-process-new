import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetProductTypeByUrl } from '@/utils';
import { _deleteProcess, _fetchAllProcesses } from '@/requests';
import { useSessionStorageState, useSwitch } from '@/hooks';
import { HttpError, LoanStage, PipelineAccountStatus, UserType } from '@/types';
import { AUTO_HIDE_DURATION, PAGE_SIZE } from '@/constants';
import { StyledButton, StyledDialog, StyledLoading } from '@/components/atoms';

import {
  LoanItemCard,
  LoanItemCardProps,
  SearchBar,
  SearchBarProps,
} from './components';

import PIPELINE_NO_RESULT from '@/svg/pipeline/pipeline_no_result.svg';

export const Pipeline: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { saasState } = useSessionStorageState('tenantConfig');

  const {
    userSetting: {
      pipelineStatus,
      pipelineStatusInitialized,
      //applicable
    },
    pipelineTask: { pipelineInitialized },
    userType,
    session,
    selectedProcessData,
    applicationForm,
  } = useMst();

  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const { visible, open, close } = useSwitch(false);

  const [page, setPage] = useState<number>(1);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

  const [listData, setListData] = useState<LoanItemCardProps['formData'][]>([]);

  const [isChange, setIsChange] = useState<boolean>(false);
  const [deleteAddress, setDeleteAddress] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [searchForm, setSearchForm] = useState<SearchBarProps['searchForm']>({
    propertyAddress: '',
    dateRange: [null, null],
    loanSpecies: [],
    loanStage: [],
    loanPurpose: [],
  });

  const [, getListData] = useAsyncFn(async () => {
    if (!session) {
      return;
    }
    if (
      (!pipelineInitialized ||
        !pipelineStatusInitialized ||
        pipelineStatus !== PipelineAccountStatus.active) &&
      //||!applicable
      userType !== UserType.CUSTOMER
    ) {
      return;
    }
    const params = {
      page: 1,
      size: PAGE_SIZE * page,
      loanId: '',
      propertyAddress: searchForm.propertyAddress,
      beginTime: searchForm.dateRange[0]
        ? format(searchForm.dateRange[0], "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : '',
      endTime: searchForm.dateRange[1]
        ? format(searchForm.dateRange[1], "yyyy-MM-dd'T'") + '23:59:59Z'
        : '',
      loanType: searchForm.loanSpecies,
      loanPurpose: searchForm.loanPurpose,
      stage: searchForm.loanStage,
    };
    setFetchLoading(true);
    return await _fetchAllProcesses(params)
      .then((res) => {
        setIsLoadMore(
          res.data.content.length !== res.data.totalElements
            ? res.data.totalElements - PAGE_SIZE > 0
              ? res.data.totalElements / PAGE_SIZE >= 1
              : false
            : false,
        );
        setListData(res.data.content);
        if (firstLoading) {
          setFirstLoading(false);
        }
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      })
      .finally(() => {
        setFetchLoading(false);
        setIsChange(false);
      });
  }, [
    //applicable,
    searchForm,
    page,
    pipelineInitialized,
    pipelineStatusInitialized,
    pipelineStatus,
  ]);

  const handledView = async (row: LoanItemCardProps['formData']) => {
    if (!row) {
      return;
    }
    switch (row.loanStage) {
      case LoanStage.Application:
        applicationForm.resetForm();
        await router.push(
          `/application/${POSGetProductTypeByUrl(row.productType)}?processId=${
            row.youlandId
          }`,
          `/application/${POSGetProductTypeByUrl(row.productType)}?processId=${
            row.youlandId
          }`,
          {
            shallow: true,
          },
        );
        break;
      case LoanStage.Refusal:
        enqueueSnackbar(
          'Your application has been rejected, feel free to submit a new\n' +
            'application',
          {
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
          },
        );
        break;
      default:
        selectedProcessData.setLoading(true);
        selectedProcessData.setProcessId('');
        await router.push({
          pathname: '/dashboard/overview',
          query: { processId: row.youlandId },
        });
        break;
    }
  };

  const handledDelete = (id: string, address: string) => {
    open();
    setDeleteAddress(address.split('NEW_LINE'));
    setDeleteId(id);
  };

  const handledClose = useCallback(
    (
      e: MouseEvent,
      reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick',
    ) => {
      if (reason !== 'backdropClick') {
        close();
      }
    },
    [close],
  );

  const handledConfirmDelete = useCallback(async () => {
    setDeleteLoading(true);
    try {
      await _deleteProcess(deleteId);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      await getListData();
      setDeleteLoading(false);
      setDeleteId('');
      close();
    }
  }, [close, deleteId, enqueueSnackbar, getListData]);

  useEffect(() => {
    if (isChange) {
      setPage(1);
    }
  }, [isChange]);

  useEffect(() => {
    getListData();
  }, [getListData, page]);

  return (!pipelineInitialized ||
    !pipelineStatusInitialized ||
    pipelineStatus !== PipelineAccountStatus.active) &&
    //||!applicable
    userType !== UserType.CUSTOMER ? null : (
    <>
      <SearchBar
        onParamsChange={(k, v) =>
          setSearchForm({
            ...searchForm,
            [k]: v,
          })
        }
        onValueChange={(v) => setIsChange(v)}
        searchForm={searchForm}
        userType={userType!}
      />

      {firstLoading && (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          margin={'auto 0'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey' }} />
        </Stack>
      )}

      <Stack
        flexDirection={'row'}
        flexWrap={'wrap'}
        gap={3}
        justifyContent={'flex-start'}
        mt={3}
      >
        {firstLoading ? null : listData.length > 0 ? (
          listData.map((item) => (
            <LoanItemCard
              formData={item}
              key={item.youlandId}
              onDelete={() => handledDelete(item.youlandId, item.address)}
              onView={() => handledView(item)}
              userType={userType}
            />
          ))
        ) : (
          <Box sx={{ m: '24px auto' }}>
            <Icon
              component={PIPELINE_NO_RESULT}
              sx={{
                width: { md: 544, xs: '100%' },
                height: 'auto',
                '& .pipeline_no_result_svg__pos_svg_theme_color': {
                  fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                },
              }}
            />
            <Typography mt={6} textAlign={'center'} variant={'body1'}>
              You don&apos;t have any loan yet, apply for a new one above.
            </Typography>
          </Box>
        )}
      </Stack>
      {isLoadMore && (
        <Box mt={3} textAlign={'center'}>
          <StyledButton
            color={'info'}
            disabled={!firstLoading && fetchLoading}
            loading={!firstLoading && fetchLoading}
            loadingText={'Loading...'}
            onClick={() => setPage(page + 1)}
            sx={{ width: 274 }}
            variant={'outlined'}
          >
            Load more
          </StyledButton>
        </Box>
      )}
      <StyledDialog
        content={
          <Typography
            component={'div'}
            mt={3}
            sx={{ color: 'info.dark', overflow: 'hidden' }}
            variant={'body2'}
          >
            {deleteLoading
              ? 'Deleting...'
              : `Are you sure you want to delete ${
                  deleteAddress[0] ? deleteAddress[0] : 'this application ?'
                } ${deleteAddress[1] ? deleteAddress[1] + '?' : ''}`}
          </Typography>
        }
        disableEscapeKeyDown
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
              color={'error'}
              disabled={deleteLoading}
              onClick={handledConfirmDelete}
              size={'small'}
            >
              Confirm
            </StyledButton>
          </Stack>
        }
        header={
          <Stack alignItems={'flex-start'} flexDirection={'row'}>
            <DeleteForever className={'POS_mr_1'} />
            <Typography variant={'h6'}>Delete?</Typography>
          </Stack>
        }
        onClose={handledClose}
        open={visible}
        TransitionProps={{
          onExited: () => {
            setDeleteId('');
            setDeleteAddress([]);
          },
        }}
      />
    </>
  );
});
