import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationProps {
  onLocationUpdate?: (address: string) => void;
}

const Location = ({ onLocationUpdate }: LocationProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Get address using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name;
            setLocation(prev => ({
              ...prev!,
              address
            }));
            onLocationUpdate?.(address);
          } catch (err) {
            console.error("Error fetching address:", err);
          }
        },
        (err) => {
          setError("Aktifkan izin lokasi di HP, kemudian refresh kembali Website!");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, [onLocationUpdate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-black font-bold fixed bottom-0 right-4 rounded-full p-2 opacity-60">
      <MapPin className="w-4 h-4" />
      {location ? (
        <span className="truncate max-w-[300px]">
          {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
        </span>
      ) : (
        <span>Mencari lokasi Anda...</span>
      )}
    </div>
  );
};

export default Location;
