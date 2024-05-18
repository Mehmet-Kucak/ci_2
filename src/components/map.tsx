// components/Map.js
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ({ center = [0, 0], zoom = 2 }) => {
  const mapContainer = useRef(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

  useEffect(() => {
    if (mapContainer.current && mapboxToken) {
        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [center[0], center[1]], // Ensure center has two elements
            zoom: zoom
        });

        // Add navigation control (zoom and rotate)
        map.addControl(new mapboxgl.NavigationControl());

        return () => map.remove();
    }
  }, [center, zoom, mapboxToken]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
