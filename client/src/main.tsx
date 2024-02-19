import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import axios, { AxiosError } from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PostPage } from "./components/post/PostPage.tsx";
import { Root } from "./components/Root.tsx";
import toast, { Toaster } from "react-hot-toast";
import { SearchPage } from "./components/SearchPage.tsx";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
axios.defaults.baseURL = "https://localhost/api";
axios.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err?.response?.status === 401) toast.error("You are not logged in!");
  }
);
const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <App />,
      },

      {
        path: "/about",
        element: <div>About</div>,
      },
      {
        path: "/posts/:postId",
        element: <PostPage />,
      },
      { path: "/search", element: <SearchPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
