using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrafficSignsApp.Models
{
    public class UserResults
    {
        [Key]
        public int Id { get; set; }

        public int Score { get; set; } // π.χ. 70 (για 70% επιτυχία)

        // ΝΕΑ ΠΕΔΙΑ ΓΙΑ ΤΑ ΣΤΑΤΙΣΤΙΚΑ:
        public string QuizMode { get; set; } = string.Empty; // Θα αποθηκεύει "master" ή "category"
        public int? CategoryId { get; set; } // Το ID της κατηγορίας (θα είναι null αν έπαιξε το Master)

        public DateTime DateCompleted { get; set; } = DateTime.UtcNow;

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}