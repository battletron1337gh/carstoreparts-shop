export interface RdwVehicle {
  licensePlate: string;
  brand: string;
  model: string;
  vehicleType: string;
  type: string;
  variant: string;
  uitvoering: string;
  year: number;
  firstRegistrationDate: string;
  fuelType: string;
  engineCapacity: number | null;
  enginePowerKw: number | null;
  cylinders: number | null;
  massReady: number | null;
  doors: number | null;
}

const RDW_VEHICLE_URL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';
const RDW_FUEL_URL = 'https://opendata.rdw.nl/resource/8ys7-d773.json';

export function normalizeKenteken(plate: string): string {
  return plate.replace(/[-\s]/g, '').toUpperCase().trim();
}

function formatDate(dateString: string): string {
  if (!dateString || dateString.length !== 8) return '';
  return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
}

function mapFuelType(fuel: string): string {
  const map: Record<string, string> = {
    Benzine: 'petrol',
    Diesel: 'diesel',
    Elektriciteit: 'electric',
    Hybride: 'hybrid',
    Waterstof: 'hydrogen',
    LPG: 'lpg',
    CNG: 'cng',
    Alcohol: 'alcohol',
  };
  return map[fuel] || fuel.toLowerCase();
}

function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function lookupRdwVehicle(plate: string): Promise<RdwVehicle | null> {
  const kenteken = normalizeKenteken(plate);
  if (kenteken.length < 4) return null;

  const [vehicleRes, fuelRes] = await Promise.all([
    fetch(`${RDW_VEHICLE_URL}?kenteken=${kenteken}`),
    fetch(`${RDW_FUEL_URL}?kenteken=${kenteken}`),
  ]);

  if (!vehicleRes.ok) {
    throw new Error('RDW voertuig lookup mislukt');
  }

  const vehicles = await vehicleRes.json();
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return null;
  }

  const v = vehicles[0];
  const fuels = fuelRes.ok ? await fuelRes.json() : [];
  const fuel = Array.isArray(fuels) && fuels.length > 0 ? fuels[0] : null;

  return {
    licensePlate: v.kenteken || kenteken,
    brand: capitalize(v.merk || ''),
    model: capitalize(v.handelsbenaming || ''),
    vehicleType: v.voertuigsoort || '',
    type: v.type || '',
    variant: v.variant || '',
    uitvoering: v.uitvoering || '',
    year: v.datum_eerste_toelating
      ? parseInt(v.datum_eerste_toelating.substring(0, 4), 10)
      : 0,
    firstRegistrationDate: formatDate(v.datum_eerste_toelating),
    fuelType: fuel ? mapFuelType(fuel.brandstof_omschrijving) : '',
    engineCapacity: v.cilinderinhoud ? parseInt(v.cilinderinhoud, 10) : null,
    enginePowerKw: fuel?.nettomaximumvermogen
      ? parseFloat(fuel.nettomaximumvermogen)
      : v.nettomaximumvermogen
        ? parseFloat(v.nettomaximumvermogen)
        : null,
    cylinders: v.aantal_cilinders ? parseInt(v.aantal_cilinders, 10) : null,
    massReady: v.massa_rijklaar ? parseInt(v.massa_rijklaar, 10) : null,
    doors: v.aantal_deuren ? parseInt(v.aantal_deuren, 10) : null,
  };
}
