import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import type { Note } from '../../../entities/types/Note.ts'
import { pluralizeNotes } from '../helper/pluralizeNotes.ts'
import { memo } from 'react'
import { NoteListItem } from '../../NoteListItem'

interface Props {
    notes: Note[]
    onSelect: (note: Note) => void
    selectedId?: number
    onAdd: () => void
    searchQuery: string
    onSearchChange: (query: string) => void
}

const NotesListComponent = ({
    notes,
    onSelect,
    selectedId,
    onAdd,
    searchQuery,
    onSearchChange,
}: Props) => {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Заметки
                </Typography>
                <IconButton
                    onClick={onAdd}
                    sx={{
                        backgroundColor: '#007AFF',
                        color: 'white',
                        '&:hover': { backgroundColor: '#0051D5' },
                    }}
                    size="small"
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <TextField
                fullWidth
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                {notes.length} {pluralizeNotes(notes.length)}
            </Typography>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {notes.map((note) => (
                    <NoteListItem
                        key={note.id}
                        note={note}
                        isActive={note.id === selectedId}
                        onClick={() => onSelect(note)}
                    />
                ))}
                {notes.length === 0 && (
                    <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 4 }}
                    >
                        Заметки не найдены
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export const NotesList = memo(NotesListComponent)
