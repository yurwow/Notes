import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Note } from '../../../entities/types/Note.ts'
import { NotesLayout } from '../../../widgets/NotesLayout'
import { NotesList } from '../../../widgets/NoteList'
import { NoteEditor } from '../../../widgets/NoteEditor'
import { getInitialNotes, STORAGE_KEY } from '../InitialData/InitialData.ts'

export const NotesPage = () => {
    const [notes, setNotes] = useState<Note[]>(getInitialNotes)
    const [selectedNote, setSelectedNote] = useState<Note | null>(() => {
        const initialNotes = getInitialNotes()
        return initialNotes[0] || null
    })
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
        } catch (error) {
            console.error('Ошибка сохранения заметок:', error)
        }
    }, [notes])

    const filteredNotes = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return notes.filter(
            (note) =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
        )
    }, [notes, searchQuery])

    const handleAddNote = useCallback(() => {
        const newNote: Note = {
            id: Date.now(),
            title: '',
            content: '',
            updatedAt: new Date(),
        }
        setNotes((prev) => [newNote, ...prev])
        setSelectedNote(newNote)
        setSearchQuery('')
    }, [])

    const handleUpdateNote = useCallback(
        (title: string, content: string) => {
            if (!selectedNote) return

            setNotes((prev) =>
                prev.map((note) =>
                    note.id === selectedNote.id
                        ? { ...note, title, content, updatedAt: new Date() }
                        : note
                )
            )
            setSelectedNote((prev) =>
                prev ? { ...prev, title, content, updatedAt: new Date() } : null
            )
        },
        [selectedNote?.id]
    )

    const handleDeleteNote = useCallback(() => {
        setNotes((prev) => {
            const newNotes = prev.filter((note) => note.id !== selectedNote?.id)
            setSelectedNote(newNotes[0] || null)
            return newNotes
        })
    }, [selectedNote?.id])

    return (
        <NotesLayout
            sidebar={
                <NotesList
                    notes={filteredNotes}
                    selectedId={selectedNote?.id}
                    onSelect={setSelectedNote}
                    onAdd={handleAddNote}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            }
            content={
                <NoteEditor
                    note={selectedNote}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                />
            }
        />
    )
}
