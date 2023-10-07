import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { HttpError, TaskFiles } from '@/types';
import { AUTO_HIDE_DURATION } from '@/constants';
import {
  _deleteTaskFile,
  _fetchTaskFormInfo,
  _updateTaskFormInfo,
  _uploadTaskFile,
} from '@/requests/dashboard';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledProgressLine,
  StyledUploadButtonBox,
  Transitions,
} from '@/components/atoms';

const hash = {
  common: [
    'payoff',
    'insurance',
    // common
    'form1003',
    'identification',
    'w9',
    'authorization',
    'bank',
    'prelim',
  ],
  show1: ['budget'],
  show2: ['questionnaire', 'policy'],
  show3: ['articles', 'laws', 'standing'],
};

export const FixRefinanceTaskDocuments: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [total, setTotal] = useState(9);

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const [insuranceFiles, setInsuranceFiles] = useState<TaskFiles[]>([]);
  const [payoffFiles, setPayoffFiles] = useState<TaskFiles[]>([]);

  const [form1003Files, setForm1003Files] = useState<TaskFiles[]>([]);
  const [identificationFiles, setIdentificationFiles] = useState<TaskFiles[]>(
    [],
  );
  const [w9Files, setW9Files] = useState<TaskFiles[]>([]);
  const [authorizationFiles, setAuthorizationFiles] = useState<TaskFiles[]>([]);
  const [bankFiles, setBankFiles] = useState<TaskFiles[]>([]);
  const [prelimFiles, setPrelimFiles] = useState<TaskFiles[]>([]);

  const [articlesFiles, setArticlesFiles] = useState<TaskFiles[]>([]);
  const [lawsFiles, setLawsFiles] = useState<TaskFiles[]>([]);
  const [standingFiles, setStandingFiles] = useState<TaskFiles[]>([]);

  const [budgetFiles, setBudgetFiles] = useState<TaskFiles[]>([]);

  const [questionnaireFiles, setQuestionnaireFiles] = useState<TaskFiles[]>([]);
  const [policyFiles, setPolicyFiles] = useState<TaskFiles[]>([]);

  const [otherFiles, setOtherFiles] = useState<TaskFiles[]>([]);

  const computedObj = useCallback(
    (key: string) => {
      switch (key) {
        case 'payoff':
          return { data: payoffFiles, action: setPayoffFiles };
        case 'insurance':
          return { data: insuranceFiles, action: setInsuranceFiles };
        case 'form1003':
          return { data: form1003Files, action: setForm1003Files };
        case 'identification':
          return { data: identificationFiles, action: setIdentificationFiles };
        case 'w9':
          return { data: w9Files, action: setW9Files };
        case 'authorization':
          return { data: authorizationFiles, action: setAuthorizationFiles };
        case 'bank':
          return { data: bankFiles, action: setBankFiles };
        case 'prelim':
          return { data: prelimFiles, action: setPrelimFiles };
        case 'articles':
          return { data: articlesFiles, action: setArticlesFiles };
        case 'laws':
          return { data: lawsFiles, action: setLawsFiles };
        case 'standing':
          return { data: standingFiles, action: setStandingFiles };
        case 'budget':
          return { data: budgetFiles, action: setBudgetFiles };
        case 'questionnaire':
          return { data: questionnaireFiles, action: setQuestionnaireFiles };
        case 'policy':
          return { data: policyFiles, action: setPolicyFiles };
        case 'other':
          return { data: otherFiles, action: setOtherFiles };
        default:
          return null;
      }
    },
    [
      articlesFiles,
      authorizationFiles,
      bankFiles,
      budgetFiles,
      form1003Files,
      identificationFiles,
      insuranceFiles,
      lawsFiles,
      otherFiles,
      payoffFiles,
      policyFiles,
      prelimFiles,
      questionnaireFiles,
      standingFiles,
      w9Files,
    ],
  );

  const handledDelete = async (index: number, key: string) => {
    if (!computedObj(key)) {
      return;
    }

    const { data, action } = computedObj(key) as {
      data: TaskFiles[];
      action: Dispatch<SetStateAction<TaskFiles[]>>;
    };

    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: `${key}Files`,
        fileUrl: data[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(data));
      temp.splice(index, 1);
      action(temp);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const handledSuccess = async (files: FileList, key: string) => {
    if (!computedObj(key)) {
      return;
    }
    setUploadLoading(true);

    const { data: computedData, action } = computedObj(key) as {
      data: TaskFiles[];
      action: Dispatch<SetStateAction<TaskFiles[]>>;
    };

    const formData = new FormData();

    formData.append('fieldName', `${key}Files`);
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      action([...computedData, ...data]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const computedCurrent = useMemo(() => {
    let count = 0;
    hash.common.forEach((item) => {
      if (computedObj(item)?.data?.length) {
        count += 1;
      }
    });
    if (show1) {
      hash.show1.forEach((item) => {
        if (computedObj(item)?.data?.length) {
          count += 1;
        }
      });
    }
    if (show2) {
      hash.show2.forEach((item) => {
        if (computedObj(item)?.data?.length) {
          count += 1;
        }
      });
    }
    if (show3) {
      hash.show3.forEach((item) => {
        if (computedObj(item)?.data?.length) {
          count += 1;
        }
      });
    }
    return count;
  }, [computedObj, show1, show2, show3]);

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          show1,
          show2,
          show3,

          payoffFiles,
          insuranceFiles,
          form1003Files,
          identificationFiles,
          w9Files,
          authorizationFiles,
          bankFiles,
          prelimFiles,
          otherFiles,

          articlesFiles,
          lawsFiles,
          standingFiles,

          budgetFiles,

          questionnaireFiles,
          policyFiles,

          totalNum,
        } = res.data;

        setTotal(totalNum);

        setShow1(show1);
        setShow2(show2);
        setShow3(show3);

        setInsuranceFiles(insuranceFiles || []);
        setPayoffFiles(payoffFiles || []);
        setForm1003Files(form1003Files || []);
        setIdentificationFiles(identificationFiles || []);
        setW9Files(w9Files || []);
        setAuthorizationFiles(authorizationFiles || []);
        setBankFiles(bankFiles || []);
        setPrelimFiles(prelimFiles || []);
        setOtherFiles(otherFiles || []);

        setArticlesFiles(articlesFiles || []);
        setLawsFiles(lawsFiles || []);
        setStandingFiles(standingFiles || []);

        setBudgetFiles(budgetFiles || []);

        setQuestionnaireFiles(questionnaireFiles || []);
        setPolicyFiles(policyFiles || []);
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.taskId]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        articlesFiles,
        authorizationFiles,
        bankFiles,
        budgetFiles,
        form1003Files,
        identificationFiles,
        insuranceFiles,
        lawsFiles,
        payoffFiles,
        policyFiles,
        prelimFiles,
        questionnaireFiles,
        standingFiles,
        w9Files,
        otherFiles,
      },
    };

    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
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
  }, [
    articlesFiles,
    authorizationFiles,
    bankFiles,
    budgetFiles,
    enqueueSnackbar,
    form1003Files,
    identificationFiles,
    insuranceFiles,
    lawsFiles,
    otherFiles,
    payoffFiles,
    policyFiles,
    prelimFiles,
    questionnaireFiles,
    router,
    standingFiles,
    w9Files,
  ]);

  return (
    <>
      <Transitions
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            margin={'auto 0'}
            minHeight={'calc(667px - 46px)'}
            width={'100%'}
          >
            <StyledLoading sx={{ color: 'text.grey' }} />
          </Stack>
        ) : (
          <StyledFormItem
            gap={3}
            label={'Documents'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              <Stack alignItems={'center'}>
                <StyledProgressLine current={computedCurrent} total={total} />
              </Stack>
            }
            width={'100%'}
          >
            <Stack gap={6} maxWidth={900} width={'100%'}>
              <StyledUploadButtonBox
                fileList={form1003Files}
                label={
                  <Stack flexDirection={'column'} width={'100%'}>
                    1003 Form{' '}
                    <Typography
                      color={'primary.main'}
                      onClick={() =>
                        window.open(
                          'https://youland-template-file.s3.us-west-1.amazonaws.com/1003_2021V.pdf',
                        )
                      }
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      variant={'body1'}
                    >
                      1003 Form.pdf
                    </Typography>
                  </Stack>
                }
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'form1003')}
                onSuccess={(files) => handledSuccess(files, 'form1003')}
              />
              <StyledUploadButtonBox
                fileList={identificationFiles}
                label={'Personal identification of guarantor and/or borrower'}
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'identification')}
                onSuccess={(files) => handledSuccess(files, 'identification')}
              />

              <StyledUploadButtonBox
                fileList={w9Files}
                label={
                  <Stack flexDirection={'column'} width={'100%'}>
                    W9 Form
                    <Typography
                      color={'primary.main'}
                      onClick={() =>
                        window.open(
                          'https://youland-template-file.s3.us-west-1.amazonaws.com/fw9.pdf',
                        )
                      }
                      sx={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      variant={'body1'}
                    >
                      W9 Form.pdf
                    </Typography>
                  </Stack>
                }
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'w9')}
                onSuccess={(files) => handledSuccess(files, 'w9')}
              />

              <StyledUploadButtonBox
                fileList={authorizationFiles}
                label={
                  <Stack flexDirection={'column'} width={'100%'}>
                    Borrower Authorization Form{' '}
                    <Typography
                      color={'primary.main'}
                      onClick={() =>
                        window.open(
                          'https://youland-template-file.s3.us-west-1.amazonaws.com/Borrower+authorization+form.pdf',
                        )
                      }
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      variant={'body1'}
                    >
                      Borrower Authorization Form.pdf
                    </Typography>
                  </Stack>
                }
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'authorization')}
                onSuccess={(files) => handledSuccess(files, 'authorization')}
              />

              <StyledUploadButtonBox
                fileList={bankFiles}
                label={'Proof of Liquidity (Bank Statement)'}
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'bank')}
                onSuccess={(files) => handledSuccess(files, 'bank')}
              />

              <StyledUploadButtonBox
                fileList={prelimFiles}
                label={'Prelim or Title Commitment'}
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'prelim')}
                onSuccess={(files) => handledSuccess(files, 'prelim')}
              />

              {show1 && (
                <StyledUploadButtonBox
                  fileList={budgetFiles}
                  label={'Rehabilitation Budget'}
                  loading={uploadLoading}
                  onDelete={(index) => handledDelete(index, 'budget')}
                  onSuccess={(files) => handledSuccess(files, 'budget')}
                />
              )}

              {show2 && (
                <>
                  <StyledUploadButtonBox
                    fileList={questionnaireFiles}
                    label={'Completed Condominium Questionnaire'}
                    loading={uploadLoading}
                    onDelete={(index) => handledDelete(index, 'questionnaire')}
                    onSuccess={(files) =>
                      handledSuccess(files, 'questionnaire')
                    }
                  />

                  <StyledUploadButtonBox
                    fileList={policyFiles}
                    label={
                      'Copy of Condominium Master Insurance Policy/Certificate'
                    }
                    loading={uploadLoading}
                    onDelete={(index) => handledDelete(index, 'policy')}
                    onSuccess={(files) => handledSuccess(files, 'policy')}
                  />
                </>
              )}

              {show3 && (
                <>
                  <StyledUploadButtonBox
                    fileList={articlesFiles}
                    label={
                      'Certificates of formation/filed articles of organization/incorporation'
                    }
                    loading={uploadLoading}
                    onDelete={(index) => handledDelete(index, 'articles')}
                    onSuccess={(files) => handledSuccess(files, 'articles')}
                  />

                  <StyledUploadButtonBox
                    fileList={lawsFiles}
                    label={'Operating Agreement, Partnership Agreement, Bylaws'}
                    loading={uploadLoading}
                    onDelete={(index) => handledDelete(index, 'laws')}
                    onSuccess={(files) => handledSuccess(files, 'laws')}
                  />

                  <StyledUploadButtonBox
                    fileList={standingFiles}
                    label={
                      'Certificate of Good Standing from State of Organization'
                    }
                    loading={uploadLoading}
                    onDelete={(index) => handledDelete(index, 'standing')}
                    onSuccess={(files) => handledSuccess(files, 'standing')}
                  />
                </>
              )}

              <StyledUploadButtonBox
                fileList={otherFiles}
                label={'Other'}
                loading={uploadLoading}
                onDelete={(index) => handledDelete(index, 'other')}
                onSuccess={(files) => handledSuccess(files, 'other')}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              width={'100%'}
            >
              <StyledButton
                color={'info'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ flex: 1 }}
                variant={'text'}
              >
                Back
              </StyledButton>
              <StyledButton
                disabled={saveLoading}
                loading={saveLoading}
                loadingText={'Saving...'}
                onClick={handledSubmit}
                sx={{ flex: 1 }}
              >
                Save
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
