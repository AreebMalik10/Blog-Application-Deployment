import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const navigate = useNavigate();

  // Fetch Blogs from the server
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const response = await axios.get('https://blog-application-39aq.onrender.com/api/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`  // Include the token in the request headers
          }
        });
        setBlogs(response.data); // Save fetched blogs in state
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  // Create Blog
  const createBlog = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const newBlog = { title, content };
      await axios.post('https://blog-application-39aq.onrender.com/api/blogs', newBlog, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the request headers
        }
      });
      setTitle('');
      setContent('');
      alert("Blog created successfully!");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  // Edit Blog
  const editBlog = (blog) => {
    setIsEditing(true);
    setCurrentBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
  };

  // Update Blog
  const updateBlog = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      await axios.put(`https://blog-application-39aq.onrender.com/api/blogs/${currentBlog._id}`, { title, content }, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the request headers
        }
      });
      setIsEditing(false);
      setTitle('');
      setContent('');
      alert("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  // Delete Blog
  const deleteBlog = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      await axios.delete(`https://blog-application-39aq.onrender.com/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the request headers
        }
      });
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate('/admin');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Display Admin Email */}
      <div className="mb-6 text-lg">
        <strong>Admin Email: </strong> {email}
      </div>

      {/* Create/Update Blog Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Update Blog' : 'Create New Blog'}</h3>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded-md"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-4 p-2 border rounded-md"
          rows="4"
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          onClick={isEditing ? updateBlog : createBlog}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>

      {/* Blog List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Manage Blogs</h3>
        <ul>
          {blogs.map((blog) => (
            <li key={blog._id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold">{blog.title}</h4>
                  <p className="text-gray-600">{blog.content.substring(0, 100)}...</p>
                </div>
                <div>
                  <button
                    onClick={() => editBlog(blog)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
