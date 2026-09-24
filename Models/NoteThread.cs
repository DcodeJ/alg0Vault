using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace AlgorithmVault.Models;

public sealed class NoteThread : INotifyPropertyChanged
{
    private string _title = "Untitled thread";
    private string _course = "General";
    private string _semester = "Semester 1";
    private string _body = "";
    private bool _isPinned;

    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get => _title; set => SetField(ref _title, value); }
    public string Course { get => _course; set => SetField(ref _course, value); }
    public string Semester { get => _semester; set => SetField(ref _semester, value); }
    public string Body { get => _body; set => SetField(ref _body, value); }
    public bool IsPinned { get => _isPinned; set => SetField(ref _isPinned, value); }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public ObservableCollection<NotePost> Replies { get; set; } = [];
    public ObservableCollection<NoteAttachment> Attachments { get; set; } = [];

    public event PropertyChangedEventHandler? PropertyChanged;

    private void SetField<T>(ref T field, T value, [CallerMemberName] string? name = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value)) return;
        field = value;
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}

public sealed class NotePost
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Author { get; set; } = "You";
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

public sealed class NoteAttachment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } = "";
    public string StoredPath { get; set; } = "";
    public long SizeBytes { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.Now;
    public string SizeLabel => SizeBytes switch
    {
        >= 1_048_576 => $"{SizeBytes / 1_048_576d:0.0} MB",
        >= 1_024 => $"{SizeBytes / 1_024d:0.0} KB",
        _ => $"{SizeBytes} B"
    };
}
