import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

import {
  StyledButton,
  StyledCheckbox,
  StyledFormItem,
  StyledLoading,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

import { DashboardTaskGender, DashboardTaskKey, HttpError } from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksDemographics: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [latino, setLatino] = useState<boolean>(false);
  const [mexican, setMexican] = useState<boolean>(false);
  const [puertoRican, setPuertoRican] = useState<boolean>(false);
  const [cuban, setCuban] = useState<boolean>(false);
  const [otherLatino, setOtherLatino] = useState<boolean>(false);
  const [otherLatinoText, setOtherLatinoText] = useState<string>('');

  const [notLatino, setNotLatino] = useState<boolean>(false);
  const [notProvideEthnicity, setNotProvideEthnicity] =
    useState<boolean>(false);

  // race
  const [american, setAmerican] = useState<boolean>(false);
  const [tribeText, setTribeText] = useState<string>('');

  const [isAsian, setIsAsian] = useState<boolean>(false);
  const [asianIndian, setAsianIndian] = useState<boolean>(false);
  const [chinese, setChinese] = useState<boolean>(false);
  const [filipino, setFilipino] = useState<boolean>(false);
  const [japanese, setJapanese] = useState<boolean>(false);
  const [korean, setKorean] = useState<boolean>(false);
  const [otherAsian, setOtherAsian] = useState<boolean>(false);
  const [otherAsianText, setOtherAsianText] = useState<string>('');

  const [black, setBlack] = useState<boolean>(false);
  const [islander, setIslander] = useState<boolean>(false);
  const [hawaiian, setHawaiian] = useState<boolean>(false);
  const [chamorro, setChamorro] = useState<boolean>(false);
  const [samoan, setSamoan] = useState<boolean>(false);
  const [otherIslander, setOtherIslander] = useState<boolean>(false);
  const [otherIslanderText, setOtherIslanderText] = useState<string>('');

  const [white, setWhite] = useState<boolean>(false);
  const [notProvideRace, setNotProvideRace] = useState<boolean>(false);

  // gender
  const [male, setMale] = useState<boolean>(false);
  const [female, setFemale] = useState<boolean>(false);
  const [notProvideGender, setNotProvideGender] = useState<boolean>(false);

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: {
            ethnicity: {
              latino,
              mexican,
              puertoRican,
              cuban,
              otherLatino,
              otherLatinoText,

              notLatino,
              notProvideEthnicity,
            },
            race: {
              american,
              tribeText,

              isAsian,
              asianIndian,
              chinese,
              filipino,
              japanese,
              korean,
              otherAsian,
              otherAsianText,

              islander,
              hawaiian,
              chamorro,
              samoan,
              otherIslander,
              otherIslanderText,

              black,
              white,
              notProvideRace,
            },
            gender,
          },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.demographics,
      });
      // ethnicity
      setLatino(latino);
      setMexican(mexican);
      setPuertoRican(puertoRican);
      setCuban(cuban);
      setOtherLatino(otherLatino);
      setOtherLatinoText(otherLatinoText ?? '');
      setNotLatino(notLatino);
      setNotProvideEthnicity(notProvideEthnicity);

      // race
      setAmerican(american);
      setTribeText(tribeText ?? '');

      setIsAsian(isAsian);
      setAsianIndian(asianIndian);
      setChinese(chinese);
      setFilipino(filipino);
      setJapanese(japanese);
      setKorean(korean);
      setOtherAsian(otherAsian);
      setOtherAsianText(otherAsianText ?? '');

      setIslander(islander);
      setHawaiian(hawaiian);
      setChamorro(chamorro);
      setSamoan(samoan);
      setOtherIslander(otherIslander);
      setOtherIslanderText(otherIslanderText ?? '');

      setBlack(black);
      setWhite(white);
      setNotProvideRace(notProvideRace);

      setMale(gender === DashboardTaskGender.male);
      setFemale(gender === DashboardTaskGender.female);
      setNotProvideGender(gender === DashboardTaskGender.not_provide);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const handledResetEthnicity = useCallback((isAll = false) => {
    if (isAll) {
      setNotLatino(false);
      setNotProvideEthnicity(false);
      return;
    }
    setLatino(false);
    setNotLatino(false);
    setNotProvideEthnicity(false);
  }, []);

  const handledResetRace = useCallback((isAll = false) => {
    if (isAll) {
      setAmerican(false);
      setTribeText('');
      setBlack(false);
      setWhite(false);
      setNotProvideRace(false);
      return;
    }
    setAmerican(false);
    setTribeText('');
    setIsAsian(false);
    setBlack(false);
    setIslander(false);
    setWhite(false);
    setNotProvideRace(false);
  }, []);

  const isFormDataValid = useMemo(() => {
    const conditionA = latino
      ? otherLatino
        ? !!otherLatinoText
        : mexican || puertoRican || cuban
      : notProvideEthnicity || notLatino;
    const conditionB = () => {
      if (isAsian) {
        return otherAsian
          ? !!otherAsianText
          : asianIndian || chinese || filipino || japanese || korean;
      }
      if (islander) {
        return otherIslander
          ? !!otherIslanderText
          : hawaiian || chamorro || samoan;
      }
      if (american) {
        return !!tribeText;
      }
      return notProvideRace || black || white;
    };
    const conditionC = () => {
      return [male, female, notProvideGender].some((item) => item);
    };
    return conditionC() && conditionB() && conditionA;
  }, [
    american,
    asianIndian,
    black,
    chamorro,
    chinese,
    cuban,
    female,
    filipino,
    hawaiian,
    isAsian,
    islander,
    japanese,
    korean,
    latino,
    male,
    mexican,
    notLatino,
    notProvideEthnicity,
    notProvideGender,
    notProvideRace,
    otherAsian,
    otherAsianText,
    otherIslander,
    otherIslanderText,
    otherLatino,
    otherLatinoText,
    puertoRican,
    samoan,
    tribeText,
    white,
  ]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.demographics,
      data: {
        ethnicity: {
          latino,
          mexican,
          puertoRican,
          cuban,
          otherLatino,
          otherLatinoText,

          notLatino,
          notProvideEthnicity,
        },
        race: {
          american,
          tribeText,

          isAsian,
          asianIndian,
          chinese,
          filipino,
          japanese,
          korean,
          otherAsian,
          otherAsianText,

          islander,
          hawaiian,
          chamorro,
          samoan,
          otherIslander,
          otherIslanderText,

          black,
          white,
          notProvideRace,
        },
        gender: male
          ? DashboardTaskGender.male
          : female
            ? DashboardTaskGender.female
            : DashboardTaskGender.not_provide,
      },
    };

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await jumpToNextTask(DashboardTaskKey.demographics);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 194px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 6, lg: 8 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        width={'100%'}
      >
        <Typography component={'div'} fontSize={{ xs: 20, lg: 24 }}>
          Demographic information
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            sx={{ display: 'flex', flexDirection: 'column' }}
            variant={'body1'}
          >
            The law requires us to ask for this information in order to monitor
            our compliance with equal credit opportunity.
            <Typography component={'span'} fontSize={'inherit'}>
              The law provides that we may not discriminate based on the basis
              of this information.
            </Typography>
          </Typography>
        </Typography>

        <StyledFormItem
          gap={3}
          label={'What is your ethnicity?'}
          maxWidth={600}
          mt={-3}
          sub
        >
          <Stack gap={1.5} width={'100%'}>
            <StyledCheckbox
              checked={latino}
              label={'Hispanic or Latino'}
              onChange={(e) => {
                handledResetEthnicity();
                setLatino(e.target.checked);
              }}
            />
            <Transitions
              style={{
                display: latino ? 'flex' : 'none',
                padding: '0 24px',
                flexDirection: 'column',
              }}
            >
              {latino && (
                <>
                  <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1}>
                    <StyledCheckbox
                      checked={mexican}
                      label={'Mexican'}
                      onChange={(e) => {
                        handledResetEthnicity(true);
                        setMexican(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={puertoRican}
                      label={'Puerto Rican'}
                      onChange={(e) => {
                        handledResetEthnicity(true);
                        setPuertoRican(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={cuban}
                      label={'Cuban'}
                      onChange={(e) => {
                        handledResetEthnicity(true);
                        setCuban(e.target.checked);
                      }}
                    />
                  </Stack>
                  <Box mt={1}>
                    <StyledCheckbox
                      checked={otherLatino}
                      label={' Other Hispanic or Latino'}
                      onChange={(e) => {
                        handledResetEthnicity(true);
                        setOtherLatino(e.target.checked);
                      }}
                    />
                    <Transitions
                      style={{
                        display: otherLatino ? 'block' : 'none',
                      }}
                    >
                      {otherLatino && (
                        <>
                          <StyledTextField
                            maxRows={4}
                            minRows={1}
                            multiline
                            onChange={(e) => setOtherLatinoText(e.target.value)}
                            size={'small'}
                            value={otherLatinoText}
                          />
                          <Typography
                            color={'info.main'}
                            component={'div'}
                            mt={1}
                            textAlign={'center'}
                            variant={'body3'}
                          >
                            For example, Argentinian, Colombian, Nicaraguan, El
                            Salvadoran, Venezuelan, etc.
                          </Typography>
                        </>
                      )}
                    </Transitions>
                  </Box>
                </>
              )}
            </Transitions>

            <StyledCheckbox
              checked={notLatino}
              label={'Not Hispanic or Latino'}
              onChange={(e) => {
                handledResetEthnicity();
                setNotLatino(e.target.checked);
              }}
            />
            <StyledCheckbox
              checked={notProvideEthnicity}
              label={'I do not wish to provide this information'}
              onChange={(e) => {
                handledResetEthnicity();
                setNotProvideEthnicity(e.target.checked);
              }}
            />
          </Stack>
        </StyledFormItem>

        <StyledFormItem gap={3} label={'What is your race?'} maxWidth={600} sub>
          <Stack gap={1.5} width={'100%'}>
            <Box>
              <StyledCheckbox
                checked={american}
                label={'American Indian or Alaska Native'}
                onChange={(e) => {
                  handledResetRace();
                  setAmerican(e.target.checked);
                }}
              />
              <Transitions
                style={{
                  display: american ? 'block' : 'none',
                  width: '100%',
                }}
              >
                {american && (
                  <StyledTextField
                    label={'Name of enrolled or principal tribe'}
                    onChange={(e) => setTribeText(e.target.value)}
                    size={'small'}
                    value={tribeText}
                  />
                )}
              </Transitions>
            </Box>

            <StyledCheckbox
              checked={isAsian}
              label={'Asian'}
              onChange={(e) => {
                handledResetRace();
                setIsAsian(e.target.checked);
              }}
            />

            <Transitions
              style={{
                display: isAsian ? 'flex' : 'none',
                width: '100%',
                flexDirection: 'column',
                padding: '0 24px',
              }}
            >
              {isAsian && (
                <>
                  <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1}>
                    <StyledCheckbox
                      checked={asianIndian}
                      label={'Asian Indian'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setAsianIndian(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={chinese}
                      label={'Chinese'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setChinese(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={filipino}
                      label={'Filipino'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setFilipino(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={japanese}
                      label={'Japanese'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setJapanese(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={korean}
                      label={'Korean'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setKorean(e.target.checked);
                      }}
                    />
                  </Stack>
                  <Box mt={1}>
                    <StyledCheckbox
                      checked={otherAsian}
                      label={'Other Hispanic or Latino'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setOtherAsian(e.target.checked);
                      }}
                    />
                    <Transitions
                      style={{
                        display: otherAsian ? 'block' : 'none',
                        width: '100%',
                      }}
                    >
                      {otherAsian && (
                        <>
                          <StyledTextField
                            maxRows={4}
                            minRows={1}
                            multiline
                            onChange={(e) => {
                              setOtherAsianText(e.target.value);
                            }}
                            size={'small'}
                            value={otherAsianText}
                          />
                          <Typography
                            color={'info.main'}
                            component={'div'}
                            mt={1}
                            textAlign={'center'}
                            variant={'body3'}
                          >
                            For example, Argentinian, Colombian, Nicaraguan, El
                            Salvadoran, Venezuelan, etc.
                          </Typography>
                        </>
                      )}
                    </Transitions>
                  </Box>
                </>
              )}
            </Transitions>

            <StyledCheckbox
              checked={black}
              label={'Black or African American'}
              onChange={(e) => {
                handledResetRace();
                setBlack(e.target.checked);
              }}
            />
            <StyledCheckbox
              checked={islander}
              label={'Native Hawaiian or Other Pacific Islander'}
              onChange={(e) => {
                handledResetRace();
                setIslander(e.target.checked);
              }}
            />
            <Transitions
              style={{
                display: islander ? 'flex' : 'none',
                width: '100%',
                flexDirection: 'column',
                padding: '0 24px',
              }}
            >
              {islander && (
                <>
                  <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1}>
                    <StyledCheckbox
                      checked={hawaiian}
                      label={'Native Hawaiian'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setHawaiian(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={chamorro}
                      label={'Guamanian or Chamorro'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setChamorro(e.target.checked);
                      }}
                    />
                    <StyledCheckbox
                      checked={samoan}
                      label={'Samoan'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setSamoan(e.target.checked);
                      }}
                    />
                  </Stack>
                  <Box mt={1}>
                    <StyledCheckbox
                      checked={otherIslander}
                      label={'Other Hispanic or Latino'}
                      onChange={(e) => {
                        handledResetRace(true);
                        setOtherIslander(e.target.checked);
                      }}
                    />
                    <Transitions
                      style={{
                        display: otherIslander ? 'block' : 'none',
                        width: '100%',
                      }}
                    >
                      {otherIslander && (
                        <>
                          <StyledTextField
                            maxRows={4}
                            minRows={1}
                            multiline
                            onChange={(e) => {
                              setOtherIslanderText(e.target.value);
                            }}
                            size={'small'}
                            value={otherIslanderText}
                          />
                          <Typography
                            color={'info.main'}
                            component={'div'}
                            mt={1}
                            textAlign={'center'}
                            variant={'body3'}
                          >
                            For example, Argentinian, Colombian, Nicaraguan, El
                            Salvadoran, Venezuelan, etc.
                          </Typography>
                        </>
                      )}
                    </Transitions>
                  </Box>
                </>
              )}
            </Transitions>

            <StyledCheckbox
              checked={white}
              label={'White'}
              onChange={(e) => {
                handledResetRace();
                setWhite(e.target.checked);
              }}
            />
            <StyledCheckbox
              checked={notProvideRace}
              label={'I do not wish to provide this information'}
              onChange={(e) => {
                handledResetRace();
                setNotProvideRace(e.target.checked);
              }}
            />
          </Stack>
        </StyledFormItem>

        <StyledFormItem gap={3} label={'What is your sex?'} maxWidth={600} sub>
          <Stack gap={1.5} width={'100%'}>
            <StyledCheckbox
              checked={male}
              label={'Male'}
              onChange={(e) => {
                setFemale(false);
                setNotProvideGender(false);
                setMale(e.target.checked);
              }}
            />
            <StyledCheckbox
              checked={female}
              label={'Female'}
              onChange={(e) => {
                setMale(false);
                setNotProvideGender(false);
                setFemale(e.target.checked);
              }}
            />
            <StyledCheckbox
              checked={notProvideGender}
              label={'I do not wish to provide this information'}
              onChange={(e) => {
                setMale(false);
                setFemale(false);
                setNotProvideGender(e.target.checked);
              }}
            />
          </Stack>
        </StyledFormItem>

        <StyledButton
          color={'primary'}
          disabled={saveLoading || !isFormDataValid}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ width: 276 }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});
