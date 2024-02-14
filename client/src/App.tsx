import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PostListItem } from "./components/post/PostListItem";

function App() {
  const [ps, setP] = useState<any[]>([]);
  useEffect(() => {
    axios.get("/posts", { withCredentials: true }).then((res) => {
      setP(res.data);
      console.log(res.data);
    });
  }, []);
  return (
    <>
      <Button
        onClick={async () => {
          try {
            const res = await axios.get("/auth/me", {
              withCredentials: true,
            });
            res?.data?.userId &&
              toast.success("You are logged in as " + res.data.userId);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        Test auth
      </Button>
      {ps.map((post: any) => (
        <PostListItem postId={post.id} key={post.id} />
      ))}
    </>
  );
}

export default App;
