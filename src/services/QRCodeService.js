// const API_BASE_URL = "http://127.0.0.1:5000"

const API_BASE_URL = "https://api6.nossoscursos.com.br"

const QRCodeService = {
  generateQRCode: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar QR Code');
      }

      const data = await response.json();
      return data.qrcode; // Retorna apenas a string base64 do QR Code
    } catch (error) {
      console.error('Erro:', error.message);
      throw error;
    }
  },

  verifyToken: async (email, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar token');
      }

      const data = await response.json();
      return data.message; // Retorna a mensagem de sucesso/erro da verificação
    } catch (error) {
      console.error('Erro:', error.message);
      throw error;
    }
  },
};

export default QRCodeService;