import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        // Lógica de login aqui
        console.log('Usuário:', username);
        console.log('Senha:', password);
    };

    return (
        <div style={{justifyContent:"center",backgroundColor:"black" ,alignItems:"center", flex:1, display:"flex", height:"100vh"}}>
        <div style={styles.loginContainer}>
            <h2>Login</h2>
            <div style={styles.inputContainer}>
                <FontAwesomeIcon icon={faUser} />
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.inputContainer}>
                <FontAwesomeIcon icon={faLock} />
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <span className="toggle-password" onClick={togglePasswordVisibility} style={styles.togglePassword}>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
            </div>
            <button onClick={handleLogin} style={styles.button}>Entrar</button>
        </div>
        </div>
    );
}

const styles = {
    loginContainer: {
        backgroundColor:"#ffff",
        textAlign: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '300px',
    },
    inputContainer: {
        position: 'relative',
        marginBottom: '15px',
    },
    input: {
        paddingRight: '30px',
        width: '100%',
    },
    togglePassword: {
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Register;
