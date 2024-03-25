import { Box, Stack, SxProps, Tab, Tabs } from '@mui/material';
import React, { FC, PropsWithChildren, ReactNode, useState } from 'react';

type TabPanelProps = {
  index: number;
  value: number;
  sx?: SxProps;
};

type StyledTabProps = {
  tabsData: {
    label: string;
    content: ReactNode;
  }[];
  sx?: SxProps;
};

export const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const { children, value, index, ...other } = props;

  return (
    <Box hidden={value !== index} {...other}>
      {value === index && children}
    </Box>
  );
};

export const StyledTab: FC<StyledTabProps> = (props) => {
  const { tabsData, sx } = props;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <Tabs
        onChange={handleChange}
        scrollButtons={false}
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            p: 1.25,
            fontSize: 16,
          },
          '& .MuiTabs-flexContainer .MuiButtonBase-root': {
            p: 0,
            minWidth: 0,
            minHeight: 0,
            mr: 8,
            mb: 1.25,
            fontWeight: 600,
          },
          mb: 3,
          minHeight: 0,
          ...sx,
        }}
        value={value}
        variant={'scrollable'}
      >
        {tabsData.map((item, index) => (
          <Tab key={index} label={item.label} />
        ))}
      </Tabs>
      {tabsData.map((item, index) => (
        <TabPanel index={index} key={index} sx={{ flex: 1 }} value={value}>
          {item.content}
        </TabPanel>
      ))}
    </Stack>
  );
};
