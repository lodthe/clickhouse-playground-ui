import * as React from 'react';
// import { useEffect, useRef } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { PlayArrow } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import IconButton from '@mui/material/IconButton';
import CodeMirror from '@uiw/react-codemirror';
// import { useCodeMirror } from "@uiw/react-codemirror";
import { EditorView } from '@codemirror/view';
import { sql } from '@codemirror/lang-sql';
import * as themes from '@uiw/codemirror-themes-all';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import SelectVersion from './components/SelectVersion';
import {
  Client, GetTagsResponse, RunQueryResponse, GetQueryRunResponse,
} from './api/PlaygroundAPI';

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
    // const editor = useRef();
    // const { setContainer } = useCodeMirror({
    //   container: editor.current,
    //   theme: themes.xcodeLight,
    //   placeholder: 'Enter SQL queries...',
    //   value: this.state.initialInput,
    //   height: '75vh',
    //   editable: !this.state.requestIsRunning,
    //   extensions: [
    //     EditorView.lineWrapping,
    //     sql(),
    //   ],
    //   basicSetup: {
    //     lineNumbers: true,
    //     foldGutter: false,
    //     indentOnInput: false,
    //     autocompletion: false,
    //     highlightActiveLine: false,
    //   },
    //   onChange: (value) => this.handleQueryFieldChangeRaw(value),
    // });

    // useEffect(() => {
    //   if (editor.current) {
    //     setContainer(editor.current);
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [editor.current]);
    // return <div ref={editor} />;

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
          <Grid container height="100%" spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <CodeMirror
                autoFocus
                theme={themes.xcodeLight}
                value={this.state.initialInput}
                placeholder="Enter SQL queries..."
                height="75vh"
                editable={!this.state.requestIsRunning}
                extensions={[
                  EditorView.lineWrapping,
                  sql(),
                ]}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  indentOnInput: false,
                  autocompletion: false,
                  highlightActiveLine: false,
                }}
                onChange={(value) => this.handleQueryFieldChangeRaw(value)}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <CodeMirror
                value={`${this.state.output}\n\nTime elapsed: ${this.state.timeElapsed}`}
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  dropCursor: true,
                  indentOnInput: false,
                  highlightActiveLine: false,
                }}
                height="75vh"
                extensions={[EditorView.lineWrapping]}
                readOnly
              />
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
