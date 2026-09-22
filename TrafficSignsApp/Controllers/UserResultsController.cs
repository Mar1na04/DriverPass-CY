using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrafficSignsApp.Data;
using TrafficSignsApp.Models;

namespace TrafficSignsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserResultsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserResultsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResults>>> GetUserResults()
        {
            // Φέρνει το σκορ και ταυτόχρονα μας λέει ποιου χρήστη είναι
            return await _context.UserResults.Include(u => u.User).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<UserResults>> PostUserResult(UserResults userResult)
        {
            _context.UserResults.Add(userResult);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserResults), new { id = userResult.Id }, userResult);
        }

        // GET: api/UserResults/leaderboard
        [HttpGet("leaderboard")]
        public async Task<ActionResult> GetLeaderboard([FromQuery] string mode, [FromQuery] int? categoryId)
        {
            // 1. Ξεκινάμε το ερώτημα στη Βάση
            var query = _context.UserResults.AsQueryable();

            // 2. Φιλτράρουμε ανάλογα με το είδος του Quiz (Master ή Συγκεκριμένη Κατηγορία)
            if (mode == "master")
            {
                query = query.Where(ur => ur.QuizMode == "master");
            }
            else if (mode == "category" && categoryId.HasValue)
            {
                query = query.Where(ur => ur.QuizMode == "category" && ur.CategoryId == categoryId.Value);
            }

            // 3.
            // - Ομαδοποιούμε ανά Όνομα Χρήστη (Username)
            // - Βρίσκουμε το υψηλότερο σκορ (Max) για τον καθένα
            // - Βάζουμε τους μεγαλύτερους βαθμούς στην κορυφή (OrderByDescending)
            // - Κρατάμε μόνο τους 10 πρώτους (Take 10)
            var leaderboard = await query
                .GroupBy(ur => ur.User.Username)
                .Select(g => new
                {
                    username = g.Key,
                    score = g.Max(ur => ur.Score)
                })
                .OrderByDescending(x => x.score)
                .Take(10)
                .ToListAsync();

            return Ok(leaderboard);
        }
    }
}