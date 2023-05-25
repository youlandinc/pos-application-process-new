import { FC } from 'react';

import { Box } from '@mui/material';
import { CheckCircleOutlineOutlined } from '@mui/icons-material';

import { POSFlex, POSFont, POSSize } from '@/styles';

const useStyles = {
  '&.listBox': {
    padding: '24px 0',
    borderBottom: '1px solid #C4C4C4',
    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  '& .listTitle': {
    ...POSFont(24, 700, 1.5, 'rgba(0,0,0,.6)'),
    ...POSFlex('center', 'space-between', 'row'),
  },
  '& .listTitleState': {
    ...POSFlex('center', 'space-between', 'row'),
    ...POSFont(12, 400, 1.5, 'rgba(0,0,0,.87)'),
    background: '#F5F8FA',
    borderRadius: 4,
    padding: '8px 16px',
    width: 100,
  },
  '& .circle': {
    flexShrink: 0,
    ...POSSize(10),
    borderRadius: '50%',
    marginRight: 8,
  },
  '& .listItemWrap': {
    width: '100%',
    marginTop: 12,
    transition: 'all .3s',
    color: 'rgba(0,0,0,.6)',
    cursor: 'default',
    '&:hover': {
      color: '#3F81E9',
    },
  },
  '& .listItem': {
    ...POSFlex('center', 'space-between', 'row'),
    whiteSpace: 'break-spaces',
    wordBreak: 'break-word',
  },
};

export interface StatusTreeNode {
  label: string;
  key: string;
  status: boolean;
  parentKey: string;
  children?: StatusTreeNode[];
}

type StatusTreeNodes = StatusTreeNode[];

interface StatusTaskProps {
  data: StatusTreeNodes;
  onItemClick: (item: StatusTreeNode) => void;
}

export const StatusTask: FC<StatusTaskProps> = (props) => {
  const { data, onItemClick } = props;

  return (
    <>
      {data.map((item) => (
        <Box className={'listBox'} key={item.key} sx={useStyles}>
          <Box className={'listTitle'}>
            {item.label}
            <Box className={'listTitleState'}>
              <Box
                bgcolor={item.status ? '#4FBF67' : '#FFAB2B'}
                className={'circle'}
              />
              {item.status ? 'Unfinished' : 'Finished'}
            </Box>
          </Box>
          <Box component={'ul'} width={'100%'}>
            {item?.children?.map((child) => (
              <li
                className={'listItemWrap'}
                key={child.key}
                onClick={() => onItemClick(child)}
              >
                <Box className={'listItem'}>
                  {child.label}
                  {child.status && (
                    <CheckCircleOutlineOutlined style={{ color: '#4FBF67' }} />
                  )}
                </Box>
              </li>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};
