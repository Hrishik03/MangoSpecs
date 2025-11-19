import tensorflow as tf
import numpy as np
from PIL import Image
import io
import requests

# Load model once (on import)
model = tf.keras.models.load_model("V_2_Grading.h5")
img_height, img_width = 256, 256
class_names = ['Grade - III', 'Grade - II', 'Grade - I']


def predict_grade_from_url(image_url: str):
    """
    Download image from Cloudinary URL and predict mango grade.
    """
    response = requests.get(image_url)
    response.raise_for_status()

    img = Image.open(io.BytesIO(response.content)).convert("RGB")
    img = img.resize((img_height, img_width))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])

    predicted_class = class_names[tf.argmax(score)]
    confidence = float(100 * tf.reduce_max(score))

    return {"grade": predicted_class, "confidence": confidence}


