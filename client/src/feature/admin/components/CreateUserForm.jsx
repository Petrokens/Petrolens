import { useState, useEffect } from 'react';
import { createUserByAdmin } from '@/services/authService';
import { getRoles } from '@/services/roleService';

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role_id: ''
  });

  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        console.error('Failed to load roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserByAdmin(formData);
      setMessage(`✅ ${res.message}`);
      setFormData({ username: '', email: '', password: '', role_id: '' });
    } catch (err) {
      const msg = err?.response?.data?.error || '❌ Failed to create user';
      setMessage(msg);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-[#1c1d2a] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      {message && (
        <div className="mb-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="e.g. johndoe"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="text"
            name="password"
            placeholder="Strong password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
             Create User
          </button>
        </div>
      </form>
    </div>
  );
}
