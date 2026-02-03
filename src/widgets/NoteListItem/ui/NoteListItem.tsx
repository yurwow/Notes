import { Paper, Typography } from '@mui/material'
import type { Note } from '../../../entities/types/Note.ts'
import { formatDate } from '../helper/formatDate.ts'
import { stripHtml } from '../helper/stripHtml.ts'
import { memo } from 'react'

interface Props {
    note: Note
    isActive: boolean
    onClick: () => void
}

const NoteListItemComponent = ({ note, isActive, onClick }: Props) => {
    return (
        <Paper
            onClick={onClick}
            elevation={0}
            sx={{
                p: 2,
                mb: 1,
                cursor: 'pointer',
                backgroundColor: isActive ? '#E5E5EA' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                    backgroundColor: isActive ? '#E5E5EA' : '#F2F2F7',
                },
            }}
        >
            <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                {note.title || 'Без названия'}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 0.5,
                }}
            >
                {stripHtml(note.content) || 'Нет содержимого'}
            </Typography>
            <Typography variant="caption" color="text.disabled">
                {formatDate(note.updatedAt)}
            </Typography>
        </Paper>
    )
}

export const NoteListItem = memo(NoteListItemComponent)
