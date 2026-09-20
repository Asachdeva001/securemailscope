# Setup & Installation Guide — SecureMailScope

## Local Development Requirements

- Python 3.11+
- Node.js v18+ & npm 9+
- Docker & Docker Compose (Optional)

---

## Step-by-Step Installation

### 1. Clone & Initialize Workspace
```bash
git clone https://github.com/enterprise/securemailscope.git
cd securemailscope
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be served at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running with Docker Compose
```bash
docker-compose up --build
```
