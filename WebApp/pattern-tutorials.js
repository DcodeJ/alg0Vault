// Guided lessons are independent of the user's saved study data.
window.ALG0_TUTORIALS = {
  "sliding-window": {
    "definition": "A moving slice of an array or string. Reuse information about the current slice instead of checking every possible start and end.",
    "state": "A left boundary, a right boundary, and character counts or a set.",
    "walkthrough": [
      "Start with an empty window. Read a in abba: the window is a, so the best length becomes 1.",
      "Read b: ab is valid, so best becomes 2. The next b creates a duplicate; remove a and the old b before continuing.",
      "Read the final a: ba has length 2. Each character entered and left at most once, so the scan is linear."
    ],
    "question": "Can the usual sum-shrinking window safely handle arbitrary negative numbers?",
    "options": [
      "Yes, every sum window is monotone",
      "No, removing a negative can increase the sum"
    ],
    "answer": 1,
    "explanation": "A negative value breaks the monotonic relationship between moving a boundary and the sum. Prefix sums or a monotonic deque may be needed."
  },
  "fixed-window": {
    "definition": "A window whose width never changes. Remove the old contribution and add the new one at each step.",
    "state": "The window width k, its aggregate, and the best aggregate so far.",
    "walkthrough": [
      "For [2,1,5,1,3] with k=3, add the first three values: sum=8 and best=8.",
      "Move once: subtract 2 and add 1, giving sum=7. The window is now [1,5,1].",
      "Move again: subtract 1 and add 3, giving sum=9. Record 9 as the answer."
    ],
    "question": "What should initialize the maximum window sum?",
    "options": [
      "The first complete window sum",
      "Zero regardless of the input"
    ],
    "answer": 0,
    "explanation": "An all-negative array has a negative best sum. Starting at zero would invent an answer that is not a window."
  },
  "two-pointers": {
    "definition": "Two positions move through a sequence together. Ordering lets you rule out candidates without trying every pair.",
    "state": "Two indices and a rule explaining which pointer may move.",
    "walkthrough": [
      "For [1,2,4,7] and target 6, the end values sum to 8. Keeping 7 with any larger left value cannot help.",
      "Move right inward: 1+4=5, which is too small. Any smaller right value would only reduce it further.",
      "Move left inward: 2+4=6. Return these two positions."
    ],
    "question": "Why is moving the smaller pointer valid in sorted pair search?",
    "options": [
      "Because array values are ordered",
      "Because the target is positive"
    ],
    "answer": 0,
    "explanation": "Sorted order proves which whole set of pairs cannot work. Without it, the same movement rule is not justified."
  },
  "hash-map": {
    "definition": "A lookup table remembers earlier information, replacing repeated scans with expected constant-time queries.",
    "state": "A key describing the relationship and a value such as a count or index.",
    "walkthrough": [
      "For [2,7,11] and target 9, ask whether 7 has already appeared. It has not, so store 2 at index 0.",
      "At value 7, its complement is 2. The map returns index 0.",
      "Return [0,1]. Querying before inserting prevents the current position from matching itself."
    ],
    "question": "In Two Sum, when should you insert the current value?",
    "options": [
      "Before checking its complement",
      "After checking its complement"
    ],
    "answer": 1,
    "explanation": "Checking earlier values first guarantees two different positions, including when the values themselves are equal."
  },
  "prefix-sum": {
    "definition": "A running total turns a subarray sum into a difference of two totals. A map can count how often earlier totals occurred.",
    "state": "Current prefix sum, a frequency map, and a long answer counter.",
    "walkthrough": [
      "For [1,-1,1], target 1, seed sum 0 with frequency 1 to represent the empty prefix.",
      "The first prefix is 1: there is one earlier 0, giving one answer. The next prefix is 0: no earlier -1 matches.",
      "The final prefix is 1: there are now two earlier zeros, adding two answers. Total=3."
    ],
    "question": "Why store frequencies instead of just a set of prefix sums?",
    "options": [
      "Repeated prefixes represent different subarray starts",
      "A set cannot store negative integers"
    ],
    "answer": 0,
    "explanation": "Each occurrence is a distinct possible starting boundary. A set would count all equal prefixes only once."
  },
  "fast-slow": {
    "definition": "Two runners follow the same links at different speeds. If they are trapped in a cycle, the faster runner catches the slower one.",
    "state": "Slow and fast node references, with null checks before advancing twice.",
    "walkthrough": [
      "In A→B→C→B, both runners start at A.",
      "After one round slow is B and fast is C.",
      "After two rounds both are C. Meeting at the same node proves a cycle; equal node values alone do not."
    ],
    "question": "What proves that the runners met?",
    "options": [
      "Their node values match",
      "Their node references match"
    ],
    "answer": 1,
    "explanation": "Different nodes may contain equal values. The algorithm needs the same position in the linked structure."
  },
  "linked-reversal": {
    "definition": "Reverse the direction of links while keeping the remainder of the list reachable.",
    "state": "Previous, current, and a saved next node.",
    "walkthrough": [
      "Start with previous=null and current=1 for 1→2→3. Save next=2, then redirect 1 toward null.",
      "Advance to 2. Save 3 before redirecting 2 toward 1.",
      "Redirect 3 toward 2. Current becomes null; previous is the new head, 3."
    ],
    "question": "What must happen before overwriting current.Next?",
    "options": [
      "Save its old value",
      "Advance previous to the tail"
    ],
    "answer": 0,
    "explanation": "Otherwise the unprocessed suffix can become unreachable and the remaining nodes are lost from the traversal."
  },
  "intervals": {
    "definition": "Turn unordered ranges into a left-to-right scan by sorting their start positions.",
    "state": "A sorted copy and the last interval already merged.",
    "walkthrough": [
      "Sort [1,3], [2,6], [8,10] by starting point. Begin the result with [1,3].",
      "The next start, 2, is inside [1,3]. Extend the end to max(3,6)=6.",
      "The next start, 8, is after 6. Append [8,10] as a separate interval."
    ],
    "question": "Do closed intervals [1,2] and [2,3] overlap?",
    "options": [
      "Yes, they share endpoint 2",
      "No, only strict interior overlap counts"
    ],
    "answer": 0,
    "explanation": "Endpoint semantics are part of the problem. Closed intervals include their endpoints; half-open scheduling intervals may behave differently."
  },
  "binary-search": {
    "definition": "Repeatedly discard half the possible positions using a condition that changes in only one direction.",
    "state": "A half-open range [left,right) and a precisely defined boundary.",
    "walkthrough": [
      "Lower bound of 2 in [1,2,2,4] starts with [0,4). Midpoint 2 qualifies, so right becomes 2.",
      "Midpoint 1 qualifies too, so right becomes 1.",
      "Midpoint 0 is too small, so left becomes 1. Both bounds meet at the first matching position."
    ],
    "question": "What can lower bound return if every element is smaller than the target?",
    "options": [
      "The last valid index",
      "The array length"
    ],
    "answer": 1,
    "explanation": "The insertion boundary can be just beyond the array. Check it before reading the returned position."
  },
  "answer-search": {
    "definition": "Search the space of possible answers, not the input positions. A yes/no test says whether a candidate is feasible.",
    "state": "Low and high candidate values plus a monotone feasibility test.",
    "walkthrough": [
      "For weights [1,2,3,4] in 2 days, capacity is between 4 and 10.",
      "Capacity 5 needs [1,2], [3], [4]: three days, so it is too small.",
      "Capacity 6 needs [1,2,3], [4]: two days. Since smaller capacity 5 failed, 6 is minimal."
    ],
    "question": "What property makes answer-space binary search correct?",
    "options": [
      "Feasibility is monotone",
      "The original input must be sorted"
    ],
    "answer": 0,
    "explanation": "Once capacity is sufficient, larger capacities stay sufficient. Sorting packages would actually change this problem."
  },
  "monotonic-stack": {
    "definition": "A stack stores unresolved candidates in order. A new value can settle several earlier candidates at once.",
    "state": "Indices in increasing or decreasing value order, plus an answer array.",
    "walkthrough": [
      "For temperatures [70,71,69,72], push day 0. Day 1 is warmer, so pop day 0 and record a wait of 1.",
      "Push day 1, then day 2: 69 cannot resolve 71.",
      "Day 3 at 72 resolves day 2 after 1 day and day 1 after 2 days. Its own answer stays 0."
    ],
    "question": "Why is the nested popping loop still linear overall?",
    "options": [
      "Every index is pushed and popped at most once",
      "The stack always has one element"
    ],
    "answer": 0,
    "explanation": "Count total operations over the whole scan, rather than multiplying loop bounds that cannot all occur independently."
  },
  "monotonic-deque": {
    "definition": "A double-ended queue keeps only candidates that can still be the maximum or minimum of a moving window.",
    "state": "Candidate indices, with expiration at the front and domination removal at the back.",
    "walkthrough": [
      "For [1,3,-1,2] with k=3, 3 removes 1 from the back because it is larger and expires later.",
      "After reading -1, candidate values are [3,-1]. The first window maximum is the front value, 3.",
      "Reading 2 removes -1 from the back. Candidate 3 is still in the window, so the next maximum remains 3."
    ],
    "question": "Why store indices rather than only values?",
    "options": [
      "To know when candidates leave the window",
      "To sort the whole input first"
    ],
    "answer": 0,
    "explanation": "A value may appear multiple times; its position determines when it expires."
  },
  "tree-dfs": {
    "definition": "Solve smaller subtrees and combine what they return. The return value needs a precise meaning.",
    "state": "The current node and the results returned by its children.",
    "walkthrough": [
      "For depth, an empty subtree returns 0 and a leaf returns 1.",
      "A two-node branch returns 1+max(0,1)=2.",
      "A root with child depths 1 and 2 returns 1+max(1,2)=3."
    ],
    "question": "Does tree depth and tree diameter return the same quantity?",
    "options": [
      "Yes, always return the longest path",
      "No, height is returned while diameter can be tracked separately"
    ],
    "answer": 1,
    "explanation": "A parent needs a downward height. The best path through a node may use both child heights, so it is a different value."
  },
  "bfs": {
    "definition": "Explore states by distance from the start using a queue. First discovery gives the shortest path when every move has equal cost.",
    "state": "A queue and visited or distance data for each state.",
    "walkthrough": [
      "With edges 0→1, 0→2, 1→3, enqueue 0 at distance 0.",
      "Remove 0, discover 1 and 2 at distance 1, and mark them immediately.",
      "Remove 1 and discover 3 at distance 2. The queue processes all distance-1 states before distance-2 states."
    ],
    "question": "When should a vertex be marked discovered?",
    "options": [
      "When it is enqueued",
      "Only after all its neighbors are processed"
    ],
    "answer": 0,
    "explanation": "Marking on enqueue avoids adding the same vertex repeatedly through different parents."
  },
  "topological": {
    "definition": "Order directed dependencies so prerequisites are processed before their dependents.",
    "state": "Incoming-edge counts and a queue of vertices with no remaining prerequisites.",
    "walkthrough": [
      "With 0→2 and 1→2, indegrees are [0,0,2]. Enqueue 0 and 1.",
      "Processing 0 reduces indegree(2) to 1; 2 is not ready.",
      "Processing 1 reduces it to 0. Enqueue 2 and finish. Unprocessed vertices would indicate a cycle."
    ],
    "question": "What does removing fewer than V vertices imply?",
    "options": [
      "The directed graph contains a cycle",
      "The graph must be disconnected"
    ],
    "answer": 0,
    "explanation": "Disconnected acyclic components are still processed. A cycle leaves its vertices waiting on one another."
  },
  "union-find": {
    "definition": "Maintain groups that can merge. Each group has a representative, making connectivity checks cheap.",
    "state": "Parent links and component sizes or ranks.",
    "walkthrough": [
      "Begin with roots 0,1,2. Union(0,1) joins two components.",
      "Union(1,2) first finds 1's representative, then joins 2 to that component.",
      "Union(0,2) finds equal roots and reports no merge: these vertices were already connected."
    ],
    "question": "Can basic Union-Find return the shortest path between two vertices?",
    "options": [
      "No, it records connectivity, not paths",
      "Yes, parent links are the shortest path"
    ],
    "answer": 0,
    "explanation": "Its internal parent tree describes set representation, not the original graph's edges."
  },
  "dijkstra": {
    "definition": "Expand the currently cheapest reachable state. Nonnegative edge costs make that distance final.",
    "state": "Best distances and a min-priority queue; stale queue entries are skipped.",
    "walkthrough": [
      "For edges 0→1 cost 5, 0→2 cost 1, 2→1 cost 1, start with distance(0)=0.",
      "Expanding 0 gives tentative distances 5 and 1. Expand 2 next and improve distance(1) to 2.",
      "Expand 1 at cost 2. Later ignore its obsolete cost-5 queue entry."
    ],
    "question": "Why not use this guarantee with negative edges?",
    "options": [
      "A later path could reduce an already-finalized distance",
      "PriorityQueue cannot store negative numbers"
    ],
    "answer": 0,
    "explanation": "The failure is mathematical, not a queue limitation. Nonnegative costs prevent a later detour from becoming unexpectedly cheaper."
  },
  "heap": {
    "definition": "Keep the best next candidate available without fully sorting all candidates every time.",
    "state": "A priority queue whose root is the item you next need to remove.",
    "walkthrough": [
      "For [3,1,5,2] and k=2, keep 3 then 1 in a min-heap.",
      "Insert 5; size is now 3, so remove the smallest, 1. Retain 3 and 5.",
      "Insert 2 and remove it immediately as the smallest. The root, 3, is the second-largest value."
    ],
    "question": "Which heap keeps the k largest values efficiently?",
    "options": [
      "A min-heap of size k",
      "A max-heap from which you always remove the largest"
    ],
    "answer": 0,
    "explanation": "Remove the smallest retained candidate when space runs out. The heap root becomes the kth-largest boundary."
  },
  "backtracking": {
    "definition": "Explore a decision tree, undoing each choice before trying a different branch.",
    "state": "A partial answer, the remaining choices, and constraints.",
    "walkthrough": [
      "For subsets of [1,2], first exclude 1. Excluding and including 2 produce [] and [2].",
      "Undo that choice, include 1, and explore excluding and including 2 to produce [1] and [1,2].",
      "Copy each complete path into the output so later changes do not alter earlier answers."
    ],
    "question": "Why copy the current path when recording an answer?",
    "options": [
      "To avoid sharing a list that will keep changing",
      "To make an exponential output linear"
    ],
    "answer": 0,
    "explanation": "All answers would otherwise reference the same mutable object. Copying preserves each completed choice."
  },
  "dp-1d": {
    "definition": "Remember the best answer for smaller states so repeated decisions are solved only once.",
    "state": "A well-defined state, base cases, and a recurrence; sometimes only two prior states.",
    "walkthrough": [
      "For House Robber [2,7,9,3,1], the first two best totals are 2 and 7.",
      "At 9, compare skip=7 with take=2+9=11. At 3, compare skip=11 with take=7+3=10.",
      "At 1, compare skip=11 with take=11+1=12. The optimal total is 12."
    ],
    "question": "What should you define before writing a DP loop?",
    "options": [
      "Exactly what each state means",
      "Only the array dimensions"
    ],
    "answer": 0,
    "explanation": "The state definition determines transitions, base cases, iteration order, and which storage can be safely reused."
  },
  "dp-2d": {
    "definition": "Use two changing coordinates to describe a subproblem, often prefixes of two sequences.",
    "state": "A table indexed by the two prefix lengths, with empty-prefix boundaries.",
    "walkthrough": [
      "For LCS of abc and ac, initialize empty-prefix lengths to 0.",
      "Matching a extends the diagonal to length 1. The b row carries that best result without adding a match.",
      "Matching c extends the relevant diagonal to 2. Read the full-prefix cell as the answer."
    ],
    "question": "When trailing characters differ in LCS, what happens?",
    "options": [
      "Take the better result from dropping either trailing character",
      "Reset the cell to zero"
    ],
    "answer": 0,
    "explanation": "Subsequences may skip characters. Resetting to zero belongs to a different contiguous-substring recurrence."
  },
  "greedy": {
    "definition": "Commit to a local choice only after proving it cannot make a valid or optimal future solution worse.",
    "state": "A frontier or best local choice with a correctness argument.",
    "walkthrough": [
      "For Jump Game [2,3,1,1,4], index 0 makes indices up to 2 reachable.",
      "Index 1 is inside that frontier and extends it to 1+3=4.",
      "The last index is reachable. By contrast, if a future index exceeds the frontier, no earlier jump can reach it."
    ],
    "question": "What separates a correct greedy algorithm from a guess?",
    "options": [
      "A proof that the local choice is safe",
      "Passing one sample input"
    ],
    "answer": 0,
    "explanation": "Use an exchange argument or a maintained frontier. Counterexamples can defeat a plausible choice even when samples pass."
  },
  "trie": {
    "definition": "A tree whose paths represent prefixes, sharing work between words that start the same way.",
    "state": "A child map at each node and a separate complete-word marker.",
    "walkthrough": [
      "Insert apple by following or creating the path a→p→p→l→e, then mark e as a word ending.",
      "Walking app succeeds as a prefix, but its final node is not yet marked as a complete word.",
      "Insert app by reusing that same path and marking its ending. Now both prefix and exact searches succeed."
    ],
    "question": "Does finding a prefix path mean the complete word exists?",
    "options": [
      "No, the ending node must also be marked",
      "Yes, every node is automatically a word"
    ],
    "answer": 0,
    "explanation": "A prefix such as app may exist only because apple was inserted. Exact search checks the terminal marker."
  },
  "bitwise": {
    "definition": "Use binary identities to retain exactly the information a problem needs, such as parity or a set of flags.",
    "state": "An accumulator or mask, with an explicit integer width.",
    "walkthrough": [
      "For [4,1,2,1,2], combine all values with XOR.",
      "Reordering XOR is safe: pair the 1s and the 2s. Each pair cancels to zero.",
      "Only 4 remains. This reasoning depends on every other value appearing exactly twice."
    ],
    "question": "Does the same XOR template solve one-single-value with all others appearing three times?",
    "options": [
      "No, triples do not cancel to zero",
      "Yes, any repeated value cancels"
    ],
    "answer": 0,
    "explanation": "An odd number of equal XOR operands leaves that value behind. The multiplicity constraints are essential."
  }
};
