import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 0
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingLeft: 0
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 26
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '16px'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '16px'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px'
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          fontSize: '12px',  // Font size for the input part of Autocomplete
        },
        option: {
          fontSize: '12px',  // Font size for each option in the dropdown
        },
      },
    },
  }
})

export default theme;