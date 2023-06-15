import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  SetStateAction,
} from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { TaskFiles } from '@/types';
import { _deleteTaskFile, _uploadTaskFile } from '@/requests/dashboard';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButtonGroup,
  StyledCheckbox,
  StyledFormItem,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';

interface PaymentSummaryProps {
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
  loanSummary: ReactNode;
  productType?: ProductCategory;
  haveAppraisal: boolean | undefined;
  onHaveAppraisalChange: (event: MouseEvent<HTMLElement>, value: any) => void;
  fileList: TaskFiles[];
  onFileListChange: Dispatch<SetStateAction<TaskFiles[]>>;
  uploadLoading: boolean;
  onUploadLoadingChange: Dispatch<SetStateAction<boolean>>;
}

export const PaymentSummary: FC<PaymentSummaryProps> = ({
  onCheckValueChange,
  check,
  loanSummary,
  //productType,
  haveAppraisal,
  onHaveAppraisalChange,
  fileList,
  onFileListChange,
  uploadLoading = false,
  onUploadLoadingChange,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handledDelete = async (index: number) => {
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: 'appraisalFiles',
        fileUrl: fileList[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(fileList));
      temp.splice(index, 1);
      onFileListChange(temp);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  };

  const handledSuccess = async (files: FileList) => {
    onUploadLoadingChange(true);

    const formData = new FormData();

    formData.append('fieldName', 'appraisalFiles');
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      onFileListChange([...fileList, ...data]);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      onUploadLoadingChange(false);
    }
  };

  return (
    <StyledFormItem gap={6} label={'Confirm your rate'} labelSx={{ m: 0 }}>
      {loanSummary}
      <StyledCheckbox
        checked={check}
        label={
          'I agree to the terms above and would like to confirm this rate.'
        }
        onChange={onCheckValueChange}
      />
      <StyledFormItem
        gap={6}
        label={'Do you have a recent Property Appraisal？'}
        sub
        tip={'Next, fill out your Experience Verification Sheet'}
        tipSx={{ m: 0 }}
      >
        <StyledButtonGroup
          onChange={onHaveAppraisalChange}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={haveAppraisal}
        />
        <Transitions
          style={{
            display: haveAppraisal ? 'block' : 'none',
            width: '100%',
          }}
        >
          {haveAppraisal && (
            <StyledUploadBox
              fileList={fileList}
              loading={uploadLoading}
              onDelete={handledDelete}
              onSuccess={handledSuccess}
            />
          )}
        </Transitions>
      </StyledFormItem>
    </StyledFormItem>
  );
};
