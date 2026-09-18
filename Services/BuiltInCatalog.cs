using AlgorithmVault.Models;

namespace AlgorithmVault.Services;

internal static class BuiltInCatalog
{
    public static List<AlgorithmEntry> Create() =>
    [
        A("Lower Bound", "Searching", "Medium", "O(log n)", "O(1)", "Binary Search",
            "array, sorted, boundary",
            "Finds the first index whose value is greater than or equal to the target.",
            "Use a half-open interval [left, right). The answer may equal nums.Length.",
            """
public static int LowerBound(int[] nums, int target)
{
    int left = 0, right = nums.Length;
    while (left < right)
    {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}
"""),

        A("Kadane's Algorithm", "Arrays", "Medium", "O(n)", "O(1)", "Dynamic Programming",
            "array, maximum-subarray, greedy",
            "Finds the maximum sum over all non-empty contiguous subarrays.",
            "Initialize from the first value so arrays containing only negative values work correctly.",
            """
public static int MaxSubarraySum(int[] nums)
{
    if (nums.Length == 0) throw new ArgumentException("Array cannot be empty.");
    int endingHere = nums[0], best = nums[0];
    for (int i = 1; i < nums.Length; i++)
    {
        endingHere = Math.Max(nums[i], endingHere + nums[i]);
        best = Math.Max(best, endingHere);
    }
    return best;
}
"""),

        A("Prefix Sum Range Query", "Arrays", "Easy", "O(n) build, O(1) query", "O(n)", "Prefix Sum",
            "array, prefix-sum, range-query",
            "Precomputes cumulative sums so any inclusive range sum can be answered in constant time.",
            "Store n + 1 values so prefix[0] represents the empty prefix and avoids special cases.",
            """
public sealed class RangeSum
{
    private readonly long[] _prefix;

    public RangeSum(int[] nums)
    {
        _prefix = new long[nums.Length + 1];
        for (int i = 0; i < nums.Length; i++)
            _prefix[i + 1] = _prefix[i] + nums[i];
    }

    public long Query(int left, int right) =>
        _prefix[right + 1] - _prefix[left];
}
"""),

        A("Sliding Window Maximum", "Arrays", "Hard", "O(n)", "O(k)", "Monotonic Deque",
            "array, sliding-window, deque, monotonic",
            "Returns the maximum value in every fixed-size window using a decreasing deque of indices.",
            "Remove expired indices from the front and weaker values from the back.",
            """
public static int[] MaxSlidingWindow(int[] nums, int k)
{
    if (k <= 0 || k > nums.Length) return [];
    var deque = new LinkedList<int>();
    var result = new int[nums.Length - k + 1];

    for (int i = 0; i < nums.Length; i++)
    {
        if (deque.First is not null && deque.First.Value <= i - k)
            deque.RemoveFirst();
        while (deque.Last is not null && nums[deque.Last.Value] <= nums[i])
            deque.RemoveLast();
        deque.AddLast(i);
        if (i >= k - 1) result[i - k + 1] = nums[deque.First!.Value];
    }
    return result;
}
"""),

        A("Quick Sort", "Sorting", "Medium", "O(n log n) average", "O(log n) average", "Partitioning",
            "array, in-place, divide-and-conquer",
            "Sorts in place by partitioning values around a pivot, then recursively sorting both sides.",
            "Worst-case time is O(n²). Randomizing the pivot or shuffling reduces adversarial behavior.",
            """
public static void QuickSort(int[] nums, int left, int right)
{
    while (left < right)
    {
        int i = left, j = right;
        int pivot = nums[left + (right - left) / 2];
        while (i <= j)
        {
            while (nums[i] < pivot) i++;
            while (nums[j] > pivot) j--;
            if (i <= j)
            {
                (nums[i], nums[j]) = (nums[j], nums[i]);
                i++;
                j--;
            }
        }
        if (j - left < right - i)
        {
            if (left < j) QuickSort(nums, left, j);
            left = i;
        }
        else
        {
            if (i < right) QuickSort(nums, i, right);
            right = j;
        }
    }
}
"""),

        A("Depth-First Search", "Graphs", "Easy", "O(V + E)", "O(V)", "Graph Traversal",
            "graph, stack, traversal, components",
            "Explores as far as possible along each branch using an explicit stack.",
            "Push neighbors in reverse order when deterministic adjacency-list order matters.",
            """
public static List<int> Dfs(List<int>[] graph, int start)
{
    var order = new List<int>();
    var visited = new bool[graph.Length];
    var stack = new Stack<int>();
    stack.Push(start);

    while (stack.Count > 0)
    {
        int node = stack.Pop();
        if (visited[node]) continue;
        visited[node] = true;
        order.Add(node);
        for (int i = graph[node].Count - 1; i >= 0; i--)
            if (!visited[graph[node][i]]) stack.Push(graph[node][i]);
    }
    return order;
}
"""),

        A("Topological Sort (Kahn)", "Graphs", "Medium", "O(V + E)", "O(V)", "Topological Sort",
            "graph, dag, indegree, queue",
            "Orders a directed acyclic graph so every dependency appears before its dependents.",
            "If fewer than V nodes are produced, the graph contains a directed cycle.",
            """
public static int[] TopologicalSort(List<int>[] graph)
{
    int[] indegree = new int[graph.Length];
    foreach (var edges in graph)
        foreach (int next in edges) indegree[next]++;

    var queue = new Queue<int>(Enumerable.Range(0, graph.Length)
        .Where(node => indegree[node] == 0));
    var order = new List<int>();
    while (queue.Count > 0)
    {
        int node = queue.Dequeue();
        order.Add(node);
        foreach (int next in graph[node])
            if (--indegree[next] == 0) queue.Enqueue(next);
    }
    return order.Count == graph.Length ? order.ToArray() : [];
}
"""),

        A("Disjoint Set Union", "Graphs", "Medium", "O(α(n)) amortized", "O(n)", "Union-Find",
            "graph, union-find, connectivity, mst",
            "Tracks connected components efficiently with path compression and union by size.",
            "Useful for Kruskal's MST, dynamic connectivity, and cycle detection in undirected graphs.",
            """
public sealed class DisjointSet
{
    private readonly int[] _parent;
    private readonly int[] _size;

    public DisjointSet(int n)
    {
        _parent = Enumerable.Range(0, n).ToArray();
        _size = Enumerable.Repeat(1, n).ToArray();
    }

    public int Find(int x) => _parent[x] == x
        ? x
        : _parent[x] = Find(_parent[x]);

    public bool Union(int a, int b)
    {
        a = Find(a); b = Find(b);
        if (a == b) return false;
        if (_size[a] < _size[b]) (a, b) = (b, a);
        _parent[b] = a;
        _size[a] += _size[b];
        return true;
    }
}
"""),

        A("Kruskal's Minimum Spanning Tree", "Graphs", "Hard", "O(E log E)", "O(V + E)", "Greedy + Union-Find",
            "graph, mst, greedy, union-find",
            "Builds a minimum spanning forest by taking the lightest edge that connects two components.",
            "For a connected graph, exactly V - 1 edges must be accepted.",
            """
public static long Kruskal(int vertices, List<(int U, int V, int W)> edges)
{
    var dsu = new DisjointSet(vertices);
    long cost = 0;
    int used = 0;
    foreach (var (u, v, weight) in edges.OrderBy(e => e.W))
    {
        if (!dsu.Union(u, v)) continue;
        cost += weight;
        if (++used == vertices - 1) break;
    }
    if (used != vertices - 1) throw new InvalidOperationException("Graph is disconnected.");
    return cost;
}
"""),

        A("Binary Tree Level Order", "Trees", "Medium", "O(n)", "O(w)", "Breadth-First Search",
            "tree, bfs, queue, levels",
            "Traverses a binary tree one depth level at a time.",
            "Capture the queue count before each level; it is the exact number of nodes in that level.",
            """
public static List<List<int>> LevelOrder(TreeNode? root)
{
    var result = new List<List<int>>();
    if (root is null) return result;
    var queue = new Queue<TreeNode>();
    queue.Enqueue(root);

    while (queue.Count > 0)
    {
        int levelSize = queue.Count;
        var level = new List<int>(levelSize);
        while (levelSize-- > 0)
        {
            var node = queue.Dequeue();
            level.Add(node.Value);
            if (node.Left is not null) queue.Enqueue(node.Left);
            if (node.Right is not null) queue.Enqueue(node.Right);
        }
        result.Add(level);
    }
    return result;
}

public sealed record TreeNode(int Value, TreeNode? Left = null, TreeNode? Right = null);
"""),

        A("Lowest Common Ancestor", "Trees", "Medium", "O(n)", "O(h)", "Tree Recursion",
            "tree, recursion, lca",
            "Finds the lowest node that has both targets in its subtree in a general binary tree.",
            "This version assumes both targets exist. For uncertain inputs, also propagate how many targets were found.",
            """
public static TreeNode? LowestCommonAncestor(TreeNode? root, TreeNode p, TreeNode q)
{
    if (root is null || ReferenceEquals(root, p) || ReferenceEquals(root, q))
        return root;

    var left = LowestCommonAncestor(root.Left, p, q);
    var right = LowestCommonAncestor(root.Right, p, q);
    if (left is not null && right is not null) return root;
    return left ?? right;
}
"""),

        A("KMP String Search", "Strings", "Hard", "O(n + m)", "O(m)", "Prefix Function",
            "string, pattern-matching, prefix-table",
            "Finds the first pattern occurrence without rechecking text characters after a mismatch.",
            "The LPS table stores the longest proper prefix that is also a suffix for each pattern prefix.",
            """
public static int KmpIndexOf(string text, string pattern)
{
    if (pattern.Length == 0) return 0;
    int[] lps = new int[pattern.Length];
    for (int i = 1, length = 0; i < pattern.Length;)
        if (pattern[i] == pattern[length]) lps[i++] = ++length;
        else if (length > 0) length = lps[length - 1];
        else lps[i++] = 0;

    for (int i = 0, j = 0; i < text.Length;)
    {
        if (text[i] == pattern[j]) { i++; j++; }
        if (j == pattern.Length) return i - j;
        if (i < text.Length && text[i] != pattern[j])
            if (j > 0) j = lps[j - 1]; else i++;
    }
    return -1;
}
"""),

        A("Trie (Prefix Tree)", "Strings", "Medium", "O(L) per operation", "O(total characters)", "Trie",
            "string, prefix, dictionary, autocomplete",
            "Stores strings by shared prefixes for fast insert, exact lookup, and prefix lookup.",
            "A dictionary-based node handles arbitrary characters; an array of 26 children is faster for lowercase English letters.",
            """
public sealed class Trie
{
    private sealed class Node
    {
        public Dictionary<char, Node> Children { get; } = [];
        public bool IsWord { get; set; }
    }

    private readonly Node _root = new();

    public void Insert(string word)
    {
        var node = _root;
        foreach (char c in word)
        {
            if (!node.Children.TryGetValue(c, out var next))
                node.Children[c] = next = new Node();
            node = next;
        }
        node.IsWord = true;
    }

    public bool Contains(string word) => Find(word)?.IsWord == true;
    public bool StartsWith(string prefix) => Find(prefix) is not null;

    private Node? Find(string text)
    {
        var node = _root;
        foreach (char c in text)
            if (!node.Children.TryGetValue(c, out node)) return null;
        return node;
    }
}
"""),

        A("Coin Change", "Dynamic Programming", "Medium", "O(amount × coins)", "O(amount)", "Unbounded Knapsack",
            "dp, minimum, unbounded-knapsack",
            "Computes the minimum number of reusable coins needed to reach an exact amount.",
            "Use amount + 1 as an unreachable sentinel because a valid answer can never need more than amount coins.",
            """
public static int CoinChange(int[] coins, int amount)
{
    int[] dp = Enumerable.Repeat(amount + 1, amount + 1).ToArray();
    dp[0] = 0;
    for (int value = 1; value <= amount; value++)
        foreach (int coin in coins)
            if (coin <= value) dp[value] = Math.Min(dp[value], dp[value - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
"""),

        A("0/1 Knapsack", "Dynamic Programming", "Medium", "O(n × capacity)", "O(capacity)", "0/1 Knapsack",
            "dp, optimization, capacity",
            "Maximizes value when each item can be selected at most once under a capacity limit.",
            "Iterate capacity backward; forward iteration would allow the same item to be reused.",
            """
public static int Knapsack(int[] weights, int[] values, int capacity)
{
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.Length; i++)
        for (int current = capacity; current >= weights[i]; current--)
            dp[current] = Math.Max(dp[current], dp[current - weights[i]] + values[i]);
    return dp[capacity];
}
"""),

        A("Generate Permutations", "Backtracking", "Medium", "O(n · n!)", "O(n)", "Backtracking",
            "backtracking, permutation, recursion",
            "Generates every ordering by choosing a value for each position and undoing the choice afterward.",
            "For duplicate input values, sort first and skip equal unused values at the same recursion depth.",
            """
public static List<int[]> Permutations(int[] nums)
{
    var result = new List<int[]>();
    void Search(int index)
    {
        if (index == nums.Length) { result.Add((int[])nums.Clone()); return; }
        for (int i = index; i < nums.Length; i++)
        {
            (nums[index], nums[i]) = (nums[i], nums[index]);
            Search(index + 1);
            (nums[index], nums[i]) = (nums[i], nums[index]);
        }
    }
    Search(0);
    return result;
}
"""),

        A("Next Greater Element", "Stacks & Queues", "Medium", "O(n)", "O(n)", "Monotonic Stack",
            "stack, monotonic, array",
            "Finds the next larger value to the right of every array element.",
            "Store indices rather than values when the result must align with original positions.",
            """
public static int[] NextGreater(int[] nums)
{
    int[] answer = Enumerable.Repeat(-1, nums.Length).ToArray();
    var stack = new Stack<int>();
    for (int i = 0; i < nums.Length; i++)
    {
        while (stack.Count > 0 && nums[stack.Peek()] < nums[i])
            answer[stack.Pop()] = nums[i];
        stack.Push(i);
    }
    return answer;
}
"""),

        A("Top K Frequent Elements", "Arrays", "Medium", "O(n log k)", "O(n)", "Heap / Frequency Map",
            "hash-map, heap, top-k",
            "Returns the k most frequent values using a frequency map and a bounded min-heap.",
            "Keeping only k heap entries is preferable when k is much smaller than the number of distinct values.",
            """
public static int[] TopKFrequent(int[] nums, int k)
{
    var counts = nums.GroupBy(x => x).ToDictionary(g => g.Key, g => g.Count());
    var heap = new PriorityQueue<int, int>();
    foreach (var (value, frequency) in counts)
    {
        heap.Enqueue(value, frequency);
        if (heap.Count > k) heap.Dequeue();
    }
    var answer = new int[Math.Min(k, heap.Count)];
    for (int i = answer.Length - 1; i >= 0; i--)
        answer[i] = heap.Dequeue();
    return answer;
}
"""),

        A("Detect Directed Cycle", "Graphs", "Medium", "O(V + E)", "O(V)", "DFS Coloring",
            "graph, cycle, dfs, coloring",
            "Detects a cycle in a directed graph using unvisited, visiting, and finished states.",
            "An edge to a visiting node is a back edge and proves that a directed cycle exists.",
            """
public static bool HasDirectedCycle(List<int>[] graph)
{
    var state = new byte[graph.Length];
    bool Visit(int node)
    {
        if (state[node] == 1) return true;
        if (state[node] == 2) return false;
        state[node] = 1;
        foreach (int next in graph[node])
            if (Visit(next)) return true;
        state[node] = 2;
        return false;
    }
    return Enumerable.Range(0, graph.Length).Any(node => state[node] == 0 && Visit(node));
}
""")
    ];

    private static AlgorithmEntry A(
        string title, string category, string difficulty, string time, string space,
        string pattern, string tags, string summary, string notes, string code) => new()
    {
        Title = title,
        Category = category,
        Difficulty = difficulty,
        TimeComplexity = time,
        SpaceComplexity = space,
        Pattern = pattern,
        Tags = tags,
        Summary = summary,
        Notes = notes,
        Code = code.Trim(),
        IsBuiltIn = true,
        UpdatedAt = new DateTime(2026, 9, 1, 9, 0, 0, DateTimeKind.Local),
        CreatedAt = new DateTime(2026, 9, 1, 9, 0, 0, DateTimeKind.Local)
    };
}
