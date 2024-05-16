import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { AuthContext } from "../../services/authContext";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"; // Importe as funções necessárias para fazer upload de arquivos
import { storage, firestore } from "../../services/firebaseConfig"; // Importe a instância do Firebase Storage e do Firestore
import { useEffect } from "react";
import { doc, updateDoc } from "@firebase/firestore";

// ICONS:
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';






const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Home");
  const { userData , currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userFoto, setUserFoto] = useState("");
  const [progressPorcent, setProgressPorcent] = useState(0);

  useEffect(() => {
    if (userData) {
      setUserName(userData.name);
      setUserRole(userData.role);
      setUserFoto(userData.foto);
    }
  }, [userData]);

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profile_photos/${currentUser.uid}`); // Caminho onde a imagem será armazenada
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressPorcent(progress);
      },
      (error) => {
        console.error("Erro ao fazer upload da foto do perfil:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Atualiza a foto do perfil no Firestore
          const userRef = doc(firestore, "users", currentUser.uid);
          updateDoc(userRef, {
            foto: downloadURL
          }).then(() => {
            // Atualiza o estado da foto do perfil no componente
            setUserFoto(downloadURL);
          }).catch((error) => {
            console.error("Erro ao atualizar a foto do perfil no Firestore:", error);
          });
        });
      }
    );
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <div>
                    <img src="../../assets/dino-icon.svg" width={"22px"} />{" "}
                    <span style={{ fontSize: 18, fontFamily: "Bungee" }}>
                      Hex
                    </span>
                    <span style={{ fontSize: 18, fontFamily: "Varela Round" }}>
                      Analytics
                    </span>
                  </div>
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <label htmlFor="profile-photo-input">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={userFoto}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </label>
                <input
                  type="file"
                  id="profile-photo-input"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfilePhotoUpload}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userName}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {userRole}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Map"
              to="/map"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          {userRole === "ADMIN" && ( 
            <Item
              title="Management"
              to="/manege"
              icon={<HandymanOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
