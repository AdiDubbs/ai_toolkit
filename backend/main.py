from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from caption import generate_caption
import io

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/caption")
def get_caption(file: UploadFile = File(...)):
    contents = file.file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    caption = generate_caption(image)
    return {"caption": caption}
