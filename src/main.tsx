import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MyPostsPage from "./pages/MyPostPage";
import MainLayout from "./layouts/MainLayout";
import EditPostPage from "./pages/EditPostPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage />, errorElement: <ErrorPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/post/create",
            element: <CreatePostPage />,
          },
          {
            path: "/myposts",
            element: <MyPostsPage />,
          },
          {
            path: "/myposts/:id",
            element: <EditPostPage />,
          },
        ],
      },

      { path: "/post/:postId", element: <PostPage /> },
    ],
  },

  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
