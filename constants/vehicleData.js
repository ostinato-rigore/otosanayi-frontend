// constants/vehicleData.js
export const VEHICLE_BRANDS = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
];

export const VEHICLE_MODELS = {
  Toyota: ["Corolla", "Camry", "RAV4", "Prius", "Highlander"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  Ford: ["F-150", "Focus", "Escape", "Explorer", "Mustang"],
  Chevrolet: ["Silverado", "Malibu", "Equinox", "Tahoe", "Camaro"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  Mercedes: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
  Audi: ["A3", "A4", "Q5", "Q7", "A6"],
  Volkswagen: ["Golf", "Jetta", "Tiguan", "Atlas", "Passat"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"],
  Kia: ["Forte", "Optima", "Sorento", "Sportage", "Telluride"],
};

export const VEHICLE_YEARS = Array.from({ length: 25 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

export const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric", "LPG"];
