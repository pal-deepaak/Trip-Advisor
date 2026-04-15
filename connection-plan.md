# Connection Plan: FeaturesGrid to Backend Routes

## Context
The user wants to connect the FeaturesGrid frontend components with backend API routes. Currently:
- Frontend has 8 feature cards (Hotels, Restaurants, Things to Do, Travel Routes, Budget Planner, Weather Forecast, Saved Trips, Smart Itinerary Generator)
- Backend has routes in trips.js and travel.js that need to be connected
- Some grid features need new routes to be created

## Analysis of Current Routes

### Backend Routes Available:

**travel.js:**
- GET `/weather/:city` - Weather data with AI advice
- GET `/recommendations/:city` - Hotels and restaurants recommendations

**trips.js:**
- POST `/create` - Create new trip
- PUT `/itinerary/:id` - Update itinerary
- GET `/user/:userId` - Get user trips
- POST `/calculate-budget` - Calculate budget
- POST `/feedback` - Submit feedback
- PUT `/save-hotels/:id` - Save hotels
- PUT `/save-restaurants/:id` - Save restaurants
- PUT `/save-activities/:id` - Save activities
- PUT `/save-budget/:id` - Save budget
- PUT `/save-suggestions/:id` - Save suggestions

## Connection Mapping

### 1. Hotels Grid → `/recommendations/:city` (travel.js)
- **Current state**: Has route for recommendations
- **Connection**: Map Hotels card to GET recommendations endpoint
- **Implementation**: Pass city name to get hotel recommendations

### 2. Restaurants Grid → Needs dedicated route
- **Current state**: No restaurants-specific route in trips.js
- **Connection**: Create `GET /restaurants/:city` or add to existing routes
- **Implementation**: Add restaurants fetching to trips.js or travel.js

### 3. Weather Grid → `/weather/:city` (travel.js)
- **Current state**: Has route for weather
- **Connection**: Map Weather card to GET weather endpoint
- **Implementation**: Pass city name to get weather data

### 4. Smart Itinerary Generator → `/create` (trips.js)
- **Current state**: Has POST /create route
- **Connection**: Map Smart Itinerary card to create trip functionality
- **Implementation**: Use the existing /create endpoint

### 5. Budget Planner → `/calculate-budget` (trips.js)
- **Current state**: Has POST /calculate-budget route
- **Connection**: Map Budget card to budget calculation
- **Implementation**: Use existing budget calculation endpoint

### 6. Saved Trips → Needs dedicated route
- **Current state**: Has GET /user/:userId but not specific saved trips
- **Connection**: Create route to get saved/favorite trips
- **Implementation**: Add GET /saved-trips or similar

### 7. Travel Routes → Needs dedicated route
- **Current state**: No specific route for route visualization
- **Connection**: Create route for route data
- **Implementation**: Add GET /routes or similar

### 8. Things to Do → Needs dedicated route
- **Current state**: No specific route for activities
- **Connection**: Create route for activities/things to do
- **Implementation**: Add GET /activities or use existing save-activities

## Changes Required

### Frontend Changes (FeaturesGrid.tsx):
1. Add navigation handlers for each grid item
2. Pass city/location parameters to routes
3. Handle route navigation based on feature type

### Backend Changes (trips.js):
1. Add `GET /restaurants/:city` endpoint
2. Add `GET /saved-trips/:userId` endpoint
3. Add `GET /routes/:city` or similar for travel routes
4. Add `GET /activities/:city` for things to do

### Backend Changes (travel.js):
1. Consider adding restaurant-specific routes if needed

## Implementation Priority
1. High: Connect existing working routes (Hotels, Weather, Budget, Smart Itinerary)
2. Medium: Add missing routes (Restaurants, Saved Trips)
3. Low: Add specialized routes (Travel Routes, Things to Do)