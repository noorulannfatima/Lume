import React from 'react'
import { Editor } from '@tiptap/react'

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
  return (
    <div>MenuBar</div>
  )
}

export default MenuBar