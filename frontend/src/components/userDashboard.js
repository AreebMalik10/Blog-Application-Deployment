import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa'; // Import FontAwesome icon for close button

const UserDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/all-blogs");
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Explore Our Blogs</h2>
      
      {blogs && blogs.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{blog.title}</h3>
              <p className="text-gray-600 mb-4">{blog.content.slice(0, 120)}...</p>
              <div className="text-right">
                <p className="text-sm text-gray-500">Posted by: {blog.createdBy?.email || 'Unknown'}</p>
                <button 
                  onClick={() => openModal(blog)} 
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No blogs available at the moment</p>
      )}

      {/* Modal for displaying full blog content */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  ariaHideApp={false}
  className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto p-6 relative max-h-screen overflow-y-auto"
>
  {/* Modal Header */}
  <div className="flex items-center justify-between border-b pb-4 sticky top-0 bg-white z-10">
    <h2 className="text-3xl font-bold text-gray-800">{selectedBlog?.title}</h2>
    <button
      onClick={closeModal}
      className="text-gray-500 hover:text-gray-700 transition duration-200 text-2xl"
    >
      <FaTimes />
    </button>
  </div>

  {/* Modal Body */}
  <div className="mt-4 text-gray-700 leading-relaxed space-y-4">
    <p className="text-lg">{selectedBlog?.content}</p>
  </div>

  
</Modal>


    </div>
  );
};

export default UserDashboard;
