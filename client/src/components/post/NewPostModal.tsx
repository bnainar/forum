import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export default function NewPostModal() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        sx={fabStyle}
        onClick={handleClickOpen}
      >
        <AddIcon sx={{ mr: 1 }} />
        Create Post
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson);
            try {
              const res = await axios.post("/posts", formJson);
              navigate("/posts/" + res.data.id);
            } catch (error) {
              console.log("new post failed", error);
              toast.error("Failed to create post");
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            style={{ marginBottom: "1rem" }}
            variant="outlined"
          />
          <TextField
            label="Post body"
            id="content"
            name="content"
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
