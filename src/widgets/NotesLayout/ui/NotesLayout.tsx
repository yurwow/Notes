import { Box, Paper } from '@mui/material'
import { memo, type ReactNode } from 'react'

interface Props {
    sidebar: ReactNode
    content: ReactNode
}

const NotesLayoutComponent = ({ sidebar, content }: Props) => {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                backgroundColor: '#F5F5F7',
                p: 2,
                gap: 2,
            }}
        >
            <Paper
                sx={{
                    width: 320,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {sidebar}
            </Paper>

            {content}
        </Box>
    )
}

export const NotesLayout = memo(NotesLayoutComponent)
