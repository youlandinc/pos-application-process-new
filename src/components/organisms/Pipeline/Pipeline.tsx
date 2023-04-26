import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { _fetchAllProcesses } from '@/requests';

import { PAGE_SIZE } from '@/constants';
import {
  LoanItemCard,
  LoanItemCardProps,
  SearchBar,
  SearchBarProps,
} from '@/components/organisms/Pipeline/components';

export const Pipeline: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    userSetting,
    userType,
    pipelineTask: { pipelineInitialized, formData },
  } = useMst();

  console.log(userType);

  const [listData, setListData] = useState<LoanItemCardProps['formData'][]>([]);

  const [searchForm, setSearchForm] = useState<SearchBarProps['searchForm']>({
    propertyAddress: '',
    dateRange: [null, null],
    loanSpecies: [],
    loanStage: [],
  });

  const [initState, getListData] = useAsyncFn(async () => {
    const params = {
      page: 1,
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
    return await _fetchAllProcesses(params)
      .then((res) => {
        setListData(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchForm]);

  useEffect(() => {
    getListData();
  }, [getListData]);

  return (
    <>
      <SearchBar
        onParamsChange={(k, v) =>
          setSearchForm({
            ...searchForm,
            [k]: v,
          })
        }
        searchForm={searchForm}
      />
      <Stack
        flexDirection={'row'}
        flexWrap={'wrap'}
        gap={3}
        justifyContent={'flex-start'}
        mt={3}
      >
        {listData.map((item) => (
          <LoanItemCard
            formData={item}
            key={item.youlandId}
            userType={userType}
          />
        ))}
      </Stack>
    </>
  );
});
