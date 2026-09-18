using System.IO;
using System.Text.Json;
using AlgorithmVault.Models;

namespace AlgorithmVault.Services;

public sealed class NotesRepository
{
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };
    public string DataDirectory { get; } = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AlgorithmVault");
    public string NotesFile => Path.Combine(DataDirectory, "note-threads.json");
    public string AttachmentsDirectory => Path.Combine(DataDirectory, "note-attachments");

    public async Task<List<NoteThread>> LoadAsync()
    {
        Directory.CreateDirectory(DataDirectory);
        Directory.CreateDirectory(AttachmentsDirectory);
        if (!File.Exists(NotesFile))
        {
            var starter = CreateStarterThread();
            await SaveAsync([starter]);
            return [starter];
        }

        try
        {
            await using var stream = File.OpenRead(NotesFile);
            return await JsonSerializer.DeserializeAsync<List<NoteThread>>(stream, _options) ?? [];
        }
        catch (JsonException)
        {
            var backup = Path.Combine(DataDirectory, $"note-threads-corrupt-{DateTime.Now:yyyyMMdd-HHmmss}.json");
            File.Copy(NotesFile, backup, true);
            var recovered = new List<NoteThread> { CreateStarterThread() };
            await SaveAsync(recovered);
            return recovered;
        }
    }

    public async Task SaveAsync(IEnumerable<NoteThread> threads)
    {
        Directory.CreateDirectory(DataDirectory);
        var temp = NotesFile + ".tmp";
        await using (var stream = File.Create(temp))
            await JsonSerializer.SerializeAsync(stream, threads, _options);
        File.Move(temp, NotesFile, true);
    }

    public NoteAttachment ImportAttachment(string sourcePath)
    {
        Directory.CreateDirectory(AttachmentsDirectory);
        var info = new FileInfo(sourcePath);
        var storedName = $"{Guid.NewGuid():N}{info.Extension}";
        var destination = Path.Combine(AttachmentsDirectory, storedName);
        File.Copy(sourcePath, destination, false);
        return new NoteAttachment
        {
            FileName = info.Name,
            StoredPath = destination,
            SizeBytes = info.Length
        };
    }

    private static NoteThread CreateStarterThread() => new()
    {
        Title = "Welcome to your Notes Hub",
        Course = "General",
        Semester = "Getting Started",
        Body = "Use threads to organize lecture notes, study guides, exam preparation, project material, and useful discussions. Attach PDFs, Word files, slides, images, source code, or any other semester resources.",
        IsPinned = true,
        Replies =
        [
            new NotePost
            {
                Author = "alg0Vault",
                Content = "Tip: create one thread per topic, then use replies to add corrections, questions, summaries, and updates over time."
            }
        ]
    };
}
