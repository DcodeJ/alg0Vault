using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using AlgorithmVault.Models;
using AlgorithmVault.Services;

namespace AlgorithmVault;

public partial class PracticeWindow : Window
{
    private readonly List<AlgorithmEntry> _algorithms;
    private readonly Func<Task> _saveAsync;
    private readonly Random _random = new();
    private AlgorithmEntry? _current;
    private Guid? _previousId;
    private int _sessionReviews;

    public PracticeWindow(List<AlgorithmEntry> algorithms, string theme, Func<Task> saveAsync)
    {
        InitializeComponent();
        _algorithms = algorithms;
        _saveAsync = saveAsync;
        ThemeManager.Apply(Resources, theme);
        SolutionEditor.IsLightTheme = string.Equals(theme, "White", StringComparison.OrdinalIgnoreCase);
        CategoryPicker.Items.Add(new ComboBoxItem { Content = "Any category" });
        foreach (var category in algorithms.Select(x => x.Category).Distinct(StringComparer.OrdinalIgnoreCase).OrderBy(x => x))
            CategoryPicker.Items.Add(new ComboBoxItem { Content = category });
        CategoryPicker.SelectedIndex = 0;
        RefreshProgress();
        Loaded += (_, _) => NextChallenge();
        PreviewKeyDown += (_, e) =>
        {
            if (e.Key == Key.Space && _current is not null && SolutionPanel.Visibility != Visibility.Visible) { RevealSolution(); e.Handled = true; }
            else if (e.Key == Key.N && Keyboard.Modifiers == ModifierKeys.Control) { NextChallenge(); e.Handled = true; }
        };
    }

    private IEnumerable<AlgorithmEntry> FilteredPool()
    {
        IEnumerable<AlgorithmEntry> pool = _algorithms;
        var difficulty = (DifficultyPicker.SelectedItem as ComboBoxItem)?.Content?.ToString();
        var category = (CategoryPicker.SelectedItem as ComboBoxItem)?.Content?.ToString();
        var mastery = (MasteryPicker.SelectedItem as ComboBoxItem)?.Content?.ToString();
        if (!string.IsNullOrWhiteSpace(difficulty) && difficulty != "Any difficulty") pool = pool.Where(x => x.Difficulty == difficulty);
        if (!string.IsNullOrWhiteSpace(category) && category != "Any category") pool = pool.Where(x => x.Category == category);
        if (!string.IsNullOrWhiteSpace(mastery) && mastery != "Any mastery") pool = pool.Where(x => x.MasteryLevel == mastery);
        return pool;
    }

    private void NextChallenge()
    {
        var pool = FilteredPool().ToList();
        if (pool.Count == 0)
        {
            MessageBox.Show("No algorithms match those filters. Try a broader practice set.", "Interview Practice", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }
        var choices = pool.Count > 1 && _previousId is not null ? pool.Where(x => x.Id != _previousId).ToList() : pool;
        _current = choices[_random.Next(choices.Count)];
        _previousId = _current.Id;
        ChallengeTitle.Text = _current.Title;
        CategoryText.Text = _current.Category;
        DifficultyText.Text = _current.Difficulty;
        SummaryText.Text = _current.Summary;
        MasteryBadge.Text = (_current.MasteryLevel ?? "New").ToUpperInvariant();
        RevealButton.IsEnabled = true;
        RevealButton.Content = "Reveal solution  (Space)";
        SolutionPanel.Visibility = Visibility.Collapsed;
        GradePanel.Visibility = Visibility.Collapsed;
    }

    private void RevealSolution()
    {
        if (_current is null) return;
        PatternText.Text = _current.Pattern;
        TimeText.Text = _current.TimeComplexity;
        SpaceText.Text = _current.SpaceComplexity;
        SolutionEditor.Code = _current.Code;
        NotesText.Text = _current.Notes;
        SolutionPanel.Visibility = Visibility.Visible;
        GradePanel.Visibility = Visibility.Visible;
        RevealButton.IsEnabled = false;
        RevealButton.Content = "Solution revealed";
    }

    private async void Grade_Click(object sender, RoutedEventArgs e)
    {
        if (_current is null || sender is not Button { Tag: string mastery }) return;
        _current.MasteryLevel = mastery;
        _current.ReviewCount++;
        _current.LastReviewedAt = DateTime.Now;
        _current.UpdatedAt = DateTime.Now;
        _sessionReviews++;
        try { await _saveAsync(); }
        catch (Exception ex) { MessageBox.Show($"Could not save practice progress.\n\n{ex.Message}", "alg0Vault", MessageBoxButton.OK, MessageBoxImage.Error); return; }
        RefreshProgress();
        NextChallenge();
    }

    private void RefreshProgress()
    {
        MasteredCountText.Text = _algorithms.Count(x => x.MasteryLevel == "Mastered").ToString();
        ReviewedCountText.Text = _algorithms.Sum(x => x.ReviewCount).ToString();
        SessionText.Text = $"{_sessionReviews} reviewed this session";
    }

    private void NextChallenge_Click(object sender, RoutedEventArgs e) => NextChallenge();
    private void Reveal_Click(object sender, RoutedEventArgs e) => RevealSolution();
    private void Minimize_Click(object sender, RoutedEventArgs e) => WindowState = WindowState.Minimized;
    private void Close_Click(object sender, RoutedEventArgs e) => Close();
    private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e) { if (e.ClickCount == 2) WindowState = WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized; else DragMove(); }
}
