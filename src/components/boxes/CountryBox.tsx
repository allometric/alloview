import {
  useEffect,
  useState,
  FC
} from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Option } from './ModelTypeBox';

interface CountryBoxProps {
  selectedOption: Option | null;
  onChange: (event: React.SyntheticEvent, value: Option | null) => void;
}

const CountryBox: FC<CountryBoxProps> = (props: CountryBoxProps) => {
  const [options, setOptions] = useState<Option[]>([]);  // For storing autocomplete options

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.allometric.org/summary/countries', {
          method: "GET"
        });  // Replace with your API endpoint
        const data = await response.json();

        const formattedData = data.iso.map((iso: string, ix: number) => ({
          id: ix,
          label: iso,
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

export default CountryBox;
