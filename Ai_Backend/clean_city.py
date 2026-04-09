import pandas as pd
from rapidfuzz import process

data = pd.read_csv("final_with_city.csv")

def normalize_city(city):
    return str(city).lower().strip()

data['city'] = data['city'].apply(normalize_city)

unique_cities = data['city'].dropna().unique()
city_map = {}

for city in unique_cities:
    if len(city_map) == 0:
        city_map[city] = city
        continue

    match,score,_ = process.extractOne(city,list(city_map.keys()))

    if score > 85:
        city_map[city] = match
    else:
        city_map[city] = city

data['city'] = data['city'].map(city_map)

def final_clean(city):
    city = str(city)

    if "delhi" in city:
        return "Delhi"
    
    if "mumbai" in city:
        return "Mumbai"
    
    return city.title()

data['city'] = data['city'].apply(final_clean)

data.to_csv("proj_data.csv",index=False)
print("Done")