import type { Note } from '../../../entities/types/Note.ts'

export const STORAGE_KEY = 'notes-app-data'

export const getInitialNotes = (): Note[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            const parsed = JSON.parse(saved)
            return parsed.map((note: any) => ({
                ...note,
                updatedAt: new Date(note.updatedAt),
            }))
        }
    } catch (error) {
        console.error('Ошибка загрузки заметок:', error)
    }

    return [
        {
            id: 1,
            title: 'Первая заметка',
            content: 'Привет мир!',
            updatedAt: String(new Date()),
        },
        {
            id: 2,
            title: 'Вторая заметка',
            content: 'Стильные заметки Notes',
            updatedAt: new Date(Date.now() - 86400000),
        },
        {
            id: 3,
            title: 'Список дел',
            content: 'Купить молоко\nСделать домашку\nПогулять с собакой',
            updatedAt: new Date(Date.now() - 172800000),
        }
    ]
}
