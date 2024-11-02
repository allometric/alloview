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
    }
  }
})

export default theme;