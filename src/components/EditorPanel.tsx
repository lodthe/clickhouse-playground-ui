import * as React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorView } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { xcodeLight, xcodeLightPatch } from '../CodeMirrorTheme';

interface EditorPanelProps {
  initialInput: string;
  output: string;
  timeElapsed?: string;
  requestIsRunning: boolean;
  onInputChange: (value: string) => void;
}

function EditorPanel({
  initialInput,
  output,
  timeElapsed,
  requestIsRunning,
  onInputChange,
}: EditorPanelProps) {
  return (
    <Box height="100%" component="form" sx={{ my: 1, mt: 2 }}>
      <Grid container height="100%" spacing={1}>
        <Grid item xs={12} sm={12} md={6}>
          <CodeMirror
            autoFocus
            theme={xcodeLight}
            value={initialInput}
            placeholder="Enter SQL queries..."
            height="75vh"
            editable={!requestIsRunning}
            extensions={[
              xcodeLightPatch,
              EditorView.lineWrapping,
              autocompletion({
                icons: false,
              }),
              sql({
                upperCaseKeywords: true,
              }),
            ]}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              indentOnInput: false,
              autocompletion: true,
              highlightActiveLine: false,
            }}
            onChange={onInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <CodeMirror
            theme={xcodeLight}
            value={output}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              dropCursor: true,
              indentOnInput: false,
              highlightActiveLine: false,
            }}
            height="75vh"
            extensions={[
              xcodeLightPatch,
              EditorView.lineWrapping,
            ]}
            readOnly
          />
          {timeElapsed && <FormHelperText>{timeElapsed}</FormHelperText>}
        </Grid>
      </Grid>
    </Box>
  );
}

EditorPanel.defaultProps = {
  timeElapsed: undefined,
};

export default EditorPanel;
