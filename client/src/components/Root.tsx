import { Outlet } from "react-router-dom";
import NavBar from "./ui/NavBar";
import { Container } from "@mui/material";

export function Root() {
  return (
    <>
      <NavBar />
      <Container maxWidth="sm" style={{ paddingTop: "1rem" }}>
        <Outlet />
      </Container>
    </>
  );
}
