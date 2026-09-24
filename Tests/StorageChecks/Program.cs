using System.Text.Json;
using AlgorithmVault.Models;
using AlgorithmVault.Services;

// All IO is confined to a newly created temporary directory, never the user's vault.
var directory = Directory.CreateTempSubdirectory("alg0vault-storage-check-").FullName;
var checks = 0;
void Check(bool condition, string description)
{
    if (!condition) throw new InvalidOperationException(description);
    checks++;
}
try
{
    var algorithms = new AlgorithmRepository(directory);
    var notes = new NotesRepository(directory);
    var seeded = await algorithms.LoadAsync();
    Check(seeded.Count >= 60, "Fresh libraries should contain the catalog.");
    Check(seeded.First(x => x.Title == "Binary Search").Code.Contains('\n'), "Bundled seed lines should be decoded.");
    await algorithms.SaveAsync([]);
    Check((await algorithms.LoadAsync()).Count == 0, "Deleting every algorithm must survive restart.");
    const string literal = "Console.WriteLine(\"first\\nsecond\");";
    var personal = new AlgorithmEntry { Title = "My code", Code = literal };
    await algorithms.SaveAsync([personal]);
    var loaded = await algorithms.LoadAsync();
    Check(loaded.Count == 1 && loaded[0].Id == personal.Id, "Existing libraries must not regain deleted built-ins.");
    Check(loaded[0].Code == literal, "Loading must preserve literal escape sequences.");
    var exported = Path.Combine(directory, "export.json");
    await algorithms.ExportAsync(exported, [personal]);
    Check((await algorithms.ImportAsync(exported))[0].Code == literal, "Import must preserve literal escape sequences.");
    await File.WriteAllTextAsync(exported, "[null]");
    var rejected = false;
    try { await algorithms.ImportAsync(exported); } catch (JsonException) { rejected = true; }
    Check(rejected, "Invalid imported records must be rejected before use.");
    Check((await algorithms.LoadAsync())[0].Code == literal, "Rejected imports must not change the saved library.");

    foreach (var broken in new[] { "[null]", "null" })
    {
        await File.WriteAllTextAsync(algorithms.DataFile, broken);
        Check((await algorithms.LoadAsync()).Count >= 60, "Malformed collections should recover safely.");
    }
    var backups = Directory.GetFiles(directory, "algorithms-corrupt-*.json");
    Check(backups.Length == 2, "Recovery must keep separate copies of both corrupt originals.");
    Check(backups.Select(File.ReadAllText).ToHashSet().SetEquals(["[null]", "null"]), "Recovery backups must preserve exact original content.");

    await notes.SaveAsync([]);
    Check((await notes.LoadAsync()).Count == 0, "An empty notes collection must remain empty.");
    foreach (var broken in new[] { "[null]", "[{\"Replies\":null}]", "[{\"Attachments\":[null]}]" })
    {
        await File.WriteAllTextAsync(notes.NotesFile, broken);
        Check((await notes.LoadAsync()).Count == 1, "Malformed notes should recover without null-reference errors.");
    }
    Check(Directory.GetFiles(directory, "note-threads-corrupt-*.json").Length == 3, "Each corrupt notes file needs its own backup.");

    var otherAlgorithms = new AlgorithmRepository(directory);
    var otherNotes = new NotesRepository(directory);
    var saves = Enumerable.Range(0, 24).SelectMany(i => new[] {
        (i % 2 == 0 ? algorithms : otherAlgorithms).SaveAsync([new AlgorithmEntry { Title = "Saved " + i }]),
        (i % 2 == 0 ? notes : otherNotes).SaveAsync([new NoteThread { Body = "Saved " + i }])
    }).ToArray();
    await Task.WhenAll(saves);
    Check((await algorithms.LoadAsync()).Count == 1, "Concurrent algorithm saves must produce a complete JSON file.");
    Check((await notes.LoadAsync()).Count == 1, "Concurrent note saves must produce a complete JSON file.");
    Check(Directory.GetFiles(directory, "*.tmp").Length == 0, "Successful saves should not leave temporary files.");
    var beforeFailure = await File.ReadAllTextAsync(algorithms.DataFile);
    using (var locked = File.Open(algorithms.DataFile, FileMode.Open, FileAccess.Read, FileShare.Read))
    {
        var failed = false;
        try { await algorithms.SaveAsync([new AlgorithmEntry { Title = "Blocked write" }]); }
        catch (Exception error) when (error is IOException or UnauthorizedAccessException) { failed = true; }
        Check(failed, "A locked target must report save failure, not success.");
        Check(await File.ReadAllTextAsync(algorithms.DataFile) == beforeFailure, "Failed saves must preserve the previous file.");
        Check(Directory.GetFiles(directory, "*.tmp").Length == 0, "Failed saves should clean their own temporary file.");
    }
    await algorithms.SaveAsync([new AlgorithmEntry { Title = "Recovered after failure" }]);
    Check((await algorithms.LoadAsync())[0].Title == "Recovered after failure", "A failed save must release the lock so a later save can succeed.");
    Console.WriteLine($"Passed {checks} native storage checks, including 48 overlapping saves.");
}
finally
{
    // The exact path was created by this test; it contains no user data.
    Directory.Delete(directory, recursive: true);
}
