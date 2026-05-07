import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axiosInstance.delete(`/projects/${projectId}`);
        setProjects(projects.filter((project) => project._id !== projectId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          {user?.role === 'admin' && (
            <Link
              to="/projects/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Create Project
            </Link>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium">Created by: {project.createdBy?.name}</p>
                    <p className="text-xs text-gray-500">Members: {project.members?.length || 0}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center"
                    >
                      View
                    </Link>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
