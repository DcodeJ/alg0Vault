using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using AlgorithmVault.Models;
using AlgorithmVault.Services;
using Microsoft.Win32;

namespace AlgorithmVault;

public partial class MainWindow : Window, INotifyPropertyChanged
{
    private readonly AlgorithmRepository _repository = new();
    private readonly List<AlgorithmEntry> _algorithms = [];
    private AlgorithmEntry? _selectedAlgorithm;
    private string? _categoryFilter;
    private bool _favoritesOnly;
    private bool _builtInOnly;
    private bool _themeReady;
    private Button? _activeNavigationButton;
    private string _currentTheme = "Current";

    public ObservableCollection<AlgorithmEntry> FilteredAlgorithms { get; } = [];
    public ObservableCollection<CategoryStat> CategoryStats { get; } = [];
    public string[] Categories { get; } = ["Arrays", "Searching", "Sorting", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming", "Greedy", "Backtracking", "Math", "Other"];
    public string[] ComplexityOptions { get; } =
    [
        "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)",
        "O(V + E)", "O(E log V)", "O(V · E)", "O(n + k)", "O(n · m)", "O(k)", "O(h)"
    ];

    public AlgorithmEntry? SelectedAlgorithm
    {
        get => _selectedAlgorithm;
        set
        {
            if (_selectedAlgorithm == value) return;
            _selectedAlgorithm = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(HasSelection));
            RefreshSelectionUi();
        }
    }

    public bool HasSelection => SelectedAlgorithm is not null;
    public event PropertyChangedEventHandler? PropertyChanged;

    public MainWindow()
    {
        InitializeComponent();
        DataContext = this;
        var savedTheme = _repository.LoadTheme();
        _currentTheme = savedTheme;
        ThemeSelector.SelectedIndex = Math.Max(0, Array.FindIndex(ThemeManager.ThemeNames, x => string.Equals(x, savedTheme, StringComparison.OrdinalIgnoreCase)));
        ApplyTheme(savedTheme);
        _themeReady = true;
        DataPathText.Text = _repository.DataFile;
        Loaded += async (_, _) => await InitializeAsync();
        PreviewKeyDown += MainWindow_PreviewKeyDown;
    }

    private async Task InitializeAsync()
    {
        try
        {
            _algorithms.AddRange(await _repository.LoadAsync());
            ApplyFilters();
            SelectedAlgorithm = FilteredAlgorithms.FirstOrDefault();
            SetActiveNavigation(AllButton);
            SetStatus("Library loaded from local storage");
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Could not load your library.\n\n{ex.Message}", "alg0Vault", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ApplyFilters()
    {
        if (SearchBox is null || DifficultyFilter is null || SortFilter is null) return;

        var query = SearchBox.Text.Trim();
        var difficulty = (DifficultyFilter.SelectedItem as ComboBoxItem)?.Content?.ToString();
        IEnumerable<AlgorithmEntry> filtered = _algorithms;

        if (_favoritesOnly) filtered = filtered.Where(x => x.IsFavorite);
        if (_builtInOnly) filtered = filtered.Where(x => x.IsBuiltIn);
        if (!string.IsNullOrWhiteSpace(_categoryFilter))
            filtered = filtered.Where(x => string.Equals(x.Category, _categoryFilter, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrWhiteSpace(difficulty) && difficulty != "Any difficulty")
            filtered = filtered.Where(x => x.Difficulty == difficulty);
        if (!string.IsNullOrWhiteSpace(query))
            filtered = filtered.Where(x => Contains(x.Title, query) || Contains(x.Category, query) || Contains(x.Pattern, query) || Contains(x.Tags, query) || Contains(x.Summary, query) || Contains(x.Notes, query));

        filtered = SortFilter.SelectedIndex switch
        {
            1 => filtered.OrderBy(x => x.Title),
            2 => filtered.OrderBy(x => DifficultyRank(x.Difficulty)).ThenBy(x => x.Title),
            3 => filtered.OrderBy(x => x.Category).ThenBy(x => x.Title),
            4 => filtered.OrderBy(x => x.Pattern).ThenBy(x => x.Title),
            5 => filtered.OrderByDescending(x => MasteryRank(x.MasteryLevel)).ThenBy(x => x.Title),
            _ => filtered.OrderByDescending(x => x.UpdatedAt)
        };

        var selectedId = SelectedAlgorithm?.Id;
        FilteredAlgorithms.Clear();
        foreach (var item in filtered) FilteredAlgorithms.Add(item);
        SelectedAlgorithm = selectedId is null ? FilteredAlgorithms.FirstOrDefault() : FilteredAlgorithms.FirstOrDefault(x => x.Id == selectedId) ?? FilteredAlgorithms.FirstOrDefault();
        RefreshStats();
    }

    private void RefreshStats()
    {
        TotalCountText.Text = _algorithms.Count.ToString();
        LibraryStatText.Text = _algorithms.Count.ToString();
        FavoriteCountText.Text = _algorithms.Count(x => x.IsFavorite).ToString();
        HardCountText.Text = _algorithms.Count(x => x.Difficulty == "Hard").ToString();
        MasteredCountText.Text = _algorithms.Count(x => x.MasteryLevel == "Mastered").ToString();
        CoreCountText.Text = _algorithms.Count(x => x.IsBuiltIn).ToString();
        ResultCountText.Text = $"{FilteredAlgorithms.Count} {(FilteredAlgorithms.Count == 1 ? "item" : "items")}";
        CategoryStats.Clear();
        var colors = new[] { "#8B5CF6", "#42B8E8", "#37D67A", "#F7C95E", "#EF7D9B", "#F39A5A" };
        int index = 0;
        foreach (var group in _algorithms.GroupBy(x => x.Category).OrderByDescending(x => x.Count()).Take(8))
            CategoryStats.Add(new CategoryStat(group.Key, group.Count(), new SolidColorBrush((Color)ColorConverter.ConvertFromString(colors[index++ % colors.Length]))));
    }

    private void RefreshSelectionUi()
    {
        if (FavoriteButton is null || UpdatedText is null) return;
        FavoriteButton.Content = SelectedAlgorithm?.IsFavorite == true ? "★" : "☆";
        FavoriteButton.Foreground = SelectedAlgorithm?.IsFavorite == true
            ? new SolidColorBrush(Color.FromRgb(247, 201, 94))
            : (Brush)Resources["TextSecondary"];
        UpdatedText.Text = SelectedAlgorithm is null ? "No algorithm selected" : $"Last edited {SelectedAlgorithm.UpdatedAt:g}  •  {FormatReview(SelectedAlgorithm)}";
    }

    private async Task SaveAsync(string message = "Changes saved locally")
    {
        if (SelectedAlgorithm is not null)
        {
            SelectedAlgorithm.UpdatedAt = DateTime.Now;
            if (string.IsNullOrWhiteSpace(SelectedAlgorithm.Title)) SelectedAlgorithm.Title = "Untitled algorithm";
        }
        await _repository.SaveAsync(_algorithms);
        ApplyFilters();
        RefreshSelectionUi();
        SetStatus(message);
    }

    private async void Save_Click(object sender, RoutedEventArgs e)
    {
        try { await SaveAsync(); }
        catch (Exception ex) { ShowError("Could not save the library", ex); }
    }

    private void AddAlgorithm_Click(object sender, RoutedEventArgs e)
    {
        ShowAlgorithmWorkspace();
        SetActiveNavigation(AllButton);
        var entry = new AlgorithmEntry
        {
            Title = "New Algorithm",
            Category = "Other",
            Difficulty = "Medium",
            Pattern = "General",
            Summary = "Describe what the algorithm solves and when to use it.",
            Notes = "Add edge cases, constraints, and learning notes here.",
            Code = "public static void Solve()\n{\n    // Add your C# implementation\n}"
        };
        _algorithms.Add(entry);
        _categoryFilter = null;
        _favoritesOnly = false;
        _builtInOnly = false;
        LibraryTitleText.Text = "All algorithms";
        SearchBox.Clear();
        ApplyFilters();
        SelectedAlgorithm = entry;
        SetStatus("New algorithm created — edit it and save");
    }

    private async void Delete_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedAlgorithm is null) return;
        var result = MessageBox.Show($"Delete “{SelectedAlgorithm.Title}”? This removes it from local storage.", "Delete algorithm", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;
        _algorithms.Remove(SelectedAlgorithm);
        ApplyFilters();
        try { await SaveAsync("Algorithm deleted"); }
        catch (Exception ex) { ShowError("Could not update the library", ex); }
    }

    private async void Favorite_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedAlgorithm is null) return;
        SelectedAlgorithm.IsFavorite = !SelectedAlgorithm.IsFavorite;
        try { await SaveAsync(SelectedAlgorithm.IsFavorite ? "Added to favorites" : "Removed from favorites"); }
        catch (Exception ex) { ShowError("Could not update the favorite", ex); }
    }

    private void SearchBox_TextChanged(object sender, TextChangedEventArgs e) => ApplyFilters();
    private void Filter_Changed(object sender, SelectionChangedEventArgs e) => ApplyFilters();

    private void ShowAll_Click(object sender, RoutedEventArgs e)
    {
        ShowAlgorithmWorkspace();
        SetActiveNavigation(AllButton);
        _categoryFilter = null;
        _favoritesOnly = false;
        _builtInOnly = false;
        LibraryTitleText.Text = "All algorithms";
        ApplyFilters();
    }

    private void ShowFavorites_Click(object sender, RoutedEventArgs e)
    {
        ShowAlgorithmWorkspace();
        SetActiveNavigation(FavoritesButton);
        _categoryFilter = null;
        _favoritesOnly = true;
        _builtInOnly = false;
        LibraryTitleText.Text = "Favorites";
        ApplyFilters();
    }

    private void ShowCore_Click(object sender, RoutedEventArgs e)
    {
        ShowAlgorithmWorkspace();
        SetActiveNavigation(CoreButton);
        _categoryFilter = null;
        _favoritesOnly = false;
        _builtInOnly = true;
        LibraryTitleText.Text = "Core collection";
        ApplyFilters();
    }

    private void Category_Click(object sender, RoutedEventArgs e)
    {
        if (sender is not Button { Tag: string category }) return;
        ShowAlgorithmWorkspace();
        SetActiveNavigation((Button)sender);
        _categoryFilter = category;
        _favoritesOnly = false;
        _builtInOnly = false;
        LibraryTitleText.Text = category;
        ApplyFilters();
    }

    private async void Export_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new SaveFileDialog { Title = "Export algorithm library", Filter = "JSON files (*.json)|*.json", FileName = $"algorithm-vault-{DateTime.Now:yyyy-MM-dd}.json" };
        if (dialog.ShowDialog() != true) return;
        try { await _repository.ExportAsync(dialog.FileName, _algorithms); SetStatus($"Exported {_algorithms.Count} algorithms"); }
        catch (Exception ex) { ShowError("Could not export the library", ex); }
    }

    private async void Import_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new OpenFileDialog { Title = "Import algorithm library", Filter = "JSON files (*.json)|*.json" };
        if (dialog.ShowDialog() != true) return;
        try
        {
            var imported = await _repository.ImportAsync(dialog.FileName);
            var existingIds = _algorithms.Select(x => x.Id).ToHashSet();
            int added = 0;
            foreach (var item in imported.Where(x => existingIds.Add(x.Id))) { _algorithms.Add(item); added++; }
            await SaveAsync($"Imported {added} new algorithms");
        }
        catch (Exception ex) { ShowError("Could not import this file", ex); }
    }

    private void CopyCode_Click(object sender, RoutedEventArgs e)
    {
        if (SelectedAlgorithm is null) return;
        Clipboard.SetText(SelectedAlgorithm.Code ?? "");
        SetStatus("C# code copied to clipboard");
    }

    private void OpenPractice_Click(object sender, RoutedEventArgs e)
    {
        var practice = new PracticeWindow(_algorithms, _currentTheme, () => _repository.SaveAsync(_algorithms)) { Owner = this };
        practice.ShowDialog();
        ApplyFilters();
        RefreshSelectionUi();
        SetStatus("Practice progress saved locally");
    }

    private void ShowNotesHub_Click(object sender, RoutedEventArgs e)
    {
        AlgorithmListPane.Visibility = Visibility.Collapsed;
        AlgorithmDetailPane.Visibility = Visibility.Collapsed;
        NotesHub.Visibility = Visibility.Visible;
        SetActiveNavigation(NotesHubButton);
        SetStatus("Notes Hub — semester knowledge stored locally");
    }

    private void NewNoteThread_Click(object sender, RoutedEventArgs e)
    {
        ShowNotesHub_Click(sender, e);
        NotesHub.CreateNewThread();
    }

    private void ShowAlgorithmWorkspace()
    {
        NotesHub.Visibility = Visibility.Collapsed;
        AlgorithmListPane.Visibility = Visibility.Visible;
        AlgorithmDetailPane.Visibility = Visibility.Visible;
    }

    private void SetActiveNavigation(Button active)
    {
        if (_activeNavigationButton is not null)
        {
            _activeNavigationButton.Background = Brushes.Transparent;
            _activeNavigationButton.Foreground = (Brush)Resources["TextSecondary"];
        }
        foreach (var button in new[] { AllButton, FavoritesButton, CoreButton, NotesHubButton })
        {
            button.Background = Brushes.Transparent;
            button.Foreground = (Brush)Resources["TextSecondary"];
        }
        active.Background = (Brush)Resources["SelectionBackground"];
        active.Foreground = (Brush)Resources["Accent"];
        _activeNavigationButton = active;
    }

    private void ThemeSelector_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (!_themeReady || ThemeSelector.SelectedItem is not ComboBoxItem item) return;
        var theme = item.Content?.ToString() ?? "Current";
        _currentTheme = theme;
        ApplyTheme(theme);
        try { _repository.SaveTheme(theme); }
        catch (Exception ex) { ShowError("Could not save the theme preference", ex); }
        SetStatus($"{theme} theme applied");
    }

    private void ApplyTheme(string theme)
    {
        ThemeManager.Apply(Resources, theme);
        Background = (Brush)Resources["AppBackground"];
        CodeEditor.IsLightTheme = string.Equals(theme, "White", StringComparison.OrdinalIgnoreCase);
        SetActiveNavigation(_activeNavigationButton ?? AllButton);
        RefreshSelectionUi();
    }

    private void MainWindow_PreviewKeyDown(object sender, KeyEventArgs e)
    {
        if ((Keyboard.Modifiers & ModifierKeys.Control) == 0) return;
        if (e.Key == Key.S) { Save_Click(this, new RoutedEventArgs()); e.Handled = true; }
        else if (e.Key == Key.N) { AddAlgorithm_Click(this, new RoutedEventArgs()); e.Handled = true; }
        else if (e.Key == Key.F) { SearchBox.Focus(); SearchBox.SelectAll(); e.Handled = true; }
    }

    private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (e.ClickCount == 2) ToggleMaximize();
        else if (e.ButtonState == MouseButtonState.Pressed)
        {
            if (WindowState == WindowState.Maximized)
            {
                var pointer = e.GetPosition(this);
                var screen = PointToScreen(pointer);
                var dpi = VisualTreeHelper.GetDpi(this);
                double horizontalRatio = ActualWidth <= 0 ? 0.5 : pointer.X / ActualWidth;
                double restoredWidth = RestoreBounds.Width > 0 ? RestoreBounds.Width : 1200;

                WindowState = WindowState.Normal;
                Left = screen.X / dpi.DpiScaleX - restoredWidth * horizontalRatio;
                Top = Math.Max(SystemParameters.VirtualScreenTop, screen.Y / dpi.DpiScaleY - 24);
            }
            DragMove();
        }
    }
    private void Minimize_Click(object sender, RoutedEventArgs e) => WindowState = WindowState.Minimized;
    private void Maximize_Click(object sender, RoutedEventArgs e) => ToggleMaximize();
    private void Close_Click(object sender, RoutedEventArgs e) => Close();
    private void ToggleMaximize() => WindowState = WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;

    private void SetStatus(string message) => StatusText.Text = $"{message}  •  {DateTime.Now:t}";
    private static bool Contains(string? value, string query) => value?.Contains(query, StringComparison.OrdinalIgnoreCase) == true;
    private static int DifficultyRank(string value) => value switch { "Easy" => 0, "Medium" => 1, "Hard" => 2, _ => 3 };
    private static int MasteryRank(string value) => value switch { "Mastered" => 3, "Confident" => 2, "Learning" => 1, _ => 0 };
    private static string FormatReview(AlgorithmEntry algorithm) => algorithm.LastReviewedAt is null ? "Not reviewed yet" : $"Reviewed {algorithm.ReviewCount}× • {algorithm.LastReviewedAt:g}";
    private static void ShowError(string title, Exception ex) => MessageBox.Show($"{title}.\n\n{ex.Message}", "alg0Vault", MessageBoxButton.OK, MessageBoxImage.Error);
    private void OnPropertyChanged([CallerMemberName] string? name = null) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}

public sealed record CategoryStat(string Name, int Count, Brush Color);
