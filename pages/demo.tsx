import { Box } from '@mui/material';
import { useState } from 'react';

import { StyledCheckbox } from '@/components/atoms';

const DemoPage = (): JSX.Element => {
  const [checked, setChecked] = useState(false);

  return (
    <Box sx={{ p: 50, width: 200, border: '1px solid' }}>
      <StyledCheckbox
        checked={checked}
        label={
          "I'm using Material UI kit for React. I'm making Checkboxes dynamically from states and updating them, But I'm getting uncontrolled element error."
        }
        onChange={(e) => setChecked(e.target.checked)}
      />
    </Box>
  );
};

export default DemoPage;
