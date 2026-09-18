"""Execute the trusted, bundled Python reference snippets; never user storage."""
import json
import sys

samples = json.load(sys.stdin)
checks = {
    'sliding-window': 'assert longest_unique("abba") == 2; assert longest_unique("") == 0',
    'fixed-window': 'assert max_window_sum([2,1,5,1,3],3)==9; assert max_window_sum([-4,-2],1)==-2',
    'two-pointers': 'assert sorted_pair([1,2,4,7],6)==[1,2]; assert sorted_pair([],2)==[]',
    'hash-map': 'assert two_sum([3,3],6)==[0,1]; assert two_sum([],0)==[]',
    'prefix-sum': 'assert count_target_sums([1,-1,1],1)==3; assert count_target_sums([0,0],0)==3',
    'fast-slow': 'a=Node(); b=Node(); a.next=b; assert not has_cycle(a); b.next=a; assert has_cycle(a)',
    'linked-reversal': 'a=Node(1,Node(2)); r=reverse(a); assert r.value==2 and r.next is a and a.next is None; assert reverse(None) is None',
    'intervals': 'assert merge_intervals([[1,3],[2,6],[8,10]])==[[1,6],[8,10]]; assert merge_intervals([])==[]',
    'binary-search': 'assert lower_bound([1,2,2,4],2)==1; assert lower_bound([],2)==0',
    'answer-search': 'assert min_capacity([1,2,3,4],2)==6; assert min_capacity([],1)==0',
    'monotonic-stack': 'assert warmer_days([70,71,69,72])==[1,2,1,0]; assert warmer_days([5,5])==[0,0]',
    'monotonic-deque': 'assert window_maximum([1,3,-1,2],3)==[3,3]; assert window_maximum([4,4],1)==[4,4]',
    'tree-dfs': 'assert depth(None)==0; assert depth(Node(left=Node(),right=Node(right=Node())))==3',
    'bfs': 'assert distances([[1,2],[3],[],[]],0)==[0,1,1,2]; assert distances([[],[]],0)==[0,-1]',
    'topological': 'assert topological_order([[2],[2],[]])==[0,1,2]; assert topological_order([[0]])==[]',
    'union-find': 'd=DisjointSet(3); assert d.union(0,1); assert d.union(1,2); assert not d.union(0,2)',
    'dijkstra': 'assert shortest_paths([[(1,5),(2,1)],[],[(1,1)]],0)==[0,2,1]; assert shortest_paths([[],[]],0)[1]==float("inf")',
    'heap': 'assert kth_largest([3,1,5,2],2)==3; assert kth_largest([2,2,1],2)==2',
    'backtracking': 'assert sorted(subsets([1,2]))==sorted([[],[1],[2],[1,2]]); assert subsets([])==[[]]',
    'dp-1d': 'assert rob([2,7,9,3,1])==12; assert rob([])==0',
    'dp-2d': 'assert lcs_length("abcde","ace")==3; assert lcs_length("","a")==0',
    'greedy': 'assert can_reach_end([2,3,1,1,4]); assert not can_reach_end([3,2,1,0,4]); assert can_reach_end([0])',
    'trie': 't=Trie(); t.insert("apple"); assert t.starts_with("app") and not t.search("app"); t.insert("app"); assert t.search("app")',
    'bitwise': 'assert single_number([4,1,2,1,2])==4; assert single_number([-2,3,3])==-2',
}
sort_names = {
    'Bubble Sort': 'bubble_sort', 'Selection Sort': 'selection_sort',
    'Insertion Sort': 'insertion_sort', 'Merge Sort': 'merge_sort',
    'Quick Sort': 'quick_sort', 'Heap Sort': 'heap_sort',
    'Counting Sort': 'counting_sort', 'Radix Sort': 'radix_sort',
}
algorithm_checks = {
    'Binary Search': 'assert binary_search([1,3,5],3)==1; assert binary_search([],1)==-1',
    'Upper Bound': 'assert upper_bound([1,2,2,3],2)==3; assert upper_bound([],2)==0',
    "Kadane's Algorithm": 'assert max_subarray([-3,-2,-8])==-2; assert max_subarray([2,-1,4,-9])==5',
}
algorithm_checks.update({name: case['python'] for name, case in samples['catalogCases'].items()})
count = 0
algorithm_functions = {}
for name, pair in samples['patterns'].items():
    namespace = {}
    exec(compile(pair['python'], 'pattern:' + name, 'exec'), namespace)
    exec(checks[name], namespace)
    count += 1

import random
rng = random.Random(42)
for name, pair in samples['algorithms'].items():
    namespace = {}
    exec(compile(pair['python'], 'algorithm:' + name, 'exec'), namespace)
    algorithm_functions[name] = namespace
    if name in sort_names:
        sort = namespace[sort_names[name]]
        for values in [[], [0], [7,7,7], [5,4,3,2,1]] + [[rng.randrange(1000) for _ in range(n)] for n in range(30)]:
            working = values.copy()
            sort(working)
            assert working == sorted(values), name
        if name not in ['Counting Sort', 'Radix Sort']:
            values = [-4, 0, -9, 3, -4]
            assert sort(values.copy()) == sorted(values), name
    else:
        exec(algorithm_checks[name], namespace)
    count += 1
assert count == 103
print(f'Passed Python example checks for {count} snippets, including randomized sorting cases.')

# Differential checks use small, independently computed brute-force answers.
from itertools import combinations as choose, permutations as permute
from math import prod, isqrt, gcd as math_gcd, comb

def algorithm(title, function):
    return algorithm_functions[title][function]

properties = 0
def same(actual, expected, label):
    global properties
    assert actual == expected, (label, actual, expected)
    properties += 1

for _ in range(100):
    a = [rng.randrange(-4, 5) for _ in range(rng.randrange(8))]
    subsequences = [list(c) for n in range(len(a)+1) for c in choose(a, n)]
    lis = max(len(c) for c in subsequences if all(x < y for x, y in zip(c, c[1:])))
    same(algorithm('Longest Increasing Subsequence','lis_length')(a), lis, 'LIS')
    triples = sorted({tuple(sorted(c)) for c in choose(a,3) if sum(c)==0})
    same(algorithm('Three Sum','three_sum')(a), list(map(list,triples)), 'Three Sum')
    expected_products = [prod(a[:i]+a[i+1:]) for i in range(len(a))]
    same(algorithm('Product of Array Except Self','product_except_self')(a), expected_products, 'Product except self')
    if a:
        expected = max(prod(a[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1))
        same(algorithm('Maximum Product Subarray','max_product')(a), expected, 'Maximum product')
    expected = max([0]+[a[j]-a[i] for i in range(len(a)) for j in range(i+1,len(a))])
    same(algorithm('Best Time to Buy and Sell Stock','max_profit')(a), expected, 'Stock')
    expected = [next((x for x in a[i+1:] if x > value), -1) for i,value in enumerate(a)]
    same(algorithm('Next Greater Element','next_greater')(a), expected, 'Next greater')
    expected = 0
    for start in set(a):
        end = start
        while end in a:
            end += 1
        expected = max(expected,end-start)
    same(algorithm('Longest Consecutive Sequence','longest_consecutive')(a), expected, 'Consecutive')
    same(algorithm('Generate Permutations','permutations')(a[:5]), list(map(list, sorted(set(permute(a[:5]))))), 'Permutations')
    majority = next((x for x in a if a.count(x) > len(a)//2), None)
    same(algorithm('Boyer–Moore Majority Vote','majority_element')(a), majority, 'Majority')
    k = rng.randrange(len(set(a))+1)
    expected = sorted(set(a), key=lambda x:(a.count(x),x), reverse=True)[:k]
    same(algorithm('Top K Frequent Elements','top_k_frequent')(a,k), expected, 'Top K')
    rotation = rng.randrange(-20,21)
    shift = rotation % len(a) if a else 0
    working = a.copy()
    algorithm('Rotate Array','rotate_array')(working,rotation)
    same(working, a[-shift:]+a[:-shift] if shift else a, 'Rotate')
    working = a.copy()
    algorithm('Move Zeroes','move_zeroes')(working)
    same(working, [x for x in a if x != 0]+[0]*a.count(0), 'Move zeroes')
    working = sorted(a)
    length = algorithm('Remove Duplicates from Sorted Array','remove_duplicates')(working)
    same(working[:length], sorted(set(a)), 'Remove duplicates')
    colors = [rng.randrange(3) for _ in a]
    working = colors.copy()
    algorithm('Dutch National Flag Partition','dutch_flag')(working)
    same(working, sorted(colors), 'Dutch flag')
    prefix = algorithm('Prefix Sum Range Query','prefix_sums')(a)
    for left in range(len(a)):
        for right in range(left,len(a)):
            same(algorithm('Prefix Sum Range Query','range_sum')(prefix,left,right),sum(a[left:right+1]),'Range sum')

    heights = [abs(x) for x in a]
    water = max([0]+[(j-i)*min(heights[i],heights[j]) for i in range(len(a)) for j in range(i+1,len(a))])
    same(algorithm('Container With Most Water','max_water')(heights),water,'Container')
    trapped = sum(min(max(heights[:i+1]),max(heights[i:]))-height for i,height in enumerate(heights))
    same(algorithm('Trapping Rain Water','trapped_water')(heights),trapped,'Trapping rain')
    area = max([0]+[(j-i)*min(heights[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1)])
    same(algorithm('Largest Rectangle in Histogram','largest_rectangle')(heights),area,'Histogram')
    target = rng.randrange(1,16)
    lengths = [j-i for i in range(len(a)) for j in range(i+1,len(a)+1) if sum(heights[i:j])>=target]
    same(algorithm('Minimum Length Positive-Sum Window','min_window_length')(heights,target),min(lengths,default=0),'Minimum window')
    partition = any(2*sum(subset)==sum(heights) for n in range(len(a)+1) for subset in choose(heights,n))
    same(algorithm('Partition Equal Subset Sum','can_partition')(heights),partition,'Partition')
    paths = [None]*len(a)
    if paths:
        paths[0] = 0
    for i,jump in enumerate(heights):
        if paths[i] is not None:
            for j in range(i+1,min(len(a),i+jump+1)):
                paths[j] = min(paths[j],paths[i]+1) if paths[j] is not None else paths[i]+1
    same(algorithm('Minimum Jumps to Reach End','min_jumps')(heights),paths[-1] if paths and paths[-1] is not None else -1,'Minimum jumps')
    weights = [rng.randrange(4) for _ in a]
    capacity = rng.randrange(8)
    expected = max(sum(a[i] for i in ids) for n in range(len(a)+1) for ids in choose(range(len(a)),n) if sum(weights[i] for i in ids)<=capacity)
    same(algorithm('0/1 Knapsack','knapsack')(weights,a,capacity),expected,'Knapsack')

    text = ''.join(rng.choice('abc') for _ in a)
    pattern = ''.join(rng.choice('abc') for _ in range(rng.randrange(5)))
    same(algorithm('KMP String Search','kmp_search')(text,pattern),text.find(pattern),'KMP')
    expected = [i for i in range(len(text)-len(pattern)+1) if sorted(text[i:i+len(pattern)])==sorted(pattern)] if pattern else []
    same(algorithm('Find All Anagram Windows','find_anagrams')(text,pattern),expected,'Anagrams')
    z = [0]*len(text)
    for i in range(1,len(text)):
        while i+z[i]<len(text) and text[z[i]]==text[i+z[i]]:
            z[i] += 1
    same(algorithm('Z Algorithm','z_array')(text),z,'Z array')
    palindrome = algorithm('Longest Palindromic Substring','longest_palindrome')(text)
    length = max([0]+[j-i for i in range(len(text)) for j in range(i+1,len(text)+1) if text[i:j]==text[i:j][::-1]])
    same((len(palindrome),palindrome==palindrome[::-1],palindrome in text),(length,True,True),'Palindrome')
    encoded = algorithm('Run-Length Encoding','run_length_encode')(text)
    same(''.join(c*n for c,n in encoded),text,'RLE roundtrip')
    arrays = [sorted([rng.randrange(8) for _ in range(rng.randrange(5))]) for _ in range(4)]
    same(algorithm('Merge K Sorted Arrays','merge_k_arrays')(arrays),sorted(x for row in arrays for x in row),'Merge K')

for n in range(8):
    for k in range(n+1):
        same(algorithm('Generate K-Combinations','combinations')(n,k),list(map(list,choose(range(1,n+1),k))),'Combinations')
    valid = algorithm('Generate Balanced Parentheses','generate_parentheses')(n)
    same(len(set(valid)),comb(2*n,n)//(n+1),'Catalan count')
    for text in valid:
        balance = 0
        for char in text:
            balance += 1 if char=='(' else -1
            assert balance >= 0
        same((balance,len(text)),(0,2*n),'Balanced parentheses')
    for cols in range(8):
        same(algorithm('Unique Grid Paths','unique_paths')(n,cols),comb(n+cols-2,n-1) if n and cols else 0,'Grid paths')
    values = list(range(n))
    for shift in range(max(n,1)):
        rotated = values[shift:]+values[:shift]
        for target in range(-1,n+1):
            same(algorithm('Search Rotated Sorted Array','search_rotated')(rotated,target),rotated.index(target) if target in rotated else -1,'Rotated search')

for _ in range(100):
    x = rng.randrange(2**31)
    y = rng.randrange(-2**31,2**31)
    same(algorithm('Integer Square Root','integer_sqrt')(x),isqrt(x),'Integer sqrt')
    same(algorithm('Euclidean Greatest Common Divisor','gcd')(x,y),math_gcd(x,y),'GCD')
    exponent,modulus = rng.randrange(32),rng.randrange(1,1000)
    same(algorithm('Modular Exponentiation by Squaring','mod_power')(y,exponent,modulus),pow(y,exponent,modulus),'Modular power')
    same(algorithm('Count Set Bits (Kernighan)','count_set_bits')(x),x.bit_count(),'Set bits')
    n = rng.randrange(60)
    primes = [p for p in range(2,n+1) if all(p%d for d in range(2,isqrt(p)+1))]
    same(algorithm('Sieve of Eratosthenes','sieve')(n),primes,'Sieve')
    intervals = [(rng.randrange(-3,4),rng.randrange(1,5)) for _ in range(rng.randrange(7))]
    intervals = [(start,start+length) for start,length in intervals]
    best = 0
    for n in range(len(intervals)+1):
        for subset in choose(intervals,n):
            ordered = sorted(subset)
            if all(a[1]<=b[0] for a,b in zip(ordered,ordered[1:])):
                best = max(best,n)
    same(algorithm('Maximum Nonoverlapping Intervals','max_nonoverlapping')(intervals),best,'Interval scheduling')
    rooms = max([0]+[sum(start<=t<end for start,end in intervals) for t in range(-3,9)])
    same(algorithm('Minimum Meeting Rooms','meeting_rooms')(intervals),rooms,'Meeting rooms')

for _ in range(40):
    n = rng.randrange(1,7)
    edges = [(i,j,rng.randrange(6)) for i in range(n) for j in range(n) if i!=j and rng.random()<.3]
    matrix = [[None]*n for _ in range(n)]
    for u,v,w in edges:
        matrix[u][v] = w
    all_pairs = algorithm('Floyd–Warshall All-Pairs Shortest Paths','floyd_warshall')(matrix)
    for source in range(n):
        same(algorithm('Bellman-Ford Shortest Paths','bellman_ford')(n,edges,source),all_pairs[source],'Bellman vs Floyd')
    undirected = [(u,v,w-2) for u,v,w in edges if u<v]
    matrix = [[None]*n for _ in range(n)]
    graph = [[] for _ in range(n)]
    for u,v,w in undirected:
        matrix[u][v] = matrix[v][u] = w
        graph[u].append(v)
        graph[v].append(u)
    same(algorithm('Prim Minimum Spanning Tree (Dense)','prim_mst')(matrix),algorithm("Kruskal's Minimum Spanning Tree",'kruskal')(n,undirected),'Prim vs Kruskal')
    sources = sorted(set(rng.randrange(n) for _ in range(3)))
    distance = algorithm('Multi-Source BFS Distances','multi_source_bfs')(graph,sources)
    expected = [-1]*n
    for source in sources:
        expected[source] = 0
    for _ in range(n):
        for u in range(n):
            if expected[u] >= 0:
                for v in graph[u]:
                    if expected[v]<0 or expected[v]>expected[u]+1:
                        expected[v]=expected[u]+1
    same(distance,expected,'Multi-source BFS')
    reachable = set(algorithm('Depth-First Search','dfs')(graph,0))
    same(reachable,{i for i,d in enumerate(algorithm('Multi-Source BFS Distances','multi_source_bfs')(graph,[0])) if d>=0},'DFS coverage')

invalid = [
    ('Coin Change','coin_change',([0,1],4)),
    ('Coin Change','coin_change',([1],-1)),
    ('0/1 Knapsack','knapsack',([-1],[3],2)),
    ('Top K Frequent Elements','top_k_frequent',([1],2)),
    ('Remove Nth Node From End','remove_nth',(None,1)),
    ('Search Row and Column Sorted Matrix','search_matrix',([[1],[2,3]],2)),
    ('Dutch National Flag Partition','dutch_flag',([0,3],)),
    ('Maximum Product Subarray','max_product',([],)),
    ('Minimum Length Positive-Sum Window','min_window_length',([1],0)),
    ('Minimum Length Positive-Sum Window','min_window_length',([-1],1)),
    ('Count Set Bits (Kernighan)','count_set_bits',(-1,)),
    ('Modular Exponentiation by Squaring','mod_power',(2,-1,7)),
    ('Modular Exponentiation by Squaring','mod_power',(2,3,0)),
    ('Partition Equal Subset Sum','can_partition',([-1,1],)),
    ('Decode Ways','decode_ways',('1a',)),
    ('Find All Anagram Windows','find_anagrams',('ABC','a')),
    ('Maximum Nonoverlapping Intervals','max_nonoverlapping',([(1,1)],)),
    ('Combination Sum (Reusable Candidates)','combination_sum',([0],2)),
    ('Generate K-Combinations','combinations',(2,3)),
    ('Largest Rectangle in Histogram','largest_rectangle',([-1],)),
]
for title,function,args in invalid:
    try:
        algorithm(title,function)(*args)
    except ValueError:
        properties += 1
    else:
        raise AssertionError('Expected input validation: '+title)
print(f'Passed {properties} additional randomized, boundary, and invalid-input checks.')
