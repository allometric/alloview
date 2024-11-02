import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          width: '100%',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          border: '1px solid #ddd'
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          textAlign: 'left'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '16px'
        }
      }
    }
  }
})

export default theme;