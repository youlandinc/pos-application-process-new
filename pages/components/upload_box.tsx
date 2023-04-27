import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledUploadBox } from '@/components/atoms';

import { _addTaskFile } from '@/requests';
import { useSnackbar } from 'notistack';
import { AUTO_HIDE_DURATION } from '@/constants';

const UploadBoxComponent: FC = () => {
  const router = useRouter();
  const [fileList, setFileList] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const onSuccess = async (files: FileList) => {
    setLoading(true);
    const formData = new FormData();
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    console.log({ files });
    try {
      const { data } = await _addTaskFile(formData, '');
      setFileList([...fileList, ...data]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
    //  files.forEach((item) => {
    //    BROKER_GOVERNMENT_ID.addFile(item);
    //  });
  };

  const onDelete = async (index: number) => {
    // try {
    //  await _deleteUpload(BROKER_GOVERNMENT_ID.taskId, {
    //    url: fileList[index]?.url,
    //  });
    const temp = JSON.parse(JSON.stringify(fileList));
    temp.splice(index, 1);
    setFileList(temp);
    //  BROKER_GOVERNMENT_ID.removeFile(index);
    // } catch (err) {
    //  enqueueSnackbar(err, {
    //    variant: 'error',
    //    autoHideDuration: AUTO_HIDE_DURATION,
    //  });
    // }
  };

  return (
    <Box
      sx={{
        p: 4,
        width: { lg: '50%', xs: '100%' },
        border: '1px solid rgba(145, 158, 171, 0.32)',
        borderRadius: 4,
        '& .component_wrap': {
          '& .divider': {
            my: 2,
          },
          '& .component_item': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '1px 1px 3px 1px rgba(0,0,0,.38)',
            p: 4,
            borderRadius: 4,
          },
        },
      }}
    >
      <StyledButton
        onClick={() => router.back()}
        sx={{
          my: 3,
        }}
        variant={'outlined'}
      >
        back to components
      </StyledButton>

      <Box className={'component_wrap'}>
        <Typography variant={'h4'}>UploadBox</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <StyledUploadBox
            fileList={fileList}
            loading={loading}
            onDelete={onDelete}
            onSuccess={onSuccess}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default UploadBoxComponent;
