using System.ComponentModel.DataAnnotations;

public class CalcItem
{
    [Key]
    public string Name { get; set;}
    public long Price { get; set;}

    public long Percentage { get; set;}

    public long Total { get; set;}
}