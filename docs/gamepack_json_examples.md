# GamePack JSON Examples

The admin scan feature reads `.json` files from `frontend/public/GamePack` to automatically import data.
Each game directory should contain a `game.json` file and optional subfolders for cars, tracks and layouts.

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
  "name": "Monza",
  "imageUrl": "/images/tracks/monza.jpg",
  "description": "Fast circuit in Italy"
}
```

## layout.json
```json
{
  "name": "Full Course",
  "imageUrl": "/images/layouts/monza_full.jpg"
}
```

## car.json
```json
{
  "name": "Chevrolet Chevette",
  "imageUrl": "/images/cars/chevette.jpg",
  "description": "Classic hatchback"
}
```
