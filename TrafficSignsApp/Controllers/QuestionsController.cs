using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrafficSignsApp.Data;
using TrafficSignsApp.Models;

namespace TrafficSignsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Questions>>> GetQuestions()
        {
            // Φέρνει την ερώτηση μαζί με τα στοιχεία του Σήματος που την αφορά!
            return await _context.Questions.Include(q => q.TrafficSign).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Questions>> PostQuestion(Questions question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetQuestions), new { id = question.Id }, question);
        }
    }
}