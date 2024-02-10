import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./ui/NavBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useParams } from "react-router-dom";
import { IconButton, Stack, Typography } from "@mui/material";

export function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<any>();
  useEffect(() => {
    axios.get("/posts/" + postId, { withCredentials: true }).then((res) => {
      setPost(res.data);
      console.log(res.data);
    });
  }, []);
  if (!post)
    return (
      <>
        <NavBar /> <p>Loading...</p>
      </>
    );
  return (
    <>
      <NavBar />
      <Stack direction="row" spacing={2}>
        <Stack>
          <IconButton
            aria-label="upvote"
            disabled={post.upvoted}
            onClick={() => {
              axios.post("/vote?post_id=" + post.post.id).then(console.log);
              setPost((p: any) => ({
                ...p,
                votes: p.votes + 1,
                upvoted: true,
              }));
            }}
          >
            <ArrowDropUpIcon />
          </IconButton>
          <p>{post.votes}</p>
        </Stack>
        <Typography variant="h2" gutterBottom>
          {post.post.title}
        </Typography>
      </Stack>
      <Typography variant="body1" gutterBottom>
        {post.post.content}
      </Typography>
      <p>{post.replies} replies</p>
    </>
  );
}
