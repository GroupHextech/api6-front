import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TypingEffect from "../components/TypingFunc/Typing";
import earthVideo from '../../public/assets/earth.mp4';
import ConfirmationDialog from "../components/ConfirmationDialog";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
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

  const { currentUser } = React.useContext(AuthContext);
  const [showTermsModal, setShowTermsModal] = React.useState(false);
  const [outdatedTerms, setOutdatedTerms] = React.useState([]);
  const [acceptedOutdatedTerms, setAcceptedOutdatedTerms] = React.useState({});
  const [showDeleteFieldsDialog, setShowDeleteFieldsDialog] = React.useState(false);

  const handleDeleteAccount = async () => {
    try {
      // Adicionar documento na coleção 'blacklist'
      await addDoc(collection(firestore, "blacklist"), {
        userId: currentUser.uid,
        timestamp: new Date(),
      });
  
      // Excluir o documento do usuário
      const userRef = doc(firestore, "users", currentUser.uid);
      await deleteDoc(userRef);
  
      // Excluir o usuário
      await deleteUser(currentUser);
  
      // Navegar para a página de login
      navigate("/login");
    } catch (error) {
      console.error("Erro ao excluir a conta do usuário:", error);
    }
  };
  

  const navigate = useNavigate();
  React.useEffect(() => {




    async function checkTerms() {
      try {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const acceptedTermsList = userData.terms || [];

        const termsCollection = collection(firestore, "terms");
        const termsSnapshot = await getDocs(termsCollection);
        const termsList = termsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));


        const outdated = termsList.filter(term => term.active && !acceptedTermsList.some(acceptedTerm => acceptedTerm.id === term.id));

        // Verificar se há termos desatualizados não aceitos
        if (outdated.length > 0) {
          setOutdatedTerms(outdated);
          setShowTermsModal(true);
        } else {
          // Verificar se todos os termos ativos foram aceitos
          const allActiveTermsAccepted = termsList.every(term => !term.active || acceptedTermsList.some(acceptedTerm => acceptedTerm.id === term.id));
          if (!allActiveTermsAccepted) {
            setShowTermsModal(true);
          } else {
            setShowTermsModal(false); // Não mostrar o modal se todos os termos ativos foram aceitos
          }
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

      // Mapear todos os termos desatualizados para novos termos aceitos ou não aceitos
      const outdatedTermsAccepted = outdatedTerms.map(term => ({
        id: term.id,
        type: term.type,
        version: term.version,
        accepted: term.type === "USO" || acceptedOutdatedTerms[term.id] || false, // Tratar undefined como false
        timestamp: new Date()
      }));

      const newAcceptedTerms = [
        ...currentTerms,
        ...outdatedTermsAccepted
      ];

      // Atualizar documento do usuário com os novos termos aceitos
      await updateDoc(userDocRef, {
        terms: newAcceptedTerms
      });

      // Limpar estados locais e fechar modal
      setOutdatedTerms([]);
      setAcceptedOutdatedTerms({});
      setShowTermsModal(false);

      // Atualizar localStorage com os IDs dos termos aceitos
      const termsAccepted = newAcceptedTerms.map(term => term.id);
      localStorage.setItem('termsAccepted', JSON.stringify(termsAccepted));
    } catch (error) {
      console.error("Erro ao aceitar termos:", error);
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
                {outdatedTerms.map(term => (
                  <div key={term.id}>
                    {term.type === "USO" ? (
                      <p>{term.type} - Versão {term.version}</p>
                    ) : (
                      <label>
                        <input
                          type="checkbox"
                          checked={acceptedOutdatedTerms[term.id] || false}
                          onChange={(e) => {
                            setAcceptedOutdatedTerms({
                              ...acceptedOutdatedTerms,
                              [term.id]: e.target.checked
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
              title="EDIT"
              content="Esta ação excluirá sua conta e todos os dados correnspondentes a ela, deseja confirmar?."
            />
    </Box>
  );
}
