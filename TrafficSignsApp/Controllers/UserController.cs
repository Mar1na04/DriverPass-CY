using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using TrafficSignsApp.Data;
using TrafficSignsApp.Models;

namespace TrafficSignsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // --- 1. ΕΛΕΓΧΟΣ ΑΣΦΑΛΕΙΑΣ ΚΩΔΙΚΟΥ ---
            if (request.Password.Length < 8)
            {
                return BadRequest("err_pwd_length");
            }
            if (!Regex.IsMatch(request.Password, "[A-Z]")) // Ψάχνει για τουλάχιστον 1 κεφαλαίο
            {
                return BadRequest("err_pwd_upper");
            }
            if (!Regex.IsMatch(request.Password, "[0-9]")) // Ψάχνει για τουλάχιστον 1 αριθμό
            {
                return BadRequest("err_pwd_number");
            }
            if (!Regex.IsMatch(request.Password, "[^a-zA-Z0-9]")) // Ψάχνει για σύμβολο (οτιδήποτε δεν είναι γράμμα ή αριθμός)
            {
                return BadRequest("err_pwd_symbol");
            }

            // --- 2. ΕΛΕΓΧΟΣ ΜΟΝΑΔΙΚΟΤΗΤΑΣ ---
            if (_context.Users.Any(u => u.Username == request.Username))
            {
                return BadRequest("err_user_exists");
            }
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest("err_email_exists");
            }

            // --- 3. ΚΡΥΠΤΟΓΡΑΦΗΣΗ (Αφού πέρασε όλους τους ελέγχους) ---
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // --- 4. ΑΠΟΘΗΚΕΥΣΗ ---
            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashedPassword
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "success_register" });
        }

        // Βοηθητική κλάση για τα δεδομένα του Login
        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        // POST ΓΙΑ ΤΗ ΣΥΝΔΕΣΗ (Στο /api/Users/login)
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Ψάχνουμε στη βάση αν υπάρχει χρήστης με αυτό το όνομα
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);

            // Αν δεν υπάρχει καν τέτοιο όνομα
            if (user == null)
            {
                return BadRequest("err_invalid_login");
            }

            // 2. Ελέγχουμε αν ο κωδικός που έβαλε ταιριάζει με τον κρυπτογραφημένο
            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordCorrect)
            {
                return BadRequest("err_invalid_login"); // Βγάζουμε το ίδιο μήνυμα για λόγους ασφαλείας
            }

            // 3. Αν όλα είναι σωστά, του δίνουμε πρόσβαση και επιστρέφουμε το ID του!
            // (Το ID βοηθάει στην αποθήκευση του σκορ του στα Quiz)
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                message = "success_login"
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetUserProfile(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound("err_user_not_found");

            var results = _context.UserResults.Where(ur => ur.UserId == id).ToList();

            // Βασικά στατιστικά
            int totalQuizzes = results.Count;
            double averageScore = totalQuizzes > 0 ? results.Average(ur => ur.Score) : 0;

            // 1. ΑΔΥΝΑΜΙΕΣ (Κατηγορίες με μέσο όρο κάτω από 70%)
            var categoryResults = results.Where(r => r.QuizMode == "category" && r.CategoryId != null).ToList();
            var weakCategoryIds = categoryResults
                .GroupBy(r => r.CategoryId)
                .Where(g => g.Average(r => r.Score) < 70) // < 7/10
                .Select(g => g.Key)
                .ToList();

            // 2. ΕΠΙΣΗΜΗ ΕΞΕΤΑΣΗ (Master Quiz)
            var masterResults = results.Where(r => r.QuizMode == "master").ToList();
            int masterAttempts = masterResults.Count;
            int masterPasses = masterResults.Count(r => r.Score == 100); // Απαιτείται 10/10 (100%)

            return Ok(new
            {
                username = user.Username,
                email = user.Email,
                totalQuizzes,
                averageScore = Math.Round(averageScore, 1),
                weakCategories = weakCategoryIds, // Στέλνουμε λίστα με τα ID των αδύναμων κατηγοριών
                masterAttempts,
                masterPasses
            });
        }
        // =========================================
        // ENDPOINT: ΞΕΧΑΣΑ ΤΟΝ ΚΩΔΙΚΟ
        // =========================================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            // 1. Ψάχνουμε αν υπάρχει χρήστης με αυτό το email στη βάση
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Αν δεν υπάρχει, λέμε "ΟΚ" ούτως ή άλλως! 
            if (user == null)
            {
                return Ok("If the email exists, a reset link has been sent.");
            }

            // Φτιάχνεται πάντα ένα νέο Token
            user.ResetToken = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32))
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();

            // Στέλνουμε το email με το ολοκαίνουριο link
            var resetLink = $"http://localhost:5173/reset-password?token={user.ResetToken}";
            SendEmail(user.Email, resetLink);

            return Ok("If the email exists, a reset link has been sent.");
        }

        // =========================================
        // HELPER: ΛΕΙΤΟΥΡΓΙΑ ΑΠΟΣΤΟΛΗΣ EMAIL
        // =========================================
        private void SendEmail(string toEmail, string resetLink)
        {
            // Ρυθμίσεις για αποστολή μέσω Gmail
            using var smtpClient = new System.Net.Mail.SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new System.Net.NetworkCredential("marinaioa27@gmail.com", "nxvd bzhd zrtk pous"),
                EnableSsl = true,
            };

            var mailMessage = new System.Net.Mail.MailMessage
            {
                From = new System.Net.Mail.MailAddress("marinaioa27@gmail.com", "DriverPass Support"),
                Subject = "Επαναφορά Κωδικού στο DriverPass",
                Body = $@"
            <h3>Γεια σου!</h3>
            <p>Ζήτησες επαναφορά του κωδικού σου στο DriverPass.</p>
            <p>Πάτα το παρακάτω κουμπί για να δημιουργήσεις νέο κωδικό:</p>
            <a href='{resetLink}' style='background-color: purple; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>Αλλαγή Κωδικού</a>
            <p><i>Αν δεν το ζήτησες εσύ, απλά αγνόησε αυτό το μήνυμα. Το link θα λήξει σε 1 ώρα.</i></p>",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(toEmail);
            smtpClient.Send(mailMessage);
        }
        // =========================================
        // ENDPOINT: ΕΠΑΝΑΦΟΡΑ ΝΕΟΥ ΚΩΔΙΚΟΥ
        // =========================================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            // 1. Ψάχνουμε τον χρήστη
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.ResetToken == request.Token &&
                u.ResetTokenExpires > DateTime.UtcNow);

            if (user == null)
            {
                return BadRequest("invalidToken");
            }

            // 2. Αλλάζουμε τον κωδικό
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            // 3. Σβήνουμε το Token για να μην μπορεί να ξαναχρησιμοποιηθεί το ίδιο link
            user.ResetToken = null;
            user.ResetTokenExpires = null;

            await _context.SaveChangesAsync();

            return Ok("success");
        }
    }
}