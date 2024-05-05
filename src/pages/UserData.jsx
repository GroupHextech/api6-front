import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import BaseLayout from "../layouts/BaseLayout";
import { useContext } from "react";
import { AuthContext } from "../services/authContext";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { firestore, storage } from "../services/firebaseConfig";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import TypingEffect from "../components/TypingFunc/Typing";

export default function UserData() {
  const { userData, currentUser } = useContext(AuthContext);

  const [emailTermAccepted, setEmailTermAccepted] = useState(userData.termOfEmail);
  const [smsTermAccepted, setSmsTermAccepted] = useState(userData.termOfSms);
  const [useTermAccepted, setUseTermAccepted] = useState(userData.useTerm);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [audio, setAudio] = useState(null); 
  const [musicUrl, setMusicUrl] = useState(null); 
  
  const texts = [
    "Obrigado Mineda",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    updateTermsInFirestore("termOfEmail", emailTermAccepted);
    updateTermsInFirestore("termOfSms", smsTermAccepted);
    updateTermsInFirestore("useTerm", useTermAccepted);

    if (userData.name === "Mineda") {
      playMusicFromStorage();
    }
  }, [emailTermAccepted, smsTermAccepted, useTermAccepted, userData]);

  const getTermStatus = (term) => {
    return term ? "Accepted" : "Unaccepted";
  };

  const updateTermsInFirestore = async (termName, newValue) => {
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        [termName]: newValue,
      });
    } catch (error) {
      console.error("Erro ao atualizar termos:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await deleteDoc(userRef);
      await deleteUser(currentUser);
      navigate("/login")
    } catch (error) {
      console.error("Erro ao excluir a conta do usuário:", error);
    }
  };

  const playMusicFromStorage = async () => {
    try {
      const musicStorageRef = ref(storage, 'musica.mp3');
      const url = await getDownloadURL(musicStorageRef);
      setMusicUrl(url); 
    } catch (error) {
      console.error("Erro ao reproduzir a música:", error);
    }
  };

  useEffect(() => {
    if (musicUrl) {
      const audioElement = new Audio(musicUrl); 
      setAudio(audioElement); 
      audioElement.play(); 
    }
  }, [musicUrl]);

  return (
    <Box style={{}}>
      <Box
        style={{
          flex: 0.8,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginRight: 20,
        }}
      >
        <div>
          <Paper
            sx={{
              marginLeft: 3,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <h1 style={{ textAlign: "center" }}>Your Data</h1>
          </Paper>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginLeft: 3,
              justifyContent:"center",
              alignItems:"center",
              gap:2,
            }}
          >
            <img
              alt="profile-user"
              width="200px"
              height="200px"
              src={userData.foto}
              style={{ borderRadius: "50%" }}
            />
            {userData.name === "Mineda" && (
              <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
                <TypingEffect texts={texts}/>
              </Paper>
            )}
            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Name :</div>
              <div>{userData.name}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Email :</div>
              <div>{userData.email}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Employ Identification :</div>
              <div>{userData.employId}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Department :</div>
              <div>{userData.department}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Job Title :</div>
              <div>{userData.jobTitle}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Phone :</div>
              <div>{userData.phone}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>User Role :</div>
              <div>{userData.role}</div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Term Email :</div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={emailTermAccepted}
                      onChange={(event) => {
                        const newValue = event.target.checked;
                        setEmailTermAccepted(newValue);
                        updateTermsInFirestore("termOfEmail", newValue);
                      }}
                      color="default"
                    />
                  }
                />
              </div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Sms Term :</div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={smsTermAccepted}
                      onChange={(event) => {
                        const newValue = event.target.checked;
                        setSmsTermAccepted(newValue);
                        updateTermsInFirestore("termOfSms", newValue);
                      }}
                      color="default"
                    />
                  }
                />
              </div>
            </Paper>

            <Paper style={{padding:4,display:"flex", justifyContent:"space-between", width:"40%"}}>
              <div>Use Term :</div>
              <div>{getTermStatus(userData.useTerm)}</div>
              
              {userData.role === "USER" && (
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowConfirmationDialog(true)}
              >
                Edit
              </Button>
              )}
            </Paper>
            <ConfirmationDialog
              open={showConfirmationDialog}
              onClose={() => setShowConfirmationDialog(false)}
              onConfirm={handleDeleteAccount}
              title="Delete account"
              content="Please note that failure to comply with the terms of use may result in the deletion of your account, along with all associated data. (A deletion request will be sent to the administrator)"
            />
            {userData.role === "USER" && (
            <Paper style={{padding:4,display:"flex", justifyContent:"center", width:"40%"}}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowConfirmationDialog(true)}
              >
                Delete Account
              </Button>
            </Paper>
            )}
            <ConfirmationDialog
              open={showConfirmationDialog}
              onClose={() => setShowConfirmationDialog(false)}
              onConfirm={handleDeleteAccount}
              title="Delete account"
              content="This action result in the deletion of your account along with all associated data. (A deletion request will be sent to the administrator)"
            />
          </Paper>
        </div>
      </Box>
    </Box>
  );
}
