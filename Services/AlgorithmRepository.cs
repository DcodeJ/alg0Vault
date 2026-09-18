using System.IO;
using System.Text.Json;
using AlgorithmVault.Models;

namespace AlgorithmVault.Services;

public sealed class AlgorithmRepository
{
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };
    public string DataDirectory { get; } = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AlgorithmVault");
    public string DataFile => Path.Combine(DataDirectory, "algorithms.json");
    public string ThemeFile => Path.Combine(DataDirectory, "theme.txt");

    public string LoadTheme()
    {
        try
        {
            if (!File.Exists(ThemeFile)) return "Current";
            var theme = File.ReadAllText(ThemeFile).Trim();
            return ThemeManager.ThemeNames.Contains(theme, StringComparer.OrdinalIgnoreCase) ? theme : "Current";
        }
        catch { return "Current"; }
    }

    public void SaveTheme(string theme)
    {
        Directory.CreateDirectory(DataDirectory);
        File.WriteAllText(ThemeFile, theme);
    }

    public async Task<List<AlgorithmEntry>> LoadAsync()
    {
        Directory.CreateDirectory(DataDirectory);
        if (!File.Exists(DataFile))
        {
            var seeds = CreateSeeds();
            NormalizeCode(seeds);
            MergeBuiltIns(seeds);
            await SaveAsync(seeds);
            return seeds;
        }

        try
        {
            List<AlgorithmEntry> entries;
            await using (var stream = File.OpenRead(DataFile))
                entries = await JsonSerializer.DeserializeAsync<List<AlgorithmEntry>>(stream, _options) ?? [];
            NormalizeCode(entries);
            if (MergeBuiltIns(entries))
                await SaveAsync(entries);
            return entries;
        }
        catch (JsonException)
        {
            var backup = Path.Combine(DataDirectory, $"algorithms-corrupt-{DateTime.Now:yyyyMMdd-HHmmss}.json");
            File.Copy(DataFile, backup, true);
            var recovered = CreateSeeds();
            NormalizeCode(recovered);
            MergeBuiltIns(recovered);
            await SaveAsync(recovered);
            return recovered;
        }
    }

    public async Task SaveAsync(IEnumerable<AlgorithmEntry> entries)
    {
        Directory.CreateDirectory(DataDirectory);
        var temp = DataFile + ".tmp";
        await using (var stream = File.Create(temp))
            await JsonSerializer.SerializeAsync(stream, entries, _options);
        File.Move(temp, DataFile, true);
    }

    public async Task ExportAsync(string path, IEnumerable<AlgorithmEntry> entries)
    {
        await using var stream = File.Create(path);
        await JsonSerializer.SerializeAsync(stream, entries, _options);
    }

    public async Task<List<AlgorithmEntry>> ImportAsync(string path)
    {
        await using var stream = File.OpenRead(path);
        var entries = await JsonSerializer.DeserializeAsync<List<AlgorithmEntry>>(stream, _options)
                      ?? throw new InvalidDataException("The selected file does not contain an algorithm collection.");
        NormalizeCode(entries);
        return entries;
    }

    private static void NormalizeCode(IEnumerable<AlgorithmEntry> entries)
    {
        foreach (var entry in entries)
        {
            if (entry.Id == Guid.Empty) entry.Id = Guid.NewGuid();
            entry.Title = string.IsNullOrWhiteSpace(entry.Title) ? "Untitled algorithm" : entry.Title;
            entry.Category = string.IsNullOrWhiteSpace(entry.Category) ? "Other" : entry.Category;
            entry.Difficulty = entry.Difficulty is "Easy" or "Medium" or "Hard" ? entry.Difficulty : "Medium";
            entry.TimeComplexity ??= "";
            entry.SpaceComplexity ??= "";
            entry.Tags ??= "";
            entry.Pattern = string.IsNullOrWhiteSpace(entry.Pattern) ? "General" : entry.Pattern;
            entry.Summary ??= "";
            entry.Notes ??= "";
            entry.Code ??= "";
            entry.MasteryLevel = entry.MasteryLevel is "New" or "Learning" or "Confident" or "Mastered" ? entry.MasteryLevel : "New";
            if (!entry.Code.Contains('\n') && entry.Code.Contains("\\n"))
                entry.Code = entry.Code.Replace("\\n", Environment.NewLine);
        }
    }

    private static bool MergeBuiltIns(List<AlgorithmEntry> entries)
    {
        var changed = false;
        var corePatterns = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["Binary Search"] = "Binary Search",
            ["Breadth-First Search"] = "Graph Traversal",
            ["Merge Sort"] = "Divide and Conquer",
            ["Dijkstra's Algorithm"] = "Shortest Path",
            ["Longest Increasing Subsequence"] = "Dynamic Programming + Binary Search",
            ["Two Sum"] = "Hash Map Lookup"
        };

        foreach (var entry in entries.Where(x => corePatterns.ContainsKey(x.Title)))
        {
            if (!entry.IsBuiltIn) { entry.IsBuiltIn = true; changed = true; }
            if (string.IsNullOrWhiteSpace(entry.Pattern) || entry.Pattern == "General")
            {
                entry.Pattern = corePatterns[entry.Title];
                changed = true;
            }
        }

        var existingTitles = entries.Select(x => x.Title).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var catalog = BuiltInCatalog.Create().Concat(InterviewCatalog.Create());
        foreach (var builtIn in catalog.Where(x => existingTitles.Add(x.Title)))
        {
            entries.Add(builtIn);
            changed = true;
        }
        return changed;
    }

    private static List<AlgorithmEntry> CreateSeeds() =>
    [
        new()
        {
            Title = "Binary Search", Category = "Searching", Difficulty = "Easy",
            TimeComplexity = "O(log n)", SpaceComplexity = "O(1)", Tags = "array, divide-and-conquer, sorted",
            Summary = "Finds a target in a sorted array by repeatedly halving the search interval.",
            Notes = "The input must be sorted. Use left + (right - left) / 2 to avoid integer overflow.",
            IsFavorite = true,
            Code = """public static int BinarySearch(int[] nums, int target)\n{\n    int left = 0, right = nums.Length - 1;\n\n    while (left <= right)\n    {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n\n    return -1;\n}"""
        },
        new()
        {
            Title = "Breadth-First Search", Category = "Graphs", Difficulty = "Medium",
            TimeComplexity = "O(V + E)", SpaceComplexity = "O(V)", Tags = "graph, queue, shortest-path",
            Summary = "Explores a graph level by level and finds shortest paths in unweighted graphs.",
            Notes = "Mark nodes visited when enqueuing them, not when dequeuing, to prevent duplicates.",
            Code = """public static List<int> Bfs(List<int>[] graph, int start)\n{\n    var order = new List<int>();\n    var visited = new bool[graph.Length];\n    var queue = new Queue<int>();\n\n    visited[start] = true;\n    queue.Enqueue(start);\n\n    while (queue.Count > 0)\n    {\n        int node = queue.Dequeue();\n        order.Add(node);\n\n        foreach (int next in graph[node])\n            if (!visited[next])\n            {\n                visited[next] = true;\n                queue.Enqueue(next);\n            }\n    }\n\n    return order;\n}"""
        },
        new()
        {
            Title = "Merge Sort", Category = "Sorting", Difficulty = "Medium",
            TimeComplexity = "O(n log n)", SpaceComplexity = "O(n)", Tags = "array, stable, divide-and-conquer",
            Summary = "Divides the array into halves, sorts each half, then merges the sorted results.",
            Notes = "Stable and predictable, but requires auxiliary memory for merging.",
            Code = """public static void MergeSort(int[] a, int left, int right)\n{\n    if (left >= right) return;\n    int mid = left + (right - left) / 2;\n    MergeSort(a, left, mid);\n    MergeSort(a, mid + 1, right);\n    Merge(a, left, mid, right);\n}\n\nprivate static void Merge(int[] a, int left, int mid, int right)\n{\n    int[] temp = new int[right - left + 1];\n    int i = left, j = mid + 1, k = 0;\n    while (i <= mid && j <= right)\n        temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];\n    while (i <= mid) temp[k++] = a[i++];\n    while (j <= right) temp[k++] = a[j++];\n    Array.Copy(temp, 0, a, left, temp.Length);\n}"""
        },
        new()
        {
            Title = "Dijkstra's Algorithm", Category = "Graphs", Difficulty = "Hard",
            TimeComplexity = "O((V + E) log V)", SpaceComplexity = "O(V + E)", Tags = "graph, shortest-path, priority-queue",
            Summary = "Computes shortest paths from one source in a graph with non-negative edge weights.",
            Notes = "Do not use with negative-weight edges. Skip stale priority-queue entries.",
            IsFavorite = true,
            Code = """public static int[] Dijkstra(List<(int To, int Weight)>[] graph, int source)\n{\n    int[] distance = Enumerable.Repeat(int.MaxValue, graph.Length).ToArray();\n    var pq = new PriorityQueue<int, int>();\n    distance[source] = 0;\n    pq.Enqueue(source, 0);\n\n    while (pq.TryDequeue(out int node, out int cost))\n    {\n        if (cost != distance[node]) continue;\n        foreach (var (next, weight) in graph[node])\n        {\n            int candidate = cost + weight;\n            if (candidate >= distance[next]) continue;\n            distance[next] = candidate;\n            pq.Enqueue(next, candidate);\n        }\n    }\n    return distance;\n}"""
        },
        new()
        {
            Title = "Longest Increasing Subsequence", Category = "Dynamic Programming", Difficulty = "Hard",
            TimeComplexity = "O(n log n)", SpaceComplexity = "O(n)", Tags = "array, binary-search, patience-sorting",
            Summary = "Finds the length of the longest strictly increasing subsequence using a tails array.",
            Notes = "tails[i] stores the smallest possible tail for an increasing subsequence of length i + 1.",
            Code = """public static int LengthOfLis(int[] nums)\n{\n    var tails = new List<int>();\n    foreach (int value in nums)\n    {\n        int index = tails.BinarySearch(value);\n        if (index < 0) index = ~index;\n        if (index == tails.Count) tails.Add(value);\n        else tails[index] = value;\n    }\n    return tails.Count;\n}"""
        },
        new()
        {
            Title = "Two Sum", Category = "Arrays", Difficulty = "Easy",
            TimeComplexity = "O(n)", SpaceComplexity = "O(n)", Tags = "array, hash-map, interview",
            Summary = "Returns indices of two values whose sum equals the requested target.",
            Notes = "Check the complement before inserting the current number so one element is never reused.",
            Code = """public static int[] TwoSum(int[] nums, int target)\n{\n    var seen = new Dictionary<int, int>();\n    for (int i = 0; i < nums.Length; i++)\n    {\n        int complement = target - nums[i];\n        if (seen.TryGetValue(complement, out int j))\n            return [j, i];\n        seen[nums[i]] = i;\n    }\n    return [];\n}"""
        }
    ];
}
