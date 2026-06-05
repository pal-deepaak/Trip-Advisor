from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel

import os
from dotenv import load_dotenv
from google import genai
import json


load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
api_key2 = os.getenv("GOOGLE_API_KEY2")

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment")
client = genai.Client(api_key=api_key)

if not api_key2:
    raise ValueError("GOOGLE_API_KEY2 not found in environment")
client2 = genai.Client(api_key=api_key2)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = pd.read_csv('Final_project_data.csv')


for col in ["type", "budget_category", "best_season", "region", "activities"]:
    data[col] = data[col].str.lower()


def calculate_score(row, user):
    score = 0

    # 🔥 activity (MOST IMPORTANT)
    if user.get("activities"):
        if row.get("activities") == user.get("activities"):
            score += 6
        else:
            score -= 3

    # 🔥 region
    if user.get("region") == row.get("region"):
        score += 3

    # 🔥 budget
    if user.get("budget") == row.get("budget_category"):
        score += 2

    # 🔥 rating + popularity
    score += float(row.get("rating", 0)) * 0.5
    score += float(row.get("popularity_score", 0)) * 0.03

    return score

@app.post("/recommend")
def recommend(user_input: dict):
    """
    Provide personalized destination recommendations based on user preferences.
    Uses weighted scoring system to rank destinations by relevance.
    """
    try:
        user_input = {k: str(v).lower() for k, v in user_input.items()}

        # Create a copy of data for scoring
        scored_data = data.copy()

        # Calculate relevance score for each destination
        scored_data["relevance_score"] = scored_data.apply(
            lambda row: calculate_score(row, user_input), axis=1
        )

        # Filter out invalid entries
        scored_data = scored_data[
            scored_data["city"].notna() &
            (scored_data["city"].str.lower() != "unknown")
        ]

        # Apply preference-based bonuses/penalties
        activities = user_input.get("activities")
        region = user_input.get("region")
        budget = user_input.get("budget")

        message_parts = []

        # Activity bonus - significant boost for exact match
        if activities:
            activity_match = scored_data["activities"] == activities
            scored_data.loc[activity_match, "relevance_score"] += 8
            if not activity_match.any():
                message_parts.append(f"No exact matches for '{activities}' activities found")

        # Region bonus - moderate boost for exact match
        if region:
            region_match = scored_data["region"] == region
            scored_data.loc[region_match, "relevance_score"] += 4
            if not region_match.any():
                message_parts.append(f"No destinations found in '{region}' region")

        # Budget bonus - small boost for exact match
        if budget:
            budget_match = scored_data["budget_category"] == budget
            scored_data.loc[budget_match, "relevance_score"] += 2
            if not budget_match.any():
                message_parts.append(f"No destinations found for '{budget}' budget")

        # Sort by relevance score (descending) then by rating/popularity as tie-breakers
        scored_data = scored_data.sort_values(
            by=["relevance_score", "rating", "popularity_score"],
            ascending=False
        )

        # Get top destinations (ensure variety by limiting per city)
        top_destinations = scored_data.groupby("city").head(3).head(15)

        # Prepare response with detailed destination information
        recommendations = []
        for _, row in top_destinations.iterrows():
            recommendations.append({
                "destination": row["destination"],
                "city": row["city"],
                "region": row["region"],
                "type": row["type"],
                "activities": row["activities"],
                "budget_category": row["budget_category"],
                "best_season": row["best_season"],
                "rating": float(row["rating"]),
                "popularity_score": float(row["popularity_score"]),
                "description": row["description"],
                "relevance_score": float(row["relevance_score"])
            })

        # Generate summary message
        if message_parts:
            message = "; ".join(message_parts) + ". Showing best available matches."
        else:
            message = f"Found 5 personalized recommendations for you!"

        # Fallback to popular destinations if no relevant matches
        if len(recommendations) == 0:
            fallback_data = data[
                data["city"].notna() &
                (data["city"].str.lower() != "unknown")
            ].sort_values(
                by=["rating", "popularity_score"],
                ascending=False
            ).head(10)

            recommendations = []
            for _, row in fallback_data.iterrows():
                recommendations.append({
                    "destination": row["destination"],
                    "city": row["city"],
                    "region": row["region"],
                    "type": row["type"],
                    "activities": row["activities"],
                    "budget_category": row["budget_category"],
                    "best_season": row["best_season"],
                    "rating": float(row["rating"]),
                    "popularity_score": float(row["popularity_score"]),
                    "description": row["description"],
                    "relevance_score": float(row["rating"] * 0.5 + row["popularity_score"] * 0.03)
                })

            message = "Showing top-rated destinations based on popularity and rating."

        return {
            "message": message,
            "recommendations": recommendations,
            "total_found": len(recommendations)
        }
    except Exception as e:
        print(f"Recommendation error: {e}")
        # Fallback to simple popular destinations
        fallback_data = data[
            data["city"].notna() &
            (data["city"].str.lower() != "unknown")
        ].sort_values(
            by=["rating", "popularity_score"],
            ascending=False
        ).head(10)

        recommendations = []
        for _, row in fallback_data.iterrows():
            recommendations.append({
                "destination": row["destination"],
                "city": row["city"],
                "region": row["region"],
                "type": row["type"],
                "activities": row["activities"],
                "budget_category": row["budget_category"],
                "best_season": row["best_season"],
                "rating": float(row["rating"]),
                "popularity_score": float(row["popularity_score"]),
                "description": row["description"],
                "relevance_score": float(row["rating"] * 0.5 + row["popularity_score"] * 0.03)
            })

        return {
            "message": "Showing popular destinations as fallback.",
            "recommendations": recommendations,
            "total_found": len(recommendations)
        }

@app.post("/itinerary")
def generate_itinerary(user_input: dict):
    try:
        city = user_input.get('city', '').strip()
        city_lower = city.lower()
        days = int(user_input.get('days', 1)) if str(user_input.get('days', '1')).isdigit() else 1
        interest = user_input.get('interest', 'sightseeing').lower()
        traveler_type = user_input.get('traveler_type', 'family').lower()
        budget = user_input.get('budget', 'mid_range').lower()

        # Get places from data for this city (case-insensitive)
        filtered = data[data['city'].str.lower() == city_lower]
        filtered = filtered.sort_values(by=["rating", "popularity_score"], ascending=False)
        places = filtered['destination'].head(10).tolist()

        # If no places found, use general knowledge
        if len(places) == 0:
            places = [f"Popular attractions in {city.title()}"]
        print(f"Found {len(places)} places for city: {city}")

        prompt = f"""
Create a {days}-day travel itinerary for {city.title()}.
User interest: {interest}

Available places: {', '.join(places[:5])}

Return ONLY valid JSON (no markdown, no code blocks):

{{
  "city": "{city.title()}",
  "duration_days": {days},
  "theme": "{days}-Day {interest.title()} Experience",
  "overview": "A curated {days}-day itinerary in {city.title()} focusing on {interest}.",
  "days": [
    {{
      "day": 1,
      "title": "Day 1: Exploring {city.title()}",
      "activities": [
        {{
          "time": "Morning",
          "place": "Place name",
          "activity": "Activity description",
          "description": "Brief details",
          "duration": "2-3 hours",
          "tips": "Helpful tip"
        }},
        {{
          "time": "Afternoon",
          "place": "Local restaurant",
          "activity": "Lunch - Local cuisine",
          "description": "Try regional specialties",
          "duration": "1-2 hours",
          "tips": "Ask for local dishes"
        }},
        {{
          "time": "Evening",
          "place": "Evening spot",
          "activity": "Sunset or shopping",
          "description": "Relax and enjoy",
          "duration": "2 hours",
          "tips": "Great for photos"
        }}
      ],
      "day_summary": "Explore the best of {city.title()}"
    }}
  ],
  "travel_tips": [
    "Start early to avoid crowds",
    "Carry water and stay hydrated",
    "Respect local customs"
  ],
  "estimated_budget": {{
    "budget_category": "{budget}",
    "daily_estimate": "Rs. 1500-3000 per day",
    "includes": ["Food", "Transport", "Entry fees"]
  }}
}}

IMPORTANT: Return ONLY the JSON object, nothing else. No markdown formatting.
"""

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        plan_text = response.text.strip()

        # Clean markdown code blocks
        plan_text = plan_text.replace("```json", "").replace("```", "").strip()

        # Try to parse JSON
        try:
            plan_json = json.loads(plan_text)
            print(plan_json)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            print(f"Response text: {plan_text[:500]}")
            # Create fallback itinerary
            plan_json = create_fallback_itinerary(city, days, interest, budget, places)

        return plan_json

    except Exception as e:
        print(f"Itinerary error: {e}")
        return {
            "error": "Itinerary generation failed",
            "details": str(e)
        }


def create_fallback_itinerary(city: str, days: int, interest: str, budget: str, places: list):
    """Create a structured fallback itinerary when AI fails."""
    city_name = city.title() if city else "Destination"

    return {
        "city": city_name,
        "duration_days": days,
        "theme": f"{days}-Day {interest.title()} Experience",
        "overview": f"Explore the beautiful {city_name} with this curated itinerary.",
        "days": [
            {
                "day": i + 1,
                "title": f"Day {i + 1}: Discover {city_name}",
                "activities": [
                    {
                        "time": "Morning",
                        "place": places[i] if i < len(places) else f"Local attraction {i + 1}",
                        "activity": "Sightseeing and exploration",
                        "description": "Start your day with fresh energy",
                        "duration": "2-3 hours",
                        "tips": "Start early for best experience"
                    },
                    {
                        "time": "Afternoon",
                        "place": "Local restaurant",
                        "activity": "Lunch - Regional cuisine",
                        "description": "Enjoy authentic local flavors",
                        "duration": "1-2 hours",
                        "tips": "Try the regional specialties"
                    },
                    {
                        "time": "Evening",
                        "place": places[-(i + 1)] if len(places) > i else "City center",
                        "activity": "Evening stroll and shopping",
                        "description": "Relax and soak in the atmosphere",
                        "duration": "2 hours",
                        "tips": "Perfect time for photography"
                    }
                ],
                "day_summary": f"Day {i + 1} in {city_name}"
            }
            for i in range(days)
        ],
        "travel_tips": [
            "Start your day early to make the most of it",
            "Carry water and stay hydrated",
            "Respect local culture and customs",
            "Keep emergency contacts handy"
        ],
        "estimated_budget": {
            "budget_category": budget,
            "daily_estimate": "Rs. 1500-3000 per day (mid-range)",
            "includes": ["Food", "Local transport", "Entry fees"]
        }
    }

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
# Store conversation history per session
chat_sessions: dict[str, list] = {}

# Travel expertise context for the AI
TRAVEL_EXPERT_PROMPT = """
You are VoyageAI, an expert travel assistant with deep knowledge about Indian tourism.
You help users with:
- Personalized destination recommendations based on preferences, budget, and interests
- Day-by-day itinerary planning
- Travel tips (best seasons, packing, safety, local culture)
- Budget planning and cost-saving tips and budget and all the currency are show in the indian rupees not in dollars and other currency
- Activity suggestions (trekking, beaches, heritage, wildlife, adventure sports)
- Route planning and multi-city trip suggestions
- Food recommendations and local cuisine guidance
- Accommodation tips (budget hotels, homestays, luxury resorts)

Guidelines:
- Be friendly, conversational, and helpful
- Ask clarifying questions when user input is vague
- Provide specific, actionable advice
- When recommending places, mention 2-3 specific destinations with brief details
- Consider budget, season, and traveler type (solo, family, couple, group)
- For hill stations, suggest summer; for beaches, suggest winter
- Always prioritize safety and responsible tourism

Available data covers: North India (mountains, heritage), South India (beaches, temples),
East India (culture, nature), West India (beaches, deserts, cities), Central India (wildlife, tribal)
"""
def extract_intent_and_entities(user_msg: str, conversation_history: list) -> dict:
    """Use AI to extract intent and entities from user message with conversation context."""

    context_summary = ""
    if conversation_history:
        recent = conversation_history[-6:]  # Last 6 messages for context
        context_summary = "\nRecent conversation:\n" + "\n".join(
            [f"{'User' if i%2==0 else 'Bot'}: {msg}" for i, msg in enumerate(recent)]
        )

    prompt = f"""
Analyze this travel-related message and extract intent and entities.

{context_summary}

Current user message: "{user_msg}"

Return ONLY valid JSON (no extra text):
{{
    "intent": "recommendation" | "itinerary" | "travel_advice" | "general_chat" | "budget_query" | "activity_suggestion",
    "entities": {{
        "city": "" or null,
        "region": "" or null (north/south/east/west/central),
        "activities": "" or null (trekking/beaches/heritage/wildlife/adventure/religious/spiritual/hill_station),
        "budget": "" or null (budget/mid_range/luxury),
        "days": number or null,
        "traveler_type": "" or null (solo/family/couple/group),
        "season": "" or null (summer/winter/monsoon)
    }},
    "needs_followup": true/false,
    "followup_question": "" if needs_followup else null
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        result = json.loads(response.text.strip())
        return result
    except:
        # Fallback to basic keyword matching
        return {
            "intent": "general_chat",
            "entities": {},
            "needs_followup": False
        }
def generate_travel_response(intent_data: dict, user_msg: str, conversation_history: list) -> dict:
    """Generate appropriate response based on detected intent."""

    intent = intent_data.get("intent", "general_chat")
    entities = intent_data.get("entities", {})

    # 🎯 RECOMMENDATION INTENT
    if intent == "recommendation":
        activities = entities.get("activities") or "sightseeing"
        region = entities.get("region") or ""
        budget = entities.get("budget") or ""

        result = recommend({
            "activities": activities,
            "region": region,
            "budget": budget
        })

        # Generate a personalized response using AI
        response_prompt = f"""
User wants destination recommendations.
Preferences: activities={activities}, region={region or 'any'}, budget={budget or 'any'}

Recommended cities: {', '.join(result.get('cities', []))}

Write a friendly, helpful response (2-4 sentences) recommending these destinations.
Mention 2-3 specific places if possible and why they match the user's preferences.
"""
        try:
            ai_response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=response_prompt
            )
            result["ai_message"] = ai_response.text.strip()
        except:
            pass

        return {"type": "recommend", "data": result}

    # 📋 ITINERARY INTENT
    elif intent == "itinerary":
        city = entities.get("city")
        days = entities.get("days")
        interest = entities.get("activities") or "sightseeing"

        if not city:
            # Ask for city
            return {
                "type": "chat",
                "data": "I'd love to create an itinerary for you! Which city would you like to visit?"
            }

        if not days:
            return {
                "type": "chat",
                "data": f"Great choice! How many days are you planning to spend in {city}?"
            }

        # Generate itinerary
        try:
            itinerary_result = generate_itinerary({
                "city": city,
                "days": int(days) if isinstance(days, int) else int(days) if str(days).isdigit() else 1,
                "interest": interest
            })

            # Check if result has error
            if isinstance(itinerary_result, dict) and itinerary_result.get("error"):
                return {"type": "itinerary", "data": itinerary_result}

            return {"type": "itinerary", "data": itinerary_result}
        except Exception as e:
            return {
                "type": "chat",
                "data": f"Sorry, I encountered an error generating the itinerary: {str(e)}"
            }

    # 💰 BUDGET QUERY
    elif intent == "budget_query":
        budget_prompt = f"""
User has a budget-related question: "{user_msg}"

Provide helpful budget travel tips for India including:
- Approximate costs for different budget levels
- Money-saving tips
- Best value destinations
- Cheap accommodation options
- Budget food options

Keep it conversational and practical (3-5 sentences).
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=budget_prompt
        )
        return {"type": "chat", "data": response.text}

    # 🎯 ACTIVITY SUGGESTION
    elif intent == "activity_suggestion":
        activity_prompt = f"""
User is asking about activities: "{user_msg}"

Suggest specific activities and destinations in India that match their interest.
Be specific - mention 3-4 places and what makes them special.
Include tips on best time to visit and approximate costs.

Keep it conversational and enthusiastic (4-6 sentences).
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=activity_prompt
        )
        return {"type": "chat", "data": response.text}

    # 🧳 TRAVEL ADVICE
    elif intent == "travel_advice":
        advice_prompt = f"""
User is asking for travel advice: "{user_msg}"

Provide expert travel advice based on the question.
Consider: safety, best time to visit, packing tips, local customs,
transportation, permits, health precautions.

Be practical and reassuring (3-5 sentences).
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=advice_prompt
        )
        return {"type": "chat", "data": response.text}

    # 💬 GENERAL CHAT (with travel expertise)
    else:
        # Build context-aware prompt
        context = ""
        if conversation_history:
            context = f"Conversation history: {' | '.join(conversation_history[-4:])}\n\n"

        chat_prompt = f"""
{TRAVEL_EXPERT_PROMPT}

{context}User says: "{user_msg}"

Respond as a friendly, knowledgeable travel expert.
- If they're asking about travel, give specific, useful advice
- If it's casual chat, be conversational but look for opportunities to help with travel planning
- Ask follow-up questions to understand their travel needs better
- Be warm and enthusiastic (3-5 sentences)
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=chat_prompt
        )
        return {"type": "chat", "data": response.text}
@app.post("/chat")
def chat(user_input: dict):
    """
    Intelligent travel chatbot with conversation memory.
    Handles: recommendations, itineraries, travel advice, budget queries, activity suggestions.
    """

    user_msg = user_input.get("message", "")
    session_id = user_input.get("session_id", "default")

    if not user_msg.strip():
        return {"type": "chat", "data": "Please enter a message."}

    # Initialize or get session history
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    history = chat_sessions[session_id]

    # Add user message to history
    history.append(user_msg)

    try:
        # Step 1: Extract intent with conversation context
        intent_data = extract_intent_and_entities(user_msg, history)

        # Step 2: Generate response based on intent
        response = generate_travel_response(intent_data, user_msg, history)

        # Step 3: Add bot response to history
        bot_text = response.get("data", "")
        if isinstance(bot_text, dict):
            bot_text = str(bot_text)
        history.append(bot_text[:500])  # Store truncated response

        # Step 4: Check if follow-up needed
        if intent_data.get("needs_followup") and intent_data.get("followup_question"):
            response["followup"] = intent_data["followup_question"]

        return response

    except Exception as e:
        # Fallback: direct AI response
        try:
            fallback_prompt = f"""
{TRAVEL_EXPERT_PROMPT}

User: "{user_msg}"

Respond helpfully as a travel expert.
"""
            response = client2.models.generate_content(
                model="gemini-2.5-flash",
                contents=fallback_prompt
            )
            return {"type": "chat", "data": response.text}
        except Exception as e:
            print("ERROR:", str(e))