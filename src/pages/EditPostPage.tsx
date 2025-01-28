import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PostData {
  title: string;
  summary: string;
  content: string;
}

interface PostUpdateData {
  title: string;
  summary: string;
  content: string;
}

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData>({
    title: "",
    summary: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://api.lazydev.uz/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Postni yuklab bo'lmadi");
        }

        const data = await response.json();
        if (!data.title || !data.content || !data.summary) {
          throw new Error("Post ma'lumotlari to'liq emas");
        }

        setPost({
          title: data.title,
          summary: data.summary,
          content: data.content,
        });
      } catch (error: any) {
        setError(error.message);
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && accessToken) {
      fetchPost();
    }
  }, [id, accessToken]);

  const handleContentChange = useCallback((value: string) => {
    setPost((prev) => ({ ...prev, content: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: PostUpdateData = {
      title: post.title,
      summary: post.summary,
      content: post.content,
    };

    try {
      const response = await fetch(`https://api.lazydev.uz/api/v1/blog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Yangilashda xatolik yuz berdi");
      }

      navigate("/myposts");
    } catch (error: any) {
      setError(error.message);
      console.error("Update error:", error);
    }
  };

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Postni Tahrirlash</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Краткое содержание
            </label>
            <textarea
              value={post.summary}
              onChange={(e) => setPost({ ...post, summary: e.target.value })}
              className="w-full p-2 border rounded h-24"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Основное содержание
            </label>
            <ReactQuill
              theme="snow"
              value={post.content}
              onChange={handleContentChange}
              modules={modules}
              className="h-64 mb-12"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Обновлять
          </button>
        </form>
      </div>
    </div>
  );
}
