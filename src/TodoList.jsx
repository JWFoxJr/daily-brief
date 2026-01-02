import { useState, useEffect } from 'react'

function TodoList() {
  const [tasks, setTasks] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('dailyBriefTasks')
    try {
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [input, setInput] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem('dailyBriefTasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    if (!input.trim()) return
    setTasks([...tasks, { text: input.trim(), created: Date.now() }])
    setInput('')
  }

  function completeTask(index) {
    const updated = [...tasks]
    updated[index].completed = !updated[index].completed
    setTasks(updated)
  }

  function deleteTask(indexToRemove) {
    setTasks(tasks.filter((_, index) => index !== indexToRemove))
  }

  function moveTaskUp(index) {
    if (index === 0) return
    const newTasks = [...tasks]
    ;[newTasks[index - 1], newTasks[index]] = [
      newTasks[index],
      newTasks[index - 1],
    ]
    setTasks(newTasks)
  }

  function moveTaskDown(index) {
    if (index === tasks.length - 1) return
    const newTasks = [...tasks]
    ;[newTasks[index], newTasks[index + 1]] = [
      newTasks[index + 1],
      newTasks[index],
    ]
    setTasks(newTasks)
  }

  function saveEdit(index) {
    const updated = [...tasks]
    updated[index].text = editText
    setTasks(updated)
    setEditingIndex(null)
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="card-header text-green-500">
        <span>✅</span> Todo List
      </h2>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTask()}
        placeholder="What do you want to do?"
        className="ml-2 text-gray-800 dark:text-gray-800 p-1 rounded border"
      />
      <button onClick={addTask} className="btn ml-2 hover:bg-green-500">
        + Add
      </button>
      <ul>
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2 px-2 pt-2">
            {editingIndex === i ? (
              <>
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit(i)}
                  className="input"
                />
                <button onClick={() => saveEdit(i)} className="ml-4">
                  💾
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <span
                    className={`transition-all ${
                      task.completed
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {task.text}
                  </span>
                  <span className="mx-1 text-gray-500">–</span>
                  <small className="text-gray-500 dark:text-gray-400">
                    {new Date(task.created).toLocaleString()}
                  </small>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => completeTask(i)}>
                    {task.completed ? '✅' : '⬜'}
                  </button>
                  <button onClick={() => deleteTask(i)} className="ml-4">
                    ❌
                  </button>
                  <button
                    onClick={() => {
                      setEditingIndex(i)
                      setEditText(task.text)
                    }}
                    className="ml-2"
                  >
                    ✏️
                  </button>
                  <button onClick={() => moveTaskUp(i)} className=" ml-2">
                    ⬆️
                  </button>
                  <button onClick={() => moveTaskDown(i)} className="ml-2">
                    ⬇️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
