import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoginModal from "../modals/LoginModal";
import CampaignIcon from "@mui/icons-material/Campaign";
import SignupModal from "../modals/SignupModal";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <CampaignIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Forum App
          </Typography>
          <LoginModal />
          <SignupModal />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
