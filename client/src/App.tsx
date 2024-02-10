import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import NavBar from "./components/ui/NavBar";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

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
      <NavBar />
      <div>
        <Button
          onClick={async () => {
            const res = await axios.get("/auth/me", {
              withCredentials: true,
            });
            console.log(res);
          }}
        >
          Test auth
        </Button>
        {ps.map((post: any) => (
          <Link key={post.id} to={"/posts/" + post.id}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {post.content}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export default App;
