using AlgorithmVault.Models;

namespace AlgorithmVault.Services;

internal static class InterviewCatalog
{
    public static List<AlgorithmEntry> Create() =>
    [
        A("Bubble Sort", "Sorting", "Easy", "O(n²)", "O(1)", "Exchange Sort", "sorting, in-place, stable",
            "Repeatedly swaps adjacent out-of-order values; useful for learning, rarely for production.",
            "The swapped flag makes already-sorted input finish in O(n).",
            """
public static void BubbleSort(int[] nums)
{
    for (int end = nums.Length - 1; end > 0; end--)
    {
        bool swapped = false;
        for (int i = 0; i < end; i++)
            if (nums[i] > nums[i + 1])
            {
                (nums[i], nums[i + 1]) = (nums[i + 1], nums[i]);
                swapped = true;
            }
        if (!swapped) return;
    }
}
"""),

        A("Selection Sort", "Sorting", "Easy", "O(n²)", "O(1)", "Selection", "sorting, in-place, comparison",
            "Selects the smallest remaining value and places it at the next sorted position.",
            "It performs only O(n) swaps but is not stable in its usual form.",
            """
public static void SelectionSort(int[] nums)
{
    for (int i = 0; i < nums.Length - 1; i++)
    {
        int minIndex = i;
        for (int j = i + 1; j < nums.Length; j++)
            if (nums[j] < nums[minIndex]) minIndex = j;
        if (minIndex != i) (nums[i], nums[minIndex]) = (nums[minIndex], nums[i]);
    }
}
"""),

        A("Insertion Sort", "Sorting", "Easy", "O(n²), O(n) nearly sorted", "O(1)", "Incremental Insertion", "sorting, stable, in-place",
            "Builds a sorted prefix by inserting each new value into its correct position.",
            "Excellent for small or nearly sorted inputs and commonly used inside hybrid sorts.",
            """
public static void InsertionSort(int[] nums)
{
    for (int i = 1; i < nums.Length; i++)
    {
        int value = nums[i], j = i - 1;
        while (j >= 0 && nums[j] > value)
        {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = value;
    }
}
"""),

        A("Heap Sort", "Sorting", "Medium", "O(n log n)", "O(1)", "Heap", "sorting, heap, in-place",
            "Builds a max heap and repeatedly moves its largest value to the sorted suffix.",
            "Predictable O(n log n) and constant extra space, but not stable.",
            """
public static void HeapSort(int[] nums)
{
    for (int i = nums.Length / 2 - 1; i >= 0; i--) SiftDown(nums, i, nums.Length);
    for (int end = nums.Length - 1; end > 0; end--)
    {
        (nums[0], nums[end]) = (nums[end], nums[0]);
        SiftDown(nums, 0, end);
    }
}

private static void SiftDown(int[] a, int root, int length)
{
    while (root * 2 + 1 < length)
    {
        int child = root * 2 + 1;
        if (child + 1 < length && a[child + 1] > a[child]) child++;
        if (a[root] >= a[child]) return;
        (a[root], a[child]) = (a[child], a[root]);
        root = child;
    }
}
"""),

        A("Counting Sort", "Sorting", "Medium", "O(n + k)", "O(k)", "Frequency Counting", "sorting, integer, non-comparison",
            "Sorts bounded integers by counting how often every value occurs.",
            "Avoid it when max - min is enormous compared with the input length.",
            """
public static int[] CountingSort(int[] nums)
{
    if (nums.Length == 0) return [];
    int min = nums.Min(), max = nums.Max();
    int[] counts = new int[max - min + 1];
    foreach (int value in nums) counts[value - min]++;
    var result = new int[nums.Length];
    for (int value = 0, index = 0; value < counts.Length; value++)
        while (counts[value]-- > 0) result[index++] = value + min;
    return result;
}
"""),

        A("Radix Sort", "Sorting", "Medium", "O(d · (n + 10))", "O(n + 10)", "Digit Bucketing", "sorting, integer, stable",
            "Stably sorts non-negative integers one decimal digit at a time.",
            "This version accepts non-negative integers; handle signs separately when negatives are allowed.",
            """
public static void RadixSort(int[] nums)
{
    if (nums.Any(x => x < 0)) throw new ArgumentException("Non-negative values only.");
    if (nums.Length == 0) return;
    int[] output = new int[nums.Length];
    for (long place = 1; nums.Max() / place > 0; place *= 10)
    {
        int[] count = new int[10];
        foreach (int value in nums) count[(int)(value / place % 10)]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = nums.Length - 1; i >= 0; i--)
            output[--count[(int)(nums[i] / place % 10)]] = nums[i];
        Array.Copy(output, nums, nums.Length);
    }
}
"""),

        A("Valid Parentheses", "Stacks & Queues", "Easy", "O(n)", "O(n)", "Stack Matching", "stack, string, brackets",
            "Checks whether every closing bracket matches the most recent unmatched opening bracket.",
            "Reject immediately when a closing bracket appears with an empty stack.",
            """
public static bool IsValidParentheses(string text)
{
    var stack = new Stack<char>();
    foreach (char c in text)
    {
        if (c is '(' or '[' or '{') stack.Push(c);
        else if (c is ')' or ']' or '}')
        {
            if (stack.Count == 0) return false;
            char open = stack.Pop();
            if ((open, c) is not ('(', ')') and not ('[', ']') and not ('{', '}')) return false;
        }
    }
    return stack.Count == 0;
}
"""),

        A("Valid Anagram", "Strings", "Easy", "O(n)", "O(1) alphabet", "Frequency Counting", "string, frequency, hash-map",
            "Determines whether two strings contain exactly the same characters with the same counts.",
            "Use a dictionary for arbitrary Unicode; this compact version assumes lowercase English letters.",
            """
public static bool IsAnagram(string first, string second)
{
    if (first.Length != second.Length) return false;
    int[] counts = new int[26];
    for (int i = 0; i < first.Length; i++)
    {
        counts[first[i] - 'a']++;
        counts[second[i] - 'a']--;
    }
    return counts.All(count => count == 0);
}
"""),

        A("Group Anagrams", "Strings", "Medium", "O(n · k log k)", "O(n · k)", "Canonical Key", "string, hash-map, grouping",
            "Groups words that share the same sorted-character signature.",
            "A 26-count signature improves this to O(n · k) for lowercase English input.",
            """
public static IList<IList<string>> GroupAnagrams(string[] words)
{
    var groups = new Dictionary<string, IList<string>>();
    foreach (string word in words)
    {
        string key = new string(word.OrderBy(c => c).ToArray());
        if (!groups.TryGetValue(key, out var group))
            groups[key] = group = new List<string>();
        group.Add(word);
    }
    return groups.Values.ToList();
}
"""),

        A("Longest Substring Without Repeating", "Strings", "Medium", "O(n)", "O(min(n, alphabet))", "Sliding Window", "string, sliding-window, hash-map",
            "Finds the longest substring containing no repeated character.",
            "Move the left boundary forward only; never move it backward after finding an older duplicate.",
            """
public static int LongestUniqueSubstring(string text)
{
    var lastSeen = new Dictionary<char, int>();
    int left = 0, best = 0;
    for (int right = 0; right < text.Length; right++)
    {
        if (lastSeen.TryGetValue(text[right], out int previous))
            left = Math.Max(left, previous + 1);
        lastSeen[text[right]] = right;
        best = Math.Max(best, right - left + 1);
    }
    return best;
}
"""),

        A("Valid Palindrome", "Strings", "Easy", "O(n)", "O(1)", "Two Pointers", "string, two-pointers, palindrome",
            "Checks whether the alphanumeric characters read the same forward and backward.",
            "Skip punctuation on both sides before comparing case-insensitively.",
            """
public static bool IsPalindrome(string text)
{
    int left = 0, right = text.Length - 1;
    while (left < right)
    {
        while (left < right && !char.IsLetterOrDigit(text[left])) left++;
        while (left < right && !char.IsLetterOrDigit(text[right])) right--;
        if (char.ToLowerInvariant(text[left++]) != char.ToLowerInvariant(text[right--])) return false;
    }
    return true;
}
"""),

        A("Reverse Linked List", "Linked Lists", "Easy", "O(n)", "O(1)", "Pointer Reversal", "linked-list, pointers, iterative",
            "Reverses a singly linked list by redirecting each node's next pointer.",
            "Save next before overwriting the pointer or the rest of the list becomes unreachable.",
            """
public static ListNode? ReverseList(ListNode? head)
{
    ListNode? previous = null;
    while (head is not null)
    {
        ListNode? next = head.Next;
        head.Next = previous;
        previous = head;
        head = next;
    }
    return previous;
}

public sealed class ListNode(int value, ListNode? next = null)
{
    public int Value { get; set; } = value;
    public ListNode? Next { get; set; } = next;
}
"""),

        A("Linked List Cycle", "Linked Lists", "Easy", "O(n)", "O(1)", "Fast & Slow Pointers", "linked-list, cycle, two-pointers",
            "Detects a cycle by moving one pointer once and another pointer twice per step.",
            "If a cycle exists, the two pointers must eventually meet inside it.",
            """
public static bool HasCycle(ListNode? head)
{
    ListNode? slow = head, fast = head;
    while (fast?.Next is not null)
    {
        slow = slow!.Next;
        fast = fast.Next.Next;
        if (ReferenceEquals(slow, fast)) return true;
    }
    return false;
}
"""),

        A("Merge Two Sorted Lists", "Linked Lists", "Easy", "O(n + m)", "O(1)", "Two Pointers", "linked-list, merge, sentinel",
            "Merges two sorted linked lists by repeatedly attaching the smaller current node.",
            "A dummy head removes special cases for initializing the result list.",
            """
public static ListNode? MergeLists(ListNode? first, ListNode? second)
{
    var dummy = new ListNode(0);
    var tail = dummy;
    while (first is not null && second is not null)
    {
        if (first.Value <= second.Value) { tail.Next = first; first = first.Next; }
        else { tail.Next = second; second = second.Next; }
        tail = tail.Next;
    }
    tail.Next = first ?? second;
    return dummy.Next;
}
"""),

        A("Remove Nth Node From End", "Linked Lists", "Medium", "O(n)", "O(1)", "Two Pointers + Sentinel", "linked-list, two-pointers, sentinel",
            "Removes the nth node from the end in one pass by keeping two pointers n nodes apart.",
            "Using a dummy node cleanly handles removing the original head.",
            """
public static ListNode? RemoveNthFromEnd(ListNode? head, int n)
{
    var dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i < n; i++) fast = fast.Next ?? throw new ArgumentOutOfRangeException(nameof(n));
    while (fast.Next is not null) { fast = fast.Next; slow = slow.Next!; }
    slow.Next = slow.Next?.Next;
    return dummy.Next;
}
"""),

        A("Merge Intervals", "Arrays", "Medium", "O(n log n)", "O(n)", "Sort + Sweep", "array, intervals, sorting",
            "Combines every pair of overlapping intervals after sorting by start position.",
            "Touching intervals merge when next.Start <= current.End; adjust this rule for open intervals.",
            """
public static int[][] MergeIntervals(int[][] intervals)
{
    if (intervals.Length == 0) return [];
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    var result = new List<int[]> { (int[])intervals[0].Clone() };
    foreach (var interval in intervals.Skip(1))
    {
        int[] last = result[^1];
        if (interval[0] <= last[1]) last[1] = Math.Max(last[1], interval[1]);
        else result.Add((int[])interval.Clone());
    }
    return result.ToArray();
}
"""),

        A("Three Sum", "Arrays", "Medium", "O(n²)", "O(1) excluding output", "Sort + Two Pointers", "array, two-pointers, sorting",
            "Finds unique triples whose values sum to zero by fixing one value and scanning the rest with two pointers.",
            "Skip equal fixed values and equal pointer values after finding a triple to avoid duplicates.",
            """
public static IList<IList<int>> ThreeSum(int[] nums)
{
    Array.Sort(nums);
    var result = new List<IList<int>>();
    for (int i = 0; i < nums.Length - 2; i++)
    {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.Length - 1;
        while (left < right)
        {
            long sum = (long)nums[i] + nums[left] + nums[right];
            if (sum < 0) left++;
            else if (sum > 0) right--;
            else
            {
                result.Add([nums[i], nums[left], nums[right]]);
                int a = nums[left], b = nums[right];
                while (left < right && nums[left] == a) left++;
                while (left < right && nums[right] == b) right--;
            }
        }
    }
    return result;
}
"""),

        A("Container With Most Water", "Arrays", "Medium", "O(n)", "O(1)", "Two Pointers", "array, two-pointers, greedy",
            "Maximizes contained area by moving inward from the widest pair of vertical lines.",
            "Move the shorter line because keeping it cannot improve height while width decreases.",
            """
public static int MaxArea(int[] heights)
{
    int left = 0, right = heights.Length - 1, best = 0;
    while (left < right)
    {
        best = Math.Max(best, Math.Min(heights[left], heights[right]) * (right - left));
        if (heights[left] <= heights[right]) left++; else right--;
    }
    return best;
}
"""),

        A("Trapping Rain Water", "Arrays", "Hard", "O(n)", "O(1)", "Two Pointers", "array, two-pointers, prefix-maximum",
            "Computes trapped water while maintaining the best wall seen from each side.",
            "Process the side with the lower current maximum; that side's water is already determined.",
            """
public static int TrapRainWater(int[] height)
{
    int left = 0, right = height.Length - 1, leftMax = 0, rightMax = 0, water = 0;
    while (left <= right)
    {
        if (leftMax <= rightMax)
        {
            leftMax = Math.Max(leftMax, height[left]);
            water += leftMax - height[left++];
        }
        else
        {
            rightMax = Math.Max(rightMax, height[right]);
            water += rightMax - height[right--];
        }
    }
    return water;
}
"""),

        A("Product of Array Except Self", "Arrays", "Medium", "O(n)", "O(1) excluding output", "Prefix + Suffix", "array, prefix-product, interview",
            "Returns the product of every other element without division.",
            "A prefix pass fills the output; a scalar suffix product completes it from right to left.",
            """
public static int[] ProductExceptSelf(int[] nums)
{
    int[] answer = new int[nums.Length];
    int prefix = 1;
    for (int i = 0; i < nums.Length; i++) { answer[i] = prefix; prefix *= nums[i]; }
    int suffix = 1;
    for (int i = nums.Length - 1; i >= 0; i--) { answer[i] *= suffix; suffix *= nums[i]; }
    return answer;
}
"""),

        A("Rotate Array", "Arrays", "Medium", "O(n)", "O(1)", "Three Reversals", "array, reversal, modular",
            "Rotates an array right by k positions using three in-place reversals.",
            "Normalize k by n and handle an empty array before taking the modulus.",
            """
public static void RotateRight(int[] nums, int k)
{
    if (nums.Length == 0) return;
    k %= nums.Length;
    Array.Reverse(nums);
    Array.Reverse(nums, 0, k);
    Array.Reverse(nums, k, nums.Length - k);
}
"""),

        A("Subarray Sum Equals K", "Arrays", "Medium", "O(n)", "O(n)", "Prefix Sum + Hash Map", "array, prefix-sum, hash-map",
            "Counts contiguous subarrays whose sum equals k by tracking previous prefix-sum frequencies.",
            "Seed frequency[0] = 1 so subarrays beginning at index zero are counted.",
            """
public static int CountSubarrays(int[] nums, int k)
{
    var frequency = new Dictionary<long, int> { [0] = 1 };
    long prefix = 0;
    int count = 0;
    foreach (int value in nums)
    {
        prefix += value;
        if (frequency.TryGetValue(prefix - k, out int matches)) count += matches;
        frequency[prefix] = frequency.GetValueOrDefault(prefix) + 1;
    }
    return count;
}
"""),

        A("Longest Consecutive Sequence", "Arrays", "Medium", "O(n)", "O(n)", "Hash Set Expansion", "array, hash-set, sequence",
            "Finds the longest run of consecutive integers without sorting.",
            "Only expand from values whose predecessor is absent; every sequence is scanned once.",
            """
public static int LongestConsecutive(int[] nums)
{
    var values = nums.ToHashSet();
    int best = 0;
    foreach (int start in values)
    {
        if (values.Contains(start - 1)) continue;
        int current = start, length = 1;
        while (current < int.MaxValue && values.Contains(current + 1)) { current++; length++; }
        best = Math.Max(best, length);
    }
    return best;
}
"""),

        A("Best Time to Buy and Sell Stock", "Arrays", "Easy", "O(n)", "O(1)", "Running Minimum", "array, greedy, stock",
            "Finds the maximum profit from one buy followed by one later sell.",
            "Track the cheapest earlier price and evaluate selling at the current price.",
            """
public static int MaxProfit(int[] prices)
{
    int cheapest = int.MaxValue, best = 0;
    foreach (int price in prices)
    {
        cheapest = Math.Min(cheapest, price);
        best = Math.Max(best, price - cheapest);
    }
    return best;
}
"""),

        A("Binary Tree Inorder Traversal", "Trees", "Easy", "O(n)", "O(h)", "Iterative DFS", "tree, stack, traversal",
            "Visits a binary tree in left-root-right order using an explicit stack.",
            "The iterative form avoids recursion-depth limits on highly skewed trees.",
            """
public static List<int> Inorder(TreeNode? root)
{
    var result = new List<int>();
    var stack = new Stack<TreeNode>();
    while (root is not null || stack.Count > 0)
    {
        while (root is not null) { stack.Push(root); root = root.Left; }
        root = stack.Pop();
        result.Add(root.Value);
        root = root.Right;
    }
    return result;
}
"""),

        A("Validate Binary Search Tree", "Trees", "Medium", "O(n)", "O(h)", "Range Constraints", "tree, bst, recursion",
            "Validates that every node lies strictly inside the range imposed by all of its ancestors.",
            "Use long boundaries so int.MinValue and int.MaxValue remain valid node values.",
            """
public static bool IsValidBst(TreeNode? root)
{
    bool Validate(TreeNode? node, long lower, long upper)
    {
        if (node is null) return true;
        if (node.Value <= lower || node.Value >= upper) return false;
        return Validate(node.Left, lower, node.Value) && Validate(node.Right, node.Value, upper);
    }
    return Validate(root, long.MinValue, long.MaxValue);
}
"""),

        A("Maximum Depth of Binary Tree", "Trees", "Easy", "O(n)", "O(h)", "Tree Recursion", "tree, dfs, recursion",
            "Returns the number of nodes on the longest path from root to leaf.",
            "An empty tree has depth zero; a leaf has depth one.",
            """
public static int MaxDepth(TreeNode? root) => root is null
    ? 0
    : 1 + Math.Max(MaxDepth(root.Left), MaxDepth(root.Right));
"""),

        A("Diameter of Binary Tree", "Trees", "Medium", "O(n)", "O(h)", "Postorder DP", "tree, dfs, diameter",
            "Finds the maximum number of edges on a path between any two tree nodes.",
            "Compute height and update diameter in the same postorder traversal.",
            """
public static int Diameter(TreeNode? root)
{
    int best = 0;
    int Height(TreeNode? node)
    {
        if (node is null) return 0;
        int left = Height(node.Left), right = Height(node.Right);
        best = Math.Max(best, left + right);
        return 1 + Math.Max(left, right);
    }
    Height(root);
    return best;
}
"""),

        A("Number of Islands", "Graphs", "Medium", "O(rows × cols)", "O(rows × cols)", "Grid Flood Fill", "graph, grid, dfs, components",
            "Counts connected components of land in a binary grid by flooding each newly discovered island.",
            "Mark a cell before pushing its neighbors so it is never added to the stack twice.",
            """
public static int CountIslands(char[][] grid)
{
    int islands = 0;
    int[][] directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (int row = 0; row < grid.Length; row++)
        for (int col = 0; col < grid[row].Length; col++)
        {
            if (grid[row][col] != '1') continue;
            islands++;
            var stack = new Stack<(int Row, int Col)>();
            stack.Push((row, col));
            grid[row][col] = '0';
            while (stack.Count > 0)
            {
                var (r, c) = stack.Pop();
                foreach (var d in directions)
                {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr < 0 || nr >= grid.Length || nc < 0 || nc >= grid[nr].Length || grid[nr][nc] != '1') continue;
                    grid[nr][nc] = '0';
                    stack.Push((nr, nc));
                }
            }
        }
    return islands;
}
"""),

        A("Bellman-Ford Shortest Paths", "Graphs", "Hard", "O(V · E)", "O(V)", "Edge Relaxation", "graph, shortest-path, negative-weights",
            "Computes single-source shortest paths even when edges can have negative weights.",
            "A successful relaxation on the Vth pass proves a reachable negative cycle exists.",
            """
public static long[] BellmanFord(int vertices, (int From, int To, int Weight)[] edges, int source)
{
    long infinity = long.MaxValue / 4;
    long[] distance = Enumerable.Repeat(infinity, vertices).ToArray();
    distance[source] = 0;
    for (int pass = 1; pass < vertices; pass++)
    {
        bool changed = false;
        foreach (var (from, to, weight) in edges)
            if (distance[from] != infinity && distance[from] + weight < distance[to])
            { distance[to] = distance[from] + weight; changed = true; }
        if (!changed) break;
    }
    foreach (var (from, to, weight) in edges)
        if (distance[from] != infinity && distance[from] + weight < distance[to])
            throw new InvalidOperationException("Reachable negative cycle detected.");
    return distance;
}
"""),

        A("House Robber", "Dynamic Programming", "Medium", "O(n)", "O(1)", "Take or Skip DP", "dp, array, rolling-state",
            "Maximizes stolen value when adjacent houses cannot both be selected.",
            "At each house, compare skipping it with taking it plus the best result two positions back.",
            """
public static int Rob(int[] money)
{
    int twoBack = 0, oneBack = 0;
    foreach (int value in money)
    {
        int current = Math.Max(oneBack, twoBack + value);
        twoBack = oneBack;
        oneBack = current;
    }
    return oneBack;
}
"""),

        A("Climbing Stairs", "Dynamic Programming", "Easy", "O(n)", "O(1)", "Fibonacci DP", "dp, fibonacci, rolling-state",
            "Counts ways to reach step n when every move climbs one or two steps.",
            "Only the previous two states are required, so the DP table can be compressed.",
            """
public static int ClimbStairs(int n)
{
    if (n <= 1) return 1;
    int previous = 1, current = 1;
    for (int step = 2; step <= n; step++)
        (previous, current) = (current, checked(previous + current));
    return current;
}
"""),

        A("Longest Common Subsequence", "Dynamic Programming", "Medium", "O(n · m)", "O(m)", "Sequence DP", "dp, string, subsequence",
            "Finds the maximum-length sequence appearing in order in both strings.",
            "Keep the previous diagonal value while updating a one-dimensional DP row.",
            """
public static int LcsLength(string first, string second)
{
    int[] dp = new int[second.Length + 1];
    foreach (char a in first)
    {
        int diagonal = 0;
        for (int j = 1; j <= second.Length; j++)
        {
            int old = dp[j];
            dp[j] = a == second[j - 1] ? diagonal + 1 : Math.Max(dp[j], dp[j - 1]);
            diagonal = old;
        }
    }
    return dp[^1];
}
"""),

        A("Edit Distance", "Dynamic Programming", "Hard", "O(n · m)", "O(m)", "String Transformation DP", "dp, string, levenshtein",
            "Finds the minimum insertions, deletions, and replacements required to transform one string into another.",
            "Each state considers the cheapest predecessor operation; equal characters copy the diagonal state.",
            """
public static int EditDistance(string source, string target)
{
    int[] dp = Enumerable.Range(0, target.Length + 1).ToArray();
    for (int i = 1; i <= source.Length; i++)
    {
        int diagonal = dp[0];
        dp[0] = i;
        for (int j = 1; j <= target.Length; j++)
        {
            int old = dp[j];
            dp[j] = source[i - 1] == target[j - 1]
                ? diagonal
                : 1 + Math.Min(diagonal, Math.Min(dp[j], dp[j - 1]));
            diagonal = old;
        }
    }
    return dp[^1];
}
"""),

        A("Generate Subsets", "Backtracking", "Medium", "O(n · 2ⁿ)", "O(n) recursion", "Include or Exclude", "backtracking, subsets, recursion",
            "Generates the power set by deciding whether to include every input value.",
            "Clone the current path when recording it because the same list is mutated during backtracking.",
            """
public static List<List<int>> Subsets(int[] nums)
{
    var result = new List<List<int>>();
    var current = new List<int>();
    void Search(int index)
    {
        if (index == nums.Length) { result.Add([.. current]); return; }
        Search(index + 1);
        current.Add(nums[index]);
        Search(index + 1);
        current.RemoveAt(current.Count - 1);
    }
    Search(0);
    return result;
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
        UpdatedAt = new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Local),
        CreatedAt = new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Local)
    };
}
