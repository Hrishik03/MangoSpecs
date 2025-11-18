# from fastapi import FastAPI, UploadFile, File , HTTPException
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# import subprocess
# import json
# import os

# # creating an instance
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins, you might want to restrict this in production
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods
#     allow_headers=["*"],  # Allow all headers
# )

# # Define the directory where uploaded files will be saved
# upload_folder = "C:/Users/HRISHIKESH/Desktop/prodigy/mango_app/classification-model-backend/img"
# os.makedirs(upload_folder, exist_ok=True)
# stored_string = "full path of file"


# @app.post("/uploadfile/")
# async def create_upload_file(file: UploadFile = File(...)):
#     # Create the full path to save the file
#     file_path = os.path.join(upload_folder, file.filename)
#     global stored_string 
#     print(file_path)
#     stored_string = file_path 
#     # Save the file
#     with open(file_path, "wb") as image:
#         image.write(file.file.read())
    
#     # Return a response with the filename
#     return {"filename": file.filename}

# @app.get("/run-model")
# async def run_model():
#     try:
#         global stored_string
#         print(stored_string)
#         # Run the model.py script using subprocess
#         result = subprocess.run(["python", "model.py" , stored_string], capture_output=True, text=True)
        
#         # Check if the subprocess ran successfully
#         if result.returncode == 0:
#             # Attempt to find and extract the JSON part from the output
#             print(result)
#             json_start = result.stdout.find("{")
#             json_end = result.stdout.rfind("}")
            
#             # Check if JSON part is found
#             if json_start != -1 and json_end != -1:
#                 json_str = result.stdout[json_start:json_end+1]
                
#                 # Parse the JSON string
#                 output_json = json.loads(json_str)
                
#                 # Return the JSON as a response
#                 return JSONResponse(content=output_json, status_code=200)
#             else:
#                 raise HTTPException(status_code=500, detail="JSON not found in model output.")
#         else:
#             # If the subprocess failed, raise an HTTPException
#             raise HTTPException(status_code=500, detail="Model execution failed.")
#     except Exception as e:
#         # Handle other exceptions
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/run-grading-model")
# async def run_model():
#     try:
#         global stored_string
#         print(stored_string)
#         # Run the model.py script using subprocess
#         result = subprocess.run(["python", "grading_model.py" , stored_string], capture_output=True, text=True)
        
#         # Check if the subprocess ran successfully
#         if result.returncode == 0:
#             # Attempt to find and extract the JSON part from the output
#             print(result)
#             json_start = result.stdout.find("{")
#             json_end = result.stdout.rfind("}")
            
#             # Check if JSON part is found
#             if json_start != -1 and json_end != -1:
#                 json_str = result.stdout[json_start:json_end+1]
                
#                 # Parse the JSON string
#                 output_json = json.loads(json_str)
                
#                 # Return the JSON as a response
#                 return JSONResponse(content=output_json, status_code=200)
#             else:
#                 raise HTTPException(status_code=500, detail="JSON not found in model output.")
#         else:
#             # If the subprocess failed, raise an HTTPException
#             raise HTTPException(status_code=500, detail="Model execution failed.")
#     except Exception as e:
#         # Handle other exceptions
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
import requests

# Import model prediction functions
from model import predict_species_from_url
from grading_model import predict_grade_from_url

# Load environment variables
load_dotenv()

# Configure Cloudinary from .env
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

stored_url = None
stored_public_id = None


@app.post("/uploadfile/")
async def upload_to_cloud(file: UploadFile = File(...)):
    """
    Upload image directly to Cloudinary and return its URL.
    """
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]

    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, JPEG, PNG are allowed.")

    try:
        upload_result = cloudinary.uploader.upload(file.file, folder="mango_uploads",resource_type="image",quality="100",format="jpg")
        image_url = upload_result["secure_url"]
        public_id = upload_result["public_id"]

        global stored_url, stored_public_id
        stored_url = image_url
        stored_public_id = public_id

        return {"message": "Uploaded successfully", "image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/analyze")
async def analyze_image():
    global stored_url, stored_public_id

    if not stored_url:
        raise HTTPException(status_code=400, detail="No image uploaded.")

    try:
        # Run species model
        species_res = predict_species_from_url(stored_url)

        # Run grade model
        grade_res = predict_grade_from_url(stored_url)

        # Cleanup Cloudinary image
        try:
            if stored_public_id:
                cloudinary.api.delete_resources([stored_public_id])
                stored_public_id = None
        except Exception as cleanup_err:
            print("Cleanup failed:", cleanup_err)

        return {
            "image_url": stored_url,
            "species": {
                "label": species_res["species"],
                "confidence": species_res["confidence"]
            },
            "grade": {
                "label": grade_res["grade"],
                "confidence": grade_res["confidence"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

