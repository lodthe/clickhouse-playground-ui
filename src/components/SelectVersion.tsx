import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export type SelectVersionProps = {
  tags: string[];
  selectedVersion: string;
  onChange: (newValue: string) => any;
  disabled: boolean;
};

export default function SelectVersion(props: SelectVersionProps) {
  return (
    <Autocomplete
      id='select-clickhouse-version'
      sx={{ my: 1, px: 1, flexGrow: 1, minWidth: '150px' }}
      disableClearable
      autoSelect
      options={props.tags}
      value={props.selectedVersion}
      disabled={props.disabled}
        onChange={(e, newValue) => props.onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label='ClickHouse Version'
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
    />
  );
}