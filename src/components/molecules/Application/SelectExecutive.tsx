import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledButton,
  StyledFormItem,
  StyledTextField,
} from '@/components/atoms';

import { _fetchExecutiveList } from '@/requests/application';
import { HttpError } from '@/types';
import { debounce } from 'lodash';

interface InsideOption {
  title: string;
  key: string;
  value: string;
}

const genOption = (arr: any[]) => {
  return arr.reduce((acc, cur) => {
    acc.push({
      title: cur.userInfo.name,
      key: cur.id,
      value: cur.id,
    });
    return acc;
  }, []);
};

export const SelectExecutive: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep }) => {
    const { enqueueSnackbar } = useSnackbar();
    const {
      applicationForm: { selectExecutive },
    } = useMst();

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<InsideOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selfValue, setSelfValue] = useState<any>({
      title: selectExecutive.executiveName || '',
      key: selectExecutive.executiveId || '',
      value: selectExecutive.executiveId || '',
    });

    const handleOpen = async () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setLoading(false);
    };

    const fetchOptions = useCallback(
      async (value: string, loading = true) => {
        loading && setLoading(true);
        try {
          const { data } = await _fetchExecutiveList(value);
          setOptions(genOption(data?.content || []));
        } catch (err) {
          const { message, header, variant } = err as HttpError;
          enqueueSnackbar(message, { variant, header, isSimple: false });
        } finally {
          loading && setLoading(false);
        }
      },
      [enqueueSnackbar],
    );

    const throttleFetchOptions = useMemo(
      () =>
        debounce(async () => {
          await fetchOptions(selectExecutive.executiveName || '');
        }, 500),
      [fetchOptions, selectExecutive.executiveName],
    );

    useEffect(
      () => {
        fetchOptions('', false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return (
      <Stack gap={{ xs: 6, lg: 10 }} m={'0 auto'} maxWidth={600} width={'100%'}>
        <StyledFormItem
          gap={3}
          label={'Is there anyone helping you with the loan?'}
          labelSx={{
            pb: 3,
          }}
          maxWidth={600}
        >
          <Autocomplete
            getOptionLabel={(option) => {
              return option.title;
            }}
            inputValue={selectExecutive.executiveName}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            loading={loading}
            onChange={(e, newValue) => {
              if (newValue) {
                selectExecutive.changeFieldValue('executiveId', newValue.key);
              }
              setSelfValue(newValue);
            }}
            onClose={handleClose}
            onInputChange={(e, newValue) => {
              selectExecutive.changeFieldValue('executiveName', newValue || '');
              throttleFetchOptions();
            }}
            onOpen={handleOpen}
            open={open}
            options={options}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                label={'Please select an account executive'}
              />
            )}
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option.title, inputValue, {
                insideWords: true,
              });
              const parts = parse(option.title, matches);
              return (
                <Stack
                  {...props}
                  component={'li'}
                  flexDirection={'row'}
                  height={48}
                  key={props.id}
                  sx={{
                    alignItems: 'center !important',
                    justifyContent: 'flex-start !important',
                  }}
                >
                  {parts.map((part, index) => (
                    <Stack
                      component="span"
                      height={'100%'}
                      justifyContent={'center'}
                      key={index}
                      sx={{
                        fontWeight: part.highlight ? 'bold' : 'regular',
                      }}
                    >
                      {part.text}
                    </Stack>
                  ))}
                </Stack>
              );
            }}
            slotProps={{
              paper: {
                sx: {
                  '.MuiAutocomplete-listbox': {
                    p: 0,
                  },
                },
              },
            }}
            value={selfValue}
          />
        </StyledFormItem>

        <Stack flexDirection={'row'} gap={3} width={'100%'}>
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState}
            id={'application-select-executive-next-button'}
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'contained'}
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
