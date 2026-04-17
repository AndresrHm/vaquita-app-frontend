import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination'

interface Props {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function AppPagination({ page, totalPages, onPageChange }: Props) {
    const safeTotalPages = Number.isFinite(totalPages) ? Math.max(0, Math.trunc(totalPages)) : 0
    const safePage = Number.isFinite(page) ? Math.max(0, Math.trunc(page)) : 0
    const pages = getPages(safePage + 1, safeTotalPages)

    const goTo = (p: number) => {
        if (p >= 0 && p < safeTotalPages) {
            onPageChange(p)
        }
    }

    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious
                        size="default"
                        onClick={() => goTo(safePage - 1)}
                        className={safePage === 0 ? 'cursor-pointer pointer-events-none opacity-50' : 'cursor-pointer'}
                        data-testid="pagination-previousButton"
                    />
                </PaginationItem>

                {pages.map((p, index) => {
                    if (p === '...') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    const pageIndex = p - 1

                    return (
                        <PaginationItem key={`page-${p}-${index}`}>
                            <PaginationLink
                                size="default"
                                isActive={pageIndex === safePage}
                                className="cursor-pointer"
                                onClick={() => goTo(pageIndex)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationNext
                        size="default"
                        onClick={() => goTo(safePage + 1)}
                        className={
                            safePage === safeTotalPages - 1
                                ? 'cursor-pointer pointer-events-none opacity-50'
                                : 'cursor-pointer'
                        }
                        data-testid="pagination-nextButton"
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}

function getPages(current: number, total: number) {
    if (total <= 0) return []

    if (total === 1) return [1]

    const pages: (number | '...')[] = []
    const safeCurrent = Math.min(Math.max(1, current), total)
    const corePages = Array.from(
        new Set([1, safeCurrent - 1, safeCurrent, safeCurrent + 1, total])
    )
        .filter((p) => p >= 1 && p <= total)
        .sort((a, b) => a - b)

    for (let i = 0; i < corePages.length; i++) {
        const value = corePages[i]

        if (i > 0 && value - corePages[i - 1] > 1) {
            pages.push('...')
        }

        pages.push(value)
    }

    return pages
}