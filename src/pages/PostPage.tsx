import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://13.60.184.232:5000/api/v1/blog/${postId}`
        );
        const result: Post = await response.json();
        setPost(result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

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

  if (!post) return <div>Сообщение не найдено</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Orqaga link */}
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Barcha postlarga qaytish
        </Link>
      </div>

      {/* Sarlavha va metadata */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span className="font-medium text-gray-700">
            {post.author.username}
          </span>
          <span className="text-gray-300">•</span>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="text-gray-300">•</span>
          <span>5 минут на чтение</span>
        </div>
      </header>

      {/* Qisqacha ma'lumot */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <p className="text-gray-700 italic">{post.summary}</p>
      </div>

      {/* Asosiy kontent */}
      <article className="prose max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Pastki separator */}
      <div className="border-t pt-8 mt-8">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Список всех сообщений
        </Link>
      </div>
    </div>
  );
}
