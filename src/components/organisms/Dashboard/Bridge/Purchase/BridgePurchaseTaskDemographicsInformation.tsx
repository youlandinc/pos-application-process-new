import { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { OPTIONS_TASK_GENDER } from '@/constants';
import { DashboardTaskGender } from '@/types';

import {
  StyledButton,
  StyledCheckbox,
  StyledFormItem,
  StyledSelectOption,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

export const BridgePurchaseTaskDemographicsInformation: FC = observer(() => {
  const router = useRouter();

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
  const [tribe, setTribe] = useState<string>('');

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

  const [gender, setGender] = useState<DashboardTaskGender | undefined>();

  const handledResetEthnicity = useCallback((isAll = false) => {
    if (isAll) {
      setMexican(false);
      setPuertoRican(false);
      setCuban(false);
      setOtherLatino(false);
      setOtherLatinoText('');
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
      setOtherIslander(false);
      setHawaiian(false);
      setChamorro(false);
      setSamoan(false);
      setOtherIslanderText('');

      setOtherAsian(false);
      setJapanese(false);
      setFilipino(false);
      setChinese(false);
      setKorean(false);
      setAsianIndian(false);

      setAmerican(false);
      setTribe('');
      setBlack(false);
      setWhite(false);
      setNotProvideRace(false);
      return;
    }
    setAmerican(false);
    setTribe('');
    setIsAsian(false);
    setBlack(false);
    setIslander(false);
    setWhite(false);
    setNotProvideRace(false);
  }, []);

  return (
    <StyledFormItem
      gap={6}
      label={'Government Requested Information for you'}
      tip={
        "The following information is requested by the Federal Government for certain types of loans related to a dwelling in order to monitor the lender's compliance with equal credit opportunity, fair housing, and home mortgage disclosure laws. The law provides that a lender may not discriminate either on the basis of this information, or whether you choose to disclose it. You may select one or more designations for Ethnicity and one or more designations for Race. You are not required to provide this information, but are encouraged to do so."
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        label={'What is your ethnicity?'}
        sub
        tip={'You can choose one or more.'}
      >
        <Stack gap={3} maxWidth={600} width={'100%'}>
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
                <Stack flexDirection={'row'} width={'100%'}>
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
                          multiline
                          onChange={(e) => setOtherLatinoText(e.target.value)}
                          rows={2}
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

      <StyledFormItem
        label={'What is your race?'}
        sub
        tip={'You can choose one or more.'}
      >
        <Stack gap={3} maxWidth={600} width={'100%'}>
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
                  onChange={(e) => setTribe(e.target.value)}
                  value={tribe}
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
                          multiline
                          onChange={(e) => {
                            setOtherAsianText(e.target.value);
                          }}
                          rows={2}
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
                <Stack flexDirection={'row'} gap={3}>
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
                    label={'Native Hawaiian'}
                    onChange={(e) => {
                      handledResetRace(true);
                      setChamorro(e.target.checked);
                    }}
                  />
                  <StyledCheckbox
                    checked={samoan}
                    label={'Native Hawaiian'}
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
                          multiline
                          onChange={(e) => {
                            setOtherIslanderText(e.target.value);
                          }}
                          rows={2}
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

      <StyledFormItem label={'What is your sex?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(v) => setGender(v as string as DashboardTaskGender)}
            options={OPTIONS_TASK_GENDER}
            value={gender}
          />
        </Stack>
      </StyledFormItem>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() => router.push('/dashboard/tasks')}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
