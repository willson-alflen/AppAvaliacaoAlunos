# App Avaliação Alunos

Ferramenta auxiliar para professores realizarem avaliações de alunos e gerarem relatórios (boletins) em PDF.

---

## 🚀 Tecnologias usadas

- Frontend: Vite + React + Tailwind CSS  
- Backend: Node.js + Express  
- Banco de dados: Google Sheets API 

---

## 🎯 Funcionalidades principais

- Seleção de turmas e alunos  
- Avaliação por estrelas em diversas dimensões (compreensão lógica, autonomia, colaboração, etc.)  
- Geração e download de relatórios individuais em PDF, agrupados em arquivos ZIP  
- Interface simples e responsiva para uso em desktop e mobile  

---

## 👩‍🏫 Público alvo

Professores cadastrados que desejam organizar e acompanhar avaliações dos seus alunos de forma prática e digital.

---

## 📥 Como usar (clonagem e instalação local)

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   
2. Instale as dependências no frontend e backend:
   
    ```bash
    # No diretório frontend
    cd frontend
    npm install
  
    # No diretório backend
    cd ..
    cd backend
    npm install

3. Configure as variáveis de ambiente:

    ```bash
    # No frontend (frontend/.env), defina:
    VITE_API_URL=https://seu-backend.onrender.com

    # No backend (backend/.env), configure as variáveis necessárias para conectar à Google Sheets e a porta (PORT=4000 ou outra).

    PORT=4000

    # ID da planilha no Google Sheets usada como "banco de dados"
    GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID_HERE

    # E-mail da conta de serviço do Google
    GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

    # Chave privada da conta de serviço do Google (atenção para manter o formato \n)
    GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT_HERE\n-----END PRIVATE KEY-----\n

4. Rode o projeto localmente:
   
    ```bash
    # Backend
    cd backend
    npm start

    # Frontend (em outro terminal)
    cd ../frontend
    npm run dev

5. Acesse no navegador:
   
   [http://localhost:5173](http://localhost:5173)

---

## 🌐 Versão online

Acesse a versão hospedada do frontend em:

[https://app-avaliacao-alunos.vercel.app](https://app-avaliacao-alunos.vercel.app)

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT. [Consulte a licença MIT](https://opensource.org/licenses/MIT) para mais detalhes.

---

##  🤝 Contribuições

Contribuições são bem-vindas! Abra issues ou pull requests para sugerir melhorias.

