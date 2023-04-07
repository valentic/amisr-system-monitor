import React from 'react'
import { createRoot } from 'react-dom/client'
import { Program } from './program' 

document.title = import.meta.env.VITE_TITLE

createRoot(document.getElementById('root')).render(<Program />)
