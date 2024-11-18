import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For capturing the blog ID from the URL

const BlogDetails = () => {
  const { id } = useParams(); // Capture the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the blog details by ID
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((err) => {
        setError("Error fetching blog details");
        console.error(err);
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!blog) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-lg mb-4">{blog.content}</p>
      <small className="text-sm text-gray-500">Posted by: {blog.createdBy?.email}</small>
    </div>
  );
};

export default BlogDetails;
