import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import './App.css'

interface Task {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [text, setText] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      try {
        setTasks(JSON.parse(stored) as Task[])
      } catch {
        setTasks([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const newTask: Task = { id: Date.now(), text, completed: false }
    setTasks((prev) => [...prev, newTask])
    setText('')
  }

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const suggestTask = async () => {
    setLoadingAI(true)
    try {
      const resp = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Give me one short to-do item.' }),
      })
      if (!resp.ok) throw new Error('AI request failed')
      const data = (await resp.json()) as { text?: string }
      const suggestion = data.text?.trim()
      if (suggestion) setText(suggestion)
    } catch (err) {
      console.error(err)
      alert('AI suggestion failed')
    } finally {
      setLoadingAI(false)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const completedCount = tasks.filter((task) => task.completed).length
  const points = completedCount * 10

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ToDo List
      </Typography>
      <Typography>ポイント: {points}</Typography>
      <Typography>
        完了: {completedCount} / {tasks.length}
      </Typography>

      <Box component="form" onSubmit={addTask} sx={{ mt: 2, mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
            placeholder="タスクを追加"
            size="small"
          />
          <Button type="submit" variant="contained">
            追加
          </Button>
          <Button variant="outlined" onClick={suggestTask} disabled={loadingAI}>
            AI
          </Button>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          onClick={() => setFilter('all')}
        >
          すべて
        </Button>
        <Button
          variant={filter === 'active' ? 'contained' : 'outlined'}
          onClick={() => setFilter('active')}
        >
          未完了
        </Button>
        <Button
          variant={filter === 'completed' ? 'contained' : 'outlined'}
          onClick={() => setFilter('completed')}
        >
          完了済み
        </Button>
      </Stack>

      <List>
        {filteredTasks.map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <ListItemText
              primary={task.text}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            />
          </ListItem>
        ))}
      </List>

      {completedCount > 0 && (
        <Button variant="outlined" color="error" onClick={clearCompleted}>
          完了を一括削除
        </Button>
      )}
    </Container>
  )
}

export default App

