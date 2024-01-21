using System;

namespace Models.Constants
{
    public sealed class AccessCounter
    {
        private static AccessCounter instance;
        private static readonly object padlock = new();
        private int counter;
        public static AccessCounter GetInstance()
        {
            if (instance == null)
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new();
                    }
                }
            }
            return instance;
        }

        public void Increase()
        {
            counter++;
        }
        public int GetValue()
        {
            return counter;
        }
    }
}
