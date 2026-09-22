using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrafficSignsApp.Data; // Η "γέφυρα"
using TrafficSignsApp.Models; // Τα μοντέλα

namespace TrafficSignsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Ο Constructor: Εδώ λέμε στον Controller να χρησιμοποιήσει τη Βάση
        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        // Αυτή η μέθοδος φέρνει ΟΛΕΣ τις κατηγορίες από τη βάση
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // POST: api/Categories
        // Αυτή η μέθοδος προσθέτει μια ΝΕΑ κατηγορία στη βάση
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Επιστρέφει την κατηγορία που μόλις δημιουργήθηκε (μαζί με το νέο της Id)
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }
    }
}
