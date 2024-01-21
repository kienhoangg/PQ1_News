using System.Collections.Generic;
using System.ComponentModel;
using Common.Enums;

namespace Models.Dtos
{
    public class UpdateManyDto<T>
    {
        public List<T> Ids { get; set; }
        public bool? Value { get; set; }
        public MultipleTypeUpdate? Field { get; set; }
    }
}