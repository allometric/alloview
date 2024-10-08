import {
  useEffect,
  useState,
  FC
} from 'react';
import { Autocomplete, TextField } from '@mui/material';

export interface Option {
  id: number;
  label: string;
}

interface ModelTypeBoxProps {
  selectedOption: Option | null;
  onChange: (event: React.SyntheticEvent, value: Option | null) => void;
}

const ModelTypeBox: FC<ModelTypeBoxProps> = (props: ModelTypeBoxProps) => {
  const [options, setOptions] = useState<Option[]>([]);  // For storing autocomplete options

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.allometric.org/summary/distinct', {
          method: "GET"
        });  // Replace with your API endpoint
        const data = await response.json();

        const formattedData = data.model_type.map((model_type: string, ix: number) => ({
          id: ix,
          label: model_type,
        }));
        setOptions(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Autocomplete
      value={props.selectedOption}
      onChange={props.onChange}  // Handle selection
      options={options}  // Options from API
      getOptionLabel={(option) => option.label}  // How to display each option
      renderInput={(params) => <TextField {...params} label="Select an Option" variant="outlined" />}
      isOptionEqualToValue={(option, value) => option.id === value?.id}  // Ensure proper matching
    />
  );
};

export default ModelTypeBox;
