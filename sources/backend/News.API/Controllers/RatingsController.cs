using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;

namespace News.API.Controllers
{
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        private readonly IMapper _mapper;

        public RatingsController(
            IRatingService ratingService,
            IMapper mapper
        )
        {
            _ratingService = ratingService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetRatingByPaging([FromBody] RatingRequest ratingRequest)
        {
            var result =
                await _ratingService.GetRatingByPaging(ratingRequest);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult>
        CreateRatingDto([FromBody] RatingDto ratingDto)
        {
            var rating = _mapper.Map<Rating>(ratingDto);
            await _ratingService.CreateRating(rating);
            var result = _mapper.Map<RatingDto>(rating);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRatingById([Required] int id)
        {
            Rating? rating = await _ratingService.GetRating(id);
            if (rating == null) return NotFound();
            return Ok(rating);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateRatingDto(
            [Required] int id,
            [FromBody] Rating ratingUpdated
        )
        {
            Rating? rating = await _ratingService.GetRating(id);
            if (rating == null) return NotFound();
            rating.SatisfiedCount += ratingUpdated.SatisfiedCount;
            rating.NotSatisfiedCount += ratingUpdated.NotSatisfiedCount;
            rating.OkCount += ratingUpdated.OkCount;
            rating.HappyCount += ratingUpdated.HappyCount;
            rating.UnHappyCount += ratingUpdated.UnHappyCount;
            rating.TotalRating += 1;
            await _ratingService.UpdateRating(rating);
            var result = _mapper.Map<RatingDto>(rating);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRatingDto([Required] int id)
        {
            Rating? rating = await _ratingService.GetRating(id);
            if (rating == null) return NotFound();

            await _ratingService.DeleteRating(id);
            return NoContent();
        }
    }
}
