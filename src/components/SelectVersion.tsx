import * as React from 'react';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material";

export type SelectVersionProps = {
  tags: string[];
  selectedVersion: string;
  onChange: (event: SelectChangeEvent<string>) => any;
};

export default function SelectVersion(props: SelectVersionProps) {
  return (
    <FormControl sx={{ my: 1, px: 1, flexGrow: 1 }}>
      <InputLabel id="version-label">ClickHouse Version</InputLabel>

      <Select
        labelId="version-label"
        id="version-select"
        value={props.selectedVersion}
        onChange={(e) => props.onChange(e)}
        label="ClickHouse version"
      >
        {
          props.tags.map(tag =>
            <MenuItem key={tag} value={tag}>{tag}</MenuItem>
            )
        }
      </Select>
    </FormControl>
  );
}