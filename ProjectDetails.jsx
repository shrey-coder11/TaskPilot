import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setAddingMember(true);

    try {
      if (!email) {
        setError('Please provide an email');
        setAddingMember(false);
        return;
      }

      const response = await axiosInstance.put(`/projects/${id}/add-member`, { email });
      setProject(response.data);
      setEmail('');
      setSuccessMessage('Member added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/projects')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Projects
        </button>

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="text-sm text-gray-500">
            <p>Created by: {project.createdBy?.name}</p>
            <p>Created on: {new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Add Member Section - Admin Only */}
        {user?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Member</h2>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md bg-green-50 p-4 mb-4">
                <p className="text-sm font-medium text-green-600">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleAddMember} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter member email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                disabled={addingMember}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
              >
                {addingMember ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>
        )}

        {/* Members List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {project.members && project.members.length > 0 ? (
              project.members.map((member) => (
                <div key={member._id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {member.role}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">No members yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
