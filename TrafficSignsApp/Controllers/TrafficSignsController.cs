using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrafficSignsApp.Data;
using TrafficSignsApp.Models;

namespace TrafficSignsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrafficSignsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrafficSignsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TrafficSigns
        // Φέρνει όλα τα σήματα ΜΑΖΙ με την κατηγορία τους
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrafficSign>>> GetTrafficSigns()
        {
            // "Μη μου φέρεις μόνο το CategoryId, φέρε μου και όλο το όνομα της κατηγορίας!"
            return await _context.TrafficSigns.Include(t => t.Category).ToListAsync();
        }

        // POST: api/TrafficSigns
        // Προσθέτει ένα νέο σήμα
        [HttpPost]
        public async Task<ActionResult<TrafficSign>> PostTrafficSign(TrafficSign trafficSign)
        {
            _context.TrafficSigns.Add(trafficSign);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrafficSigns), new { id = trafficSign.Id }, trafficSign);
        }
    }
}