# MangoSpecs 🍋

**AI Mango Varietal & Quality Grader**

[![Languages](https://img.shields.io/badge/JavaScript-65.1%25-yellow.svg?style=flat&logo=javascript)](#language-composition)
[![Python](https://img.shields.io/badge/Python-31.4%25-blue.svg?style=flat&logo=python)](#language-composition)
[![HTML](https://img.shields.io/badge/HTML-2.3%25-orange.svg?style=flat&logo=html5)](#language-composition)
[![CSS](https://img.shields.io/badge/CSS-1.2%25-264de4.svg?style=flat&logo=css3)](#language-composition)

---

A **FastAPI + React** application that allows users to upload photos of mangos, stores them temporarily on Cloudinary, and uses two TensorFlow models to:
- Predict the cultivar (e.g., Chausa, Dasheri, etc.)
- Grade the quality

---

## 🗂 Project Layout

- `classification-model-backend/` — FastAPI service and TensorFlow inference code; houses the model files.
- `client/` — React + Vite frontend UI with Tailwind CSS.

---

## 🚀 Running This Project Locally

You’ll need **Python (3.10+)**, **Node.js (18+)**, **npm (10+)**, and a **Cloudinary account**.

### 1. Clone the Repository

```sh
git clone https://github.com/Hrishik03/MangoSpecs.git
cd MangoSpecs
```

---

### 2. Backend Setup (`classification-model-backend`)

```sh
cd classification-model-backend
python -m venv .venv
# Activate venv:
source .venv/bin/activate    # On Mac/Linux
# OR
.venv\Scripts\activate       # On Windows

pip install -r requirements.txt
```

Create a file named `.env` in this folder with your Cloudinary credentials:

```
CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the API server:
```sh
uvicorn main:app --reload
```
- API runs at: [http://localhost:8000](http://localhost:8000)
- Key endpoints: `POST /uploadfile/`, `GET /analyze`

**Note:** The `.h5` model files must be in this directory alongside `model.py` and `grading_model.py`.

---

### 3. Frontend Setup (`client`)

Open a **new terminal**, then:

```sh
cd client
npm install
npm run dev
```
- The web UI will open at: [http://localhost:5173](http://localhost:5173)
- It expects the backend at: `http://localhost:8000` (can be changed in `client/src/components/Upload.jsx` & `Display.jsx`)

---

### 4. Using MangoSpecs

1. Launch the backend server first.
2. Start the frontend (Vite dev server).
3. Open [http://localhost:5173](http://localhost:5173) in your browser.
4. Drop a JPG/PNG mango photo, **Upload**, then **Get Result** after the upload succeeds.
5. Use **Reset** to analyze another image.

---

## 🌐 Deployment Notes

- Keep your Cloudinary credentials secure (use secrets/environment variables).
- Model files are ~56 MB combined; hosting must support large static assets or persistent storage.
- If exposing the API publicly, restrict `allow_origins` in the FastAPI CORS middleware (don’t use `*`).

---

> Update this README as necessary if the API base URL, model paths, or UI details change.
