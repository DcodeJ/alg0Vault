using System.Collections.Concurrent;
using System.IO;

namespace AlgorithmVault.Services;

internal static class AtomicJsonFile
{
    // Serialize saves to the same target, even across repository instances.
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> Gates = new(StringComparer.OrdinalIgnoreCase);

    public static async Task WriteAsync(string path, byte[] snapshot)
    {
        var target = Path.GetFullPath(path);
        var gate = Gates.GetOrAdd(target, _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync();
        var temporary = target + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(target)!);
            await File.WriteAllBytesAsync(temporary, snapshot);
            File.Move(temporary, target, true);
        }
        finally
        {
            try { if (File.Exists(temporary)) File.Delete(temporary); }
            finally { gate.Release(); }
        }
    }
}
