import { DisabledModule } from '@/components/shared/disabled-module';

export default function CheckoutPage() {
  return (
    <DisabledModule
      naslov="Plaćanje uskoro"
      opis="Online plaćanje je trenutno isključeno. Upit i dogovor s pružateljem usluge rade normalno, bez pokretanja transakcija."
    />
  );
}
