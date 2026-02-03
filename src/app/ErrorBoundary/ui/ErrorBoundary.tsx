import { Component, type ReactNode } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'
import type { ErrorInfo } from 'react-dom/client'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary поймал ошибку:', error, errorInfo)
        this.setState({
            error,
            errorInfo,
        })
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F5F5F7',
                        p: 3,
                    }}
                >
                    <Paper
                        sx={{
                            maxWidth: 600,
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 80,
                                color: '#FF3B30',
                                mb: 2,
                            }}
                        />
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Что-то пошло не так
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Приложение столкнулось с непредвиденной ошибкой.
                            Попробуйте перезагрузить страницу.
                        </Typography>

                        {this.state.error && (
                            <Box
                                sx={{
                                    backgroundColor: '#F2F2F7',
                                    p: 2,
                                    borderRadius: 1,
                                    mb: 3,
                                    textAlign: 'left',
                                    overflow: 'auto',
                                    maxHeight: 200,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    component="pre"
                                    sx={{
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        margin: 0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={this.handleReset}
                            sx={{
                                backgroundColor: '#007AFF',
                                '&:hover': {
                                    backgroundColor: '#0051D5',
                                },
                            }}
                        >
                            Перезагрузить приложение
                        </Button>
                    </Paper>
                </Box>
            )
        }

        return this.props.children
    }
}
