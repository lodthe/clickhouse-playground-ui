import { sql } from '@codemirror/lang-sql';
import { EditorView } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';
import { PlayArrow } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CodeMirror from '@uiw/react-codemirror';
import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import {
  Client, GetQueryRunResponse, GetTagsResponse, RunQueryResponse,
} from './api/PlaygroundAPI';
import { xcodeLight, xcodeLightPatch } from './CodeMirrorTheme';
import SelectVersion from './components/SelectVersion';

const defaultInput = 'CREATE TABLE users (uid Int16, name String, age Int16) ENGINE=Memory;\n\n'
+ "INSERT INTO users VALUES (1231, 'John', 33);\n"
+ "INSERT INTO users VALUES (6666, 'Ksenia', 48);\n"
+ "INSERT INTO users VALUES (8888, 'Alice', 50);\n\n"
+ 'SELECT * FROM users;';

const apiUrl = process.env.REACT_APP_API_URL;
const githubRepoUrl = 'https://github.com/lodthe/clickhouse-playground';

type State = {
  tags: string[];

  selectedVersion: string;
  input: string;
  initialInput: string;

  requestIsRunning: boolean;

  output: string;
  timeElapsed?: string;
};

class App extends React.Component {
  client: Client;

  // eslint-disable-next-line
  state: State = {
    tags: ['latest'],

    selectedVersion: 'latest',
    input: '',
    initialInput: '',

    requestIsRunning: false,
    output: '',
  };

  navigate?: NavigateFunction;

  constructor(props: any) { //eslint-disable-line
    super(props);
    this.navigate = props.navigate; //eslint-disable-line
    this.client = new Client(apiUrl);
  }

  componentDidMount() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'Enter') {
        this.runQuery();
      }
    });

    const matches = location.pathname.match(/\/([a-z\d\-]+)/); //eslint-disable-line
    if (matches) {
      this.getQueryRun(matches[1]);
    } else {
      this.setState({
        input: defaultInput,
        initialInput: defaultInput,
      });
    }

    this.client
      .getTags()
      .then((result: GetTagsResponse) => {
        this.setState({
          tags: result.tags,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private getQueryRun(id: string) {
    this.setState({
      requestIsRunning: true,
      timeElapsed: undefined,
    });

    this.client
      .getQueryRun(id)
      .then((result: GetQueryRunResponse) => {
        this.setState({
          input: result.input,
          initialInput: result.input,
          output: result.output,
          selectedVersion: result.version,
        });
      })
      .catch((error) => {
        console.log(error);

        this.setState({
          input: '',
          output: error.message,
        });
      })
      .finally(() => this.setState({
        requestIsRunning: false,
      }));
  }

  private runQuery() {
    this.setState({
      requestIsRunning: true,
      output: '',
      timeElapsed: undefined,
    });

    const { input, selectedVersion } = this.state;

    this.client
      .runQuery(input, selectedVersion)
      .then((result: RunQueryResponse) => {
        this.setState({
          output: result.output,
          timeElapsed: result.timeElapsed,
        });

        const path = `/${result.queryRunId}`;
        if (this.navigate != null) {
          this.navigate(path);
        }
      })
      .catch((error) => {
        console.log(error);

        this.setState({
          output: error.message,
        });
      })
      .finally(() => this.setState({
        requestIsRunning: false,
      }));
  }

  // eslint-disable-next-line
  private handleQueryFieldChangeRaw(value: string) {
    this.setState({
      input: value,
    });
  }

  private handleSelectedVersionChange(newValue: string) {
    this.setState({
      selectedVersion: newValue,
    });
  }

  private handleRunButtonClick(event: React.FormEvent) {
    event.preventDefault();

    this.runQuery();
  }

  public render() {
    // EditorView.theme()
    return (
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 2 }}>
          <AppBar position="static">
            <Toolbar>
              <SelectVersion
                tags={this.state.tags}
                selectedVersion={this.state.selectedVersion}
                onChange={(e) => this.handleSelectedVersionChange(e)}
                disabled={this.state.requestIsRunning}
              />

              <Button
                variant="contained"
                disabled={this.state.requestIsRunning}
                onClick={(e) => this.handleRunButtonClick(e)}
                sx={{ my: 2, display: 'flex', flexGrow: 1 }}
                color="secondary"
              >
                <PlayArrow fontSize="large" />
                Run query
              </Button>
              <Box sx={{ flexGrow: 5 }} />

              <IconButton
                size="large"
                edge="end"
                color="secondary"
                onClick={() => window.open(githubRepoUrl, '_blank')}
              >
                <GitHubIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>

        <Box height="100%" component="form" sx={{ my: 1 }}>
          <Grid container height="100%" spacing={1}>
            <Grid item xs={12} sm={12} md={6}>
              <CodeMirror
                autoFocus
                theme={xcodeLight}
                value={this.state.initialInput}
                placeholder="Enter SQL queries..."
                height="75vh"
                editable={!this.state.requestIsRunning}
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
                onChange={(value) => this.handleQueryFieldChangeRaw(value)}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <CodeMirror
                theme={xcodeLight}
                value={this.state.output}
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

              <FormHelperText>{this.state.timeElapsed}</FormHelperText>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }
}

function WrappedApp(props: any) { //eslint-disable-line
  return (
    <App {...props} navigate={useNavigate()} />
  );
}

export default WrappedApp;
