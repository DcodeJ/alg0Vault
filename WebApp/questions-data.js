// 100 distinct practice questions. Briefs and hints are original paraphrases.
// IDs are local study-list numbers, not official LeetCode problem numbers.
window.ALG0_QUESTIONS = [
  {
    "title": "Longest Substring Without Repeating Characters",
    "guides": [
      {
        "pattern": "sliding-window",
        "approach": "Track character counts or a set; shrink until the duplicate disappears, then maximize length."
      }
    ],
    "id": 1,
    "brief": "Find the length of the longest contiguous substring whose characters are all distinct."
  },
  {
    "title": "Minimum Size Subarray Sum",
    "guides": [
      {
        "pattern": "sliding-window",
        "approach": "With positive values, grow the sum; while it reaches the target, record the length and shrink."
      }
    ],
    "id": 2,
    "brief": "Given positive integers and a positive target, find the shortest contiguous subarray with sum at least the target; return 0 if none exists."
  },
  {
    "title": "Fruit Into Baskets",
    "guides": [
      {
        "pattern": "sliding-window",
        "approach": "Treat fruit types as keys; shrink until at most two types remain."
      }
    ],
    "id": 3,
    "brief": "Choose the longest contiguous run of fruit trees containing at most two fruit types."
  },
  {
    "title": "Minimum Window Substring",
    "guides": [
      {
        "pattern": "sliding-window",
        "approach": "Track required multiplicities and how many are satisfied; shrink a valid window while preserving a best answer."
      }
    ],
    "id": 4,
    "brief": "Find the shortest substring of s that contains every character of t with its required multiplicity; return an empty string if impossible."
  },
  {
    "title": "Maximum Average Subarray I",
    "guides": [
      {
        "pattern": "fixed-window",
        "approach": "Maintain a k-element sum and divide the best sum by k after scanning."
      }
    ],
    "id": 5,
    "brief": "Find the greatest average among all contiguous subarrays of exactly k numbers."
  },
  {
    "title": "Maximum Number of Vowels in a Substring of Given Length",
    "guides": [
      {
        "pattern": "fixed-window",
        "approach": "Add and remove vowel contributions as the k-character window moves."
      }
    ],
    "id": 6,
    "brief": "Find the maximum number of lowercase vowels in any substring of exactly k characters."
  },
  {
    "title": "Permutation in String",
    "guides": [
      {
        "pattern": "fixed-window",
        "approach": "Compare window frequencies with the pattern's frequencies; track how many counts differ."
      }
    ],
    "id": 7,
    "brief": "Determine whether the second string contains a contiguous permutation of the first string."
  },
  {
    "title": "Find All Anagrams in a String",
    "guides": [
      {
        "pattern": "fixed-window",
        "approach": "Use the same frequency-window test, but collect every matching starting index."
      }
    ],
    "id": 8,
    "brief": "Return all starting indices of substrings that are anagrams of the given pattern."
  },
  {
    "title": "Two Sum II - Input Array Is Sorted",
    "guides": [
      {
        "pattern": "two-pointers",
        "approach": "Compare the two end values; move left for a small sum and right for a large sum."
      }
    ],
    "id": 9,
    "brief": "In a sorted array, find two distinct positions whose values add to the target. Return their one-based indices."
  },
  {
    "title": "3Sum",
    "guides": [
      {
        "pattern": "two-pointers",
        "approach": "Sort, fix the first element, then use two pointers for the remaining target; skip duplicates."
      }
    ],
    "id": 10,
    "brief": "Return all distinct value triplets whose sum is zero, without using an array position twice."
  },
  {
    "title": "Container With Most Water",
    "guides": [
      {
        "pattern": "two-pointers",
        "approach": "Compute width times the shorter height; move the shorter side since keeping it cannot improve the area."
      }
    ],
    "id": 11,
    "brief": "Choose two vertical lines that, with the horizontal axis, hold the greatest area of water."
  },
  {
    "title": "Valid Palindrome",
    "guides": [
      {
        "pattern": "two-pointers",
        "approach": "Skip non-alphanumeric characters at each end and compare normalized characters."
      }
    ],
    "id": 12,
    "brief": "After ignoring non-alphanumeric characters and letter case, determine whether a string reads the same forwards and backwards."
  },
  {
    "title": "Two Sum",
    "guides": [
      {
        "pattern": "hash-map",
        "approach": "Look for target-current among earlier values, then store the current index."
      }
    ],
    "id": 13,
    "brief": "Find two distinct array indices whose values sum to the target."
  },
  {
    "title": "Group Anagrams",
    "guides": [
      {
        "pattern": "hash-map",
        "approach": "Group by a canonical sorted-string or frequency signature, not by a raw sum of letters."
      }
    ],
    "id": 14,
    "brief": "Group strings that contain the same characters with the same multiplicities."
  },
  {
    "title": "Valid Anagram",
    "guides": [
      {
        "pattern": "hash-map",
        "approach": "Increment counts for one word and decrement for the other; all counts must balance."
      }
    ],
    "id": 15,
    "brief": "Determine whether two strings contain exactly the same characters with the same counts."
  },
  {
    "title": "Longest Consecutive Sequence",
    "guides": [
      {
        "pattern": "hash-map",
        "approach": "Use a set; start runs only where value-1 is absent, then walk forward through each run."
      }
    ],
    "id": 16,
    "brief": "Find the length of the longest sequence of consecutive integer values in an unsorted array, in expected linear time."
  },
  {
    "title": "Subarray Sum Equals K",
    "guides": [
      {
        "pattern": "prefix-sum",
        "approach": "Count previous prefix sums equal to current-target; seed the empty prefix once."
      }
    ],
    "id": 17,
    "brief": "Count contiguous subarrays whose sum equals k. Values may be negative or zero."
  },
  {
    "title": "Contiguous Array",
    "guides": [
      {
        "pattern": "prefix-sum",
        "approach": "Map 0 to -1 and 1 to +1; store each prefix sum's earliest index and maximize repeated-prefix distance."
      }
    ],
    "id": 18,
    "brief": "Find the longest contiguous part of a binary array containing equal numbers of zeros and ones."
  },
  {
    "title": "Range Sum Query - Immutable",
    "guides": [
      {
        "pattern": "prefix-sum",
        "approach": "Build a prefix array once; answer inclusive [l,r] with prefix[r+1]-prefix[l]."
      }
    ],
    "id": 19,
    "brief": "Preprocess an unchanging integer array to answer repeated inclusive range-sum queries."
  },
  {
    "title": "Subarray Sums Divisible by K",
    "guides": [
      {
        "pattern": "prefix-sum",
        "approach": "Count equal normalized remainders of prefix sums; normalize negative remainders to [0,k)."
      }
    ],
    "id": 20,
    "brief": "Count nonempty contiguous subarrays whose sum is divisible by a positive integer k."
  },
  {
    "title": "Linked List Cycle",
    "guides": [
      {
        "pattern": "fast-slow",
        "approach": "Advance one and two links per round; a meeting proves a cycle."
      }
    ],
    "id": 21,
    "brief": "Determine whether following next pointers in a linked list eventually revisits a node."
  },
  {
    "title": "Linked List Cycle II",
    "guides": [
      {
        "pattern": "fast-slow",
        "approach": "After the first meeting, reset one pointer to head; move both one step to meet at the entry."
      }
    ],
    "id": 22,
    "brief": "Return the node at which a linked-list cycle begins, or null when no cycle exists."
  },
  {
    "title": "Middle of the Linked List",
    "guides": [
      {
        "pattern": "fast-slow",
        "approach": "Advance slow once and fast twice; decide which middle to return for even lengths."
      }
    ],
    "id": 23,
    "brief": "Return the middle node of a singly linked list; when there are two middle nodes, return the second."
  },
  {
    "title": "Happy Number",
    "guides": [
      {
        "pattern": "fast-slow",
        "approach": "Treat sum-of-squared-digits as the transition; detect a cycle and check whether it includes 1."
      }
    ],
    "id": 24,
    "brief": "Repeatedly replace a positive integer with the sum of its digits' squares. Determine whether this process reaches 1."
  },
  {
    "title": "Reverse Linked List",
    "guides": [
      {
        "pattern": "linked-reversal",
        "approach": "Save next, reverse the current link, and advance; previous becomes the new head."
      }
    ],
    "id": 25,
    "brief": "Reverse a singly linked list and return its new head."
  },
  {
    "title": "Reverse Linked List II",
    "guides": [
      {
        "pattern": "linked-reversal",
        "approach": "Use a dummy node, locate the segment predecessor, reverse the segment, and reconnect both ends."
      }
    ],
    "id": 26,
    "brief": "Reverse only the nodes between two given one-based positions in a singly linked list."
  },
  {
    "title": "Reorder List",
    "guides": [
      {
        "pattern": "linked-reversal",
        "approach": "Find the midpoint, reverse the second half, then weave the halves alternately."
      }
    ],
    "id": 27,
    "brief": "Rearrange L0→L1→…→Ln into L0→Ln→L1→Ln-1→… by changing links, not node values."
  },
  {
    "title": "Palindrome Linked List",
    "guides": [
      {
        "pattern": "linked-reversal",
        "approach": "Find and reverse the second half, compare values, and restore the list if preservation is required."
      }
    ],
    "id": 28,
    "brief": "Determine whether a linked list's values form a palindrome."
  },
  {
    "title": "Merge Intervals",
    "guides": [
      {
        "pattern": "intervals",
        "approach": "Sort by start, extend the current merged end on overlap, otherwise append a new interval."
      }
    ],
    "id": 29,
    "brief": "Combine overlapping closed intervals and return non-overlapping intervals covering the same range."
  },
  {
    "title": "Insert Interval",
    "guides": [
      {
        "pattern": "intervals",
        "approach": "Copy earlier intervals, merge all overlaps with the new one, then append the later intervals."
      }
    ],
    "id": 30,
    "brief": "Insert a new interval into a sorted, non-overlapping list and merge any resulting overlaps."
  },
  {
    "title": "Non-overlapping Intervals",
    "guides": [
      {
        "pattern": "intervals",
        "approach": "Sort by end and keep the maximum number of compatible intervals; remove the rest."
      },
      {
        "pattern": "greedy",
        "approach": "Keep intervals by earliest end time; an exchange argument justifies leaving the most room for later choices."
      }
    ],
    "id": 31,
    "brief": "Remove as few intervals as possible so the remaining intervals do not overlap; touching endpoints are allowed."
  },
  {
    "title": "Minimum Number of Arrows to Burst Balloons",
    "guides": [
      {
        "pattern": "intervals",
        "approach": "Sort by end; shoot at the earliest ending balloon and reuse that position while it remains inside later balloons."
      }
    ],
    "id": 32,
    "brief": "Balloons occupy closed horizontal intervals. Find the fewest vertical arrows needed to intersect every balloon."
  },
  {
    "title": "Binary Search",
    "guides": [
      {
        "pattern": "binary-search",
        "approach": "Use a consistent inclusive or half-open range and return -1 if no exact match exists."
      }
    ],
    "id": 33,
    "brief": "Find a target's index in an ascending sorted array, or return -1 if it is absent, in logarithmic time."
  },
  {
    "title": "Search Insert Position",
    "guides": [
      {
        "pattern": "binary-search",
        "approach": "Return the lower bound: the first index with value at least the target, including n."
      }
    ],
    "id": 34,
    "brief": "Return the index of the target in a sorted array, or the position at which it should be inserted to preserve order."
  },
  {
    "title": "Find First and Last Position of Element in Sorted Array",
    "guides": [
      {
        "pattern": "binary-search",
        "approach": "Run lower-bound and upper-bound searches; verify the target exists before returning endpoints."
      }
    ],
    "id": 35,
    "brief": "Find the first and last occurrence of a target in a sorted array in logarithmic time; use [-1,-1] when absent."
  },
  {
    "title": "Search in Rotated Sorted Array",
    "guides": [
      {
        "pattern": "binary-search",
        "approach": "At least one half is sorted (without duplicates); use its bounds to decide which half can contain the target."
      }
    ],
    "id": 36,
    "brief": "Find a target in an ascending array of distinct values that has been rotated, in logarithmic time."
  },
  {
    "title": "Capacity To Ship Packages Within D Days",
    "guides": [
      {
        "pattern": "answer-search",
        "approach": "Binary search capacity; a greedy ordered scan counts how many days that capacity needs."
      }
    ],
    "id": 37,
    "brief": "Ship positive package weights in their original order within the given number of days using the smallest daily capacity."
  },
  {
    "title": "Koko Eating Bananas",
    "guides": [
      {
        "pattern": "answer-search",
        "approach": "Binary search speed; feasibility sums ceiling(pile/speed), using long arithmetic."
      }
    ],
    "id": 38,
    "brief": "Choose the smallest integer eating speed that finishes all banana piles within h hours; each hour is spent on at most one pile."
  },
  {
    "title": "Split Array Largest Sum",
    "guides": [
      {
        "pattern": "answer-search",
        "approach": "For nonnegative values, binary search the largest allowed segment sum and greedily count segments."
      }
    ],
    "id": 39,
    "brief": "Split a nonnegative array into k nonempty contiguous parts while minimizing the largest part sum."
  },
  {
    "title": "Minimum Number of Days to Make m Bouquets",
    "guides": [
      {
        "pattern": "answer-search",
        "approach": "Binary search the day; scan consecutive bloomed runs and count disjoint groups of the required size."
      }
    ],
    "id": 40,
    "brief": "Flowers bloom on given days. Find the earliest day to make m bouquets, each using k adjacent flowers without reuse, or report impossibility."
  },
  {
    "title": "Daily Temperatures",
    "guides": [
      {
        "pattern": "monotonic-stack",
        "approach": "Keep unresolved day indices; a strictly warmer temperature resolves them on pop."
      }
    ],
    "id": 41,
    "brief": "For each day's temperature, return how many days pass before a strictly warmer temperature; use 0 if none follows."
  },
  {
    "title": "Next Greater Element I",
    "guides": [
      {
        "pattern": "monotonic-stack",
        "approach": "Find each value's next-greater value with a decreasing stack, then answer the requested lookups."
      }
    ],
    "id": 42,
    "brief": "For every value in the first array, find its first greater value to the right in the second array, or -1 if absent; values are distinct."
  },
  {
    "title": "Largest Rectangle in Histogram",
    "guides": [
      {
        "pattern": "monotonic-stack",
        "approach": "Use an increasing-height stack; a smaller bar finalizes rectangles whose right boundary is now known."
      }
    ],
    "id": 43,
    "brief": "Find the largest rectangular area under a histogram of unit-width, nonnegative-height bars."
  },
  {
    "title": "Remove K Digits",
    "guides": [
      {
        "pattern": "monotonic-stack",
        "approach": "Maintain increasing digits, spending removals on larger preceding digits; trim remaining removals from the end."
      }
    ],
    "id": 44,
    "brief": "Delete exactly k digits from a decimal string to produce the smallest remaining number; normalize leading zeros."
  },
  {
    "title": "Sliding Window Maximum",
    "guides": [
      {
        "pattern": "monotonic-deque",
        "approach": "Keep candidate maximum indices in decreasing-value order and expire indices leaving the window."
      }
    ],
    "id": 45,
    "brief": "Return the maximum value in every contiguous window of exactly k elements."
  },
  {
    "title": "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
    "guides": [
      {
        "pattern": "monotonic-deque",
        "approach": "Use one max deque and one min deque; shrink until max-min is within the limit."
      }
    ],
    "id": 46,
    "brief": "Find the longest contiguous subarray in which the difference between the maximum and minimum value is at most the limit."
  },
  {
    "title": "Shortest Subarray with Sum at Least K",
    "guides": [
      {
        "pattern": "monotonic-deque",
        "approach": "Build prefix sums; use an increasing deque of candidate starts, popping valid answers from the front and dominated starts from the back."
      }
    ],
    "id": 47,
    "brief": "Given integers that may be negative, find the shortest nonempty contiguous subarray with sum at least k, or -1 if impossible."
  },
  {
    "title": "Maximum Depth of Binary Tree",
    "guides": [
      {
        "pattern": "tree-dfs",
        "approach": "Return one plus the larger child depth; an empty subtree returns zero."
      }
    ],
    "id": 48,
    "brief": "Return the maximum number of nodes on a path from a binary tree's root to a leaf."
  },
  {
    "title": "Diameter of Binary Tree",
    "guides": [
      {
        "pattern": "tree-dfs",
        "approach": "Return subtree height but update a separate best path using leftHeight+rightHeight."
      }
    ],
    "id": 49,
    "brief": "Return the number of edges in the longest path between any two nodes of a binary tree."
  },
  {
    "title": "Balanced Binary Tree",
    "guides": [
      {
        "pattern": "tree-dfs",
        "approach": "Return height or a failure sentinel; propagate failure as soon as child heights differ by more than one."
      }
    ],
    "id": 50,
    "brief": "Determine whether every node's left and right subtree heights differ by at most one."
  },
  {
    "title": "Binary Tree Maximum Path Sum",
    "guides": [
      {
        "pattern": "tree-dfs",
        "approach": "Return a single downward gain, but update a global answer with both positive child gains; handle all-negative trees."
      }
    ],
    "id": 51,
    "brief": "Find the greatest sum along any nonempty path in a binary tree; a path cannot revisit a node and need not pass through the root."
  },
  {
    "title": "Binary Tree Level Order Traversal",
    "guides": [
      {
        "pattern": "bfs",
        "approach": "Process a fixed queue-size batch for each level and collect its values."
      }
    ],
    "id": 52,
    "brief": "Return binary-tree values grouped by depth, traversing each level from left to right."
  },
  {
    "title": "Rotting Oranges",
    "guides": [
      {
        "pattern": "bfs",
        "approach": "Seed every rotten orange at time zero; BFS outward and count any fresh oranges left unreachable."
      }
    ],
    "id": 53,
    "brief": "Rotten oranges infect adjacent fresh oranges each minute in four directions. Return the time to rot all fresh oranges, or -1 if impossible."
  },
  {
    "title": "Word Ladder",
    "guides": [
      {
        "pattern": "bfs",
        "approach": "Words are states and one-letter changes are edges; BFS finds the shortest transformation count."
      }
    ],
    "id": 54,
    "brief": "Transform a start word into a target by changing one letter at a time through dictionary words. Return the number of words in a shortest sequence, or 0."
  },
  {
    "title": "Shortest Path in Binary Matrix",
    "guides": [
      {
        "pattern": "bfs",
        "approach": "BFS through valid neighboring cells; mark on enqueue and follow the problem's allowed directions."
      }
    ],
    "id": 55,
    "brief": "Find the shortest path of clear cells from the top-left to bottom-right of a binary grid, using eight directions. Count visited cells; return -1 if impossible."
  },
  {
    "title": "Number of Islands",
    "guides": [
      {
        "pattern": "bfs",
        "approach": "Scan for unvisited land. Each new BFS or DFS marks one four-directionally connected component and increments the island count; do not count diagonal contact."
      }
    ],
    "id": 56,
    "brief": "Count four-directionally connected groups of land cells in a grid of land and water."
  },
  {
    "title": "Course Schedule",
    "guides": [
      {
        "pattern": "topological",
        "approach": "Build prerequisite edges and check whether Kahn's algorithm removes every course."
      }
    ],
    "id": 57,
    "brief": "Determine whether all courses can be completed when some courses have prerequisites."
  },
  {
    "title": "Course Schedule II",
    "guides": [
      {
        "pattern": "topological",
        "approach": "Return the Kahn removal order if all courses were removed; otherwise no ordering exists."
      }
    ],
    "id": 58,
    "brief": "Return an ordering in which all prerequisites precede their dependent courses, or an empty list if no such ordering exists."
  },
  {
    "title": "Find Eventual Safe States",
    "guides": [
      {
        "pattern": "topological",
        "approach": "Reverse the graph and peel terminal vertices using outgoing-degree counts."
      }
    ],
    "id": 59,
    "brief": "Return, in sorted order, vertices from which every possible directed path eventually reaches a terminal vertex rather than a cycle."
  },
  {
    "title": "Minimum Height Trees",
    "guides": [
      {
        "pattern": "topological",
        "approach": "This is an undirected leaf-peeling variant, not a directed topological sort: remove leaf layers until one or two centers remain."
      }
    ],
    "id": 60,
    "brief": "For an undirected tree, return all choices of root that give the smallest tree height."
  },
  {
    "title": "Number of Provinces",
    "guides": [
      {
        "pattern": "union-find",
        "approach": "Union connected city pairs, then count distinct representatives."
      }
    ],
    "id": 61,
    "brief": "Given a symmetric city-connectivity matrix, count the connected groups of cities."
  },
  {
    "title": "Redundant Connection",
    "guides": [
      {
        "pattern": "union-find",
        "approach": "Process undirected edges in order; the first failed union identifies an already-connected pair."
      }
    ],
    "id": 62,
    "brief": "An extra edge was added to an undirected tree. Return the removable edge that restores a tree, choosing the last such edge in input order."
  },
  {
    "title": "Accounts Merge",
    "guides": [
      {
        "pattern": "union-find",
        "approach": "Union accounts sharing an email, then group and sort emails by representative."
      }
    ],
    "id": 63,
    "brief": "Merge accounts sharing an email address; preserve the account name and return sorted unique emails for each merged account."
  },
  {
    "title": "Most Stones Removed with Same Row or Column",
    "guides": [
      {
        "pattern": "union-find",
        "approach": "Union stones sharing a row or column; each connected component can retain one stone."
      }
    ],
    "id": 64,
    "brief": "Remove a stone only when another stone shares its row or column. Find the maximum number of stones that can be removed."
  },
  {
    "title": "Network Delay Time",
    "guides": [
      {
        "pattern": "dijkstra",
        "approach": "Run shortest paths from the source; return the maximum finite distance, or -1 if a vertex is unreachable."
      }
    ],
    "id": 65,
    "brief": "Given directed weighted transmission times, find when a signal from one source reaches every vertex, or -1 if some are unreachable."
  },
  {
    "title": "Path With Minimum Effort",
    "guides": [
      {
        "pattern": "dijkstra",
        "approach": "Use a minimax relaxation: candidate=max(currentEffort, edgeDifference), not a sum."
      }
    ],
    "id": 66,
    "brief": "Travel through a height grid in four directions, minimizing the largest absolute height difference between consecutive cells."
  },
  {
    "title": "Swim in Rising Water",
    "guides": [
      {
        "pattern": "dijkstra",
        "approach": "Use a minimax relaxation where cost is the greatest elevation encountered, not total travel cost."
      }
    ],
    "id": 67,
    "brief": "Water rises over a height grid. Find the earliest time you can move from top-left to bottom-right through cells at or below water level."
  },
  {
    "title": "Kth Largest Element in an Array",
    "guides": [
      {
        "pattern": "heap",
        "approach": "Keep a min-heap of size k, or use quickselect when a partition-based approach is suitable."
      }
    ],
    "id": 68,
    "brief": "Return the kth largest array value counting duplicates, rather than the kth distinct value."
  },
  {
    "title": "Top K Frequent Elements",
    "guides": [
      {
        "pattern": "heap",
        "approach": "Count frequencies first, then keep k highest-frequency keys in a min-heap."
      }
    ],
    "id": 69,
    "brief": "Return the k most frequent values in an array."
  },
  {
    "title": "Merge k Sorted Lists",
    "guides": [
      {
        "pattern": "heap",
        "approach": "Seed the heap with each nonempty list's head; pop the smallest and insert its successor."
      }
    ],
    "id": 70,
    "brief": "Merge k sorted linked lists into one sorted linked list."
  },
  {
    "title": "Find Median from Data Stream",
    "guides": [
      {
        "pattern": "heap",
        "approach": "Maintain a max-heap for the lower half and min-heap for the upper half, balancing their sizes after each insertion."
      }
    ],
    "id": 71,
    "brief": "Support adding numbers to a stream and querying the median of all values received so far."
  },
  {
    "title": "Subsets",
    "guides": [
      {
        "pattern": "backtracking",
        "approach": "Choose include/exclude per element and copy the path at each leaf."
      },
      {
        "pattern": "bitwise",
        "approach": "For small n, each mask represents one subset; include position i when its bit is set."
      }
    ],
    "id": 72,
    "brief": "Return every subset of an array of distinct integers, including the empty subset."
  },
  {
    "title": "Permutations",
    "guides": [
      {
        "pattern": "backtracking",
        "approach": "Track used positions; choose any unused value, recurse, and undo the choice."
      }
    ],
    "id": 73,
    "brief": "Return every possible ordering of an array of distinct integers."
  },
  {
    "title": "Combination Sum",
    "guides": [
      {
        "pattern": "backtracking",
        "approach": "Track a start index and remaining sum; with positive candidates, reuse a choice or move forward, pruning sums that exceed the target."
      }
    ],
    "id": 74,
    "brief": "Return distinct combinations of positive candidates that sum to the target. A candidate may be used more than once."
  },
  {
    "title": "N-Queens",
    "guides": [
      {
        "pattern": "backtracking",
        "approach": "Place one queen per row while maintaining used columns and both diagonal sets."
      }
    ],
    "id": 75,
    "brief": "Return every placement of n queens on an n×n board such that none share a row, column, or diagonal."
  },
  {
    "title": "Word Search",
    "guides": [
      {
        "pattern": "backtracking",
        "approach": "DFS adjacent cells matching the next character; mark a cell for the current path and restore it on backtracking."
      }
    ],
    "id": 76,
    "brief": "Determine whether a word can be formed through horizontally or vertically adjacent board cells without reusing a cell in one path."
  },
  {
    "title": "House Robber",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "Choose between skipping the current house and taking it plus the best total two positions earlier."
      }
    ],
    "id": 77,
    "brief": "Choose non-adjacent houses to maximize the sum of their stored money."
  },
  {
    "title": "Climbing Stairs",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "Ways to reach step i equal ways(i-1)+ways(i-2); choose base cases consistently."
      }
    ],
    "id": 78,
    "brief": "Count ways to climb n steps when each move climbs either one or two steps."
  },
  {
    "title": "Coin Change",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "dp[amount] is the fewest coins; minimize dp[amount-coin]+1 over valid coins, using an unreachable sentinel."
      }
    ],
    "id": 79,
    "brief": "Given positive coin denominations with unlimited supply, find the fewest coins making an amount, or -1 if impossible."
  },
  {
    "title": "Word Break",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "dp[i] records whether the prefix of length i can be segmented; try preceding cuts whose suffix is a dictionary word."
      }
    ],
    "id": 80,
    "brief": "Determine whether a string can be segmented completely into dictionary words; words may be reused."
  },
  {
    "title": "Longest Increasing Subsequence",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "Use dp[i] as the best subsequence ending at i for O(n²), or binary-search a tails array for O(n log n)."
      }
    ],
    "id": 81,
    "brief": "Find the length of the longest strictly increasing subsequence; chosen elements need not be adjacent."
  },
  {
    "title": "Maximum Subarray",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "Let bestEndingHere be the best nonempty sum ending at the current index. Choose between starting fresh and extending; track a global best, including all-negative inputs."
      }
    ],
    "id": 82,
    "brief": "Find the greatest sum of a nonempty contiguous subarray, including when all values are negative."
  },
  {
    "title": "Decode Ways",
    "guides": [
      {
        "pattern": "dp-1d",
        "approach": "Let dp[i] count decodings of a prefix. Add dp[i-1] for a valid single digit and dp[i-2] for a valid 10..26 pair; zero cannot decode on its own."
      }
    ],
    "id": 83,
    "brief": "Digits encode letters using 1 through 26. Count valid decodings of the entire string; a standalone zero is invalid."
  },
  {
    "title": "Longest Common Subsequence",
    "guides": [
      {
        "pattern": "dp-2d",
        "approach": "Matching trailing characters extend the diagonal; otherwise take the best of dropping either trailing character."
      }
    ],
    "id": 84,
    "brief": "Find the length of the longest subsequence common to two strings; selected characters retain order but need not be adjacent."
  },
  {
    "title": "Edit Distance",
    "guides": [
      {
        "pattern": "dp-2d",
        "approach": "Initialize empty-prefix edit costs; use minimum insertion, deletion, and substitution costs."
      }
    ],
    "id": 85,
    "brief": "Find the fewest single-character insertions, deletions, or replacements that transform one string into another."
  },
  {
    "title": "Unique Paths",
    "guides": [
      {
        "pattern": "dp-2d",
        "approach": "For each cell, add ways from above and left; obstacle variants set blocked cells to zero."
      }
    ],
    "id": 86,
    "brief": "Count routes from the top-left to bottom-right of an m×n grid when each move goes right or down."
  },
  {
    "title": "Interleaving String",
    "guides": [
      {
        "pattern": "dp-2d",
        "approach": "dp[i,j] checks whether prefixes of two strings form the target prefix of length i+j."
      }
    ],
    "id": 87,
    "brief": "Determine whether a third string can be formed by interleaving two strings while preserving each source's character order."
  },
  {
    "title": "Partition Equal Subset Sum",
    "guides": [
      {
        "pattern": "dp-2d",
        "approach": "Reduce to a subset-sum target of half the total; for positive inputs use a boolean array updated in descending sum order."
      }
    ],
    "id": 88,
    "brief": "Determine whether positive integers can be partitioned into two subsets with equal sums."
  },
  {
    "title": "Jump Game",
    "guides": [
      {
        "pattern": "greedy",
        "approach": "Maintain the farthest reachable index; fail if the next index lies beyond it."
      }
    ],
    "id": 89,
    "brief": "Each nonnegative value is the maximum forward jump from its position. Determine whether the last index is reachable from the first."
  },
  {
    "title": "Jump Game II",
    "guides": [
      {
        "pattern": "greedy",
        "approach": "Scan BFS-like reachable ranges; crossing the current range end commits one more jump."
      }
    ],
    "id": 90,
    "brief": "Find the minimum jumps needed to reach the final array index when each value is the maximum jump length; the input guarantees reachability."
  },
  {
    "title": "Gas Station",
    "guides": [
      {
        "pattern": "greedy",
        "approach": "If total gas is insufficient there is no solution; reset the candidate start after each negative running balance."
      }
    ],
    "id": 91,
    "brief": "Choose a starting station from which a car can complete a circular route with unlimited tank capacity, or return -1 if impossible."
  },
  {
    "title": "Partition Labels",
    "guides": [
      {
        "pattern": "greedy",
        "approach": "Precompute each character's last occurrence; extend a segment until all characters it contains end within that segment."
      }
    ],
    "id": 92,
    "brief": "Partition a string into as many contiguous parts as possible so each character appears in at most one part. Return their lengths."
  },
  {
    "title": "Implement Trie (Prefix Tree)",
    "guides": [
      {
        "pattern": "trie",
        "approach": "Insert character paths and mark complete words separately from prefixes."
      }
    ],
    "id": 93,
    "brief": "Implement a data structure supporting word insertion, exact-word search, and prefix lookup."
  },
  {
    "title": "Design Add and Search Words Data Structure",
    "guides": [
      {
        "pattern": "trie",
        "approach": "For a wildcard, branch to every child; for a literal, follow only its matching child."
      }
    ],
    "id": 94,
    "brief": "Store words and support searches where a dot matches any single character."
  },
  {
    "title": "Word Search II",
    "guides": [
      {
        "pattern": "trie",
        "approach": "Combine board backtracking with trie traversal; prune prefixes absent from the dictionary and deduplicate found words."
      }
    ],
    "id": 95,
    "brief": "Find all dictionary words that can be traced through four-directionally adjacent board cells, without reusing a cell in a word path."
  },
  {
    "title": "Replace Words",
    "guides": [
      {
        "pattern": "trie",
        "approach": "Walk each word from the trie root and stop at the first terminal node to use the shortest root."
      }
    ],
    "id": 96,
    "brief": "Replace each sentence word by its shortest dictionary root when that root is a prefix; keep words with no matching root."
  },
  {
    "title": "Single Number",
    "guides": [
      {
        "pattern": "bitwise",
        "approach": "XOR all numbers; paired duplicates cancel and the single value remains."
      }
    ],
    "id": 97,
    "brief": "Every integer appears exactly twice except one. Return the single value in linear time with constant extra space."
  },
  {
    "title": "Number of 1 Bits",
    "guides": [
      {
        "pattern": "bitwise",
        "approach": "Repeatedly clear the lowest set bit with n &= n-1; use unsigned input for predictable width semantics."
      }
    ],
    "id": 98,
    "brief": "Count the set bits in an unsigned binary integer."
  },
  {
    "title": "Counting Bits",
    "guides": [
      {
        "pattern": "bitwise",
        "approach": "Use bits[i]=bits[i>>1]+(i&1), or bits[i]=bits[i&(i-1)]+1."
      }
    ],
    "id": 99,
    "brief": "For every integer from 0 through n, return its number of set bits."
  },
  {
    "title": "Missing Number",
    "guides": [
      {
        "pattern": "bitwise",
        "approach": "XOR the numbers and all expected indices 0..n, or use a long arithmetic sum difference."
      }
    ],
    "id": 100,
    "brief": "An array contains distinct values from 0 through n with one value missing. Return the missing value."
  }
];
