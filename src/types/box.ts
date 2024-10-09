export type Option = {
  id: number;
  label: string;
}

export type BoxProps = {
  selectedOption: Option | null;
  onChange: (event: React.SyntheticEvent, value: Option | null) => void;
}