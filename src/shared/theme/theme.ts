import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F5F5F7',
            paper: '#FFFFFF',
        },
        primary: {
            main: '#007AFF',
        },
        text: {
            primary: '#1C1C1E',
            secondary: '#6E6E73',
        },
    },
    typography: {
        fontFamily: `'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        h6: {
            fontWeight: 600,
        },
        body1: {
            fontSize: 15,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                },
            },
        },
    },
})
