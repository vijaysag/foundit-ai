# AI-Powered Lost & Found Management System

This is a premium, full-stack application that leverages Computer Vision and NLP to help users find and recover lost items.

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **MongoDB** (Running locally on `mongodb://localhost:27017` or via MongoDB Atlas)

---

### 2. Backend Setup
Navigate to the `backend` directory:
```powershell
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```
> [!NOTE]
> On the first run, the system will download the **YOLOv8** and **Sentence-Transformers** models (~100MB). This might take a few moments.

---

### 3. Frontend Setup
Navigate to the `frontend` directory in a new terminal:
```powershell
cd frontend
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Features Implemented

### 🧠 AI Features
- **Computer Vision (CV)**: Uses `YOLOv8` to analyze uploaded images, detect item categories, and extract dominant colors.
- **NLP Matching**: Converts descriptions into 384-dimensional embeddings using `Sentence-Transformers`. It calculates the **Cosine Similarity** between lost reports and found items to find the best possible matches.

### 📱 User Workflow
1. **Report Lost**: Describe your lost item and upload an optional photo.
2. **Found Item**: If you find something, snap a photo. The AI will automatically tag it.
3. **AI Dashboard**: View potential matches with similarity scores.
4. **Secure Claim**: Generate a unique QR code for verification during item recovery.

### 🛡 Admin Console
- Oversee all platform activity.
- Verify user identity and approve recovery claims.
- Monitor AI matching accuracy.

---

## 📂 Project Structure
```text
backend/
├── ai/                # CV & NLP service logic
├── models/            # MongoDB & Pydantic schemas
├── routes/            # API Endpoints (Auth, Items)
├── services/          # Business logic & Notifications
├── uploads/           # Storage for item images
└── app.py             # Main entry point

frontend/
├── src/
│   ├── components/    # Reusable UI parts
│   ├── pages/         # Full page views
│   ├── services/      # Axios API definitions
│   └── App.jsx        # Routing & Main Layout
└── tailwind.config.js # Design System
```
