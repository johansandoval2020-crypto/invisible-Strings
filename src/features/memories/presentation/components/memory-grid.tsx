import type { MemorySummary } from "@/features/memories/domain/memory.entity";
import { MemoryCard } from "@/features/memories/presentation/components/memory-card";

export function MemoryGrid({ memories }: { memories: MemorySummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
