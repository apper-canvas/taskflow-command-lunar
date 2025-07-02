import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TaskModal from "@/components/organisms/TaskModal";
import Sidebar from "@/components/organisms/Sidebar";
import TaskList from "@/components/organisms/TaskList";
import Header from "@/components/organisms/Header";
import { templateService } from "@/services/api/templateService";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";
const TasksPage = ({ onRegisterKeyboardActions }) => {
  // Keyboard shortcut handlers
const handleKeyboardShortcuts = useCallback((e) => {
    // Don't trigger shortcuts if user is typing in an input
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      handleAddTask();
      toast.info('Opening new task form...');
    }
    
if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      // For simplicity, we'll show a message about selecting a task
      // In a real app, you'd track the selected task
      toast.info('Select a task first, then use Ctrl+D to delete it');
    }
  }, []);

  useEffect(() => {
    if (onRegisterKeyboardActions) {
      onRegisterKeyboardActions({ handleKeyboard: handleKeyboardShortcuts });
    }
  }, [handleKeyboardShortcuts, onRegisterKeyboardActions]);
// Data state
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // Loading and error states
  const [tasksLoading, setTasksLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  
  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFormRef, setTaskFormRef] = useState(null);
  
  // URL params
  const { categoryId, priority } = useParams();
  // Load initial data
  const loadTasks = useCallback(async () => {
    try {
      setTasksLoading(true)
      setTasksError(null)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (error) {
      setTasksError(error.message)
      toast.error('Failed to load tasks')
    } finally {
      setTasksLoading(false)
    }
}, []);

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

const loadTemplates = useCallback(async () => {
    try {
      setTemplatesLoading(true);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  // Filter tasks based on URL params and search
useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === parseInt(categoryId));
    }
    
    // Filter by priority
    if (priority) {
      filtered = filtered.filter(task => task.priority === priority);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, categoryId, priority, searchQuery]);

  // Load data on mount
  useEffect(() => {
    loadTasks();
    loadCategories();
    loadTemplates();
  }, [loadTasks, loadCategories, loadTemplates]);

  // Task operations
const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ));
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.info('Task reopened');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

// Modal handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = (taskData) => {
    if (editingTask) {
      return handleUpdateTask(taskData);
    } else {
      return handleCreateTask(taskData);
    }
  };

// Template handlers
  const handleApplyTemplate = (template) => {
    if (taskFormRef && taskFormRef.applyTemplate) {
      taskFormRef.applyTemplate(template);
      toast.success('Template applied successfully!');
    }
  };

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 min-h-screen">
          <Sidebar
            categories={categories}
            categoriesLoading={categoriesLoading}
            className="min-h-screen"
          />
        </div>
<div className="flex-1 min-h-screen">
          <Header
            onAddTask={handleAddTask}
            onSearch={handleSearch}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
          />
          
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <TaskList
                tasks={filteredTasks}
                categories={categories}
                loading={tasksLoading}
                error={tasksError}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRetry={loadTasks}
              />
            </div>
          </main>
        </div>
      </div>

{/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        categories={categories}
        task={editingTask}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
};
export default TasksPage;