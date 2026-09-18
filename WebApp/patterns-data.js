// Original instructional guides. Examples illustrate each pattern, not every variant.
window.ALG0_PATTERNS = [
  {
    "id": "sliding-window",
    "title": "Sliding window · variable size",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "Longest or shortest contiguous range with a condition that can be repaired by moving the left edge.",
    "idea": "Maintain exactly the information needed for the current window. Expand right; while invalid, remove from the left. For longest-valid problems, record the answer after restoring validity.",
    "steps": [
      "Define what makes a window valid and what state can detect a violation.",
      "Add the rightmost item to the window state.",
      "Shrink with a while loop until the invariant is restored.",
      "Update the best valid length; prove each pointer moves at most n times."
    ],
    "invariant": "After shrinking, every character in s[left..right] is distinct.",
    "pitfalls": [
      "A single if may not remove all violations; use while.",
      "Sum-based windows generally require nonnegative numbers; negative values break the usual monotonic shrinking argument.",
      "Minimum-valid windows record the answer while valid, before shrinking—not at the same point as longest-valid windows."
    ],
    "example": "For abba: a → best 1; ab → best 2; adding the second b removes a then b; the window becomes b. Adding a makes ba. Answer: 2.",
    "practice": [
      {
        "title": "Longest Substring Without Repeating Characters",
        "approach": "Track character counts or a set; shrink until the duplicate disappears, then maximize length."
      },
      {
        "title": "Minimum Size Subarray Sum",
        "approach": "With positive values, grow the sum; while it reaches the target, record the length and shrink."
      },
      {
        "title": "Fruit Into Baskets",
        "approach": "Treat fruit types as keys; shrink until at most two types remain."
      },
      {
        "title": "Minimum Window Substring",
        "approach": "Track required multiplicities and how many are satisfied; shrink a valid window while preserving a best answer."
      }
    ],
    "complexity": "O(n) time · O(min(n, alphabet size)) space",
    "next": [
      "fixed-window",
      "prefix-sum",
      "monotonic-deque"
    ],
    "code": "public static int LongestUnique(string s)\n{\n    var seen = new HashSet<char>();\n    int left = 0, best = 0;\n    for (int right = 0; right < s.Length; right++)\n    {\n        while (seen.Contains(s[right]))\n            seen.Remove(s[left++]);\n        seen.Add(s[right]);\n        best = Math.Max(best, right - left + 1);\n    }\n    return best;\n}",
    "tests": "Check(LongestUnique(\"abba\") == 2); Check(LongestUnique(\"\") == 0); Check(LongestUnique(\"abcabcbb\") == 3);"
  },
  {
    "id": "fixed-window",
    "title": "Sliding window · fixed size",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "Exactly k consecutive elements, a rolling average, or a fixed-length substring.",
    "idea": "Compute the first window once. Every move adds the entering element and removes the departing one.",
    "steps": [
      "Validate 1 ≤ k ≤ n.",
      "Build the aggregate of the first k elements.",
      "Move one position: add a[right], subtract a[right-k].",
      "Update the best aggregate without rescanning the window."
    ],
    "invariant": "Before recording an answer, sum contains exactly k consecutive elements.",
    "pitfalls": [
      "Initialize the best value from the first window, not zero; all values may be negative.",
      "Use long for sums when int can overflow.",
      "For anagrams, maintain frequencies rather than only a sum."
    ],
    "example": "For [2,1,5,1,3], k=3: window sums are 8, 7, 9. The maximum is 9 from [5,1,3].",
    "practice": [
      {
        "title": "Maximum Average Subarray I",
        "approach": "Maintain a k-element sum and divide the best sum by k after scanning."
      },
      {
        "title": "Maximum Number of Vowels in a Substring of Given Length",
        "approach": "Add and remove vowel contributions as the k-character window moves."
      },
      {
        "title": "Permutation in String",
        "approach": "Compare window frequencies with the pattern's frequencies; track how many counts differ."
      },
      {
        "title": "Find All Anagrams in a String",
        "approach": "Use the same frequency-window test, but collect every matching starting index."
      }
    ],
    "complexity": "O(n) time · O(1) space for a sum",
    "next": [
      "sliding-window",
      "hash-map"
    ],
    "code": "public static long MaxWindowSum(int[] a, int k)\n{\n    if (k < 1 || k > a.Length)\n        throw new ArgumentOutOfRangeException(nameof(k));\n    long sum = 0;\n    for (int i = 0; i < k; i++) sum += a[i];\n    long best = sum;\n    for (int right = k; right < a.Length; right++)\n    {\n        sum += (long)a[right] - a[right - k];\n        best = Math.Max(best, sum);\n    }\n    return best;\n}",
    "tests": "Check(MaxWindowSum(new[]{2,1,5,1,3}, 3) == 9); Check(MaxWindowSum(new[]{-5,-2}, 1) == -2);"
  },
  {
    "id": "two-pointers",
    "title": "Two pointers",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "Sorted pair search, comparing opposite ends, or compacting an array in place.",
    "idea": "Use ordering to eliminate many candidates after each comparison. For a sorted pair sum, increasing the left value increases the sum; decreasing the right value decreases it.",
    "steps": [
      "Check whether sorting is allowed; preserve original indices if required.",
      "Place pointers at opposite ends.",
      "Compare the current candidate with the target.",
      "Move only the pointer whose movement can improve the candidate."
    ],
    "invariant": "Any discarded left value is too small, or any discarded right value is too large, to form the target with the remaining range.",
    "pitfalls": [
      "The pair-sum template requires sorted input.",
      "Use left < right to avoid reusing one element.",
      "Three Sum adds an outer loop plus duplicate skipping; it is not an O(n) application."
    ],
    "example": "Sorted [1,2,4,7], target 6: 1+7 is too large, move right; 1+4 is too small, move left; 2+4 matches.",
    "practice": [
      {
        "title": "Two Sum II - Input Array Is Sorted",
        "approach": "Compare the two end values; move left for a small sum and right for a large sum."
      },
      {
        "title": "3Sum",
        "approach": "Sort, fix the first element, then use two pointers for the remaining target; skip duplicates."
      },
      {
        "title": "Container With Most Water",
        "approach": "Compute width times the shorter height; move the shorter side since keeping it cannot improve the area."
      },
      {
        "title": "Valid Palindrome",
        "approach": "Skip non-alphanumeric characters at each end and compare normalized characters."
      }
    ],
    "complexity": "O(n) time · O(1) auxiliary space (already sorted)",
    "next": [
      "hash-map",
      "sliding-window"
    ],
    "code": "public static int[] SortedPair(int[] a, long target)\n{\n    int left = 0, right = a.Length - 1;\n    while (left < right)\n    {\n        long sum = (long)a[left] + a[right];\n        if (sum == target) return new[] { left, right };\n        if (sum < target) left++;\n        else right--;\n    }\n    return Array.Empty<int>();\n}",
    "tests": "Check(SortedPair(new[]{1,2,4,7}, 6).SequenceEqual(new[]{1,2})); Check(SortedPair(new[]{1}, 2).Length == 0);"
  },
  {
    "id": "hash-map",
    "title": "Hash map & frequency counting",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "Find a complement, count duplicates, group equivalent objects, or remember earlier positions.",
    "idea": "Trade memory for repeated lookup. Store the information needed to answer the next query without scanning the whole prefix.",
    "steps": [
      "Choose a key that captures the relationship: value, frequency signature, or prefix state.",
      "Query earlier state before inserting the current item when self-matching is forbidden.",
      "Store a count, index, or list according to the requested output.",
      "Check duplicates and the no-solution case."
    ],
    "invariant": "The map contains only elements strictly before the current position.",
    "pitfalls": [
      "A set records existence, not counts or positions.",
      "Worst-case hash operations are not guaranteed constant time; usual analysis uses expected time.",
      "Use long for complement arithmetic near int boundaries."
    ],
    "example": "[2,7,11], target 9: store 2 at index 0; for 7, the missing value is 2; return [0,1].",
    "practice": [
      {
        "title": "Two Sum",
        "approach": "Look for target-current among earlier values, then store the current index."
      },
      {
        "title": "Group Anagrams",
        "approach": "Group by a canonical sorted-string or frequency signature, not by a raw sum of letters."
      },
      {
        "title": "Valid Anagram",
        "approach": "Increment counts for one word and decrement for the other; all counts must balance."
      },
      {
        "title": "Longest Consecutive Sequence",
        "approach": "Use a set; start runs only where value-1 is absent, then walk forward through each run."
      }
    ],
    "complexity": "Expected O(n) time · O(n) space",
    "next": [
      "prefix-sum",
      "sliding-window"
    ],
    "code": "public static int[] TwoSum(int[] a, long target)\n{\n    var index = new Dictionary<long, int>();\n    for (int i = 0; i < a.Length; i++)\n    {\n        if (index.TryGetValue(target - a[i], out int j))\n            return new[] { j, i };\n        index[a[i]] = i;\n    }\n    return Array.Empty<int>();\n}",
    "tests": "Check(TwoSum(new[]{3,3},6).SequenceEqual(new[]{0,1})); Check(TwoSum(Array.Empty<int>(),1).Length == 0);"
  },
  {
    "id": "prefix-sum",
    "title": "Prefix sums & prefix-state maps",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "Range-sum queries or counting contiguous subarrays with an exact sum, especially with negative numbers.",
    "idea": "A subarray sum is the difference of two prefix sums. Count earlier prefixes equal to currentSum - target.",
    "steps": [
      "Derive prefix[right] - prefix[left] = target.",
      "Seed the empty prefix with frequency 1.",
      "For each new prefix, count matching earlier prefixes.",
      "Increment the current prefix frequency only after querying."
    ],
    "invariant": "Frequency counts include every prefix ending before the current position, including the empty prefix.",
    "pitfalls": [
      "Missing the initial zero prefix loses subarrays starting at index zero.",
      "Store frequencies, not just a set: repeated prefixes create multiple answers.",
      "Use long for both prefix sums and the number of subarrays."
    ],
    "example": "[1,-1,1], target 1: prefix sums 1,0,1 find 1,0,2 matches respectively. Total: 3 subarrays.",
    "practice": [
      {
        "title": "Subarray Sum Equals K",
        "approach": "Count previous prefix sums equal to current-target; seed the empty prefix once."
      },
      {
        "title": "Contiguous Array",
        "approach": "Map 0 to -1 and 1 to +1; store each prefix sum's earliest index and maximize repeated-prefix distance."
      },
      {
        "title": "Range Sum Query - Immutable",
        "approach": "Build a prefix array once; answer inclusive [l,r] with prefix[r+1]-prefix[l]."
      },
      {
        "title": "Subarray Sums Divisible by K",
        "approach": "Count equal normalized remainders of prefix sums; normalize negative remainders to [0,k)."
      }
    ],
    "complexity": "Expected O(n) time · O(n) space",
    "next": [
      "sliding-window",
      "hash-map"
    ],
    "code": "public static long CountTargetSums(int[] a, long target)\n{\n    var frequency = new Dictionary<long, long> { [0] = 1 };\n    long prefix = 0, count = 0;\n    foreach (int value in a)\n    {\n        prefix += value;\n        count += frequency.GetValueOrDefault(prefix - target);\n        frequency[prefix] = frequency.GetValueOrDefault(prefix) + 1;\n    }\n    return count;\n}",
    "tests": "Check(CountTargetSums(new[]{1,-1,1},1) == 3); Check(CountTargetSums(new[]{0,0},0) == 3);"
  },
  {
    "id": "fast-slow",
    "title": "Fast & slow pointers",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "A linked-list cycle, midpoint, or a repeated state under a deterministic transition.",
    "idea": "Move one pointer one step and another two steps. In a cycle, their relative position eventually coincides.",
    "steps": [
      "Start both pointers at the head.",
      "Guard fast and fast.Next before taking two steps.",
      "Advance both pointers and compare references.",
      "For a cycle entry variant, reset one pointer to the head after a meeting and move both one step."
    ],
    "invariant": "After t rounds, slow took t steps and fast took 2t steps.",
    "pitfalls": [
      "Compare node references, not equal node values.",
      "Midpoint variants differ for even-length lists.",
      "This template detects a cycle, not the cycle entry; the reset phase is a separate step."
    ],
    "example": "A → B → C → B: after one round slow=B, fast=C; after two rounds both are C, confirming a cycle.",
    "practice": [
      {
        "title": "Linked List Cycle",
        "approach": "Advance one and two links per round; a meeting proves a cycle."
      },
      {
        "title": "Linked List Cycle II",
        "approach": "After the first meeting, reset one pointer to head; move both one step to meet at the entry."
      },
      {
        "title": "Middle of the Linked List",
        "approach": "Advance slow once and fast twice; decide which middle to return for even lengths."
      },
      {
        "title": "Happy Number",
        "approach": "Treat sum-of-squared-digits as the transition; detect a cycle and check whether it includes 1."
      }
    ],
    "complexity": "O(n) time · O(1) space",
    "next": [
      "linked-reversal"
    ],
    "code": "public class Node\n{\n    public int Value;\n    public Node? Next;\n}\npublic static bool HasCycle(Node? head)\n{\n    Node? slow = head, fast = head;\n    while (fast != null && fast.Next != null)\n    {\n        slow = slow!.Next;\n        fast = fast.Next.Next;\n        if (ReferenceEquals(slow, fast)) return true;\n    }\n    return false;\n}",
    "tests": "var a = new Node(); var b = new Node(); a.Next=b; Check(!HasCycle(a)); b.Next=a; Check(HasCycle(a)); Check(!HasCycle(null));"
  },
  {
    "id": "linked-reversal",
    "title": "Linked-list reversal",
    "group": "Arrays & strings",
    "level": "Foundation",
    "cue": "Reverse links, reverse a sublist, reorder nodes, or compare both halves of a list.",
    "idea": "Keep the unprocessed suffix safe before changing a pointer. Grow a reversed prefix one node at a time.",
    "steps": [
      "Maintain previous=null and current=head.",
      "Save current.Next before modifying it.",
      "Redirect current.Next to previous.",
      "Advance previous and current; return previous as the new head."
    ],
    "invariant": "previous heads the reversed processed prefix; current heads the untouched suffix.",
    "pitfalls": [
      "Never overwrite Next before saving the remaining list.",
      "The input must be acyclic for this loop to terminate.",
      "Reversing a subrange needs reconnection to the surrounding nodes, often with a dummy head."
    ],
    "example": "1→2→3 becomes 1→null, then 2→1→null, then 3→2→1→null.",
    "practice": [
      {
        "title": "Reverse Linked List",
        "approach": "Save next, reverse the current link, and advance; previous becomes the new head."
      },
      {
        "title": "Reverse Linked List II",
        "approach": "Use a dummy node, locate the segment predecessor, reverse the segment, and reconnect both ends."
      },
      {
        "title": "Reorder List",
        "approach": "Find the midpoint, reverse the second half, then weave the halves alternately."
      },
      {
        "title": "Palindrome Linked List",
        "approach": "Find and reverse the second half, compare values, and restore the list if preservation is required."
      }
    ],
    "complexity": "O(n) time · O(1) space",
    "next": [
      "fast-slow"
    ],
    "code": "public class Node\n{\n    public int Value;\n    public Node? Next;\n}\npublic static Node? Reverse(Node? head)\n{\n    Node? previous = null;\n    while (head != null)\n    {\n        Node? next = head.Next;\n        head.Next = previous;\n        previous = head;\n        head = next;\n    }\n    return previous;\n}",
    "tests": "var a=new Node{Value=1,Next=new Node{Value=2}}; var r=Reverse(a); Check(r!.Value==2 && r.Next==a && a.Next==null); Check(Reverse(null)==null);"
  },
  {
    "id": "intervals",
    "title": "Sort & merge intervals",
    "group": "Search & ordering",
    "level": "Foundation",
    "cue": "Overlapping ranges, booking conflicts, scheduling, or interval insertion.",
    "idea": "Sort by start time so only the last merged interval can overlap the next interval.",
    "steps": [
      "Clarify whether endpoints are closed or half-open.",
      "Copy and sort intervals by start.",
      "If the next start is inside the last merged interval, extend its end.",
      "Otherwise begin a new interval."
    ],
    "invariant": "The result is sorted and non-overlapping, and covers every interval processed so far.",
    "pitfalls": [
      "For closed intervals [1,2] and [2,3] overlap; for half-open intervals they do not.",
      "Use CompareTo rather than subtracting endpoints to compare.",
      "Minimum meeting rooms needs an event sweep or heap, not merely merge counting."
    ],
    "example": "[1,3], [2,6], [8,10] merge into [1,6], [8,10].",
    "practice": [
      {
        "title": "Merge Intervals",
        "approach": "Sort by start, extend the current merged end on overlap, otherwise append a new interval."
      },
      {
        "title": "Insert Interval",
        "approach": "Copy earlier intervals, merge all overlaps with the new one, then append the later intervals."
      },
      {
        "title": "Non-overlapping Intervals",
        "approach": "Sort by end and keep the maximum number of compatible intervals; remove the rest."
      },
      {
        "title": "Minimum Number of Arrows to Burst Balloons",
        "approach": "Sort by end; shoot at the earliest ending balloon and reuse that position while it remains inside later balloons."
      }
    ],
    "complexity": "O(n log n) time · O(n) space including copied output",
    "next": [
      "heap",
      "greedy"
    ],
    "code": "public static int[][] MergeIntervals(int[][] intervals)\n{\n    var sorted = intervals.Select(x => new[] { x[0], x[1] })\n                          .OrderBy(x => x[0]).ToArray();\n    var result = new List<int[]>();\n    foreach (var interval in sorted)\n    {\n        if (result.Count == 0 || result[^1][1] < interval[0])\n            result.Add(interval);\n        else\n            result[^1][1] = Math.Max(result[^1][1], interval[1]);\n    }\n    return result.ToArray();\n}",
    "tests": "var r=MergeIntervals(new[]{new[]{1,3},new[]{2,6},new[]{8,10}}); Check(r.Length==2 && r[0][1]==6); Check(MergeIntervals(Array.Empty<int[]>()).Length==0);"
  },
  {
    "id": "binary-search",
    "title": "Binary search · boundaries",
    "group": "Search & ordering",
    "level": "Foundation",
    "cue": "Sorted input or a false-to-true predicate; first/last valid position rather than just any match.",
    "idea": "Keep a half-open candidate range and discard half with each comparison. Lower bound returns the first value at least the target.",
    "steps": [
      "Define exactly what position you seek.",
      "Use a consistent interval convention: [left,right).",
      "If mid is too small, move left to mid+1; otherwise keep mid by moving right to mid.",
      "Return left; it can equal n when no element qualifies."
    ],
    "invariant": "All indices below left are too small; all indices at or above right satisfy the lower-bound condition.",
    "pitfalls": [
      "Do not mix inclusive and half-open update rules.",
      "Duplicates require a boundary search, not an immediate return.",
      "Check the returned index before accessing the array."
    ],
    "example": "[1,2,2,4], target 2: mid=2 qualifies, then mid=1 qualifies, then mid=0 is too small. Return 1.",
    "practice": [
      {
        "title": "Binary Search",
        "approach": "Use a consistent inclusive or half-open range and return -1 if no exact match exists."
      },
      {
        "title": "Search Insert Position",
        "approach": "Return the lower bound: the first index with value at least the target, including n."
      },
      {
        "title": "Find First and Last Position of Element in Sorted Array",
        "approach": "Run lower-bound and upper-bound searches; verify the target exists before returning endpoints."
      },
      {
        "title": "Search in Rotated Sorted Array",
        "approach": "At least one half is sorted (without duplicates); use its bounds to decide which half can contain the target."
      }
    ],
    "complexity": "O(log n) time · O(1) space",
    "next": [
      "answer-search"
    ],
    "code": "public static int LowerBound(int[] a, int target)\n{\n    int left = 0, right = a.Length;\n    while (left < right)\n    {\n        int mid = left + (right - left) / 2;\n        if (a[mid] < target) left = mid + 1;\n        else right = mid;\n    }\n    return left;\n}",
    "tests": "Check(LowerBound(new[]{1,2,2,4},2)==1); Check(LowerBound(new[]{1},2)==1); Check(LowerBound(Array.Empty<int>(),2)==0);"
  },
  {
    "id": "answer-search",
    "title": "Binary search · on the answer",
    "group": "Search & ordering",
    "level": "Intermediate",
    "cue": "Minimize the maximum, find the smallest feasible capacity, or the least speed that meets a deadline.",
    "idea": "Convert optimization into a yes/no feasibility question. Binary search only after proving larger answers cannot turn feasible back into infeasible.",
    "steps": [
      "Choose a search range containing a feasible answer.",
      "Write a feasibility check and prove its monotonicity.",
      "For the minimum feasible answer, keep a feasible midpoint as the upper bound.",
      "Return the converged bound and test extreme constraints."
    ],
    "invariant": "The minimum feasible capacity remains within [low,high]; high is always feasible.",
    "pitfalls": [
      "A monotone array is not required, but a monotone feasibility predicate is.",
      "Shipping must preserve package order; sorting would change the problem.",
      "Use long for total capacity and verify the minimum bound can hold the largest package."
    ],
    "example": "Weights [1,2,3,4], 2 days: capacity 5 takes 3 days; capacity 6 gives [1,2,3] and [4]. Answer 6.",
    "practice": [
      {
        "title": "Capacity To Ship Packages Within D Days",
        "approach": "Binary search capacity; a greedy ordered scan counts how many days that capacity needs."
      },
      {
        "title": "Koko Eating Bananas",
        "approach": "Binary search speed; feasibility sums ceiling(pile/speed), using long arithmetic."
      },
      {
        "title": "Split Array Largest Sum",
        "approach": "For nonnegative values, binary search the largest allowed segment sum and greedily count segments."
      },
      {
        "title": "Minimum Number of Days to Make m Bouquets",
        "approach": "Binary search the day; scan consecutive bloomed runs and count disjoint groups of the required size."
      }
    ],
    "complexity": "O(n log S) time · O(1) space, S = total weight",
    "next": [
      "binary-search",
      "greedy"
    ],
    "code": "public static long MinCapacity(int[] weights, int days)\n{\n    if (days < 1 || weights.Any(w => w <= 0))\n        throw new ArgumentOutOfRangeException();\n    if (weights.Length == 0) return 0;\n    long low = weights.Max(), high = weights.Sum(w => (long)w);\n    while (low < high)\n    {\n        long mid = low + (high - low) / 2, load = 0;\n        int used = 1;\n        foreach (int weight in weights)\n        {\n            if (load + weight > mid) { used++; load = 0; }\n            load += weight;\n        }\n        if (used <= days) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
    "tests": "Check(MinCapacity(new[]{1,2,3,4},2)==6); Check(MinCapacity(new[]{7},5)==7);"
  },
  {
    "id": "monotonic-stack",
    "title": "Monotonic stack",
    "group": "Search & ordering",
    "level": "Intermediate",
    "cue": "Next greater/smaller element, waiting until a warmer day, or a boundary where an item stops dominating.",
    "idea": "Keep unresolved candidates in monotone order. A new element resolves and removes candidates it dominates.",
    "steps": [
      "Store indices if you need distances or original positions.",
      "Choose increasing or decreasing order from the desired comparison.",
      "Pop candidates while the current element resolves them.",
      "Assign answers on pop and then push the current index."
    ],
    "invariant": "Temperatures at unresolved indices are non-increasing from stack bottom to top.",
    "pitfalls": [
      "Strict greater and greater-or-equal problems use different pop conditions.",
      "Each index is pushed and popped once: the nested loop is O(n), not O(n²).",
      "Histogram rectangles need both width boundaries and careful handling of the final stack."
    ],
    "example": "[70,71,69,72]: day 1 resolves day 0 after 1 day; day 3 resolves day 2 after 1 and day 1 after 2. Result [1,2,1,0].",
    "practice": [
      {
        "title": "Daily Temperatures",
        "approach": "Keep unresolved day indices; a strictly warmer temperature resolves them on pop."
      },
      {
        "title": "Next Greater Element I",
        "approach": "Find each value's next-greater value with a decreasing stack, then answer the requested lookups."
      },
      {
        "title": "Largest Rectangle in Histogram",
        "approach": "Use an increasing-height stack; a smaller bar finalizes rectangles whose right boundary is now known."
      },
      {
        "title": "Remove K Digits",
        "approach": "Maintain increasing digits, spending removals on larger preceding digits; trim remaining removals from the end."
      }
    ],
    "complexity": "O(n) time · O(n) space",
    "next": [
      "monotonic-deque"
    ],
    "code": "public static int[] WarmerDays(int[] temperatures)\n{\n    var pending = new Stack<int>();\n    var answer = new int[temperatures.Length];\n    for (int i = 0; i < temperatures.Length; i++)\n    {\n        while (pending.Count > 0 &&\n               temperatures[i] > temperatures[pending.Peek()])\n        {\n            int previous = pending.Pop();\n            answer[previous] = i - previous;\n        }\n        pending.Push(i);\n    }\n    return answer;\n}",
    "tests": "Check(WarmerDays(new[]{70,71,69,72}).SequenceEqual(new[]{1,2,1,0})); Check(WarmerDays(new[]{5,5}).SequenceEqual(new[]{0,0}));"
  },
  {
    "id": "monotonic-deque",
    "title": "Monotonic deque",
    "group": "Search & ordering",
    "level": "Intermediate",
    "cue": "Maximum or minimum in each moving window without sorting each window.",
    "idea": "Keep only candidates that can still become the window maximum. The front is the best valid candidate; dominated items leave the back.",
    "steps": [
      "Remove indices that have left the window from the front.",
      "Remove smaller or equal values from the back.",
      "Append the current index.",
      "Once the window has k elements, read its maximum from the front."
    ],
    "invariant": "Indices increase front-to-back while their values strictly decrease; all indices are inside the current window.",
    "pitfalls": [
      "Store indices to detect expiration, not values alone.",
      "Use both ends; a regular Queue cannot remove dominated items from the back.",
      "This template requires 1 ≤ k ≤ n."
    ],
    "example": "[1,3,-1,2], k=3: 3 dominates 1; maxima are 3 for [1,3,-1] and 3 for [3,-1,2].",
    "practice": [
      {
        "title": "Sliding Window Maximum",
        "approach": "Keep candidate maximum indices in decreasing-value order and expire indices leaving the window."
      },
      {
        "title": "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
        "approach": "Use one max deque and one min deque; shrink until max-min is within the limit."
      },
      {
        "title": "Shortest Subarray with Sum at Least K",
        "approach": "Build prefix sums; use an increasing deque of candidate starts, popping valid answers from the front and dominated starts from the back."
      }
    ],
    "complexity": "O(n) time · O(k) auxiliary space, plus O(n-k+1) output",
    "next": [
      "fixed-window",
      "monotonic-stack",
      "prefix-sum"
    ],
    "code": "public static int[] WindowMaximum(int[] a, int k)\n{\n    if (k < 1 || k > a.Length)\n        throw new ArgumentOutOfRangeException(nameof(k));\n    var deque = new LinkedList<int>();\n    var result = new int[a.Length - k + 1];\n    for (int i = 0; i < a.Length; i++)\n    {\n        while (deque.Count > 0 && deque.First!.Value <= i - k)\n            deque.RemoveFirst();\n        while (deque.Count > 0 && a[deque.Last!.Value] <= a[i])\n            deque.RemoveLast();\n        deque.AddLast(i);\n        if (i >= k - 1) result[i - k + 1] = a[deque.First!.Value];\n    }\n    return result;\n}",
    "tests": "Check(WindowMaximum(new[]{1,3,-1,2},3).SequenceEqual(new[]{3,3})); Check(WindowMaximum(new[]{4,4},1).SequenceEqual(new[]{4,4}));"
  },
  {
    "id": "tree-dfs",
    "title": "Tree DFS & recursive returns",
    "group": "Trees & graphs",
    "level": "Foundation",
    "cue": "Subtree properties, root-to-leaf paths, depth, balanced trees, or combining child results.",
    "idea": "Define precisely what one recursive call returns. Solve children and combine their answers at the parent.",
    "steps": [
      "Write the return contract before the recursion.",
      "Choose the base case for an empty subtree.",
      "Recursively solve left and right subtrees.",
      "Combine child results; distinguish the returned value from any global answer."
    ],
    "invariant": "Depth(node) returns the maximum number of nodes on a downward path starting at node.",
    "pitfalls": [
      "Depth of an empty tree here is 0; edge-based height uses a different convention.",
      "Very deep trees can overflow the C# call stack; use an explicit stack when needed.",
      "For graph DFS, add visited-state handling to avoid cycling forever."
    ],
    "example": "A root with a leaf on the left and a two-node branch on the right returns 1 + max(1,2) = 3.",
    "practice": [
      {
        "title": "Maximum Depth of Binary Tree",
        "approach": "Return one plus the larger child depth; an empty subtree returns zero."
      },
      {
        "title": "Diameter of Binary Tree",
        "approach": "Return subtree height but update a separate best path using leftHeight+rightHeight."
      },
      {
        "title": "Balanced Binary Tree",
        "approach": "Return height or a failure sentinel; propagate failure as soon as child heights differ by more than one."
      },
      {
        "title": "Binary Tree Maximum Path Sum",
        "approach": "Return a single downward gain, but update a global answer with both positive child gains; handle all-negative trees."
      }
    ],
    "complexity": "O(n) time · O(h) call stack, worst-case O(n)",
    "next": [
      "bfs",
      "backtracking"
    ],
    "code": "public class Node\n{\n    public int Value;\n    public Node? Left, Right;\n}\npublic static int Depth(Node? root)\n{\n    if (root == null) return 0;\n    return 1 + Math.Max(Depth(root.Left), Depth(root.Right));\n}",
    "tests": "Check(Depth(null)==0); Check(Depth(new Node{Left=new Node(),Right=new Node{Right=new Node()}})==3);"
  },
  {
    "id": "bfs",
    "title": "BFS · levels & shortest unweighted paths",
    "group": "Trees & graphs",
    "level": "Foundation",
    "cue": "Minimum number of equal-cost steps, nearest target, level order, or simultaneous spreading.",
    "idea": "A queue explores vertices by increasing distance. Mark nodes when enqueuing so each enters the queue once.",
    "steps": [
      "Model states as vertices and valid moves as edges.",
      "Enqueue the source with distance zero and mark it visited.",
      "Visit all unvisited neighbors with distance current+1.",
      "For multi-source BFS, seed every starting vertex at distance zero."
    ],
    "invariant": "When a vertex is first discovered, its distance is the shortest unweighted path from the source.",
    "pitfalls": [
      "Weighted edges require a different algorithm unless all weights are equal.",
      "Mark on enqueue, not dequeue, to prevent duplicate queue entries.",
      "Grid problems need bounds checks and a clear decision on whether the grid may be mutated."
    ],
    "example": "Edges 0→1, 0→2, 1→3: queue levels are [0], [1,2], [3]. Distances are [0,1,1,2].",
    "practice": [
      {
        "title": "Binary Tree Level Order Traversal",
        "approach": "Process a fixed queue-size batch for each level and collect its values."
      },
      {
        "title": "Rotting Oranges",
        "approach": "Seed every rotten orange at time zero; BFS outward and count any fresh oranges left unreachable."
      },
      {
        "title": "Word Ladder",
        "approach": "Words are states and one-letter changes are edges; BFS finds the shortest transformation count."
      },
      {
        "title": "Shortest Path in Binary Matrix",
        "approach": "BFS through valid neighboring cells; mark on enqueue and follow the problem's allowed directions."
      },
      {
        "title": "Number of Islands",
        "approach": "Scan for unvisited land. Each new BFS or DFS marks one four-directionally connected component and increments the island count; do not count diagonal contact."
      }
    ],
    "complexity": "O(V+E) time · O(V) auxiliary space",
    "next": [
      "dijkstra",
      "topological"
    ],
    "code": "// Vertices are 0..graph.Length-1; neighbor indices must be valid.\npublic static int[] Distances(List<int>[] graph, int source)\n{\n    var distance = Enumerable.Repeat(-1, graph.Length).ToArray();\n    var queue = new Queue<int>();\n    distance[source] = 0;\n    queue.Enqueue(source);\n    while (queue.Count > 0)\n    {\n        int node = queue.Dequeue();\n        foreach (int next in graph[node])\n        {\n            if (distance[next] != -1) continue;\n            distance[next] = distance[node] + 1;\n            queue.Enqueue(next);\n        }\n    }\n    return distance;\n}",
    "tests": "var g=new[]{new List<int>{1,2},new List<int>{3},new List<int>(),new List<int>()}; Check(Distances(g,0).SequenceEqual(new[]{0,1,1,2})); Check(Distances(g,3)[0]==-1);"
  },
  {
    "id": "topological",
    "title": "Topological sort",
    "group": "Trees & graphs",
    "level": "Intermediate",
    "cue": "Prerequisites, dependency resolution, or an ordering constrained by directed edges.",
    "idea": "Repeatedly remove vertices with no unmet incoming dependencies. If some vertices remain, the directed graph contains a cycle.",
    "steps": [
      "Orient edges from prerequisite to dependent.",
      "Compute indegree for every vertex.",
      "Queue all zero-indegree vertices.",
      "Remove each queued vertex and decrement neighbors; count how many were removed."
    ],
    "invariant": "Every queued vertex has no incoming edge from the remaining graph.",
    "pitfalls": [
      "This is for directed dependencies, not undirected connectivity.",
      "Multiple valid orders may exist; do not require a unique order unless specified.",
      "An empty result means failure only when the graph was nonempty; an empty graph has a valid empty order."
    ],
    "example": "0→2 and 1→2: initially queue [0,1]; processing both releases 2. One valid order is [0,1,2].",
    "practice": [
      {
        "title": "Course Schedule",
        "approach": "Build prerequisite edges and check whether Kahn's algorithm removes every course."
      },
      {
        "title": "Course Schedule II",
        "approach": "Return the Kahn removal order if all courses were removed; otherwise no ordering exists."
      },
      {
        "title": "Find Eventual Safe States",
        "approach": "Reverse the graph and peel terminal vertices using outgoing-degree counts."
      },
      {
        "title": "Minimum Height Trees",
        "approach": "This is an undirected leaf-peeling variant, not a directed topological sort: remove leaf layers until one or two centers remain."
      }
    ],
    "complexity": "O(V+E) time · O(V) auxiliary space",
    "next": [
      "bfs",
      "dp-1d"
    ],
    "code": "// Edges point prerequisite -> dependent.\npublic static int[] TopologicalOrder(List<int>[] graph)\n{\n    var indegree = new int[graph.Length];\n    foreach (var edges in graph)\n        foreach (int v in edges) indegree[v]++;\n    var queue = new Queue<int>();\n    for (int v = 0; v < graph.Length; v++)\n        if (indegree[v] == 0) queue.Enqueue(v);\n    var order = new List<int>();\n    while (queue.Count > 0)\n    {\n        int u = queue.Dequeue();\n        order.Add(u);\n        foreach (int v in graph[u])\n            if (--indegree[v] == 0) queue.Enqueue(v);\n    }\n    return order.Count == graph.Length ? order.ToArray() : Array.Empty<int>();\n}",
    "tests": "Check(TopologicalOrder(new[]{new List<int>{2},new List<int>{2},new List<int>()}).SequenceEqual(new[]{0,1,2})); Check(TopologicalOrder(new[]{new List<int>{0}}).Length==0);"
  },
  {
    "id": "union-find",
    "title": "Union-Find · disjoint sets",
    "group": "Trees & graphs",
    "level": "Intermediate",
    "cue": "Repeated connectivity queries, merging components, or detecting an undirected cycle as edges arrive.",
    "idea": "Represent each component by a root. Path compression speeds later finds, while union by size keeps the trees shallow.",
    "steps": [
      "Create one component per vertex.",
      "Find each endpoint's root before merging.",
      "If roots match, the endpoints were already connected.",
      "Otherwise attach the smaller tree to the larger and update its size."
    ],
    "invariant": "Two vertices are connected exactly when Find returns the same representative.",
    "pitfalls": [
      "Union-Find does not return a path or a shortest distance.",
      "It does not directly support arbitrary edge deletion.",
      "A failed union detects a redundant undirected edge, not a directed cycle."
    ],
    "example": "Union(0,1), Union(1,2) create one component. Union(0,2) returns false because both roots already match.",
    "practice": [
      {
        "title": "Number of Provinces",
        "approach": "Union connected city pairs, then count distinct representatives."
      },
      {
        "title": "Redundant Connection",
        "approach": "Process undirected edges in order; the first failed union identifies an already-connected pair."
      },
      {
        "title": "Accounts Merge",
        "approach": "Union accounts sharing an email, then group and sort emails by representative."
      },
      {
        "title": "Most Stones Removed with Same Row or Column",
        "approach": "Union stones sharing a row or column; each connected component can retain one stone."
      }
    ],
    "complexity": "O(n) initialization · amortized O(α(n)) per operation · O(n) space",
    "next": [
      "bfs",
      "topological"
    ],
    "code": "public class DisjointSet\n{\n    private readonly int[] parent, size;\n    public DisjointSet(int n)\n    {\n        parent = Enumerable.Range(0, n).ToArray();\n        size = Enumerable.Repeat(1, n).ToArray();\n    }\n    public int Find(int x)\n    {\n        while (parent[x] != x)\n        {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n    public bool Union(int a, int b)\n    {\n        a = Find(a); b = Find(b);\n        if (a == b) return false;\n        if (size[a] < size[b]) (a, b) = (b, a);\n        parent[b] = a; size[a] += size[b];\n        return true;\n    }\n}",
    "tests": "var d=new DisjointSet(3); Check(d.Union(0,1)); Check(d.Union(1,2)); Check(!d.Union(0,2)); Check(d.Find(0)==d.Find(2));"
  },
  {
    "id": "dijkstra",
    "title": "Dijkstra · nonnegative shortest paths",
    "group": "Trees & graphs",
    "level": "Intermediate",
    "cue": "Shortest paths with varying nonnegative edge costs.",
    "idea": "Always expand the smallest tentative distance. Improving a neighbor inserts a new queue entry; outdated entries are ignored.",
    "steps": [
      "Initialize all distances to infinity except the source.",
      "Use a min-priority queue keyed by tentative distance.",
      "Discard popped entries whose distance no longer equals the best known value.",
      "Relax each outgoing edge and enqueue successful improvements."
    ],
    "invariant": "A non-stale popped vertex has its final shortest distance when all edge weights are nonnegative.",
    "pitfalls": [
      "Negative edges invalidate this guarantee; consider Bellman-Ford or DAG shortest paths instead.",
      "C# PriorityQueue removes the smallest priority, not the largest.",
      "This lazy-duplicate implementation may keep O(E) heap entries; account for them in space analysis."
    ],
    "example": "0→1 costs 5, 0→2 costs 1, 2→1 costs 1: visit 2 before 1, improve distance(1) to 2, then ignore its old priority-5 entry.",
    "practice": [
      {
        "title": "Network Delay Time",
        "approach": "Run shortest paths from the source; return the maximum finite distance, or -1 if a vertex is unreachable."
      },
      {
        "title": "Path With Minimum Effort",
        "approach": "Use a minimax relaxation: candidate=max(currentEffort, edgeDifference), not a sum."
      },
      {
        "title": "Swim in Rising Water",
        "approach": "Use a minimax relaxation where cost is the greatest elevation encountered, not total travel cost."
      }
    ],
    "complexity": "O(V + E log(E+2)) time · O(V+E) auxiliary space with lazy heap entries",
    "next": [
      "bfs",
      "heap"
    ],
    "code": "// Valid vertex indices, nonnegative weights; path sums must fit in long.\npublic static long[] ShortestPaths(List<(int To, int Weight)>[] graph, int source)\n{\n    var distance = Enumerable.Repeat(long.MaxValue, graph.Length).ToArray();\n    var heap = new PriorityQueue<int, long>();\n    distance[source] = 0;\n    heap.Enqueue(source, 0);\n    while (heap.TryDequeue(out int u, out long cost))\n    {\n        if (cost != distance[u]) continue;\n        foreach (var edge in graph[u])\n        {\n            if (edge.Weight < 0) throw new ArgumentException(\"Negative weight\");\n            long candidate = checked(cost + edge.Weight);\n            if (candidate >= distance[edge.To]) continue;\n            distance[edge.To] = candidate;\n            heap.Enqueue(edge.To, candidate);\n        }\n    }\n    return distance;\n}",
    "tests": "var g=new[]{new List<(int,int)>{(1,5),(2,1)},new List<(int,int)>(),new List<(int,int)>{(1,1)}}; Check(ShortestPaths(g,0).SequenceEqual(new long[]{0,2,1}));"
  },
  {
    "id": "heap",
    "title": "Heap · top K & best-next choice",
    "group": "Search & ordering",
    "level": "Intermediate",
    "cue": "K largest/smallest, merging sorted streams, or repeatedly selecting the next best item.",
    "idea": "For the kth largest element, retain only the k largest values seen so far in a min-heap. Its smallest element is the current kth largest.",
    "steps": [
      "Decide which item must be easy to remove.",
      "Choose min-heap or max-heap behavior accordingly.",
      "Insert each candidate and remove the smallest when size exceeds k.",
      "Read the root after processing all candidates."
    ],
    "invariant": "The heap contains the largest min(k, processedCount) values seen so far, including duplicates.",
    "pitfalls": [
      "PriorityQueue is a min-heap; a top-K-largest task still uses a min-heap to discard small values.",
      "Kth largest is not kth distinct largest.",
      "A heap is not sorted when enumerated; dequeue repeatedly if ordered output is required."
    ],
    "example": "[3,1,5,2], k=2: retained values become [3], [1,3], [3,5], [3,5]. The kth largest is 3.",
    "practice": [
      {
        "title": "Kth Largest Element in an Array",
        "approach": "Keep a min-heap of size k, or use quickselect when a partition-based approach is suitable."
      },
      {
        "title": "Top K Frequent Elements",
        "approach": "Count frequencies first, then keep k highest-frequency keys in a min-heap."
      },
      {
        "title": "Merge k Sorted Lists",
        "approach": "Seed the heap with each nonempty list's head; pop the smallest and insert its successor."
      },
      {
        "title": "Find Median from Data Stream",
        "approach": "Maintain a max-heap for the lower half and min-heap for the upper half, balancing their sizes after each insertion."
      }
    ],
    "complexity": "O(n log(k+1)) time · O(k) space",
    "next": [
      "dijkstra",
      "intervals"
    ],
    "code": "public static int KthLargest(int[] a, int k)\n{\n    if (k < 1 || k > a.Length)\n        throw new ArgumentOutOfRangeException(nameof(k));\n    var heap = new PriorityQueue<int, int>();\n    foreach (int value in a)\n    {\n        heap.Enqueue(value, value);\n        if (heap.Count > k) heap.Dequeue();\n    }\n    return heap.Peek();\n}",
    "tests": "Check(KthLargest(new[]{3,1,5,2},2)==3); Check(KthLargest(new[]{2,2,1},2)==2);"
  },
  {
    "id": "backtracking",
    "title": "Backtracking · choose, explore, undo",
    "group": "Decisions & optimization",
    "level": "Intermediate",
    "cue": "Enumerate all subsets, permutations, placements, or combinations under constraints.",
    "idea": "Traverse a decision tree. Mutate a current choice, explore its consequences, and undo it before the next branch.",
    "steps": [
      "Define the state and the choices available at that state.",
      "Write a base case that copies a complete answer.",
      "Choose, recurse, then undo exactly that choice.",
      "Prune impossible partial states without eliminating valid answers."
    ],
    "invariant": "On return from a recursive call, the shared path is exactly as it was before entering that call.",
    "pitfalls": [
      "Copy the path into results; storing the same mutable list makes answers alias each other.",
      "Duplicate inputs require sorting and duplicate skipping for unique results.",
      "Exponential output cannot be made polynomial by a clever loop."
    ],
    "example": "[1,2] branches into [], [2], [1], [1,2] with an exclude-first recursion.",
    "practice": [
      {
        "title": "Subsets",
        "approach": "Choose include/exclude per element and copy the path at each leaf."
      },
      {
        "title": "Permutations",
        "approach": "Track used positions; choose any unused value, recurse, and undo the choice."
      },
      {
        "title": "Combination Sum",
        "approach": "Track a start index and remaining sum; with positive candidates, reuse a choice or move forward, pruning sums that exceed the target."
      },
      {
        "title": "N-Queens",
        "approach": "Place one queen per row while maintaining used columns and both diagonal sets."
      },
      {
        "title": "Word Search",
        "approach": "DFS adjacent cells matching the next character; mark a cell for the current path and restore it on backtracking."
      }
    ],
    "complexity": "O(n·2ⁿ) time and output space · O(n) auxiliary stack/path",
    "next": [
      "dp-1d",
      "trie"
    ],
    "code": "// Distinct input values; duplicates produce duplicate subsets.\npublic static List<int[]> Subsets(int[] a)\n{\n    var result = new List<int[]>();\n    var path = new List<int>();\n    void Search(int index)\n    {\n        if (index == a.Length) { result.Add(path.ToArray()); return; }\n        Search(index + 1);\n        path.Add(a[index]);\n        Search(index + 1);\n        path.RemoveAt(path.Count - 1);\n    }\n    Search(0);\n    return result;\n}",
    "tests": "var r=Subsets(new[]{1,2}); Check(r.Count==4); Check(r.Any(x=>x.SequenceEqual(new[]{1,2}))); Check(Subsets(Array.Empty<int>()).Count==1);"
  },
  {
    "id": "dp-1d",
    "title": "Dynamic programming · one-dimensional state",
    "group": "Decisions & optimization",
    "level": "Intermediate",
    "cue": "Repeated subproblems involving a prefix, amount, index, or take/skip decision.",
    "idea": "Define a state in words, derive a recurrence, choose base cases, and compute each state once. Compress storage only after dependencies are clear.",
    "steps": [
      "State exactly what dp[i] means.",
      "List all legal last decisions leading to state i.",
      "Take min, max, sum, or OR depending on the question.",
      "Choose a dependency-respecting order; then consider rolling variables."
    ],
    "invariant": "Before processing a house, previous is the best total before it, and twoBack is the best total before its predecessor.",
    "pitfalls": [
      "Greedy largest-first choices may block a better combination.",
      "An optimized one-dimensional knapsack changes meaning with loop direction.",
      "The House Robber template below is not a universal DP recurrence."
    ],
    "example": "[2,7,9,3,1]: best totals after each house are 2,7,11,11,12. Pick 2+9+1.",
    "practice": [
      {
        "title": "House Robber",
        "approach": "Choose between skipping the current house and taking it plus the best total two positions earlier."
      },
      {
        "title": "Climbing Stairs",
        "approach": "Ways to reach step i equal ways(i-1)+ways(i-2); choose base cases consistently."
      },
      {
        "title": "Coin Change",
        "approach": "dp[amount] is the fewest coins; minimize dp[amount-coin]+1 over valid coins, using an unreachable sentinel."
      },
      {
        "title": "Word Break",
        "approach": "dp[i] records whether the prefix of length i can be segmented; try preceding cuts whose suffix is a dictionary word."
      },
      {
        "title": "Longest Increasing Subsequence",
        "approach": "Use dp[i] as the best subsequence ending at i for O(n²), or binary-search a tails array for O(n log n)."
      },
      {
        "title": "Maximum Subarray",
        "approach": "Let bestEndingHere be the best nonempty sum ending at the current index. Choose between starting fresh and extending; track a global best, including all-negative inputs."
      },
      {
        "title": "Decode Ways",
        "approach": "Let dp[i] count decodings of a prefix. Add dp[i-1] for a valid single digit and dp[i-2] for a valid 10..26 pair; zero cannot decode on its own."
      }
    ],
    "complexity": "O(n) time · O(1) space for this recurrence",
    "next": [
      "dp-2d",
      "greedy",
      "backtracking"
    ],
    "code": "// Skipping every house is allowed; use long for total values.\npublic static long Rob(int[] houses)\n{\n    long twoBack = 0, previous = 0;\n    foreach (int value in houses)\n    {\n        long current = Math.Max(previous, twoBack + value);\n        twoBack = previous;\n        previous = current;\n    }\n    return previous;\n}",
    "tests": "Check(Rob(new[]{2,7,9,3,1})==12); Check(Rob(Array.Empty<int>())==0); Check(Rob(new[]{2,1,1,2})==4);"
  },
  {
    "id": "dp-2d",
    "title": "Dynamic programming · grids & two sequences",
    "group": "Decisions & optimization",
    "level": "Intermediate",
    "cue": "Two changing indices, sequence alignment, grid paths, or a capacity plus an item index.",
    "idea": "Use a state for each pair of prefixes. Derive transitions from smaller states, including what happens when the current characters match or differ.",
    "steps": [
      "Define dp[i,j] for prefixes of lengths i and j.",
      "Initialize the row and column representing empty prefixes.",
      "Derive the transition using only already-computed states.",
      "Read the requested final state; reconstruct choices only if needed."
    ],
    "invariant": "dp[i,j] stores the longest common subsequence length of a[0..i) and b[0..j).",
    "pitfalls": [
      "Subsequence is not substring: skipped characters are allowed.",
      "Edit distance has insertion/deletion/replacement transitions, not the same recurrence as LCS.",
      "O(mn) memory can be large; rolling rows reduce length-only LCS storage."
    ],
    "example": "abcde and ace: matching a,c,e extend the diagonal result. The LCS length is 3.",
    "practice": [
      {
        "title": "Longest Common Subsequence",
        "approach": "Matching trailing characters extend the diagonal; otherwise take the best of dropping either trailing character."
      },
      {
        "title": "Edit Distance",
        "approach": "Initialize empty-prefix edit costs; use minimum insertion, deletion, and substitution costs."
      },
      {
        "title": "Unique Paths",
        "approach": "For each cell, add ways from above and left; obstacle variants set blocked cells to zero."
      },
      {
        "title": "Interleaving String",
        "approach": "dp[i,j] checks whether prefixes of two strings form the target prefix of length i+j."
      },
      {
        "title": "Partition Equal Subset Sum",
        "approach": "Reduce to a subset-sum target of half the total; for positive inputs use a boolean array updated in descending sum order."
      }
    ],
    "complexity": "O(mn) time · O(mn) space for the full table",
    "next": [
      "dp-1d"
    ],
    "code": "public static int LcsLength(string a, string b)\n{\n    var dp = new int[a.Length + 1, b.Length + 1];\n    for (int i = 1; i <= a.Length; i++)\n        for (int j = 1; j <= b.Length; j++)\n            dp[i, j] = a[i - 1] == b[j - 1]\n                ? dp[i - 1, j - 1] + 1\n                : Math.Max(dp[i - 1, j], dp[i, j - 1]);\n    return dp[a.Length, b.Length];\n}",
    "tests": "Check(LcsLength(\"abcde\",\"ace\")==3); Check(LcsLength(\"abc\",\"def\")==0); Check(LcsLength(\"\",\"a\")==0);"
  },
  {
    "id": "greedy",
    "title": "Greedy · prove the local choice",
    "group": "Decisions & optimization",
    "level": "Intermediate",
    "cue": "A local choice can be shown never to harm future feasibility or an optimal solution.",
    "idea": "Do not assume a plausible choice is optimal. Prove it with an exchange argument, a stays-ahead argument, or a maintained reachability frontier.",
    "steps": [
      "Propose a local choice or frontier.",
      "Try to build a counterexample before coding.",
      "Explain why an optimal solution can use the choice without getting worse.",
      "Implement the invariant and test adversarial inputs."
    ],
    "invariant": "All indices up to farthest are reachable from index zero.",
    "pitfalls": [
      "Greedy fails when an appealing local choice loses necessary future information; use DP if proof fails.",
      "Jump Game assumes nonnegative jump lengths.",
      "The reachability solution does not by itself give the minimum number of jumps."
    ],
    "example": "[2,3,1,1,4]: index 0 reaches 2; index 1 extends the frontier to 4, so the last index is reachable.",
    "practice": [
      {
        "title": "Jump Game",
        "approach": "Maintain the farthest reachable index; fail if the next index lies beyond it."
      },
      {
        "title": "Jump Game II",
        "approach": "Scan BFS-like reachable ranges; crossing the current range end commits one more jump."
      },
      {
        "title": "Gas Station",
        "approach": "If total gas is insufficient there is no solution; reset the candidate start after each negative running balance."
      },
      {
        "title": "Non-overlapping Intervals",
        "approach": "Keep intervals by earliest end time; an exchange argument justifies leaving the most room for later choices."
      },
      {
        "title": "Partition Labels",
        "approach": "Precompute each character's last occurrence; extend a segment until all characters it contains end within that segment."
      }
    ],
    "complexity": "O(n) time · O(1) space",
    "next": [
      "dp-1d",
      "intervals",
      "answer-search"
    ],
    "code": "public static bool CanReachEnd(int[] jumps)\n{\n    if (jumps.Length == 0) return false;\n    long farthest = 0;\n    for (int i = 0; i < jumps.Length; i++)\n    {\n        if (i > farthest) return false;\n        farthest = Math.Max(farthest, (long)i + jumps[i]);\n        if (farthest >= jumps.Length - 1) return true;\n    }\n    return false;\n}",
    "tests": "Check(CanReachEnd(new[]{2,3,1,1,4})); Check(!CanReachEnd(new[]{3,2,1,0,4})); Check(CanReachEnd(new[]{0}));"
  },
  {
    "id": "trie",
    "title": "Trie · prefix search",
    "group": "Trees & graphs",
    "level": "Intermediate",
    "cue": "Many word-prefix queries, dictionary traversal, autocomplete, or word search with shared prefixes.",
    "idea": "Store characters along paths so shared prefixes share nodes. Separate a complete-word marker from mere path existence.",
    "steps": [
      "Start each insertion or lookup at the root.",
      "Follow or create one edge per character.",
      "Mark the final insertion node as a complete word.",
      "For prefix queries, path existence is enough; word queries also require the marker."
    ],
    "invariant": "The node reached after k characters represents exactly that k-character prefix.",
    "pitfalls": [
      "Finding a prefix does not prove the complete word was inserted.",
      "This template uses C# char units; normalize text or use runes when full Unicode semantics matter.",
      "Trie memory can be large; dictionary edges trade overhead for a flexible alphabet."
    ],
    "example": "Insert apple: searching app is false, but StartsWith(app) is true. After inserting app, both queries are true.",
    "practice": [
      {
        "title": "Implement Trie (Prefix Tree)",
        "approach": "Insert character paths and mark complete words separately from prefixes."
      },
      {
        "title": "Design Add and Search Words Data Structure",
        "approach": "For a wildcard, branch to every child; for a literal, follow only its matching child."
      },
      {
        "title": "Word Search II",
        "approach": "Combine board backtracking with trie traversal; prune prefixes absent from the dictionary and deduplicate found words."
      },
      {
        "title": "Replace Words",
        "approach": "Walk each word from the trie root and stop at the first terminal node to use the shortest root."
      }
    ],
    "complexity": "Expected O(L) per insert/query · O(total inserted characters) space",
    "next": [
      "backtracking",
      "hash-map"
    ],
    "code": "public class Trie\n{\n    private readonly Dictionary<char, Trie> children = new();\n    private bool word;\n    public void Insert(string text)\n    {\n        var node = this;\n        foreach (char c in text)\n        {\n            if (!node.children.ContainsKey(c)) node.children[c] = new Trie();\n            node = node.children[c];\n        }\n        node.word = true;\n    }\n    private Trie? Walk(string text)\n    {\n        var node = this;\n        foreach (char c in text)\n        {\n            if (!node.children.TryGetValue(c, out var next)) return null;\n            node = next;\n        }\n        return node;\n    }\n    public bool Search(string text) => Walk(text)?.word == true;\n    public bool StartsWith(string prefix) => Walk(prefix) != null;\n}",
    "tests": "var t=new Trie(); t.Insert(\"apple\"); Check(!t.Search(\"app\") && t.StartsWith(\"app\")); t.Insert(\"app\"); Check(t.Search(\"app\")); Check(!t.StartsWith(\"z\"));"
  },
  {
    "id": "bitwise",
    "title": "Bit manipulation & masks",
    "group": "Decisions & optimization",
    "level": "Intermediate",
    "cue": "Parity, compact sets of flags, XOR cancellation, or subset states with small n.",
    "idea": "Choose a bit identity that matches the constraints. XOR cancels equal pairs because x XOR x = 0 and x XOR 0 = x.",
    "steps": [
      "Translate the constraints into bit-level behavior.",
      "Prove the identity removes exactly the unwanted information.",
      "Apply it across the input or enumerate masks for a small set.",
      "Check width, sign, and shift bounds in C#."
    ],
    "invariant": "The accumulator is the XOR of every processed value; pairs cancel regardless of order.",
    "pitfalls": [
      "Single Number works only when all other values appear exactly twice; triples need a different method.",
      "C# int shifts mask the shift count, so 1 << 32 does not create a 33-bit flag.",
      "Do not allocate or enumerate 2ⁿ states unless n is small enough."
    ],
    "example": "[4,1,2,1,2]: the two 1s and two 2s cancel, leaving 4.",
    "practice": [
      {
        "title": "Single Number",
        "approach": "XOR all numbers; paired duplicates cancel and the single value remains."
      },
      {
        "title": "Number of 1 Bits",
        "approach": "Repeatedly clear the lowest set bit with n &= n-1; use unsigned input for predictable width semantics."
      },
      {
        "title": "Counting Bits",
        "approach": "Use bits[i]=bits[i>>1]+(i&1), or bits[i]=bits[i&(i-1)]+1."
      },
      {
        "title": "Missing Number",
        "approach": "XOR the numbers and all expected indices 0..n, or use a long arithmetic sum difference."
      },
      {
        "title": "Subsets",
        "approach": "For small n, each mask represents one subset; include position i when its bit is set."
      }
    ],
    "complexity": "O(n) time · O(1) space for XOR cancellation",
    "next": [
      "backtracking",
      "dp-1d"
    ],
    "code": "// Exactly one value appears once; every other value appears twice.\npublic static int SingleNumber(int[] a)\n{\n    int result = 0;\n    foreach (int value in a) result ^= value;\n    return result;\n}",
    "tests": "Check(SingleNumber(new[]{4,1,2,1,2})==4); Check(SingleNumber(new[]{-2,3,3})==-2);"
  }
];
