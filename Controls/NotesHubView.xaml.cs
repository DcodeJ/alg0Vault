using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using AlgorithmVault.Models;
using AlgorithmVault.Services;
using Microsoft.Win32;

namespace AlgorithmVault.Controls;

public partial class NotesHubView : UserControl, INotifyPropertyChanged
{
    private readonly NotesRepository _repository = new();
    private readonly List<NoteThread> _threads = [];
    private NoteThread? _selectedThread;

    public ObservableCollection<NoteThread> FilteredThreads { get; } = [];
    public string[] SemesterOptions { get; } = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8", "Summer Semester", "Archive"];

    public NoteThread? SelectedThread
    {
        get => _selectedThread;
        set
        {
            if (_selectedThread == value) return;
            _selectedThread = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(HasThread));
            RefreshThreadHeader();
        }
    }

    public bool HasThread => SelectedThread is not null;
    public event PropertyChangedEventHandler? PropertyChanged;

    public NotesHubView()
    {
        InitializeComponent();
        DataContext = this;
        Loaded += async (_, _) =>
        {
            if (_threads.Count > 0) return;
            try
            {
                _threads.AddRange(await _repository.LoadAsync());
                ApplyFilters();
                SelectedThread = FilteredThreads.FirstOrDefault();
            }
            catch (Exception ex) { ShowError("Could not load the Notes Hub", ex); }
        };
    }

    public void CreateNewThread()
    {
        var thread = new NoteThread
        {
            Title = "New semester thread",
            Course = "Course name",
            Semester = "Semester 1",
            Body = "Write your lecture notes, study guide, questions, or topic summary here."
        };
        _threads.Add(thread);
        SemesterFilter.SelectedIndex = 0;
        ThreadSearchBox.Clear();
        ApplyFilters();
        SelectedThread = thread;
    }

    private void NewThread_Click(object sender, RoutedEventArgs e) => CreateNewThread();

    private async void SaveThread_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedThread is null) return;
        SelectedThread.Title = string.IsNullOrWhiteSpace(SelectedThread.Title) ? "Untitled thread" : SelectedThread.Title.Trim();
        SelectedThread.Course = string.IsNullOrWhiteSpace(SelectedThread.Course) ? "General" : SelectedThread.Course.Trim();
        SelectedThread.UpdatedAt = DateTime.Now;
        try
        {
            await _repository.SaveAsync(_threads);
            ApplyFilters();
            RefreshThreadHeader();
        }
        catch (Exception ex) { ShowError("Could not save the thread", ex); }
    }

    private async void Pin_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedThread is null) return;
        SelectedThread.IsPinned = !SelectedThread.IsPinned;
        try { await _repository.SaveAsync(_threads); ApplyFilters(); RefreshThreadHeader(); }
        catch (Exception ex) { ShowError("Could not update the pin", ex); }
    }

    private async void DeleteThread_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedThread is null) return;
        var result = MessageBox.Show($"Delete the thread “{SelectedThread.Title}”? Attached files remain in local storage for safety.", "Delete note thread", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;
        _threads.Remove(SelectedThread);
        ApplyFilters();
        SelectedThread = FilteredThreads.FirstOrDefault();
        try { await _repository.SaveAsync(_threads); }
        catch (Exception ex) { ShowError("Could not update note storage", ex); }
    }

    private async void AddFiles_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedThread is null) return;
        var dialog = new OpenFileDialog
        {
            Title = "Add semester notes and resources",
            Multiselect = true,
            Filter = "Study files|*.pdf;*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.txt;*.md;*.png;*.jpg;*.jpeg;*.cs;*.zip|All files|*.*"
        };
        if (dialog.ShowDialog() != true) return;
        try
        {
            foreach (var file in dialog.FileNames)
                SelectedThread.Attachments.Add(_repository.ImportAttachment(file));
            SelectedThread.UpdatedAt = DateTime.Now;
            await _repository.SaveAsync(_threads);
            ApplyFilters();
        }
        catch (Exception ex) { ShowError("Could not add one or more files", ex); }
    }

    private void OpenAttachment_Click(object sender, RoutedEventArgs e)
    {
        if (sender is not Button { Tag: NoteAttachment attachment }) return;
        if (!File.Exists(attachment.StoredPath))
        {
            MessageBox.Show("This attachment could not be found in local storage.", "Missing file", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }
        try { Process.Start(new ProcessStartInfo(attachment.StoredPath) { UseShellExecute = true }); }
        catch (Exception ex) { ShowError("Could not open the attachment", ex); }
    }

    private async void PostReply_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedThread is null || string.IsNullOrWhiteSpace(ReplyTextBox.Text)) return;
        SelectedThread.Replies.Add(new NotePost { Content = ReplyTextBox.Text.Trim() });
        SelectedThread.UpdatedAt = DateTime.Now;
        ReplyTextBox.Clear();
        try { await _repository.SaveAsync(_threads); ApplyFilters(); RefreshThreadHeader(); }
        catch (Exception ex) { ShowError("Could not post the reply", ex); }
    }

    private void Filter_Changed(object sender, EventArgs e) => ApplyFilters();

    private void ApplyFilters()
    {
        if (ThreadSearchBox is null || SemesterFilter is null) return;
        var query = ThreadSearchBox.Text.Trim();
        var semester = (SemesterFilter.SelectedItem as ComboBoxItem)?.Content?.ToString();
        IEnumerable<NoteThread> filtered = _threads;
        if (!string.IsNullOrWhiteSpace(query))
            filtered = filtered.Where(x => Contains(x.Title, query) || Contains(x.Course, query) || Contains(x.Semester, query) || Contains(x.Body, query));
        if (!string.IsNullOrWhiteSpace(semester) && semester != "All semesters")
            filtered = filtered.Where(x => string.Equals(x.Semester, semester, StringComparison.OrdinalIgnoreCase));
        filtered = filtered.OrderByDescending(x => x.IsPinned).ThenByDescending(x => x.UpdatedAt);

        var selectedId = SelectedThread?.Id;
        FilteredThreads.Clear();
        foreach (var thread in filtered) FilteredThreads.Add(thread);
        ThreadCountText.Text = FilteredThreads.Count.ToString();
        if (selectedId is not null)
            SelectedThread = FilteredThreads.FirstOrDefault(x => x.Id == selectedId) ?? FilteredThreads.FirstOrDefault();
    }

    private void RefreshThreadHeader()
    {
        if (ThreadMetaText is null || PinButton is null) return;
        ThreadMetaText.Text = SelectedThread is null ? "Choose a thread or create a new one" : $"Started {SelectedThread.CreatedAt:d}  •  Updated {SelectedThread.UpdatedAt:g}  •  {SelectedThread.Replies.Count} replies  •  {SelectedThread.Attachments.Count} files";
        PinButton.Content = SelectedThread?.IsPinned == true ? "Unpin" : "Pin";
    }

    private static bool Contains(string? value, string query) => value?.Contains(query, StringComparison.OrdinalIgnoreCase) == true;
    private static void ShowError(string title, Exception ex) => MessageBox.Show($"{title}.\n\n{ex.Message}", "alg0Vault", MessageBoxButton.OK, MessageBoxImage.Error);
    private void OnPropertyChanged([CallerMemberName] string? name = null) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}
