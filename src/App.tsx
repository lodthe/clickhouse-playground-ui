import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { PlayArrow } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';
import {
  useNavigate, NavigateFunction
} from 'react-router-dom';
import SelectVersion from './components/SelectVersion';
import { Client, GetTagsResponse, RunQueryResponse, GetQueryRunResponse } from './api/PlaygroundAPI'

const defaultInput = 'CREATE TABLE users (uid Int16, name String, age Int16) ENGINE=Memory;\n\n\
INSERT INTO users VALUES (1231, \'John\', 33);\n\
INSERT INTO users VALUES (6666, \'Ksenia\', 48);\n\
INSERT INTO users VALUES (8888, \'Alice\', 50);\n\n\
SELECT * FROM users;';

const textAreaRows = 15;
const apiUrl = process.env.REACT_APP_API_URL

type State = {
  tags: string[];

  selectedVersion: string;
  input: string;

  requestIsRunning: boolean;

  queryRunId?: string;
  output: string;
  timeElapsed?: string;
};

class App extends React.Component {
  client: Client;

  state: State = {
    tags: ['latest'],

    selectedVersion: 'latest',
    input: '',

    requestIsRunning: false,
    output: '',
  };

  navigate?: NavigateFunction;

  constructor(props: any) {
    super(props);
    this.navigate = props.navigate;
    this.client = new Client(apiUrl);
  }

  componentDidMount() {
    const matches = location.pathname.match(/\/([a-z\d\-]+)/);
    if (matches) {
      this.getQueryRun(matches[1]);
    } else {
      this.setState({
        input: defaultInput,
      })
    }

    this.client.getTags()
      .then((result: GetTagsResponse) => {
        this.setState({
          tags: result.tags,
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  private runQuery() {
    this.setState({
      requestIsRunning: true,
      output: '',
      queryRunId: undefined,
      timeElapsed: undefined,
    });

    this.client.runQuery(this.state.input, this.state.selectedVersion)
      .then((result: RunQueryResponse) => {
        this.setState({
          output: result.output,
          timeElapsed: result.timeElapsed,
          queryRunId: result.queryRunId,
        });

        let path = '/' + result.queryRunId;
        if (this.navigate != null) {
          this.navigate(path);
        }
      })
      .catch((error: any) => {
        console.log(error);

        this.setState({
          output: error.message,
        });
      })
      .finally(() =>
        this.setState({
          requestIsRunning: false,
        })
      );
  }

  private getQueryRun(id: string) {
    this.setState({
      requestIsRunning: true,
      timeElapsed: undefined,
    });

    this.client.getQueryRun(id)
      .then((result: GetQueryRunResponse) => {
        this.setState({
          input: result.input,
          output: result.output,
        });
      })
      .catch((error: any) => {
        console.log(error);

        this.setState({
          input: '',
          output: error.message,
        });
      })
      .finally(() =>
        this.setState({
          requestIsRunning: false,
        })
      );
  }

  private handleQueryFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    event.preventDefault();

    this.setState({
      input: event.target.value,
    });
  }

  private handleSelectedVersionChange(event: SelectChangeEvent<string>) {
    event.preventDefault();

    this.setState({
      selectedVersion: event.target.value,
    });
  }

  private handleRunButtonClick(event: React.FormEvent) {
    event.preventDefault();

    this.runQuery();
  }


  public render() {
    return (
      <Container maxWidth='xl'>
        <Box sx={{ flexGrow: 2 }}>
          <AppBar position='static'>
            <Toolbar>
              <SelectVersion
                tags={this.state.tags}
                selectedVersion={this.state.selectedVersion}
                onChange={(e) => this.handleSelectedVersionChange(e)}
              />

              <Button
                variant='contained'
                disabled={this.state.requestIsRunning}
                onClick={(e) => this.handleRunButtonClick(e)}
                sx={{ my: 2, display: 'flex', flexGrow: 1 }}
                color='secondary'
              >
                <PlayArrow fontSize='large'></PlayArrow>
                Run query
              </Button>
              <Box sx={{ flexGrow: 6 }} />
            </Toolbar>
          </AppBar>
        </Box>

        <Box component='form' sx={{ my: 1 }} >
          <Grid container>
            <TextField
              margin='normal'
              multiline
              rows={textAreaRows}
              required
              id='query'
              label='Query'
              name='query'
              value={this.state.input}
              disabled={this.state.requestIsRunning}
              onChange={(e) => this.handleQueryFieldChange(e)}
              autoFocus
              sx={{ flexGrow: 1 }}
            />

            <FormControl sx={{ flexGrow: 1 }}>
              <TextField
                margin='normal'
                multiline
                rows={textAreaRows}
                fullWidth
                name='output'
                label='Output'
                id='output'
                value={this.state.output}
                inputProps={
                  { readOnly: true, }
                }
              />
              <FormHelperText color='red'>{this.state.timeElapsed}</FormHelperText>
            </FormControl>
          </Grid>
        </Box>
      </Container>
    );
  }
}

function WrappedApp(props: any) {
  return (
    <App {...props} navigate={useNavigate()} />
  );
};

export default WrappedApp;
