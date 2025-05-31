import { calculatePageNumbers } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type Props = {
  totalPages: number;
  currentPage: number;
  pageNeighbors?: number;
  className?: string;
  currentQueryParams: URLSearchParams;
};
const Pagination = ({
  totalPages,
  currentPage,
  pageNeighbors = 2,
  className,
  currentQueryParams,
}: Props) => {
  //  ... 3 4 5 6 7 ...
  const pageNumbers = calculatePageNumbers({
    pageNeighbors,
    currentPage,
    totalPages,
  });
  const createPageLink = (page: number) => {
    const params = new URLSearchParams(currentQueryParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* pervious page button */}
      {currentPage !== 1 && (
        <Link href={createPageLink(currentPage - 1)}>
          <button className={cn("rounded-md bg-slate-200 py-2 px-2")}>
            <ChevronLeftIcon className="w-4" />
          </button>
        </Link>
      )}

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          className={cn("px-3 py-1 rounded-md transition hover:text-sky-600", {
            "bg-slate-200": currentPage !== page && page !== "...",
            "bg-blue-500 text-white": currentPage === page,
            "cursor-not-allowed": page === "...",
          })}
          disabled={page === "..."}
        >
          {page === "..." ? (
            "..."
          ) : (
            <Link href={createPageLink(page as number)}>{page}</Link>
          )}
        </button>
      ))}
      {/* next page button */}
      {currentPage !== totalPages && (
        <Link href={createPageLink(currentPage + 1)}>
          <button className="rounded-md bg-slate-200 py-2 px-2">
            <ChevronRightIcon className="w-4" />
          </button>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
