import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function QuoteBox() {
  const [quote, setQuote] = useState('')
  const [key, setKey] = useState(0) // used to force animation on new quotes

  function loadQuote() {
    fetch('http://api.quotable.io/random')
      .then(res => res.json())
      .then(data => {
        const newQuote = `${data.content} - ${data.author}`
        localStorage.setItem('dailyQuote', newQuote)
        setQuote(newQuote)
        setKey(prev => prev + 1)
      })
      .catch(() => setQuote('Error fetching quote.'))
  }

  useEffect(() => {
    const saved = localStorage.getItem('dailyQuote')
    if (saved) {
      setQuote(saved)
    } else {
      loadQuote()
    }
  }, [])

  return (
    <div className="p-4 sm:p-6">
      <h2 className="card-header text-teal-500">
        <span>💬</span> Quote of the Day
      </h2>
      {quote && (
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="italic py-4"
          >
            {quote}
          </motion.blockquote>
        </AnimatePresence>
      )}

      <button onClick={loadQuote} className="btn hover:bg-teal-500">
        🔁 New Quote
      </button>
    </div>
  )
}

export default QuoteBox
