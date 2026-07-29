from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Grind(BaseModel):
    description: str
    timemore_x_lite_clicks: Optional[int] = None
    m3_bomber_r3_pro_clicks: Optional[int] = None


class Pour(BaseModel):
    step: int
    name: str
    start_time: str
    target_weight_percentage: float
    description: str


class Recipe(BaseModel):
    id: str
    method: str
    author: str
    base_ratio: float
    base_coffee_g: float
    base_water_g: float
    temperature_c: float
    grind: Grind
    pours: List[Pour]


RECETAS = [
    {
        "id": "aeropress-hedrick",
        "method": "Aeropress",
        "author": "Hedrick",
        "base_ratio": 15.6,
        "base_coffee_g": 16,
        "base_water_g": 250,
        "temperature_c": 90,
        "grind": {
            "description": "Fina",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Hacer un bloom de 45s.",
            },
            {
                "step": 2,
                "name": "Llenado",
                "start_time": "0:45",
                "target_weight_percentage": 1.0,
                "description": "Agregar agua rápido integrando en el centro. Agitación suave y poner émbolo.",
            },
            {
                "step": 3,
                "name": "Extracción",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "Bajar el émbolo lentamente con poca presión.",
            },
        ],
    },
    {
        "id": "v60-giorgio-visitacion",
        "method": "V60",
        "author": "Giorgio Visitacion",
        "base_ratio": 14.4,
        "base_coffee_g": 18,
        "base_water_g": 260,
        "temperature_c": 93,
        "grind": {
            "description": "Media-fina",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Preinfusión",
                "start_time": "0:00",
                "target_weight_percentage": 0.23,
                "description": "Vertido inicial para bloom.",
            },
            {
                "step": 2,
                "name": "Segundo vertido",
                "start_time": "0:30",
                "target_weight_percentage": 0.615,
                "description": "Movimientos circulares de afuera hacia adentro, lento.",
            },
            {
                "step": 3,
                "name": "Tercer vertido",
                "start_time": "1:30",
                "target_weight_percentage": 1.0,
                "description": "Llenar hasta el total. Extraer hasta 2:30 ó 3:00.",
            },
        ],
    },
]


@app.get("/api/recetas")
def get_recetas():
    return RECETAS


@app.post("/api/recetas")
def create_receta(recipe: Recipe):
    RECETAS.append(recipe.model_dump())
    return recipe
