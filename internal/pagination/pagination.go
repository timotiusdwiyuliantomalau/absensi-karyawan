package pagination

import "math"

// Params for pagination

type Params struct {
    Page     int
    PageSize int
}

func (p *Params) Normalize(maxPageSize int) {
    if p.Page <= 0 {
        p.Page = 1
    }
    if p.PageSize <= 0 {
        p.PageSize = 10
    }
    if p.PageSize > maxPageSize {
        p.PageSize = maxPageSize
    }
}

func (p Params) Limit() int {
    return p.PageSize
}

func (p Params) Offset() int {
    return (p.Page - 1) * p.PageSize
}

func TotalPages(totalRows int64, pageSize int) int {
    if pageSize <= 0 {
        return 0
    }
    return int(math.Ceil(float64(totalRows) / float64(pageSize)))
}