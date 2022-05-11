import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export type SelectVersionProps = {
  tags: string[];
  selectedVersion: string;
  onChange: (newValue: string) => void;
  disabled: boolean;
};

export default function SelectVersion(props: SelectVersionProps) {
  const {
    tags, selectedVersion, disabled, onChange,
  } = props;

  return (
    <Autocomplete
      id="select-clickhouse-version"
      sx={{
        my: 1, px: 1, flexGrow: 1, minWidth: '150px',
      }}
      disableClearable
      autoSelect
      options={tags}
      value={selectedVersion}
      disabled={disabled}
      onChange={(e, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="ClickHouse Version"
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
    />
  );
}
