import { useState, useEffect, memo } from 'react'
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Note } from '../../../entities/types/Note'
import { RichTextEditor } from '../../RichTextEditor'

interface Props {
    note: Note | null
    onUpdate: (title: string, content: string) => void
    onDelete: () => void
}

const NoteEditorComponent = ({ note, onUpdate, onDelete }: Props) => {
    const [title, setTitle] = useState(note?.title || '')
    const [content, setContent] = useState(note?.content || '')

    useEffect(() => {
        setTitle(note?.title || '')
        setContent(note?.content || '')
    }, [note?.id])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (note && (title !== note.title || content !== note.content)) {
                onUpdate(title, content)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [title, content])

    if (!note) {
        return (
            <Paper
                sx={{
                    flexGrow: 1,
                    p: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography color="text.secondary">
                    Выберите заметку или создайте новую
                </Typography>
            </Paper>
        )
    }

    return (
        <Paper
            sx={{
                flexGrow: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
            }}
        >
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
                <Typography variant="caption" color="text.secondary">
                    Последнее изменение:{' '}
                    {new Date(note.updatedAt).toLocaleString('ru-RU')}
                </Typography>
                <IconButton onClick={onDelete} size="small" color="error">
                    <DeleteIcon />
                </IconButton>
            </Box>

            <TextField
                fullWidth
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="standard"
                sx={{
                    mb: 2,
                    '& .MuiInput-input': {
                        fontSize: '1.5rem',
                        fontWeight: 600,
                    },
                }}
                InputProps={{
                    disableUnderline: true,
                }}
            />

            <Divider sx={{ mb: 2 }} />

            <RichTextEditor content={content} onChange={setContent} />
        </Paper>
    )
}

export const NoteEditor = memo(NoteEditorComponent)
