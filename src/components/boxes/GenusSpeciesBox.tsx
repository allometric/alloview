import {
  FC,
  useState,
  useEffect
 } from "react";
import { Autocomplete, TextField } from '@mui/material';
import { BoxProps } from "../../types/box";
import { Option } from "../../types/box";

const concat_genus_species = (genus_arr: string[], species_arr: string[]) => {
  const n = genus_arr.length
  const out: Option[] = []

  for(let i = 0; i < n; i++) {
    out.push({
      id: i,
      label: genus_arr[i] + ' ' + species_arr[i]
    })
  }

  return out
}

const GenusSpeciesBox: FC<BoxProps> = (props: BoxProps) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.allometric.org/summary/genus_species', {
          method: "GET"
        }); 
        const data = await response.json();
        const formattedData = concat_genus_species(data.genus, data.species);

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
      renderInput={(params) => <TextField {...params} label="Species" variant="outlined" />}
      isOptionEqualToValue={(option, value) => option.id === value?.id}  // Ensure proper matching
    />
  );
}

export default GenusSpeciesBox;