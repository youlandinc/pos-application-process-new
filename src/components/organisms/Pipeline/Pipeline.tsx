import { StyledButton, StyledDialog, StyledLoading } from '@/components';
import { useSwitch } from '@/hooks';
import { POSFlex } from '@/styles';
import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { _deleteProcess, _fetchAllProcesses } from '@/requests';

import { AUTO_HIDE_DURATION, PAGE_SIZE } from '@/constants';
import {
  LoanItemCard,
  LoanItemCardProps,
  SearchBar,
  SearchBarProps,
} from '@/components/organisms/Pipeline/components';

import PIPELINE_NO_RESULT from '@/svg/pipeline/pipeline_no_result.svg';

export const Pipeline: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    userSetting,
    userType,
    pipelineTask: { pipelineInitialized, formData },
  } = useMst();

  const { visible, open, close } = useSwitch(false);

  const [listData, setListData] = useState<LoanItemCardProps['formData'][]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [deleteAddress, setDeleteAddress] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [searchForm, setSearchForm] = useState<SearchBarProps['searchForm']>({
    propertyAddress: '',
    dateRange: [null, null],
    loanSpecies: [],
    loanStage: [],
  });

  const [, getListData] = useAsyncFn(async () => {
    const params = {
      page,
      size: PAGE_SIZE,
      loanId: '',
      propertyAddress: searchForm.propertyAddress,
      beginTime: searchForm.dateRange[0]
        ? format(searchForm.dateRange[0], "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : '',
      endTime: searchForm.dateRange[1]
        ? format(searchForm.dateRange[1], "yyyy-MM-dd'T'") + '23:59:59Z'
        : '',
      loanType: searchForm.loanSpecies,
      stage: searchForm.loanStage,
    };
    setFetchLoading(true);
    return await _fetchAllProcesses(params)
      .then((res) => {
        const obj: { [key: string]: { [key: string]: unknown } } = {};
        const temp = isChange
          ? res.data.content
          : [...listData, ...res.data.content].reduce((cur, next) => {
              if (!obj[next.youlandId]) {
                obj[next.youlandId] = cur.push(next);
              }
              return cur;
            }, []);
        setIsLoadMore(
          temp.length !== res.data.totalElements
            ? res.data.totalElements - PAGE_SIZE > 0
              ? (res.data.totalElements - PAGE_SIZE) % PAGE_SIZE !== 0
              : false
            : false,
        );
        setListData(temp);
        if (firstLoading) {
          setFirstLoading(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      })
      .finally(() => {
        setFetchLoading(false);
        setIsChange(false);
      });
  }, [searchForm, page]);

  const handledView = (id: string) => {
    console.log(123);
    console.log(id, 'view');
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
    setIsChange(true);
    setDeleteLoading(true);
    try {
      await _deleteProcess(deleteId);
      await getListData();
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      close();
      setDeleteLoading(false);
    }
  }, [close, deleteId, enqueueSnackbar]);

  useEffect(() => {
    getListData();
  }, [getListData, page]);

  return (
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
      />

      {firstLoading && (
        <Box mt={3}>
          <StyledLoading sx={{ color: 'primary.main' }} />
        </Box>
      )}

      <Stack
        flexDirection={'row'}
        flexWrap={'wrap'}
        gap={3}
        justifyContent={'flex-start'}
        mt={3}
      >
        {firstLoading ? (
          <></>
        ) : listData.length > 0 ? (
          listData.map((item) => (
            <LoanItemCard
              formData={item}
              key={item.youlandId}
              onDelete={() => handledDelete(item.youlandId, item.address)}
              onView={() => handledView(item.youlandId)}
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
              }}
            />
            <Typography mt={6} textAlign={'center'} variant={'body1'}>
              You don&apos;t have any loan history yet, apply for a new loan.
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
            Load More
          </StyledButton>
        </Box>
      )}
      <StyledDialog
        content={
          <Typography mt={3} sx={{ color: 'info.A100' }} variant={'body2'}>
            {deleteLoading
              ? 'Deleting...'
              : `Are you sure you want to delete ${
                  deleteAddress[0] ? deleteAddress[0] : 'this application ?'
                } ${deleteAddress[1] ? deleteAddress[1] + ' ?' : ''}`}
          </Typography>
        }
        disableEscapeKeyDown
        footer={
          <Box mt={3}>
            <StyledButton
              className={'POS_mr_1'}
              color={'error'}
              onClick={close}
              size={'small'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              onClick={handledConfirmDelete}
              size={'small'}
              variant={'outlined'}
            >
              Confirm
            </StyledButton>
          </Box>
        }
        header={
          <Stack alignItems={'flex-start'} flexDirection={'row'}>
            <DeleteForever className={'POS_mr_1'} />
            <Typography variant={'h6'}>Delete ?</Typography>
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
