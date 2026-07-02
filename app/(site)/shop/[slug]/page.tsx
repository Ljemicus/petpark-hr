import { DisabledModule } from '@/components/shared/disabled-module';

export default function ProductPage() {
  return (
    <DisabledModule
      naslov="Proizvod uskoro"
      opis="Trgovina je trenutno zatvorena, zato ne prikazujemo demo proizvode."
    />
  );
}
