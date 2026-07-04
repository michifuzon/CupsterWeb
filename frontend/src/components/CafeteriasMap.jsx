import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const CORDOBA_CENTER = [-31.4201, -64.1888];

export function CafeteriasMap({ places }) {
  return (
    <MapContainer center={CORDOBA_CENTER} zoom={13} className="map-container" scrollWheelZoom={false}>
      {/* Tiles de CARTO (gratis, sin API key) en vez de los de OSM por
          defecto - colores de calles/POIs mucho más prolijos, look
          más parecido a Google Maps sin depender de una cuenta paga. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      {places.map(place => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>
            <div className="map-popup">
              <strong>{place.name}</strong>
              {place.zone} · ⭐ {place.rating}
              <br />
              <Link to={`/cafeterias/${place.id}`}>Ver cafetería →</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
