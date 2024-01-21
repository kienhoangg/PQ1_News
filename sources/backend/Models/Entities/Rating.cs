using Contracts.Domains;

namespace Models.Entities
{
    public class Rating : EntityAuditBase<int>
    {
        public Rating() { }
        public Rating(string title, int satisfiedCount, int happyCount, int okCount, int notSatisfiedCount, int unHappyCount)
        {
            Title = title;
            SatisfiedCount = satisfiedCount;
            HappyCount = happyCount;
            OkCount = okCount;
            NotSatisfiedCount = notSatisfiedCount;
            UnHappyCount = unHappyCount;
            TotalRating = satisfiedCount + happyCount + okCount + notSatisfiedCount + unHappyCount;
        }

        public string Title { get; set; }
        public int SatisfiedCount { get; set; }
        public int HappyCount { get; set; }
        public int OkCount { get; set; }
        public int NotSatisfiedCount { get; set; }
        public int UnHappyCount { get; set; }
        public int TotalRating { get; set; }
    }
}