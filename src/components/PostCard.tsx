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

  // Fake taglar uchun massiv
  const fakeTags = [
    "Cooking",
    "Lifestyle",
    "Quick Recipe",
    "Comfort Food",
    "Homemade",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/blog");
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg mx-4 my-8">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
        <p className="text-gray-500 text-sm">
          Showing {posts?.totalPosts} posts • {posts?.totalPages} pages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.data.map((post) => {
          // Har bir post uchun random 2 tag
          const randomTags = [...fakeTags]
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

          return (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="mb-4">
                  {/* Taglar */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {randomTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium">{post.author.username}</span>
                    <span className="text-gray-300">•</span>
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
