import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Kanban.css'; // Add styles for better visuals

const COLUMN_TITLES = ['to pend', 'pending', 'done'];

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          return;
        }
        const response = await axios.get('http://localhost:3112/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setError('Invalid response from server');
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Error fetching tasks');
      }
    };

    fetchTasks();
  }, []);

  const getTasksByStatus = (tasks) => {
    const tasksByStatus = COLUMN_TITLES.reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {});

    tasks.forEach((task) => {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task);
      } else {
        console.warn(`Unmatched status: ${task.status}`);
      }
    });

    return tasksByStatus;
  };

  const tasksByStatus = getTasksByStatus(tasks);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId; // Update the status of the task

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3112/api/tasks/${movedTask.id}`, { status: movedTask.status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      updatedTasks.splice(destination.index, 0, movedTask);
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Error updating task status');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {COLUMN_TITLES.map((status) => (
          <StrictModeDroppable droppableId={status} key={status}>
            {(provided, snapshot) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>{status.toUpperCase()}</h2>
                {(tasksByStatus[status] || []).map((task, index) => (
                  <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        className="kanban-task"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {(tasksByStatus[status] || []).length === 0 && (
                  <div className="kanban-task-placeholder">No tasks</div>
                )}
              </div>
            )}
          </StrictModeDroppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default MyTasks;
