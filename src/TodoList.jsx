import { useState, useEffect } from 'react';

function TodoList () {
  const [tasks, setTasks] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('dailyBriefTasks');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }    
  });
  
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  
  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem('dailyBriefTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  function addTask() {
    if (!input.trim()) return;
    setTasks([...tasks, { text: input.trim(), created: Date.now() }]);
    setInput('');
  }
  
  function deleteTask(indexToRemove) {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  }
  
  function moveTaskUp(index) {
    if (index === 0) return;
    const newTasks = [...tasks];
    [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
    setTasks(newTasks);
  }
  
  function moveTaskDown(index) {
    if (index === tasks.length - 1) return;
    const newTasks = [...tasks];
    [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    setTasks(newTasks)
  }
  
  function saveEdit(index) {
    const updated = [...tasks];
    updated[index].text = editText;
    setTasks(updated);
    setEditingIndex(null);
  }
  
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
        <span>✅</span> Todo List
      </h2>
    <input
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && addTask()}
      placeholder="What do you want to do?"
    />
    <button onClick={addTask} style={{ marginLeft: '0.5em' }} className="px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800 border">+ Add</button>
    <ul>
    {tasks.map((task, i) => (
      <li key={i}>
      {editingIndex === i ? (
        <>
        <input
        value={editText}
        onChange={e => setEditText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && saveEdit(i)}
        />
        <button onClick={() => saveEdit(i)}>💾</button>
        </>
      ) : (
        <>
        {task.text} - <small>{new Date(task.created).toLocaleString()}</small>
        <button onClick={() => deleteTask(i)} style={{ marginLeft: '1rem' }}>
        ❌
        </button>
        <button onClick={() => { setEditingIndex(i); setEditText(task.text); }}>✏️</button>
        <button onClick={() => moveTaskUp(i)}>⬆️</button>
        <button onClick={() => moveTaskDown(i)}>⬇️</button>
        </>
      )}
      </li>
    ))}
    </ul>
    </div>
  );
}

export default TodoList;