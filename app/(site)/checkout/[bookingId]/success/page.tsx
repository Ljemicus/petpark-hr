import { DisabledModule } from '@/components/shared/disabled-module';

export default function CheckoutSuccessPage() {
  return (
    <DisabledModule
      naslov="Plaćanje uskoro"
      opis="Online plaćanja još nisu uključena, zato ova potvrda nije aktivna produkcijska površina."
    />
  );
}
