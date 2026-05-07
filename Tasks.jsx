import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          {user?.role === 'admin' && (
            <Link
              to="/tasks/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Create Task
            </Link>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-4 py-2 rounded ${
              filter === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('In Progress')}
            className={`px-4 py-2 rounded ${
              filter === 'In Progress' ? 'bg-purple-600 text-white' : 'bg-white text-gray-900'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-4 py-2 rounded ${
              filter === 'Completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-900'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const isOverdue =
                      new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                    return (
                      <tr key={task._id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {task.project?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {task.assignedTo?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${
                              task.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(task.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="text-red-600 ml-2">⚠️ Overdue</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
