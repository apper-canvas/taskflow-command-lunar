import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import TasksPage from '@/components/pages/TasksPage'
import KeyboardShortcutGuide from '@/components/organisms/KeyboardShortcutGuide'

function App() {
  const [isShortcutGuideOpen, setIsShortcutGuideOpen] = useState(false)
  const [keyboardActions, setKeyboardActions] = useState({})

  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl + ? for help
      if (e.ctrlKey && e.key === '?') {
        e.preventDefault()
        setIsShortcutGuideOpen(true)
        return
      }

      // Pass other shortcuts to active page
      if (keyboardActions.handleKeyboard) {
        keyboardActions.handleKeyboard(e)
      }
    }

    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [keyboardActions])
return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout onShowShortcuts={() => setIsShortcutGuideOpen(true)} />}>
          <Route index element={<TasksPage onRegisterKeyboardActions={setKeyboardActions} />} />
          <Route path="category/:categoryId" element={<TasksPage onRegisterKeyboardActions={setKeyboardActions} />} />
          <Route path="priority/:priority" element={<TasksPage onRegisterKeyboardActions={setKeyboardActions} />} />
        </Route>
      </Routes>
<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      
      <KeyboardShortcutGuide
        isOpen={isShortcutGuideOpen}
        onClose={() => setIsShortcutGuideOpen(false)}
      />
    </div>
  )
}

export default App