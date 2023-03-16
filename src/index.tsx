import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import WrappedApp from './App';
import theme from './theme';

const config: Partial<PostHogConfig> = {
  // eslint-disable-next-line
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST!!,
  persistence: 'localStorage',
  disable_session_recording: true,
  mask_all_text: true,
  disable_cookie: true,
  ip: true,
};

ReactDOM.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
      options={config}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <WrappedApp />
        </BrowserRouter>
      </ThemeProvider>
    </PostHogProvider>
  </React.StrictMode>,
  document.querySelector('#root'),
);
