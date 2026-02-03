import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import { theme } from '../../../shared/theme/theme.ts'
import type { ReactNode } from 'react'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
