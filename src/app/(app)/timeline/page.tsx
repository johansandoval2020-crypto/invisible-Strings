import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { History, ImageOff } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { listMemories } from "@/features/memories/application/use-cases";

export const metadata: Metadata = { title: "Línea del tiempo" };

/**
 * Fase 1: agrupado cronológico simple por año. La versión visual animada
 * (línea vertical, nodos, scroll-reveal) es Fase 3 — ver
 * docs/ARCHITECTURE.md §9. Esta versión ya refleja datos reales para no
 * contradecir al dashboard, que promete que los recuerdos aparecen acá.
 */
export default async function TimelinePage() {
  const coupleId = await requireCoupleId();
  const memories = await listMemories(coupleId);

  if (memories.length === 0) {
    return (
      <PageContainer>
        <h1 className="font-display mb-1 text-2xl font-medium">Línea del tiempo</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Su historia, organizada por año, mes y evento.
        </p>
        <EmptyState
          icon={History}
          title="La línea del tiempo se arma sola"
          description="En cuanto agreguen recuerdos con fecha, van a aparecer acá ordenados automáticamente."
        />
      </PageContainer>
    );
  }

  const byYear = memories.reduce<Record<string, typeof memories>>((acc, memory) => {
    const year = memory.date.getFullYear().toString();
    (acc[year] ??= []).push(memory);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Línea del tiempo</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Su historia, organizada por año.
      </p>

      <div className="flex flex-col gap-10">
        {years.map((year) => (
          <div key={year} className="flex gap-6">
            <div className="font-display text-lavender-accent w-16 shrink-0 pt-1 text-lg font-medium">
              {year}
            </div>
            <div className="border-border flex flex-1 flex-col gap-3 border-l pl-6">
              {byYear[year].map((memory) => (
                <Link
                  key={memory.id}
                  href={`/moments/${memory.id}`}
                  className="hover:bg-muted flex items-center gap-3 rounded-xl p-2 transition-colors"
                >
                  <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-lg">
                    {memory.coverImageUrl ? (
                      <Image
                        src={memory.coverImageUrl}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex size-full items-center justify-center">
                        <ImageOff className="size-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">
                      {memory.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {memory.date.toLocaleDateString("es", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
