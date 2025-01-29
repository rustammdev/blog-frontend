import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.lazydev.uz/api/v1/blog/user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Ma'lumotlarni yuklab bo'lmadi");
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

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(
        `https://api.lazydev.uz/api/v1/blog/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Postni o'chirishda xatolik");
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setShowDeleteModal(false);
      setSelectedPostId(null);
    }
  };

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Мои сообщения</h1>

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
            Сообщения не найдены.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4 flex-grow">{post.summary}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">👤</span>
                    {post.author.username}
                  </div>

                  <div className="mt-auto flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2 bg-red-500 cursor-pointer   text-white rounded hover:bg-red-600 w-1/2"
                    >
                      Удалить
                    </button>
                    <Link
                      to={`/myposts/${post.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-1/2 text-center"
                    >
                      Редактировать
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Удалить пост</h3>
              <p className="mb-4">Вы уверены, что хотите удалить этот пост?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPostId(null);
                  }}
                  className="px-4 py-2 bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600"
                >
                  Отмена
                </button>
                <button
                  onClick={() => selectedPostId && handleDelete(selectedPostId)}
                  className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
