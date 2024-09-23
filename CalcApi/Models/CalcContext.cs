using Microsoft.EntityFrameworkCore;

class CalcContext : DbContext
{
    public CalcContext(DbContextOptions<CalcContext> options) : base(options) { }

    public DbSet<CalcItem> CalcItems { get; set; }
}