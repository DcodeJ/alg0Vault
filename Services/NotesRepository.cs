using System.IO;
using System.Text.Json;
using AlgorithmVault.Models;

namespace AlgorithmVault.Services;

public sealed class NotesRepository
{
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };
    public string DataDirectory { get; }
    public NotesRepository(string? dataDirectory = null)
    {
        DataDirectory = dataDirectory ?? Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AlgorithmVault");
    }
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
            var threads = await JsonSerializer.DeserializeAsync<List<NoteThread>>(stream, _options)
                ?? throw new JsonException("Expected a note collection.");
            if (threads.Any(thread => thread is null || thread.Replies is null || thread.Attachments is null
                || thread.Replies.Any(reply => reply is null) || thread.Attachments.Any(attachment => attachment is null)))
                throw new JsonException("Notes, replies and attachments cannot contain null records.");
            return threads;
        }
        catch (JsonException)
        {
            var backup = Path.Combine(DataDirectory, $"note-threads-corrupt-{DateTime.Now:yyyyMMdd-HHmmss}-{Guid.NewGuid():N}.json");
            File.Copy(NotesFile, backup, false);
            var recovered = new List<NoteThread> { CreateStarterThread() };
            await SaveAsync(recovered);
            return recovered;
        }
    }

    public Task SaveAsync(IEnumerable<NoteThread> threads) =>
        AtomicJsonFile.WriteAsync(NotesFile, JsonSerializer.SerializeToUtf8Bytes(threads, _options));

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
