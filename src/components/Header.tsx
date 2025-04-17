import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { PlayArrow } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SelectVersion from './SelectVersion';

interface HeaderProps {
  tags: string[];
  selectedVersion: string;
  selectedFormat: string;
  outputFormats: string[];
  requestIsRunning: boolean;
  isFormatSelectionDisabled: boolean;
  githubRepoUrl: string;
  onVersionChange: (newValue: string) => void;
  onFormatChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRunClick: (event: React.FormEvent) => void;
}

function Header({
  tags,
  selectedVersion,
  selectedFormat,
  outputFormats,
  requestIsRunning,
  isFormatSelectionDisabled,
  githubRepoUrl,
  onVersionChange,
  onFormatChange,
  onRunClick,
}: HeaderProps) {
  return (
    <Box sx={{ flexGrow: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <SelectVersion
            tags={tags}
            selectedVersion={selectedVersion}
            onChange={onVersionChange}
            disabled={requestIsRunning}
          />

          <Autocomplete
            id="select-output-format"
            options={outputFormats}
            value={selectedFormat}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                const pseudoEvent = {
                  target: { value: newValue },
                } as React.ChangeEvent<HTMLInputElement>;
                onFormatChange(pseudoEvent);
              }
            }}
            disabled={isFormatSelectionDisabled}
            disableClearable
            autoSelect
            sx={{
              my: 1,
              px: 1,
              width: '250px',
              minWidth: '250px',
              flexGrow: 0,
              flexShrink: 0,
              display: { xs: 'none', sm: 'block' },
              // Add style to prevent list items from wrapping
              '& .MuiAutocomplete-listbox .MuiAutocomplete-option': {
                whiteSpace: 'nowrap',
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Format"
                variant="outlined"
              />
            )}
            ListboxProps={{
              style: { overflowX: 'auto' },
            }}
          />

          <Button
            variant="contained"
            disabled={requestIsRunning}
            onClick={onRunClick}
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
  );
}

export default Header;
