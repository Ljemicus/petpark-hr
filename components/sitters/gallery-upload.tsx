'use client';

import { Image as ImageIcon, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/shared/optimized-image';

interface GalleryUploadProps {
  sitterId: string;
  currentImages: string[];
  onImagesUpdated?: (newImages: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function GalleryUpload({
  currentImages = [],
  maxImages = 20,
  className = '',
}: GalleryUploadProps) {
  const remainingSlots = Math.max(0, maxImages - currentImages.length);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Galerija</h3>
          <p className="text-sm text-gray-500">
            {currentImages.length} od {maxImages} fotografija • {remainingSlots} slobodnih mjesta
          </p>
        </div>
      </div>

      {currentImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {currentImages.map((imageUrl, index) => (
            <div key={imageUrl} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
                <OptimizedImage
                  src={imageUrl}
                  alt={`Fotografija galerije ${index + 1}`}
                  width={300}
                  height={300}
                  className="transition-transform duration-300 group-hover:scale-105"
                  objectFit="cover"
                />
                <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h4 className="mb-2 text-lg font-medium text-gray-700">Još nema fotografija</h4>
          <p className="text-gray-500">Galerija će se moći uređivati nakon što backend spremanje fotografija bude spojeno.</p>
        </div>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex gap-3 p-4 text-sm text-amber-900">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-semibold">Uređivanje galerije je privremeno zaključano.</p>
            <p className="mt-1 text-amber-800">
              Ne prikazujemo lažni upload ni lažno brisanje fotografija dok spremanje u produkcijsku bazu nije spojeno i provjereno.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
