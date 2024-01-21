using System.Net;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace News.API.Interfaces
{
    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _redisCacheService;

        public CacheService(IDistributedCache redisCacheService, IConnectionMultiplexer multiplexer)
        {
            _redisCacheService = redisCacheService;
            _multiplexer = multiplexer;
        }

        private readonly IConnectionMultiplexer _multiplexer;
        public Task<int> GetCountKeys()
        {
            List<string> listKeys = new List<string>();
            EndPoint endPoint = _multiplexer.GetEndPoints().First();
            var keys = _multiplexer
            .GetServer(endPoint)
            .Keys(pattern: "*");
            listKeys.AddRange(keys.Select(key => (string)key).ToList());
            return Task.FromResult(listKeys.Count);
        }

        public async Task SetCacheAsync(string keys, string value, DistributedCacheEntryOptions options = null)
        {
            if (options == null)
            {
                options = new DistributedCacheEntryOptions(); // create options object
                options.SetSlidingExpiration(TimeSpan.FromMinutes(1));

            }
            await _redisCacheService.SetStringAsync(keys, value, options);
        }
    }
}