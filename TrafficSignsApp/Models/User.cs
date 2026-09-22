using System.ComponentModel.DataAnnotations;

namespace TrafficSignsApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // --- ΓΙΑ ΕΠΑΝΑΦΟΡΑ ΚΩΔΙΚΟΥ ---
        public string? ResetToken { get; set; } // Το μυστικό κλειδί

        public DateTime? ResetTokenExpires { get; set; } // Πότε λήγει το κλειδί
    }
}