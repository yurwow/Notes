export const pluralizeNotes = (count: number) => {
    const mod10 = count % 10
    const mod100 = count % 100

    if (mod100 >= 11 && mod100 <= 14) return 'заметок'
    if (mod10 === 1) return 'заметка'
    if (mod10 >= 2 && mod10 <= 4) return 'заметки'
    return 'заметок'
}
