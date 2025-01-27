import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Interface'lar
interface Author {
  username: string;
}

interface Post {
  id: number;
  title: string;
  createdAt: string;
  summary: string;
  author: Author;
}

interface ApiResponse {
  page: number;
  limit: number;
  totalPosts: number;
  totalPages: number;
  data: Post[];
}

export default function PostCard() {
  const [posts, setPosts] = useState<ApiResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/blog"); // API endpoint

        const result: ApiResponse = await response.json();
        setPosts(result);
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

  return (
    <div>
      <h1>PostCards</h1>
      <p>
        TotalPost: {posts?.totalPosts}, TotalPages: {posts?.totalPages}
      </p>
      {posts?.data.map((post) => (
        <Link
          to={`/post/${post.id}`}
          key={post.id}
          className="flex flex-col border p-2 m-2"
        >
          <div>
            {post.title}
            <div className="flex gap-x-1.5">
              <span className="text-zinc-400">{post.author.username}</span>
              <span>{post.createdAt}</span>
            </div>
          </div>

          <div>{post.summary}</div>
        </Link>
      ))}
    </div>
  );
}
