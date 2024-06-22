import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TypingEffect from "../components/TypingFunc/Typing";
import earthVideo from '../../public/assets/earth.mp4';
import ConfirmationDialog from "../components/ConfirmationDialog";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, orderBy, limit, updateDoc } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";
import { AuthContext } from "../services/authContext";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "@firebase/auth";

export default function Home() {
  const texts = [
    "Welcome to HexAnalytics.",
    "Your platform for data analysis.",
  ];

  const { userData ,setUserData,currentUser } = React.useContext(AuthContext);
  const [showTermsModal, setShowTermsModal] = React.useState(false);
  const [latestTerms, setLatestTerms] = React.useState([]);
  const [acceptedTerms, setAcceptedTerms] = React.useState({});
  const [showDeleteFieldsDialog, setShowDeleteFieldsDialog] = React.useState(false);
  

  const navigate = useNavigate();

  React.useEffect(() => {
    async function checkTerms() {
      try {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const acceptedTermsList = userData.terms || [];

        // Obter a versão mais recente da coleção VersaoTermo
        const latestVersionQuery = query(collection(firestore, "VersaoTermo"), orderBy("version", "desc"), limit(1));
        const latestVersionSnapshot = await getDocs(latestVersionQuery);
        const latestVersionDoc = latestVersionSnapshot.docs[0];
        const latestVersion = latestVersionDoc.data().version;

        // Obter todos os termos da versão mais recente
        const latestTermsList = latestVersionDoc.data().terms;

        setLatestTerms(latestTermsList);

        // Verificar se o usuário já aceitou a versão mais recente dos termos
        if (!userData.version || userData.version.number !== latestVersion) {
          setShowTermsModal(true);
        } else {
          setShowTermsModal(false);
        }
      } catch (error) {
        console.error("Erro ao verificar termos:", error);
      }
    }

    checkTerms();
  }, [currentUser]);

  const handleAcceptTerms = async () => {
    try {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const currentTerms = userData.terms || [];
  
      const latestVersionQuery = query(collection(firestore, "VersaoTermo"), orderBy("version", "desc"), limit(1));
      const latestVersionSnapshot = await getDocs(latestVersionQuery);
      const latestVersionDoc = latestVersionSnapshot.docs[0];
      const latestVersion = latestVersionDoc.data().version;
      const latestTermsList = latestVersionDoc.data().terms;
  
      const latestTermsAccepted = latestTermsList.map(term => ({
        id: term.id,
        type: term.type,
        version: latestVersion,
        accepted: term.type === "USO" || acceptedTerms[term.id] || false,
        timestamp: new Date(),
      }));
  
      const newAcceptedTerms = [
        ...currentTerms,
        { version: latestVersion, terms: latestTermsAccepted },
      ];
  
      await updateDoc(userDocRef, {
        terms: newAcceptedTerms,
        version: { number: latestVersion },
      });
  
      // Atualiza o estado local de userData com os novos dados do usuário
      const updatedUserDocSnapshot = await getDoc(userDocRef);
      const updatedUserData = updatedUserDocSnapshot.data();
      setUserData(updatedUserData); // Atualiza o estado local de userData
  
      // Limpa os estados locais utilizados para gerenciar a aceitação de termos
      setLatestTerms([]);
      setAcceptedTerms({});
      setShowTermsModal(false);
  
      const termsAccepted = newAcceptedTerms.map(term => term.id);
      localStorage.setItem('termsAccepted', JSON.stringify(termsAccepted));
    } catch (error) {
      console.error("Erro ao aceitar termos:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await addDoc(collection(firestore, "blacklist"), {
        userId: currentUser.uid,
        timestamp: new Date(),
      });

      const userRef = doc(firestore, "users", currentUser.uid);
      await deleteDoc(userRef);

      await deleteUser(currentUser);

      navigate("/login");
    } catch (error) {
      console.error("Erro ao excluir a conta do usuário:", error);
    }
  };

  return (
    <Box style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
      <Paper
        sx={{
          marginTop: 0,
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          borderRadius: 5,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          marginLeft: 3,
          position: "absolute",
          top: "50%",
          backgroundColor: "transparent",
          borderWidth: 0,
          boxShadow: "none",
        }}
      >
        <TypingEffect texts={texts} />
      </Paper>
      <video
        style={{
          borderRadius: 20,
          width: "100%",
          height: "auto",
        }}
        autoPlay
        loop
        muted
      >
        <source src={earthVideo} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {showTermsModal && (
        <ConfirmationDialog
          open={showTermsModal}
          onClose={() => setShowDeleteFieldsDialog(true)}
          onConfirm={handleAcceptTerms}
          title="Aceitar Novos Termos"
          content={
            <div>
              <p>
                Há novos termos disponíveis. Por favor, leia e aceite para continuar utilizando o HexAnalytics.
              </p>
              <div>
                <div>
                  <Button
                    style={{ width: 100, height: 30, marginBottom: 10 }}
                    variant="contained"
                    color="info"
                    component={Link}
                    to="/termos"
                    target="_blank"
                  >
                    Ver Termos
                  </Button>
                </div>
                {latestTerms.map(term => (
                  <div key={term.id}>
                    {term.type === "USO" ? (
                      <p>{term.type} - Versão {term.version} (Aceito ao Confirmar)</p>
                    ) : (
                      <label>
                        <input
                          type="checkbox"
                          checked={acceptedTerms[term.id] || false}
                          onChange={(e) => {
                            setAcceptedTerms({
                              ...acceptedTerms,
                              [term.id]: e.target.checked,
                            });
                          }}
                        />
                        {term.type} - Versão {term.version}
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          }
        />
      )}

      <ConfirmationDialog
        open={showDeleteFieldsDialog}
        onClose={() => setShowDeleteFieldsDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        content="Esta ação excluirá sua conta e todos os dados correspondentes a ela. Deseja confirmar?"
      />
    </Box>
  );
}
