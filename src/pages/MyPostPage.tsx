import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/blog/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Ma'lumotlarni yuklab bo'lmadi");
        }

        const result: Post[] = await response.json();
        setPosts(result);
      } catch (error: any) {
        setError(error.message || "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mening Postlarim
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            Hech qanday post topilmadi
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4">{post.summary}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👤</span>
                    {post.author.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
