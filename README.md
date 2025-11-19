Mango App - Variety & Quality Classification

FastAPI + React application that lets you upload a mango photo, stores it temporarily on Cloudinary, and runs two TensorFlow models: one predicts the cultivar (Chausa, Dasheri, etc.) and the other grades the fruit (Grade I–III). The frontend provides a guided upload/analyze flow, while the backend exposes `/uploadfile/` and `/analyze` endpoints that orchestrate Cloudinary I/O plus the saved `.h5` models.

### Project Layout
- `classification-model-backend/` – FastAPI service, TensorFlow inference code, and the pretrained `V_2_model.h5` and `V_2_Grading.h5` files.
- `client/` – React + Vite UI with Tailwind classes, featuring `Upload` and `Display` components that call the backend.

### Key Features
- Direct image upload to Cloudinary with configurable credentials.
- Species classification across six cultivars plus grading into three quality levels.
- Clean client workflow: upload → analyze → see results/confidence → reset.

### Prerequisites
- Python 3.10+ with `pip` and (optionally) `venv`.
- Node.js 18+ / npm 10+.
- Cloudinary account (needed for the backend upload step).

### Backend Setup (`classification-model-backend`)
1. `cd classification-model-backend`
2. (Optional) `python -m venv .venv && .\.venv\Scripts\activate`
3. `pip install -r requirements.txt`
4. Create a `.env` in this folder:
   ```
   CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
5. Start the API: `uvicorn main:app --reload`
   - Runs on `http://localhost:8000`
   - Endpoints: `POST /uploadfile/`, `GET /analyze`

> The `.h5` model files are already in this directory; keep them alongside `model.py` and `grading_model.py`, or update the load paths if you relocate them.

### Frontend Setup (`client`)
1. `cd client`
2. `npm install`
3. `npm run dev`
   - Vite dev server defaults to `http://localhost:5173`
   - The UI expects the backend at `http://localhost:8000`; if you change the API base URL, update it inside `client/src/component/Upload.jsx` and `Display.jsx`.

### Running Everything Locally
1. Launch the backend server first so it can accept uploads.
2. Start the Vite dev server.
3. Open the client URL, drop a JPG/PNG mango photo, click **Upload**, then **Get Result** after the upload succeeds.
4. Use **Reset** to analyze another image.

### Deployment Notes
- Keep the Cloudinary credentials in environment variables wherever you deploy (GitHub secrets, hosting dashboard, etc.).
- Because model files are ~56 MB combined, ensure your hosting provider supports large static assets or mount persistent storage.
- If exposing the API publicly, restrict `allow_origins` in the FastAPI CORS middleware instead of the current `"*"`.

The project is already pushed to GitHub; update this README as the API base URL, model paths, or UI evolve.
