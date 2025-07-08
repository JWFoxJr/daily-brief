import { useEffect, useState } from 'react';
import QuoteBox from "./QuoteBox";
import Weather from "./Weather";
import TodoList from "./TodoList";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

const widgetMap = {
  quote: () => <QuoteBox />,
  weather: () => <Weather />,
  todos: () => <TodoList />,
};

const defaultOrder = ['quote', 'weather', 'todos'];

function SortableWidget({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Dynamic colors based on widget ID
  const colorMap = {
    quote: 'bg-yellow-100 dark:bg-yellow-900',
    weather: 'bg-blue-100 dark:bg-blue-900',
    todos: 'bg-green-100 dark:bg-green-900'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full sm:flex-1 sm:min-w-[280px] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md ${colorMap[id]}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mb-2 text-sm text-gray-500 dark:text-gray-400 cursor-grab"
      >
        ⠿ Drag
      </div>
      {children}
    </div>
  );
}
function Dashboard() {
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem('widgetOrder');
    return saved ? JSON.parse(saved) : defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem('widgetOrder', JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = widgetOrder.indexOf(active.id);
      const newIndex = widgetOrder.indexOf(over.id);
      setWidgetOrder(arrayMove(widgetOrder, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={widgetOrder}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between">
          {widgetOrder.map((id) => (
            <SortableWidget key={id} id={id}>
              {widgetMap[id]()} {/* Now it's rendered fresh */}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default Dashboard;