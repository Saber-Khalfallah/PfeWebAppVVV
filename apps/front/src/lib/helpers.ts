import { DEFAULT_PAGE_SIZE } from "./constants";

export function transformTakeSkip({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}) {
  return {
    skip: ((page ?? 1) - 1) * (pageSize ?? DEFAULT_PAGE_SIZE),
    take: pageSize ?? DEFAULT_PAGE_SIZE,
  };
}

export function calculatePageNumbers({
  pageNeighbors,
  totalPages,
  currentPage,
}: {
  pageNeighbors: number;
  totalPages: number;
  currentPage: number;
}) {
  const totalNumbers = pageNeighbors * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbors);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);

    let pages: (number | string)[] = Array.from(
      {
        length: endPage - startPage + 1,
      },
      (_, i) => startPage + i,
    );
    if (startPage > 2) pages = ["...", ...pages];
    if (endPage < totalPages - 1) pages = [...pages, "..."];
    return [1, ...pages, totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}
export function formatDuration(start: Date, end: Date) {
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return "0";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
}
export const averageRatingInv = (ratings: { score: number }[]) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.score, 0);
  return sum / ratings.length;
};
