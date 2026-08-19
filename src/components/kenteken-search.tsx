'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { lookupRdwVehicle, normalizeKenteken, RdwVehicle } from '@/lib/rdw';

export function KentekenSearch() {
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<RdwVehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVehicle(null);

    const normalized = normalizeKenteken(plate);
    if (normalized.length < 4) {
      setError('Voer een geldig kenteken in');
      return;
    }

    setLoading(true);
    try {
      const result = await lookupRdwVehicle(plate);
      if (!result) {
        setError('Geen voertuig gevonden voor dit kenteken');
      } else {
        setVehicle(result);
      }
    } catch (err) {
      setError('Kenteken lookup mislukt. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="Bijv. AB-123-CD"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          className="flex-1 uppercase"
          maxLength={10}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Zoeken...' : 'Kenteken opzoeken'}
        </Button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {vehicle && (
        <div className="bg-gray-50 border rounded-lg p-4 text-left">
          <p className="text-sm text-gray-500 mb-1">Gevonden voertuig</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="font-semibold">{vehicle.brand} {vehicle.model}</span>
            <span>{vehicle.year}</span>
            <span className="capitalize">{vehicle.fuelType}</span>
            <span>{vehicle.engineCapacity ? `${vehicle.engineCapacity} cc` : ''}</span>
            <span>{vehicle.vehicleType}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {vehicle.type} / {vehicle.variant} / {vehicle.uitvoering}
          </p>
        </div>
      )}
    </div>
  );
}
