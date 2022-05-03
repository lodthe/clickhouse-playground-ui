import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      // main: '#556cd6',
      main: '#fcd004',
    },
    secondary: {
      main: '#556cd6',
      // main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
