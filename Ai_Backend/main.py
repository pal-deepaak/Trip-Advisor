from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os 
from dotenv import load_dotenv
from google import genai
import json


load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment")
client = genai.Client(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = pd.read_csv('proj_data.csv')

for col in ["type", "budget_category", "best_season", "region", "activities"]:
    data[col] = data[col].str.lower()


def calculate_score(row, user):
    try:
        score = 0

        if row.get("type") == user.get("type"):
            score += 3

        if row.get("budget_category") == user.get("budget"):
            score += 2

        if row.get("best_season") == user.get("season"):
            score += 2

        if row.get("region") == user.get("region"):
            score += 2

        activities = str(row.get("activities"))

        if user.get("activities") in activities:
            score += 3

        score += float(row.get("rating", 0)) * 0.2
        score += float(row.get("popularity_score", 0)) * 0.02

        return float(score)

    except:
        return 0


@app.post("/recommend")
def recommend(user_input: dict):

    # 🔥 INPUT NORMALIZATION
    user_input = {k: str(v).lower() for k, v in user_input.items()}

    # 🔥 FILTERING
    filtered = data[
        (data['region'] == user_input['region']) &
        (data['type'] == user_input['type'])
    ]

    # 🔥 FALLBACKS (VERY IMPORTANT)
    if len(filtered) == 0:
        filtered = data[data['region'] == user_input['region']]

    if len(filtered) == 0:
        filtered = data.copy()

    filtered = filtered.copy()

    # 🔥 SCORE
    scores = filtered.apply(
        lambda row: calculate_score(row, user_input), axis=1
    )

    filtered["score"] = scores

    # 🔥 CITY LEVEL
    city_score = (
        filtered.groupby("city")
        .agg({
            "score": "mean",
            "popularity_score": "mean"
        })
    )

    city_score["final_score"] = (
        city_score['score'] * 0.7 +
        city_score['popularity_score'] * 0.3
    )

    top_cities = city_score.sort_values(
        by="final_score", ascending=False
    ).head(5)

    return top_cities.index.tolist()

@app.post("/itinerary")
def generat_itinerary(user_input : dict):
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        city = user_input.get('city', '').lower()
        days = int(user_input.get('days', 1))
        interest = user_input.get('interest', '').lower()

        filtered = data[data['city'].str.lower() == city]
        filtered = filtered.sort_values(by=["rating","popularity_score"], ascending=False)
        places = filtered['destination'].head(10).tolist()

        prompt = f"""
        You are a travel planner.

Create a {days}-day itinerary for {city}.

User interest: {interest}

Available places:
{places}

IMPORTANT RULES:
- Return ONLY valid JSON
- No explanation
- No text outside JSON

- Format must be exactly like this:


{{
  "Day 1": [
    {{
      "place": "Place name",
      "activity": "What to do there",
      "description": "Details about the place", 
      "rating": "Rating from data",
      "budget": "Budget category",
      "best_season": "Best time to visit"
    }}
  ],
  "Day 2": [
    {{
      "place": "Place name",
      "activity": "What to do there",
      "description": "Details about the place", 
      "rating": "Rating from data",
      "budget": "Budget category",
      "best_season": "Best time to visit"
    }}
  ]
}}

- Each place must include a short activity
- Activities should match user interest
- Keep it realistic and useful
- Do not repeat places
        """
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            contents=prompt
        )
        plan_text = response.text.strip()
        try:
            plan_json = json.loads(plan_text)
        except:
            # अगर AI गड़बड़ करे
            plan_json = {
                "raw": plan_text,
                "error": "AI did not return valid JSON"
            }

        return plan_json

    except Exception as e:
        return {
            "error": "Itinerary generation failed",
            "details": str(e)
        }