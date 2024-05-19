import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

const Map = ({ start, end}) => {
  const mapContainer = useRef(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;

  useEffect(() => {
    if (mapContainer.current && mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
  
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: start,
        zoom: 12
      });
  
      map.on('load', () => {
        const directions = new MapboxDirections({
          accessToken: mapboxToken,
          unit: 'metric',
          profile: 'mapbox/driving',
        });
  
        map.addControl(directions, 'top-left');
  
        directions.setOrigin(start);
        directions.setDestination(end);
      });
  
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: true
      }));

  
      return () => map.remove();
    }
  }, [start, end, mapboxToken]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
