// import { FC, useEffect, useMemo, useState } from 'react';
// import { Stack } from '@mui/material';
// import { useRouter } from 'next/router';
// import { useSnackbar } from 'notistack';
//
// import { observer } from 'mobx-react-lite';
// import { getSnapshot } from 'mobx-state-tree';
// import { useMst } from '@/models/Root';
//
// import { HttpError, TaskFiles, UserType } from '@/types';
// import { _addTaskFile, _completePipelineTask, _deleteUpload } from '@/requests';
// import { AUTO_HIDE_DURATION } from '@/constants';
//
// import {
//   StyledButton,
//   StyledFormItem,
//   StyledUploadBox,
// } from '@/components/atoms';
//
// export const PipelineLicense: FC = observer(() => {
//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();
//
//   const {
//     userType,
//     pipelineTask: { pipelineInitialized, formData },
//   } = useMst();
//
//   const { BROKER_LICENSE, LENDER_LICENSE } = formData;
//
//   const [fileList, setFileList] = useState<TaskFiles[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
//
//   const computedLicense = useMemo(() => {
//     switch (userType) {
//       case UserType.BROKER: {
//         return {
//           label: "Broker's license (optional)",
//           license: BROKER_LICENSE,
//           name: 'broker',
//         };
//       }
//       case UserType.LENDER: {
//         return {
//           label: "Lender's license (optional)",
//           license: LENDER_LICENSE,
//           name: 'lender',
//         };
//       }
//       default: {
//         return {
//           label: '',
//           license: null,
//           name: '',
//         };
//       }
//     }
//   }, [BROKER_LICENSE, LENDER_LICENSE, userType]);
//
//   useEffect(
//     () => {
//       if (!pipelineInitialized) {
//         return;
//       }
//       setFileList(getSnapshot(computedLicense.license?.taskForm?.taskFiles));
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [pipelineInitialized],
//   );
//
//   const onSuccess = async (files: FileList) => {
//     setUploadLoading(true);
//
//     try {
//       const formData = new FormData();
//       Array.from(files, (item) => {
//         formData.append('files', item);
//       });
//       const { data } = await _addTaskFile(
//         formData,
//         computedLicense.license.taskId,
//       );
//       setFileList([...fileList, ...data]);
//       data.forEach((item) => {
//         computedLicense.license.addFile(item);
//       });
//     } catch (err) {
//       const { header, message, variant } = err as HttpError;
//       enqueueSnackbar(message, {
//         variant: variant || 'error',
//         autoHideDuration: AUTO_HIDE_DURATION,
//         isSimple: !header,
//         header,
//       });
//     } finally {
//       setUploadLoading(false);
//     }
//   };
//
//   const onDelete = async (index: number) => {
//     try {
//       await _deleteUpload(computedLicense.license.taskId, {
//         url: fileList[index]?.url,
//       });
//       const temp = JSON.parse(JSON.stringify(fileList));
//       temp.splice(index, 1);
//       setFileList(temp);
//       computedLicense.license.removeFile(index);
//     } catch (err) {
//       const { header, message, variant } = err as HttpError;
//       enqueueSnackbar(message, {
//         variant: variant || 'error',
//         autoHideDuration: AUTO_HIDE_DURATION,
//         isSimple: !header,
//         header,
//       });
//     }
//   };
//
//   const handledCompleteTaskAndBackToSummary = async () => {
//     setLoading(true);
//     const data = computedLicense.license.getPostData();
//     try {
//       await _completePipelineTask(data);
//       setLoading(false);
//       await router.push('/pipeline/profile');
//     } catch (err) {
//       const { header, message, variant } = err as HttpError;
//       enqueueSnackbar(message, {
//         variant: variant || 'error',
//         autoHideDuration: AUTO_HIDE_DURATION,
//         isSimple: !header,
//         header,
//       });
//       setLoading(false);
//     }
//   };
//
//   return (
//     <Stack alignItems={'center'} justifyContent={'center'}>
//       <StyledFormItem
//         label={computedLicense.label}
//         sx={{ width: '100%' }}
//         tip={
//           "If you're looking to broker bridge loans, please upload your license for each respective state here."
//         }
//       >
//         <Stack alignItems={'center'} gap={3} width={'100%'}>
//           <Stack width={'100%'}>
//             <StyledUploadBox
//               fileList={fileList || []}
//               loading={uploadLoading || loading}
//               onDelete={onDelete}
//               onSuccess={onSuccess}
//             />
//           </Stack>
//
//           <Stack
//             alignItems={'center'}
//             flexDirection={{ sx: 'column', lg: 'row' }}
//             gap={3}
//             justifyContent={'center'}
//             mt={{ lg: 3, xs: 0 }}
//             width={{ lg: 600, xs: '100%' }}
//           >
//             <StyledButton
//               color={'info'}
//               onClick={() => router.back()}
//               sx={{ flex: 1, width: '100%', order: { xs: 2, lg: 1 } }}
//               variant={'text'}
//             >
//               Back
//             </StyledButton>
//             <StyledButton
//               color={'primary'}
//               disabled={fileList.length <= 0 || loading || uploadLoading}
//               loading={loading}
//               loadingText={'Saving...'}
//               onClick={() => handledCompleteTaskAndBackToSummary()}
//               sx={{ flex: 1, width: '100%', order: { xs: 1, lg: 2 } }}
//             >
//               Save
//             </StyledButton>
//           </Stack>
//         </Stack>
//       </StyledFormItem>
//     </Stack>
//   );
// });
