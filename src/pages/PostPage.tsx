import { useParams } from "react-router-dom";

export default function PostPage() {
  const param = useParams<{ postId: string }>();
  console.log(param.postId);
  return <div>PostPage {param.postId}</div>;
}
