package pagination

import "testing"

func TestPagination_Normalize_Limit_Offset_TotalPages(t *testing.T) {
    p := Params{Page: 0, PageSize: 0}
    p.Normalize(50)
    if p.Page != 1 || p.PageSize != 10 {
        t.Fatalf("unexpected normalize: %+v", p)
    }
    if p.Limit() != 10 || p.Offset() != 0 {
        t.Fatalf("unexpected limit/offset: %d %d", p.Limit(), p.Offset())
    }
    if TotalPages(101, 10) != 11 {
        t.Fatalf("unexpected total pages")
    }

    p = Params{Page: 2, PageSize: 100}
    p.Normalize(30)
    if p.Page != 2 || p.PageSize != 30 {
        t.Fatalf("unexpected normalize with cap: %+v", p)
    }
    if p.Offset() != 30 {
        t.Fatalf("unexpected offset: %d", p.Offset())
    }
}