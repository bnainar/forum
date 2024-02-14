import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export function PostListItem({ postId }: { postId: number }) {
  const [post, setPost] = useState<any>(undefined);

  useEffect(() => {
    axios
      .get("/posts/" + postId, { withCredentials: true })
      .then((res: any) => {
        setPost(res.data);
        console.log("individual post", res.data);
      });
  }, []);
  if (post)
    return (
      <Link to={`/posts/${postId}`} style={{ textDecoration: "none" }}>
        <Card
          style={{
            textDecoration: "none",
            marginTop: "1rem",
            paddingBottom: 1,
          }}
        >
          <CardContent style={{ paddingLeft: 2 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Stack justifyContent="center" alignItems="center" spacing="0">
                <IconButton
                  aria-label="upvote"
                  disabled={post.upvoted}
                  onClick={(e) => {
                    e.preventDefault();
                    axios
                      .post("/vote?post_id=" + post.post.id)
                      .then(console.log);
                    setPost((p: any) => ({
                      ...p,
                      votes: +p.votes + 1,
                      upvoted: true,
                    }));
                  }}
                >
                  <ArrowDropUpIcon fontSize="large" />
                </IconButton>
                <p>{post.votes}</p>
              </Stack>
              <Stack direction="column" spacing={0}>
                <Typography
                  variant="subtitle2"
                  style={{ fontWeight: "lighter" }}
                >
                  Posted by {post.post.author.username}{" "}
                  <Tooltip
                    title={post.post.createdAt}
                    style={{ display: "inline" }}
                  >
                    <span>{dayjs().to(dayjs(post.post.createdAt))}</span>
                  </Tooltip>
                </Typography>
                <Typography variant="h6" style={{ fontWeight: "bolder" }}>
                  {post.post.title}
                </Typography>

                <Typography variant="body1" gutterBottom>
                  {post.post.content}
                </Typography>
                <Typography variant="subtitle2">
                  {post.replies} replies
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Link>
    );
}
