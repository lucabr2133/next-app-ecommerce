import { Button } from "@heroui/react";

import { Games } from "@/types/database";

export function Pagination({
  listGames,
  previousPage,
  nextPage,
  index,
  setPage,
}: {
  listGames: Games[];
  previousPage: () => void;
  nextPage: () => void;
  index: number;
  setPage: (number: number) => void;
}) {
  const totalPages = Math.ceil(listGames.length / 9);

  if (totalPages <= 1) return null;

  const quantity = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center gap-1.5">
      <Button
        isIconOnly
        className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)]"
        isDisabled={index === 0}
        size="sm"
        variant="flat"
        onPress={previousPage}
      >
        {"<"}
      </Button>

      {quantity.map((number: number) => (
        <Button
          key={number}
          isIconOnly
          className={`rounded-xl text-xs font-semibold ${
            index === number
              ? "bg-[var(--text-primary)] text-[var(--surface-1)]"
              : "border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
          }`}
          size="sm"
          variant="flat"
          onPress={() => {
            setPage(number);
          }}
        >
          {number + 1}
        </Button>
      ))}

      <Button
        isIconOnly
        className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)]"
        isDisabled={index >= totalPages - 1}
        size="sm"
        variant="flat"
        onPress={nextPage}
      >
        {">"}
      </Button>
    </div>
  );
}
