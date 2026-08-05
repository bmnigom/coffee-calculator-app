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
                "description": "Agregar 60g de agua. (Mejora: En lugar de cuchara, puedes hacer un 'Rao Spin' girando el V60).",
            },
            {
                "step": 2,
                "name": "Vertido principal",
                "start_time": "0:30",
                "target_weight_percentage": 1.0,
                "description": "Agregar hasta 360g de agua.",
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
            "description": "Gruesa",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Vertido 1",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Agregar 60g de agua. (Var Dulzor: 50g / Var Acidez: 70g)",
            },
            {
                "step": 2,
                "name": "Vertido 2",
                "start_time": "0:45",
                "target_weight_percentage": 0.40,
                "description": "Agregar 60g de agua. (Var Dulzor: 70g / Var Acidez: 50g)",
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
    {
        "id": "v60-tetsu-katsuya-10",
        "method": "V60",
        "author": "Tetsu Kasuya (10 Vertidos)",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 96,
        "grind": {
            "description": "Muy gruesa (Comandante C40 a 40-45 clics)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.10,
                "description": "Agregar 30g de agua y esperar 30s antes del siguiente vertido.",
            },
            {
                "step": 2,
                "name": "Vertido 2",
                "start_time": "0:30",
                "target_weight_percentage": 0.20,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 3,
                "name": "Vertido 3",
                "start_time": "0:45",
                "target_weight_percentage": 0.30,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 4,
                "name": "Vertido 4",
                "start_time": "1:00",
                "target_weight_percentage": 0.40,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 5,
                "name": "Vertido 5",
                "start_time": "1:15",
                "target_weight_percentage": 0.50,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 6,
                "name": "Vertido 6",
                "start_time": "1:30",
                "target_weight_percentage": 0.60,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 7,
                "name": "Vertido 7",
                "start_time": "1:45",
                "target_weight_percentage": 0.70,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 8,
                "name": "Vertido 8",
                "start_time": "2:00",
                "target_weight_percentage": 0.80,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 9,
                "name": "Vertido 9",
                "start_time": "2:15",
                "target_weight_percentage": 0.90,
                "description": "Agregar 30g de agua.",
            },
            {
                "step": 10,
                "name": "Vertido 10",
                "start_time": "2:30",
                "target_weight_percentage": 1.0,
                "description": "Agregar 30g de agua para finalizar.",
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
                "description": "Bajar émbolo lento.",
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
    {
        "id": "aeropress-hoffmann",
        "method": "Aeropress",
        "author": "James Hoffmann",
        "base_ratio": 18.2,
        "base_coffee_g": 11,
        "base_water_g": 200,
        "temperature_c": 96,
        "grind": {
            "description": "Fina a media (un poco más gruesa que espresso)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Inmersión",
                "start_time": "0:00",
                "target_weight_percentage": 1.0,
                "description": "Verter los 200g de agua (justo fuera del hervor) sobre el café. Remover con fuerza para eliminar grumos. Colocar el émbolo solo para sellar, sin presionar.",
            },
            {
                "step": 2,
                "name": "Agitación",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "Retirar el émbolo y agitar suavemente para asentar el café.",
            },
            {
                "step": 3,
                "name": "Extracción",
                "start_time": "2:30",
                "target_weight_percentage": 1.0,
                "description": "Presionar lento durante 30s hasta el final.",
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
    # --- KALITA WAVE ---
    {
        "id": "kalita-3-vertidos",
        "method": "Kalita Wave",
        "author": "Receta Optimizada",
        "base_ratio": 16.0,
        "base_coffee_g": 25,
        "base_water_g": 400,
        "temperature_c": 92,
        "grind": {
            "description": "Media (como arena de playa)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Verter 80g de agua suavemente. Esperar 45s.",
            },
            {
                "step": 2,
                "name": "Vertido Principal",
                "start_time": "0:45",
                "target_weight_percentage": 0.50,
                "description": "Verter en espiral hasta los 200g. Mantener nivel de agua.",
            },
            {
                "step": 3,
                "name": "Cierre",
                "start_time": "1:30",
                "target_weight_percentage": 1.0,
                "description": "Completar hasta los 400g. Dejar drenar (2:30-3:00 total).",
            },
        ],
    },
    # --- HARIO PEGASUS ---
    {
        "id": "pegasus-2-vertidos",
        "method": "Hario Pegasus",
        "author": "Receta Oficial Hario",
        "base_ratio": 16.4,
        "base_coffee_g": 14,
        "base_water_g": 230,
        "temperature_c": 94,
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
                "target_weight_percentage": 0.196,
                "description": "Vertido rápido de 45g. Agitar suavemente la tolva para distribuir el agua de forma uniforme.",
            },
            {
                "step": 2,
                "name": "Segundo Vertido",
                "start_time": "0:30",
                "target_weight_percentage": 0.85,
                "description": "Verter en el centro con un flujo fino hasta que el nivel alcance 80-90% de la tolva.",
            },
            {
                "step": 3,
                "name": "Cierre",
                "start_time": "1:15",
                "target_weight_percentage": 1.0,
                "description": "Agitar suavemente y completar hasta 230g.",
            },
        ],
    },
    # --- MHW-3BOMBER METEORITE ---
    {
        "id": "meteorite-pulsos",
        "method": "MHW-3BOMBER Meteorite",
        "author": "Receta de Pulsos (Fondo Plano)",
        "base_ratio": 15.6,
        "base_coffee_g": 16,
        "base_water_g": 250,
        "temperature_c": 93,
        "grind": {
            "description": "Media (como arena de mar)",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Bloom",
                "start_time": "0:00",
                "target_weight_percentage": 0.20,
                "description": "Verter 50g de agua. Dar un giro suave al dripper para asentar la cama plana. Esperar 35s.",
            },
            {
                "step": 2,
                "name": "Segundo Vertido",
                "start_time": "0:35",
                "target_weight_percentage": 0.48,
                "description": "Verter en espiral lenta hasta los 120g. Mantener el flujo constante.",
            },
            {
                "step": 3,
                "name": "Tercer Vertido",
                "start_time": "1:10",
                "target_weight_percentage": 0.76,
                "description": "Verter en espiral hasta los 190g.",
            },
            {
                "step": 4,
                "name": "Vertido Final",
                "start_time": "1:45",
                "target_weight_percentage": 1.0,
                "description": "Completar hasta 250g. Dejar drenar (el tiempo total debería rondar los 2:30 a 2:45).",
            },
        ],
    },
    # --- CLEVER DRIPPER ---
    {
        "id": "clever-dripper-agua-primero",
        "method": "Clever Dripper",
        "author": "Agua Primero (Hoffmann)",
        "base_ratio": 15.0,
        "base_coffee_g": 20,
        "base_water_g": 300,
        "temperature_c": 95,
        "grind": {
            "description": "Media-fina",
            "timemore_x_lite_clicks": None,
            "m3_bomber_r3_pro_clicks": None,
        },
        "pours": [
            {
                "step": 1,
                "name": "Agua y Café",
                "start_time": "0:00",
                "target_weight_percentage": 1.0,
                "description": "Agregar toda el agua primero (300g). Luego añadir el café encima y hundirlo suavemente con una cuchara para humedecer todo.",
            },
            {
                "step": 2,
                "name": "Inmersión",
                "start_time": "0:30",
                "target_weight_percentage": 1.0,
                "description": "Tapar el Clever Dripper y dejar reposar sin tocar.",
            },
            {
                "step": 3,
                "name": "Decantación",
                "start_time": "2:00",
                "target_weight_percentage": 1.0,
                "description": "Romper suavemente la costra superficial. Dar un giro ligero al dripper y esperar 30 segundos para que las partículas finas decanten al fondo.",
            },
            {
                "step": 4,
                "name": "Drenaje",
                "start_time": "2:30",
                "target_weight_percentage": 1.0,
                "description": "Colocar el Clever sobre el servidor. El drenaje debería tomar alrededor de 45 a 60 segundos.",
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
