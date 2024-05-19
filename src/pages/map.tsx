import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('../components/map'), { ssr: false });

export default function Home() {
    const [center, setCenter] = useState([0, 0]);
    const [currentLocation, setCurrentLocation] = useState([0, 0]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat');
        const long = urlParams.get('long');
        const parsedLat = parseFloat(lat ?? '0');
        const parsedLong = parseFloat(long ?? '0');
        const latValue = !isNaN(parsedLat) ? parsedLat : 0;
        const longValue = !isNaN(parsedLong) ? parsedLong : 0;
        setCenter(lat ? [longValue, latValue] : [-74.006, 40.7128]);
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation([position.coords.longitude, position.coords.latitude]);
        });
    }, []);

  return (
    <div>
      <Head>
        <title>Navigation</title>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <Map
        start={currentLocation}
        end={center}
      />
    </div>
  );
}