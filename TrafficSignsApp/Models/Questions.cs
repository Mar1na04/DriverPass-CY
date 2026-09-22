using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrafficSignsApp.Models
{
    public class Questions
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public string OptionA { get; set; } = string.Empty;

        [Required]
        public string OptionB { get; set; } = string.Empty;

        [Required]
        public string OptionC { get; set; } = string.Empty;

        [Required]
        public string CorrectOption { get; set; } = string.Empty; // Θα μπαίνει π.χ. "A", "B" ή "C"

        // Σύνδεση ερώτησης με το συγκεκριμένο σήμα
        [ForeignKey("TrafficSign")]
        public int TrafficSignId { get; set; }
        public TrafficSign? TrafficSign { get; set; }
    }
}