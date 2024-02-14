import axios from "axios";
import { useEffect, useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

export function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<any>();
  const [replies, setReplies] = useState<any>([]);
  useEffect(() => {
    axios.get("/posts/" + postId, { withCredentials: true }).then((res) => {
      setPost(res?.data);
      console.log(res.data);
    });
    axios
      .get("/reply/post/" + postId, { withCredentials: true })
      .then((res) => {
        setReplies(res?.data);
        console.log(res.data);
      });
  }, []);
  if (post)
    return (
      <>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Stack justifyContent="center" alignItems="center" spacing="0">
            <IconButton
              aria-label="upvote"
              disabled={post.upvoted}
              onClick={() => {
                axios.post("/vote?post_id=" + post.post.id).then(console.log);
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
          <Stack direction="column">
            <Typography variant="body2" gutterBottom>
              Posted by {post.post.author.username}{" "}
              <Tooltip
                title={post.post.createdAt}
                style={{ display: "inline" }}
              >
                <span>{dayjs().to(dayjs(post.post.createdAt))}</span>
              </Tooltip>
            </Typography>
            <Typography variant="h2" gutterBottom>
              {post.post.title}
            </Typography>

            <Typography variant="body1" gutterBottom>
              {post.post.content}
            </Typography>
            <p>{post.replies} replies</p>
          </Stack>
        </Stack>
        <Container style={{ padding: "1rem 2rem" }}>
          <form
            onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              formJson.parentId = postId;
              console.log(formJson);
              const { data } = await axios.post("/reply", formJson);
              setReplies([...replies, data]);
              setPost((p: any) => ({
                ...p,
                replies: +p.replies + 1,
              }));
              toast.success("Added reply");
            }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-end"
              spacing={2}
            >
              <TextField
                label="Add a Reply"
                id="content"
                name="content"
                multiline
                rows={3}
                fullWidth
                onSubmit={(f) => console.log(f)}
              />
              <Button variant="outlined" type="submit">
                Submit Reply
              </Button>
            </Stack>
          </form>
          {replies.map((reply: any) => (
            <li key={reply.id}>{reply.content}</li>
          ))}
        </Container>
      </>
    );
}
