import { DisabledModule } from '@/components/shared/disabled-module';

export default function CartPage() {
  return (
    <DisabledModule
      naslov="Košarica uskoro"
      opis="Online kupnja još nije uključena. Ne pokrećemo plaćanja ni narudžbe dok modul nije spreman."
    />
  );
}
