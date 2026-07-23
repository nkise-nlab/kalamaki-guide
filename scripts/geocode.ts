/**
 * One-off helper (run in CI): queries Overpass for the tour POIs around
 * Zakynthos Town and prints centroids as JSON, so estimated coordinates in
 * src/data/pois.ts can be corrected. Read the results from the workflow log.
 */
const QUERY = `
[out:json][timeout:60];
(
  nwr["name"~"Άγιος Διονύσιος",i](37.76,20.88,37.80,20.91);
  nwr["name"~"Νικόλαος του Μώλου|Nicholas of the Mole",i](37.76,20.88,37.80,20.91);
  nwr["name"~"Πλατεία Σολωμού|Solomos Square",i](37.76,20.88,37.80,20.91);
  nwr["name"~"Πλατεία Αγίου Μάρκου|San Marco",i](37.76,20.88,37.80,20.91);
  nwr["name"~"Μουσείο Ζακύνθου|Byzantine Museum",i](37.76,20.88,37.80,20.91);
  nwr["name"~"Σολωμού και Επιφανών|Eminent",i](37.76,20.88,37.80,20.91);
  nwr["name"~"Πικριδιώτισσα",i](37.76,20.87,37.81,20.91);
  nwr["name"~"Κάστρο|Castle|Castello",i](37.78,20.87,37.81,20.91);
  nwr["name"~"Στράνη|Strani",i](37.78,20.87,37.81,20.92);
  nwr["name"~"Ρώμα|Roma",i](37.77,20.88,37.80,20.91);
  nwr["name"~"Χρυσοπηγή",i](37.78,20.87,37.81,20.91);
  nwr["tourism"="viewpoint"](37.788,20.885,37.797,20.90);
);
out center tags;
`

const resp = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: 'data=' + encodeURIComponent(QUERY),
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})
if (!resp.ok) {
  console.error('Overpass failed:', resp.status, await resp.text())
  process.exit(1)
}
interface OsmElement {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}
const data = (await resp.json()) as { elements: OsmElement[] }
const rows = data.elements.map((el) => ({
  osm: `${el.type}/${el.id}`,
  lat: el.lat ?? el.center?.lat,
  lng: el.lon ?? el.center?.lon,
  name: el.tags?.name,
  nameEn: el.tags?.['name:en'],
  kind: el.tags?.amenity ?? el.tags?.historic ?? el.tags?.tourism ?? el.tags?.building ?? '',
}))
console.log('GEOCODE_RESULTS_START')
console.log(JSON.stringify(rows, null, 2))
console.log('GEOCODE_RESULTS_END')
