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


class CoffeeBean(BaseModel):
    roaster: str
    origin: str
    process: str
    roast_level: str


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
    coffee_bean: Optional[CoffeeBean] = None


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
    {
        "id": "kalita-wave-george-howell",
        "method": "Kalita Wave (155/185)",
        "author": "George Howell (Adaptada)",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 92,
        "grind": {
            "description": "Media-gruesa (como arena de mar)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.15,
                "description": "Verter suavemente del centro hacia afuera. Esperar 45s.",
            },
            {
                "step": 2,
                "name": "Vertido Principal",
                "start_time": "0:45",
                "target_weight_percentage": 0.50,
                "description": "Verter en espiral, manteniendo el nivel del agua estable en el filtro.",
            },
            {
                "step": 3,
                "name": "Mantenimiento y Cierre",
                "start_time": "1:30",
                "target_weight_percentage": 1.0,
                "description": "Completar el volumen en espiral y dejar drenar. Tiempo total aprox 2:45 a 3:15.",
            },
        ],
    },
    {
        "id": "hario-pegasus-daily",
        "method": "Hario Pegasus",
        "author": "Hario Standard",
        "base_ratio": 15.5,
        "base_coffee_g": 16,
        "base_water_g": 250,
        "temperature_c": 93,
        "grind": {
            "description": "Media (ligeramente más fina que V60)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Vertido rápido para saturar la cama de café. Esperar 30s.",
            },
            {
                "step": 2,
                "name": "Segundo Vertido",
                "start_time": "0:30",
                "target_weight_percentage": 0.60,
                "description": "Llenar la tolva con movimientos circulares constantes.",
            },
            {
                "step": 3,
                "name": "Tercer Vertido",
                "start_time": "1:15",
                "target_weight_percentage": 1.0,
                "description": "Verter el resto en el centro. Tiempo total aprox 2:30.",
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
