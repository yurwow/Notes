import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { FontFamily } from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
    Box,
    IconButton,
    Divider,
    Select,
    MenuItem,
    Tooltip,
} from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import ImageIcon from '@mui/icons-material/Image'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import { memo, useEffect } from 'react'
import { TextStyle } from '@tiptap/extension-text-style/text-style'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

const RichTextEditorComponent = ({
    content,
    onChange,
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            TextStyle,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
            },
        },
    })

    useEffect(() => {
        if (!editor) return

        const handleClick = (event: Event) => {
            const target = event.target as HTMLElement
            if (target.tagName === 'IMG') {
                const confirmDelete = window.confirm('Удалить это изображение?')
                if (confirmDelete) {
                    const imgElement = target as HTMLImageElement
                    const { state } = editor
                    let imagePos = -1

                    state.doc.descendants((node, pos) => {
                        if (node.type.name === 'image') {
                            const nodeSrc = node.attrs.src
                            if (nodeSrc === imgElement.src) {
                                imagePos = pos
                                return false
                            }
                        }
                    })

                    if (imagePos !== -1) {
                        editor
                            .chain()
                            .focus()
                            .deleteRange({ from: imagePos, to: imagePos + 1 })
                            .run()
                    }
                }
            }
        }

        const editorElement = document.querySelector('.ProseMirror')
        editorElement?.addEventListener('click', handleClick as EventListener)

        return () => {
            editorElement?.removeEventListener(
                'click',
                handleClick as EventListener
            )
        }
    }, [editor])

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    const uploadImage = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const url = event.target?.result as string
                    editor.chain().focus().setImage({ src: url }).run()
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    p: 1,
                    backgroundColor: '#F5F5F7',
                    borderRadius: 1,
                    mb: 2,
                    alignItems: 'center',
                }}
            >
                <Select
                    size="small"
                    value={
                        editor.isActive('heading', { level: 1 })
                            ? 'h1'
                            : editor.isActive('heading', { level: 2 })
                              ? 'h2'
                              : editor.isActive('heading', { level: 3 })
                                ? 'h3'
                                : 'p'
                    }
                    onChange={(e) => {
                        const value = e.target.value
                        if (value === 'p') {
                            editor.chain().focus().setParagraph().run()
                        } else {
                            const level = parseInt(value.replace('h', '')) as
                                | 1
                                | 2
                                | 3
                            editor.chain().focus().setHeading({ level }).run()
                        }
                    }}
                    sx={{ minWidth: 100 }}
                >
                    <MenuItem value="p">Обычный</MenuItem>
                    <MenuItem value="h1">Заголовок 1</MenuItem>
                    <MenuItem value="h2">Заголовок 2</MenuItem>
                    <MenuItem value="h3">Заголовок 3</MenuItem>
                </Select>

                <Select
                    size="small"
                    value={
                        editor.getAttributes('textStyle').fontFamily ||
                        'default'
                    }
                    onChange={(e) => {
                        const value = e.target.value
                        if (value === 'default') {
                            editor.chain().focus().unsetFontFamily().run()
                        } else {
                            editor.chain().focus().setFontFamily(value).run()
                        }
                    }}
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="default">По умолчанию</MenuItem>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Georgia">Georgia</MenuItem>
                    <MenuItem value="'Courier New'">Courier New</MenuItem>
                    <MenuItem value="'Times New Roman'">
                        Times New Roman
                    </MenuItem>
                    <MenuItem value="Verdana">Verdana</MenuItem>
                </Select>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                <Tooltip title="Жирный (Ctrl+B)">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        sx={{
                            backgroundColor: editor.isActive('bold')
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatBoldIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Курсив (Ctrl+I)">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        sx={{
                            backgroundColor: editor.isActive('italic')
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatItalicIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Подчеркнутый (Ctrl+U)">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        sx={{
                            backgroundColor: editor.isActive('underline')
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatUnderlinedIcon />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                <Tooltip title="По левому краю">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().setTextAlign('left').run()
                        }
                        sx={{
                            backgroundColor: editor.isActive({
                                textAlign: 'left',
                            })
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatAlignLeftIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="По центру">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().setTextAlign('center').run()
                        }
                        sx={{
                            backgroundColor: editor.isActive({
                                textAlign: 'center',
                            })
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatAlignCenterIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="По правому краю">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().setTextAlign('right').run()
                        }
                        sx={{
                            backgroundColor: editor.isActive({
                                textAlign: 'right',
                            })
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatAlignRightIcon />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                <Tooltip title="Маркированный список">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        sx={{
                            backgroundColor: editor.isActive('bulletList')
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatListBulletedIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Нумерованный список">
                    <IconButton
                        size="small"
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        sx={{
                            backgroundColor: editor.isActive('orderedList')
                                ? '#E5E5EA'
                                : 'transparent',
                        }}
                    >
                        <FormatListNumberedIcon />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {/* Вставка изображения */}
                <Tooltip title="Вставить изображение">
                    <IconButton size="small" onClick={uploadImage}>
                        <ImageIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box
                sx={{
                    '& .ProseMirror': {
                        minHeight: '400px',
                        outline: 'none',
                        padding: 2,
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                opacity: 0.8,
                                boxShadow: '0 0 0 2px #007AFF',
                            },
                        },
                        '& p': {
                            margin: '0.5em 0',
                        },
                        '& h1': {
                            fontSize: '2em',
                            fontWeight: 'bold',
                            margin: '0.67em 0',
                        },
                        '& h2': {
                            fontSize: '1.5em',
                            fontWeight: 'bold',
                            margin: '0.75em 0',
                        },
                        '& h3': {
                            fontSize: '1.17em',
                            fontWeight: 'bold',
                            margin: '0.83em 0',
                        },
                        '& ul, & ol': {
                            paddingLeft: '2em',
                        },
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Box>
        </Box>
    )
}

export const RichTextEditor = memo(RichTextEditorComponent)
