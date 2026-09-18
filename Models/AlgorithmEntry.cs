using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace AlgorithmVault.Models;

public sealed class AlgorithmEntry : INotifyPropertyChanged
{
    private string _title = "Untitled algorithm";
    private string _category = "Other";
    private string _difficulty = "Medium";
    private string _timeComplexity = "O(n)";
    private string _spaceComplexity = "O(1)";
    private string _tags = "";
    private string _pattern = "General";
    private string _summary = "";
    private string _notes = "";
    private string _code = "";
    private bool _isFavorite;
    private bool _isBuiltIn;
    private string _masteryLevel = "New";
    private int _reviewCount;
    private DateTime? _lastReviewedAt;

    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get => _title; set => SetField(ref _title, value); }
    public string Category { get => _category; set => SetField(ref _category, value); }
    public string Difficulty { get => _difficulty; set => SetField(ref _difficulty, value); }
    public string TimeComplexity { get => _timeComplexity; set => SetField(ref _timeComplexity, value); }
    public string SpaceComplexity { get => _spaceComplexity; set => SetField(ref _spaceComplexity, value); }
    public string Tags { get => _tags; set => SetField(ref _tags, value); }
    public string Pattern { get => _pattern; set => SetField(ref _pattern, value); }
    public string Summary { get => _summary; set => SetField(ref _summary, value); }
    public string Notes { get => _notes; set => SetField(ref _notes, value); }
    public string Code { get => _code; set => SetField(ref _code, value); }
    public bool IsFavorite { get => _isFavorite; set => SetField(ref _isFavorite, value); }
    public bool IsBuiltIn { get => _isBuiltIn; set => SetField(ref _isBuiltIn, value); }
    public string MasteryLevel { get => _masteryLevel; set => SetField(ref _masteryLevel, value); }
    public int ReviewCount { get => _reviewCount; set => SetField(ref _reviewCount, value); }
    public DateTime? LastReviewedAt { get => _lastReviewedAt; set => SetField(ref _lastReviewedAt, value); }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public event PropertyChangedEventHandler? PropertyChanged;

    private void SetField<T>(ref T field, T value, [CallerMemberName] string? name = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value)) return;
        field = value;
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
