import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
interface Post {
  id: number;
  title: string;
  createdAt: string;
  summary: string;
  content: string;
  author: {
    username: string;
  };
}

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  // error and loading
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/blog/${postId}`
        ); // API endpoint

        const result: Post = await response.json();
        setPost(result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found.</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>
        <strong>Author:</strong> {post.author.username}
      </p>
      <p>
        <strong>Created:</strong> {new Date(post.createdAt).toLocaleString()}
      </p>
      <p>{post.summary}</p>

      {/* HTML content */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
