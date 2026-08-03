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
    temperature_c: Optional[float] = None
    grind: Grind
    pours: List[Pour]
    coffee_bean: Optional[CoffeeBean] = None


RECETAS = [
    # --- V60 ---
    {
        "id": "v60-scott-rao",
        "method": "V60",
        "author": "Scott Rao",
        "base_ratio": 16.3,
        "base_coffee_g": 22,
        "base_water_g": 360,
        "temperature_c": 92,
        "grind": {
            "description": "Media fina (sal marina)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.166,
                "description": "Agregar 60g de agua por 30s.",
            },
            {
                "step": 2,
                "name": "Vertido principal",
                "start_time": "0:30",
                "target_weight_percentage": 1.0,
                "description": "Agregar 300g de agua. Dar vuelta con cuchara y esperar.",
            },
        ],
    },
    {
        "id": "v60-tetsu-katsuya",
        "method": "V60",
        "author": "Tetsu Kasuya",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 92,
        "grind": {
            "description": "Media fina (sal marina)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "10 Vertidos",
                "start_time": "0:00",
                "target_weight_percentage": 1.0,
                "description": "Realizar 10 vertidos de 30g cada 15 segundos hasta alcanzar los 300g.",
            },
        ],
    },
    {
        "id": "v60-metodo-4-6-dios",
        "method": "V60",
        "author": "Método 4:6 (DIOS)",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 92,
        "grind": {
            "description": "Media gruesa",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Vertido 1",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Agregar 60g de agua. (Var 1 Dulzor: 50g / Var 2 Acidez: 70g)",
            },
            {
                "step": 2,
                "name": "Vertido 2",
                "start_time": "0:45",
                "target_weight_percentage": 0.40,
                "description": "Agregar 60g de agua. (Var 1 Dulzor: 70g / Var 2 Acidez: 50g)",
            },
            {
                "step": 3,
                "name": "Vertido 3",
                "start_time": "1:30",
                "target_weight_percentage": 0.60,
                "description": "Agregar 60g de agua.",
            },
            {
                "step": 4,
                "name": "Vertido 4",
                "start_time": "2:15",
                "target_weight_percentage": 0.80,
                "description": "Agregar 60g de agua.",
            },
            {
                "step": 5,
                "name": "Vertido 5",
                "start_time": "3:00",
                "target_weight_percentage": 1.0,
                "description": "Agregar 60g de agua hasta 300g.",
            },
        ],
    },
    # --- AEROPRESS ---
    {
        "id": "aeropress-primera-receta",
        "method": "Aeropress",
        "author": "Propia (No Invertido)",
        "base_ratio": 15.6,
        "base_coffee_g": 16,
        "base_water_g": 250,
        "temperature_c": 90,
        "grind": {
            "description": "Media fina",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Agregar el café y 50g de agua. Agitar. Esperar 30 seg.",
            },
            {
                "step": 2,
                "name": "Llenado",
                "start_time": "0:30",
                "target_weight_percentage": 1.0,
                "description": "Agregar resto del agua rápido. Armar émbolo.",
            },
            {
                "step": 3,
                "name": "Agitación",
                "start_time": "1:00",
                "target_weight_percentage": 1.0,
                "description": "Agitar. Debe haber pasado 1 minuto.",
            },
            {
                "step": 4,
                "name": "Extracción",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "Bajar émbolo lento, regresar un poco para que no gotee.",
            },
        ],
    },
    {
        "id": "aeropress-receta-clasica",
        "method": "Aeropress (Invertida)",
        "author": "Clásica",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 90,
        "grind": {
            "description": "Media a fina. 36-40 clics molino JR",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Inmersión",
                "start_time": "0:00",
                "target_weight_percentage": 0.666,
                "description": "Agregar 200ml de agua y café. Agitar fogosamente hasta 30s.",
            },
            {
                "step": 2,
                "name": "Agitación secundaria",
                "start_time": "1:20",
                "target_weight_percentage": 0.666,
                "description": "Agitar nuevamente.",
            },
            {
                "step": 3,
                "name": "Extracción",
                "start_time": "2:00",
                "target_weight_percentage": 0.666,
                "description": "Poner tapa. Bajar émbolo.",
            },
            {
                "step": 4,
                "name": "Bypass",
                "start_time": "3:00",
                "target_weight_percentage": 1.0,
                "description": "Agregar 100ml de agua a 90°C a la bebida final.",
            },
        ],
    },
    {
        "id": "aeropress-invertido-propia",
        "method": "Aeropress (Invertida)",
        "author": "Propia (13g)",
        "base_ratio": 15.3,
        "base_coffee_g": 13,
        "base_water_g": 200,
        "temperature_c": 90,
        "grind": {
            "description": "Media fina",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Inmersión",
                "start_time": "0:00",
                "target_weight_percentage": 1.0,
                "description": "Agua primero, luego café. Agitar.",
            },
            {
                "step": 2,
                "name": "Agitación secundaria",
                "start_time": "1:30",
                "target_weight_percentage": 1.0,
                "description": "Agitar nuevamente.",
            },
            {
                "step": 3,
                "name": "Extracción",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "Voltear y extraer.",
            },
        ],
    },
    {
        "id": "aeropress-cafe-brilloso",
        "method": "Aeropress (Invertida)",
        "author": "Café Brilloso (Claro)",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 82,
        "grind": {
            "description": "Media",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Inmersión",
                "start_time": "0:00",
                "target_weight_percentage": 0.333,
                "description": "Adicionar 100ml de agua y agitar un poco.",
            },
            {
                "step": 2,
                "name": "Extracción",
                "start_time": "2:00",
                "target_weight_percentage": 0.333,
                "description": "Poner 2 filtros húmedos. Extraer (30s).",
            },
            {
                "step": 3,
                "name": "Bypass",
                "start_time": "2:30",
                "target_weight_percentage": 1.0,
                "description": "Adicionar 200ml de agua a la bebida final.",
            },
        ],
    },
    {
        "id": "aeropress-cafe-viejo",
        "method": "Aeropress (Invertida)",
        "author": "Café Viejo",
        "base_ratio": 8.0,
        "base_coffee_g": 30,
        "base_water_g": 240,
        "temperature_c": 80,
        "grind": {
            "description": "Gruesa",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Inmersión",
                "start_time": "0:00",
                "target_weight_percentage": 0.50,
                "description": "Agregar 120ml de agua de una vez. Agitar fuerte 10s.",
            },
            {
                "step": 2,
                "name": "Extracción",
                "start_time": "1:00",
                "target_weight_percentage": 0.50,
                "description": "Presionar para pasarlo en 1 minuto.",
            },
            {
                "step": 3,
                "name": "Bypass",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "En el servidor agregar 120ml de agua.",
            },
        ],
    },
    {
        "id": "aeropress-cafe-viejito-2",
        "method": "Aeropress (Invertida)",
        "author": "Café viejito #2",
        "base_ratio": 8.6,
        "base_coffee_g": 18,
        "base_water_g": 156,
        "temperature_c": 90,
        "grind": {
            "description": "Media fina",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Inmersión",
                "start_time": "0:00",
                "target_weight_percentage": 0.615,
                "description": "Agregar café y 96g de agua. Agitar.",
            },
            {
                "step": 2,
                "name": "Agitación",
                "start_time": "1:20",
                "target_weight_percentage": 0.615,
                "description": "Agitar a los 1:20.",
            },
            {
                "step": 3,
                "name": "Extracción",
                "start_time": "1:30",
                "target_weight_percentage": 0.615,
                "description": "Bajar émbolo durante 30s.",
            },
            {
                "step": 4,
                "name": "Bypass",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "Adicionar 60ml de agua en la taza.",
            },
        ],
    },
    # --- HARIO SWITCH ---
    {
        "id": "metodo-switch",
        "method": "Hario Switch",
        "author": "Propia",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 92,
        "grind": {
            "description": "Media",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom (Bloqueado)",
                "start_time": "0:00",
                "target_weight_percentage": 0.166,
                "description": "Válvula cerrada. 50g de agua por 30s.",
            },
            {
                "step": 2,
                "name": "Segundo vertido (Abierto)",
                "start_time": "0:30",
                "target_weight_percentage": 0.366,
                "description": "Abrir válvula. Agregar 60g de agua.",
            },
            {
                "step": 3,
                "name": "Inmersión (Bloqueado)",
                "start_time": "1:15",
                "target_weight_percentage": 1.0,
                "description": "Bloquear válvula. Añadir agua hasta 300g.",
            },
            {
                "step": 4,
                "name": "Drenaje (Abierto)",
                "start_time": "1:45",
                "target_weight_percentage": 1.0,
                "description": "Abrir válvula para extraer.",
            },
        ],
    },
    # --- KALITA & PEGASUS (Recuperadas) ---
    {
        "id": "kalita-clasica",
        "method": "Kalita Wave",
        "author": "Clásica",
        "base_ratio": 16.6,
        "base_coffee_g": 15,
        "base_water_g": 250,
        "temperature_c": 92,
        "grind": {
            "description": "Media gruesa",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Agregar 50g de agua.",
            },
            {
                "step": 2,
                "name": "Vertido principal",
                "start_time": "0:45",
                "target_weight_percentage": 1.0,
                "description": "Agregar 200g de agua en círculos lentos.",
            },
        ],
    },
    {
        "id": "pegasus-clasica",
        "method": "Hario Pegasus",
        "author": "Clásica",
        "base_ratio": 16.6,
        "base_coffee_g": 15,
        "base_water_g": 250,
        "temperature_c": 92,
        "grind": {
            "description": "Media",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Agregar 50g de agua.",
            },
            {
                "step": 2,
                "name": "Vertidos continuos",
                "start_time": "0:45",
                "target_weight_percentage": 1.0,
                "description": "Llevar hasta 250g con flujo constante.",
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
