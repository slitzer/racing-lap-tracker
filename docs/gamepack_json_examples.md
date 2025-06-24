# GamePack JSON Examples

The admin scan feature reads `.json` files from `frontend/public/GamePack` to automatically import data.
Each game directory should contain a `game.json` file and optional subfolders for cars and tracks.  
Layouts can live under a dedicated `layouts` directory or directly inside the track folder:

```
GamePack/<game>/tracks/<track>/layouts/<layout>/layout.json
GamePack/<game>/tracks/<track>/<layout>/layout.json  # legacy structure
```

## game.json
```json
{
  "name": "Example Racing Game",
  "imageUrl": "/images/games/example.jpg"
}
```

## track.json
```json
{
  "name": "Imola",
  "officialName": "Autodromo Enzo e Dino Ferrari",
  "country": "Italy",
  "city": "Imola",
  "game": "Assetto Corsa Competizione",
  "gamePack": "ACC 2020 GT World Challenge Pack",
  "dlc": "2020 GTWC Pack DLC",
  "description": "A historic Formula 1 and endurance racing circuit known for its challenging layout and fast corners.",
  "tags": ["circuit", "historic", "Italy", "F1", "GT", "Endurance"],
  "geotags": {
    "latitude": 44.3439,
    "longitude": 11.7161
  },
  "videoUrl": "https://www.youtube.com/watch?v=example",
  "specs": {
    "lengthM": 4909,
    "widthM": 15,
    "turns": 17,
    "pitBoxes": 24,
    "pitSpeedLimitKPH": 60,
    "isClockwise": false,
    "altitudeM": 65,
    "timezoneOffset": "+1",
    "defaultMonth": 5,
    "defaultDay": 14,
    "grade": "Grade 1",
    "trackType": "Permanent Circuit",
    "surfaceType": "Asphalt",
    "climateZone": "Mediterranean",
    "lighting": true,
    "hasRainSupport": true,
    "aiMax": 32
  },
  "media": {
    "imageUrl": "/GamePack/ACC/tracks/imola/imola_main.jpg",
    "logoUrl": "/GamePack/ACC/tracks/imola/imola_logo.png",
    "additionalImages": [
      "/GamePack/ACC/tracks/imola/image_1.jpg",
      "/GamePack/ACC/tracks/imola/image_2.jpg"
    ]
  },
  "layouts": [
    {
      "name": "Grand Prix",
      "lengthM": 4909,
      "turns": 17,
      "isClockwise": false,
      "layoutImageUrl": "/GamePack/ACC/tracks/imola/layouts/grand_prix/monza_full.jpg"
    }
  ]
}
```

## layout.json
```json
{
  "name": "Full Course",
  "imageUrl": "/images/layouts/monza_full.jpg",
  "pitSpeedLimitHighKPH": 80,
  "maxAIParticipants": 32,
  "raceDateYear": 2024,
  "raceDateMonth": 6,
  "raceDateDay": 1,
  "trackSurface": "Asphalt",
  "trackType": "Permanent Circuit",
  "trackGradeFilter": "Grade 1",
  "numberOfTurns": 15,
  "trackTimeZone": "Europe/Rome",
  "trackAltitude": "112m",
  "length": "5.79 km",
  "dlcId": "pack1",
  "location": "Monza, Italy"
}
```

## car.json
```json
{
  "name": "Chevrolet Corvette C8.R",
  "manufacturer": "Chevrolet",
  "model": "Corvette C8.R",
  "year": 2020,
  "class": "GTE",
  "series": "IMSA / WEC",
  "game": "Assetto Corsa Competizione",
  "gamePack": "ACC GT4 Pack",
  "dlc": "GT4 Pack DLC",
  "description": "A modern mid-engine GTE-class racing car built for endurance racing.",
  "specs": {
    "powerHP": 500,
    "torqueNM": 650,
    "weightKG": 1245,
    "topSpeedKPH": 295,
    "acceleration0to100": 3.4,
    "brakingDistance100to0": 32.5,
    "massDistribution": "51/49",
    "engine": "5.5L V8 NA",
    "fuelType": "Petrol",
    "drivetrain": "RWD",
    "gearbox": "6-speed sequential",
    "inputType": "Sequential",
    "isElectric": false,
    "headlights": true,
    "ers": false,
    "abs": true,
    "tc": true
  },
  "media": {
    "imageUrl": "/GamePack/ACC/cars/corvette_c8r/c8r_main.jpg",
    "additionalImages": [
      "/GamePack/ACC/cars/corvette_c8r/c8r_1.jpg",
      "/GamePack/ACC/cars/corvette_c8r/c8r_2.jpg"
    ]
  }
}
```
