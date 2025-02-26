import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  Grow,
  Icon,
  Stack,
  Typography,
} from '@mui/material';
import _uniqueId from 'lodash/uniqueId';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';
import {
  AdditionalFee,
  FeeUnitEnum,
  HttpError,
  LoanAnswerEnum,
  UserType,
} from '@/types';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledTextField,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';

import { _fetchExecutiveList } from '@/requests/application';

import ICON_CLOSE from '@/svg/icon/icon_close.svg';

const initialized: AdditionalFee = {
  fieldName: '',
  unit: FeeUnitEnum.dollar,
  value: undefined,
};

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

export const CompensationInformation: FC<FormNodeBaseProps> = observer(
  ({ nextState, nextStep, backState, backStep }) => {
    const { enqueueSnackbar } = useSnackbar();
    const {
      applicationForm: { compensationInformation },
      userType,
    } = useMst();

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<InsideOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selfValue, setSelfValue] = useState<any>({
      title: compensationInformation.executiveName || '',
      key: compensationInformation.executiveId || '',
      value: compensationInformation.executiveId || '',
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
          await fetchOptions(compensationInformation.executiveName || '');
        }, 500),
      [fetchOptions, compensationInformation.executiveName],
    );

    useEffect(
      () => {
        fetchOptions('', false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const keydownEvent = useCallback(
      (e: KeyboardEvent) => {
        const button: (HTMLElement & { disabled?: boolean }) | null =
          document.getElementById(
            'application-compensation-information-next-button',
          );

        if (!button) {
          return;
        }

        if (e.key === 'Enter') {
          if (!button.disabled) {
            nextStep?.();
          }
        }
      },
      [nextStep],
    );

    useEffect(() => {
      document.addEventListener('keydown', keydownEvent, false);
      return () => {
        document.removeEventListener('keydown', keydownEvent, false);
      };
    }, [keydownEvent]);

    const renderName = useMemo(() => {
      switch (userType) {
        case UserType.REAL_ESTATE_AGENT:
          return 'Referral fee';
        case UserType.BROKER:
          return 'Broker';
        case UserType.LOAN_OFFICER:
          return 'Loan officer';
        default:
          return 'Compensation';
      }
    }, [userType]);

    return (
      <Stack gap={{ xs: 6, lg: 8 }} m={'0 auto'} maxWidth={600} width={'100%'}>
        <StyledFormItem
          gap={3}
          label={'Compensation'}
          labelSx={{ pb: 3 }}
          sub
          tip={'Please list your commission fees below'}
          tipSx={{
            mt: 0.5,
            textAlign: 'left',
            fontSize: { xs: 12, lg: 16 },
          }}
        >
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            ml={-0.5}
            width={'100%'}
          >
            {userType !== UserType.REAL_ESTATE_AGENT && (
              <StyledTextFieldNumber
                decimalScale={3}
                label={`${renderName} origination fee`}
                onValueChange={({ floatValue }) =>
                  compensationInformation.changeFieldValue(
                    'originationPoints',
                    floatValue,
                  )
                }
                percentage={true}
                suffix={'%'}
                thousandSeparator={false}
                value={compensationInformation.originationPoints}
              />
            )}

            <StyledTextFieldNumber
              label={
                userType === UserType.REAL_ESTATE_AGENT
                  ? renderName
                  : `${renderName} processing fee`
              }
              onValueChange={({ floatValue }) =>
                compensationInformation.changeFieldValue(
                  'processingFee',
                  floatValue,
                )
              }
              prefix={'$'}
              value={compensationInformation.processingFee}
            />
          </Stack>

          <Stack gap={3}>
            <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
              <Stack bgcolor={'#D2D6E1'} flex={1} height={2} />
              <StyledButton
                color={'info'}
                onClick={() =>
                  compensationInformation.addAdditionalFee({
                    ...initialized,
                    id: _uniqueId('additional_fee'),
                  })
                }
                sx={{
                  p: '0 !important',
                  '&:hover': { backgroundColor: 'transparent' },
                }}
                variant={'text'}
              >
                + Add new fee
              </StyledButton>
            </Stack>
            {compensationInformation.additionalFees.map((item, index) => (
              <Grow
                in={true}
                key={item.id}
                style={{ transformOrigin: 'top left' }}
                timeout={index * 300}
              >
                <Stack gap={1.5}>
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                  >
                    <Typography variant={'subtitle1'}>
                      Additional fee {index + 1}
                    </Typography>
                    <Icon
                      component={ICON_CLOSE}
                      onClick={() =>
                        compensationInformation.removeAdditionalFee(index)
                      }
                      sx={{
                        height: { xs: 20, lg: 24 },
                        width: { xs: 20, lg: 24 },
                        cursor: 'pointer',
                      }}
                    />
                  </Stack>
                  <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                    <StyledTextField
                      label={'Fee name'}
                      onChange={(e) =>
                        compensationInformation.changeFeeFieldValue(
                          index,
                          'fieldName',
                          e.target.value,
                        )
                      }
                      placeholder={'Fee name'}
                      value={item.fieldName}
                    />
                    <StyledTextFieldNumber
                      label={'Dollar amount'}
                      onValueChange={({ floatValue }) =>
                        compensationInformation.changeFeeFieldValue(
                          index,
                          'value',
                          floatValue,
                        )
                      }
                      placeholder={'Dollar amount'}
                      prefix={'$'}
                      value={item.value}
                    />
                  </Stack>
                </Stack>
              </Grow>
            ))}
          </Stack>
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Do you want to provide additional info about this loan?'}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              compensationInformation.changeFieldValue(
                'isAdditional',
                value === LoanAnswerEnum.yes,
              );
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%' }}
            value={
              compensationInformation.isAdditional
                ? LoanAnswerEnum.yes
                : LoanAnswerEnum.no
            }
          />
          <Transitions
            style={{
              display: compensationInformation.isAdditional ? 'flex' : 'none',
              width: '100%',
              maxWidth: 600,
            }}
          >
            {compensationInformation.isAdditional && (
              <StyledTextField
                inputProps={{
                  maxLength: 300,
                }}
                label={'Additional information'}
                multiline
                onChange={(e) =>
                  compensationInformation.changeFieldValue(
                    'additionalInfo',
                    e.target.value,
                  )
                }
                placeholder={'Additional information'}
                rows={4}
                sx={{ width: '100%' }}
                value={compensationInformation.additionalInfo}
              />
            )}
          </Transitions>
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Is there anyone helping you with the loan?'}
          sub
        >
          <Autocomplete
            getOptionLabel={(option) => {
              return option.title;
            }}
            inputValue={compensationInformation.executiveName}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            loading={loading}
            onChange={(e, newValue) => {
              setSelfValue(newValue);
              compensationInformation.changeFieldValue(
                'executiveId',
                newValue?.key || '',
              );
              compensationInformation.changeFieldValue(
                'executiveName',
                newValue?.title || '',
              );
            }}
            onClose={handleClose}
            onInputChange={(e, newValue) => {
              compensationInformation.changeFieldValue(
                'executiveName',
                newValue || '',
              );
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
              const matches = match(option.title, inputValue || '', {
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

        <Stack flexDirection={'row'} gap={3} maxWidth={600} width={'100%'}>
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ flex: 1 }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState || !compensationInformation.isListValidate}
            id={'application-compensation-information-next-button'}
            loading={nextState}
            onClick={nextStep}
            sx={{ flex: 1 }}
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
