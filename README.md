
# 🚗 Sistema de Quilometragem Veicular

Sistema web para gerenciamento e registro de quilometragem de veículos.

## Funcionalidades

- ✅ Registro de quilometragem com condutor, placa, datas e distâncias
- 📊 Visualização de registros em tabela
- 🔍 Filtros por condutor, placa e período
- 📄 Exportação em CSV, Excel e PDF
- 📱 Geração de QR Code para acesso rápido
- 📝 Histórico de alterações
- ✏️ Edição e exclusão de registros

## Tecnologias

- Backend: Flask (Python)
- Frontend: HTML, CSS, JavaScript
- Banco de Dados: SQLite
- Bibliotecas: Flask-CORS, ReportLab, OpenPyXL, QRCode

## Instalação Local

```bash
pip install -r requirements.txt
python app.py
```

Acesse: http://localhost:5000

## Deployment

Este projeto está configurado para deploy no Railway ou Vercel.

### Railway
1. Conecte seu repositório GitHub
2. O Railway detectará automaticamente as configurações
3. A aplicação será implantada automaticamente

## Estrutura do Projeto

```
Projeto_Quilometragem/
├── app.py              # Aplicação Flask principal
├── templates/          # Templates HTML
│   └── index.html
├── static/            # Arquivos estáticos
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── requirements.txt   # Dependências Python
├── Procfile          # Configuração Railway/Heroku
└── README.md         # Este arquivo
```

## API Endpoints

- `GET /api/registros` - Lista todos os registros
- `POST /api/registros` - Cria novo registro
- `GET /api/registros/<id>` - Obtém registro específico
- `PUT /api/registros/<id>` - Atualiza registro
- `DELETE /api/registros/<id>` - Deleta registro
- `GET /api/registros/<id>/historico` - Histórico de alterações
- `GET /api/exportar/csv` - Exporta CSV
- `GET /api/exportar/excel` - Exporta Excel
- `GET /api/exportar/pdf` - Exporta PDF
- `GET /api/qrcode` - Gera QR Code

## Licença

MIT License
