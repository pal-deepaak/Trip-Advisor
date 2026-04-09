from geopy.geocoders import Nominatim
import pandas as pd
import time

data = pd.read_csv('Final_destination.csv')

geolocator = Nominatim(user_agent = "travel_app")

def get_city(lat,lon):
    try:
        location = geolocator.reverse((lat,lon),language="en")
        address = location.raw['address']
        print(address)

        if 'city' in address:
            return address['city']
        elif 'town' in address:
            return address['town']
        elif 'village' in address:
            return address['village']
        elif 'state_district' in address:
            return address['state_district']
        else:
            return address.get('state','unknown')

    except:
        return "unknown"


cities = []

for i,row in data.iterrows():
    city = get_city(row['latitude'],row['longitude'])
    cities.append(city)

    print(i,city)

    time.sleep(1)

data['city'] = cities

data.to_csv("final_with_city.csv",index=False)
print("Done")

