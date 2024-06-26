import { Badge, Box, IconButton, Popover, Typography, useTheme } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import { getAuth, signOut } from "firebase/auth";
import { NotificationContext } from "../../NotificationContext";



const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const colorMode = useContext(ColorModeContext);
  const { setAuthenticated, setUserData } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(NotificationContext);

  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setAuthenticated(false);
      setUserData(null);
      navigate("/login");
    }).catch((error) => {
      console.error("Erro ao sair:", error);
    });
  };

  const dataNavigation = () => {
    navigate("/userData")
  }

  const handleToggleNotifications = (event) => {
    if (notifications.length === 0) return
    
    setAnchorEl(event.currentTarget);
    setNotificationOpen(!isNotificationOpen);

    // notificações está aberta? e o click é para fechar? entao limpa as notificações
    if (isNotificationOpen) {
      setNotifications([]);
    }
  }

  const handleCloseNotifications = () => {
    setAnchorEl(null);
    setNotificationOpen(false);
    setNotifications([]);
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* ICONS */}
      <Box display="flex" width="100%" justifyContent="flex-end">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleToggleNotifications}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <Popover
          open={isNotificationOpen}
          anchorEl={anchorEl}
          onClose={handleCloseNotifications}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {notifications.map(n => <Typography sx={{ p: 2 }}>{n.msg}</Typography>)}
        </Popover>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={dataNavigation}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={logout}>
          <LoginOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
