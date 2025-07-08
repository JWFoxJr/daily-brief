import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function QuoteBox() {
  const [quote, setQuote] = useState('');
  const [key, setKey] = useState(0); // used to force animation on new quotes

  function loadQuote() {
    fetch('http://api.quotable.io/random')
      .then(res => res.json())
      .then(data => {
        const newQuote = `${data.content} - ${data.author}`;
        localStorage.setItem('dailyQuote', newQuote);
        setQuote(newQuote);
        setKey(prev => prev + 1);
      })
      .catch(() => setQuote('Error fetching quote.'));
  }
  
  useEffect(() => {
    const saved = localStorage.getItem('dailyQuote');
    if (saved) {
      setQuote(saved);
    } else {
      loadQuote();
    }
    }, []);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
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
                className="italic"
              >
                {quote}
              </motion.blockquote>
            </AnimatePresence>
      )}

      <button
        onClick={loadQuote}
        className="mt-2 px-2 py-1 border rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800"
      >
        🔁 New Quote
      </button>
    </div>
  );
}

export default QuoteBox;