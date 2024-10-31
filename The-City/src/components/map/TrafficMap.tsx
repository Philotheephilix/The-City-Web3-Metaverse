import { useEffect, useRef, FC } from 'react';
import maplibregl from 'maplibre-gl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Define types for props and export them
export interface MapPreviewProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  style?: 'streets' | 'satellite' | 'dark';
}

const STYLE_URLS = {
  streets: 'https://demotiles.maplibre.org/style.json',
  satellite: 'https://api.maptiler.com/maps/satellite/style.json?key=get_your_own_key',
  dark: 'https://api.maptiler.com/maps/streets-dark/style.json?key=get_your_own_key'
} as const;

// Explicitly type the component as FC (Function Component) with MapPreviewProps
const MapPreview: FC<MapPreviewProps> = ({
  latitude = 51.505,
  longitude = -0.09,
  zoom = 13,
  style = 'streets'
}: MapPreviewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map
      mapInstanceRef.current = new maplibregl.Map({
        container: mapRef.current,
        style: STYLE_URLS[style],
        center: [longitude, latitude],
        zoom: zoom,
        attributionControl: false,
        antialias: true
      });

      // Add navigation controls
      mapInstanceRef.current.addControl(
        new maplibregl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }),
        'top-right'
      );

      // Add scale control
      mapInstanceRef.current.addControl(
        new maplibregl.ScaleControl({
          maxWidth: 80,
          unit: 'metric'
        }),
        'bottom-left'
      );

      // Add geolocate control
      mapInstanceRef.current.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }),
        'top-right'
      );

      // Add marker
      markerRef.current = new maplibregl.Marker({
        color: '#FF0000',
        draggable: true
      })
        .setLngLat([longitude, latitude])
        .addTo(mapInstanceRef.current);

      // Add marker drag event
      markerRef.current.on('dragend', () => {
        const lngLat = markerRef.current?.getLngLat();
        if (lngLat) {
          console.log('New position:', lngLat);
        }
      });

      // Handle map load event
      mapInstanceRef.current.on('load', () => {
        console.log('Map loaded');
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Only run on mount

  // Update map when props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter([longitude, latitude]);
      mapInstanceRef.current.setZoom(zoom);
      
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }
    }
  }, [latitude, longitude, zoom]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Map Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-md overflow-hidden"
        />
        <div className="mt-4 text-sm text-gray-500">
          Latitude: {latitude}, Longitude: {longitude}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPreview;