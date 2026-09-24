// Original C# teaching implementations. Each snippet is a member of a static class.
// [id,title,category,tier,time,space,summary,notes,code,test statements]
module.exports = [
['upper-bound','Upper Bound','Searching','Essential','O(log n)','O(1)','Find the first index whose value is greater than the target.','Requires ascending sorted input. Returns Length when no value is greater. Compare with Lower Bound for duplicate ranges.',`public static int UpperBound(int[] a, int target)
{
    int lo = 0, hi = a.Length;
    while (lo < hi) { int mid = lo + (hi-lo)/2; if (a[mid] <= target) lo = mid+1; else hi = mid; }
    return lo;
}`,`Check(UpperBound([1,2,2,4],2)==3); Check(UpperBound([],2)==0); Check(UpperBound([2],2)==1);`],
['rotated-search','Search Rotated Sorted Array','Searching','Core','O(log n)','O(1)','Search a rotated ascending array by identifying the sorted half.','Assumes distinct values. Duplicates need different handling and can degrade worst-case time.',`public static int Search(int[] a, int target)
{
    int lo=0, hi=a.Length-1;
    while(lo<=hi) {
        int mid=lo+(hi-lo)/2; if(a[mid]==target) return mid;
        if(a[lo]<=a[mid]) { if(a[lo]<=target && target<a[mid]) hi=mid-1; else lo=mid+1; }
        else { if(a[mid]<target && target<=a[hi]) lo=mid+1; else hi=mid-1; }
    }
    return -1;
}`,`Check(Search([4,5,6,1,2,3],2)==4); Check(Search([],1)==-1); Check(Search([1],2)==-1);`],
['integer-sqrt','Integer Square Root','Searching','Core','O(log n)','O(1)','Binary-search the largest integer whose square does not exceed n.','Rejects negative input. Uses long multiplication to avoid overflow for int inputs.',`public static int Sqrt(int n)
{
    if(n<0) throw new ArgumentOutOfRangeException(nameof(n));
    long lo=0, hi=n, answer=0;
    while(lo<=hi) { long mid=lo+(hi-lo)/2; if(mid*mid<=n) { answer=mid; lo=mid+1; } else hi=mid-1; }
    return (int)answer;
}`,`Check(Sqrt(8)==2); Check(Sqrt(0)==0); Check(Sqrt(int.MaxValue)==46340);`],
['matrix-search','Search Row and Column Sorted Matrix','Searching','Core','O(rows + columns)','O(1)','Eliminate a row or column at each step from the top-right corner.','Each row and each column must be ascending. This is different from treating a globally sorted matrix as a flattened array.',`public static bool Contains(int[,] a, int target)
{
    int r=0,c=a.GetLength(1)-1;
    while(r<a.GetLength(0) && c>=0) { if(a[r,c]==target) return true; if(a[r,c]>target) c--; else r++; }
    return false;
}`,`Check(Contains(new int[,]{{1,4,7},{2,5,9}},5)); Check(!Contains(new int[,]{{1,4},{2,5}},3)); Check(!Contains(new int[0,0],1));`],
['move-zeroes','Move Zeroes','Arrays','Essential','O(n)','O(1)','Compact nonzero values while preserving their order, then fill the remaining suffix with zeroes.','Mutates the input. Keep the write pointer no farther than the read position.',`public static void MoveZeroes(int[] a)
{
    int write=0;
    for(int read=0;read<a.Length;read++) if(a[read]!=0) a[write++]=a[read];
    while(write<a.Length) a[write++]=0;
}`,`int[] a=[0,1,0,3,12]; MoveZeroes(a); Check(a.SequenceEqual([1,3,12,0,0])); MoveZeroes([]);`],
['sorted-dedup','Remove Duplicates from Sorted Array','Arrays','Essential','O(n)','O(1)','Keep one copy of each value using read and write pointers.','Input must be sorted. Returns the valid prefix length; values beyond that prefix are unspecified.',`public static int Unique(int[] a)
{
    if(a.Length==0) return 0;
    int write=1;
    for(int read=1;read<a.Length;read++) if(a[read]!=a[write-1]) a[write++]=a[read];
    return write;
}`,`int[] a=[1,1,2,2,3]; Check(Unique(a)==3); Check(a.Take(3).SequenceEqual([1,2,3])); Check(Unique([])==0);`],
['dutch-flag','Dutch National Flag Partition','Arrays','Core','O(n)','O(1)','Partition an array of 0, 1 and 2 using three regions.','Mutates the input. After swapping a 2 to the end, inspect the newly swapped value before advancing mid.',`public static void SortColors(int[] a)
{
    if(a.Any(x=>x<0 || x>2)) throw new ArgumentException("Only 0, 1 and 2 allowed");
    int low=0,mid=0,high=a.Length-1;
    while(mid<=high) {
        if(a[mid]==0) { (a[low],a[mid])=(a[mid],a[low]); low++; mid++; }
        else if(a[mid]==1) mid++;
        else { (a[mid],a[high])=(a[high],a[mid]); high--; }
    }
}`,`int[] a=[2,0,2,1,1,0]; SortColors(a); Check(a.SequenceEqual([0,0,1,1,2,2])); SortColors([]);`],
['majority-vote','Boyer–Moore Majority Vote','Arrays','Core','O(n)','O(1)','Cancel different values to find a candidate occurring more than half the time.','A second pass verifies the candidate because a majority is not guaranteed. Returns null when absent.',`public static int? Majority(int[] a)
{
    int candidate=0,votes=0;
    foreach(int x in a) { if(votes==0) candidate=x; votes += x==candidate ? 1 : -1; }
    return a.Count(x=>x==candidate)>a.Length/2 ? candidate : null;
}`,`Check(Majority([2,2,1,2])==2); Check(Majority([1,2]) is null); Check(Majority([]) is null);`],
['max-product','Maximum Product Subarray','Dynamic Programming','Core','O(n)','O(1)','Track both the maximum and minimum ending products because multiplying by a negative flips signs.','Nonempty input required. Uses checked long arithmetic; overflow throws instead of silently wrapping.',`public static long MaxProduct(int[] a)
{
    if(a.Length==0) throw new ArgumentException("Nonempty input required");
    long max=a[0],min=a[0],best=a[0];
    for(int i=1;i<a.Length;i++) { long x=a[i],p=checked(max*x),q=checked(min*x); max=Math.Max(x,Math.Max(p,q)); min=Math.Min(x,Math.Min(p,q)); best=Math.Max(best,max); }
    return best;
}`,`Check(MaxProduct([2,3,-2,4])==6); Check(MaxProduct([-2,3,-4])==24); Check(MaxProduct([0,-2,0])==0);`],
['min-window-sum','Minimum Length Positive-Sum Window','Arrays','Core','O(n)','O(1)','Shrink a nonnegative window while its sum reaches a positive target.','Target must be positive and elements nonnegative. Negative elements invalidate the monotonic window argument.',`public static int MinLength(int[] a, long target)
{
    if(target<=0 || a.Any(x=>x<0)) throw new ArgumentException("Positive target and nonnegative values required");
    int left=0,best=int.MaxValue; long sum=0;
    for(int right=0;right<a.Length;right++) { sum+=a[right]; while(sum>=target) { best=Math.Min(best,right-left+1); sum-=a[left++]; } }
    return best==int.MaxValue ? 0 : best;
}`,`Check(MinLength([2,3,1,2,4,3],7)==2); Check(MinLength([0,0,5],5)==1); Check(MinLength([],4)==0);`],
['floyd-warshall','Floyd–Warshall All-Pairs Shortest Paths','Graphs','Advanced','O(V³)','O(V²)','Relax all source/destination pairs through each possible intermediate vertex.','Matrix uses null for no edge; negative edges are allowed but negative cycles are rejected. Returns a copy; checked addition detects overflow.',`public static long?[,] Distances(long?[,] edges)
{
    int n=edges.GetLength(0); if(n!=edges.GetLength(1)) throw new ArgumentException("Square matrix required");
    var d=(long?[,])edges.Clone();
    for(int i=0;i<n;i++) d[i,i]=Math.Min(d[i,i]??0,0);
    for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)
        if(d[i,k] is long x && d[k,j] is long y) { long z=checked(x+y); if(d[i,j] is null || z<d[i,j]) d[i,j]=z; }
    for(int i=0;i<n;i++) if(d[i,i]<0) throw new ArgumentException("Negative cycle");
    return d;
}`,`var d=Distances(new long?[,]{{0,3,null},{null,0,2},{null,null,0}}); Check(d[0,2]==5); Check(d[2,0] is null);`],
['bipartite','Bipartite Graph Check','Graphs','Core','O(V + E)','O(V)','Color every connected component with two colors using BFS.','Adjacency lists must describe an undirected graph with valid vertex indices. Self-loops fail the check.',`public static bool IsBipartite(int[][] graph)
{
    int[] color=Enumerable.Repeat(-1,graph.Length).ToArray(); var q=new Queue<int>();
    for(int start=0;start<graph.Length;start++) if(color[start]<0) {
        color[start]=0; q.Enqueue(start);
        while(q.Count>0) { int v=q.Dequeue(); foreach(int u in graph[v]) { if(color[u]<0) { color[u]=1-color[v]; q.Enqueue(u); } else if(color[u]==color[v]) return false; } }
    }
    return true;
}`,`Check(IsBipartite([[1],[0],[]])); Check(!IsBipartite([[1,2],[0,2],[0,1]])); Check(IsBipartite([]));`],
['components','Count Undirected Connected Components','Graphs','Essential','O(V + E)','O(V)','Start a traversal from each unvisited vertex and count the starts.','Undirected adjacency lists with valid indices; isolated vertices are their own components. Mark on enqueue to avoid duplicates.',`public static int Components(int[][] graph)
{
    bool[] seen=new bool[graph.Length]; var q=new Queue<int>(); int count=0;
    for(int s=0;s<graph.Length;s++) if(!seen[s]) {
        count++; seen[s]=true; q.Enqueue(s);
        while(q.Count>0) foreach(int u in graph[q.Dequeue()]) if(!seen[u]) { seen[u]=true; q.Enqueue(u); }
    }
    return count;
}`,`Check(Components([[1],[0],[]])==2); Check(Components([])==0);`],
['prim','Prim Minimum Spanning Tree (Dense)','Graphs','Advanced','O(V²)','O(V)','Grow a minimum spanning tree by repeatedly choosing the cheapest connection to a new vertex.','Symmetric square matrix with null for no edge. Returns null if disconnected; negative and zero weights are allowed.',`public static long? Mst(long?[,] weights)
{
    int n=weights.GetLength(0); if(n!=weights.GetLength(1)) throw new ArgumentException("Square matrix required");
    if(n==0) return 0;
    long?[] best=new long?[n]; bool[] used=new bool[n]; best[0]=0; long total=0;
    for(int step=0;step<n;step++) {
        int v=-1;
        for(int i=0;i<n;i++) if(!used[i] && best[i].HasValue && (v<0 || best[i]<best[v])) v=i;
        if(v<0) return null; used[v]=true; total=checked(total+best[v]!.Value);
        for(int u=0;u<n;u++) if(!used[u] && weights[v,u] is long w && (best[u] is null || w<best[u])) best[u]=w;
    }
    return total;
}`,`Check(Mst(new long?[,]{{0,1,4},{1,0,2},{4,2,0}})==3); Check(Mst(new long?[,]{{0,null},{null,0}}) is null);`],
['multi-source','Multi-Source BFS Distances','Graphs','Core','O(V + E + S)','O(V)','Seed a queue with all sources to find distance to the nearest source in an unweighted graph.','Valid vertex indices required. Unreachable vertices get -1. Duplicate sources are ignored; S is source count.',`public static int[] Nearest(int[][] graph, int[] sources)
{
    int[] d=Enumerable.Repeat(-1,graph.Length).ToArray(); var q=new Queue<int>();
    foreach(int s in sources) if(d[s]<0) { d[s]=0; q.Enqueue(s); }
    while(q.Count>0) { int v=q.Dequeue(); foreach(int u in graph[v]) if(d[u]<0) { d[u]=d[v]+1; q.Enqueue(u); } }
    return d;
}`,`Check(Nearest([[1],[0,2],[1,3],[2]],[0,3]).SequenceEqual([0,1,1,0])); Check(Nearest([[]],[])[0]==-1);`],
['gcd','Euclidean Greatest Common Divisor','Math','Essential','O(log min(|a|, |b|)) for nonzero inputs','O(1)','Repeatedly replace a pair by the divisor and remainder.','Accepts int inputs and uses long absolute values to handle int.MinValue. Defines gcd(0,0) as 0.',`public static long Gcd(int a,int b)
{
    long x=Math.Abs((long)a),y=Math.Abs((long)b);
    while(y!=0) { (x,y)=(y,x%y); }
    return x;
}`,`Check(Gcd(48,18)==6); Check(Gcd(0,0)==0); Check(Gcd(int.MinValue,0)==2147483648L);`],
['sieve','Sieve of Eratosthenes','Math','Core','O(n log log n)','O(n)','Mark composites to enumerate all primes up to a limit.','Uses memory proportional to n; choose a practical limit. Begin marking at p² because smaller multiples were already handled.',`public static int[] Primes(int n)
{
    if(n<2) return [];
    bool[] composite=new bool[checked(n+1)];
    for(int p=2;p<=n/p;p++) if(!composite[p]) for(long k=(long)p*p;k<=n;k+=p) composite[(int)k]=true;
    return Enumerable.Range(2,n-1).Where(x=>!composite[x]).ToArray();
}`,`Check(Primes(10).SequenceEqual([2,3,5,7])); Check(Primes(1).Length==0);`],
['mod-power','Modular Exponentiation by Squaring','Math','Core','O(log exponent)','O(1)','Square the base and consume exponent bits to compute powers modulo m.','Nonnegative exponent and positive int modulus. Long products safely cover products of reduced int-sized residues. Not a cryptographic implementation.',`public static int Power(int value,long exponent,int modulus)
{
    if(exponent<0 || modulus<=0) throw new ArgumentException("Invalid exponent or modulus");
    long b=((long)value%modulus+modulus)%modulus,answer=1%modulus;
    while(exponent>0) { if((exponent&1)!=0) answer=answer*b%modulus; b=b*b%modulus; exponent>>=1; }
    return (int)answer;
}`,`Check(Power(2,10,1000)==24); Check(Power(-2,3,5)==2); Check(Power(9,0,1)==0);`],
['count-bits','Count Set Bits (Kernighan)','Bit Manipulation','Essential','O(number of set bits)','O(1)','Clear the lowest set bit until the value becomes zero.','Uses uint to make the bit representation and right-domain behavior explicit. Zero has no set bits.',`public static int BitCount(uint value)
{
    int count=0; while(value!=0) { value &= value-1; count++; } return count;
}`,`Check(BitCount(0)==0); Check(BitCount(15)==4); Check(BitCount(uint.MaxValue)==32);`],
['single-number','Single Number with XOR','Bit Manipulation','Core','O(n)','O(1)','Cancel pairs using XOR to find the one unpaired value.','Requires exactly one value appearing once and all others exactly twice. The method does not validate that precondition.',`public static int Single(int[] a)
{
    int result=0; foreach(int x in a) result^=x; return result;
}`,`Check(Single([4,1,2,1,2])==4); Check(Single([-3,7,7])==-3);`],
['unique-paths','Unique Grid Paths','Dynamic Programming','Essential','O(rows × columns)','O(columns)','Count right/down paths through a rectangular grid with a one-row DP.','Nonnegative dimensions; zero dimension means zero paths. Checked long addition rejects counts too large to represent.',`public static long Paths(int rows,int columns)
{
    if(rows<0 || columns<0) throw new ArgumentOutOfRangeException();
    if(rows==0 || columns==0) return 0;
    long[] dp=Enumerable.Repeat(1L,columns).ToArray();
    for(int r=1;r<rows;r++) for(int c=1;c<columns;c++) dp[c]=checked(dp[c]+dp[c-1]);
    return dp[^1];
}`,`Check(Paths(3,7)==28); Check(Paths(0,4)==0); Check(Paths(1,1)==1);`],
['min-path','Minimum Grid Path Sum','Dynamic Programming','Core','O(rows × columns)','O(columns)','Choose the cheaper of the top and left path for each cell.','Allows negative cell values because paths only move right/down and cannot cycle. Empty grid returns 0.',`public static long MinPath(int[,] a)
{
    int rows=a.GetLength(0),cols=a.GetLength(1); if(rows==0 || cols==0) return 0;
    long[] dp=new long[cols];
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) {
        long prior=r==0 ? (c==0?0:dp[c-1]) : c==0 ? dp[c] : Math.Min(dp[c],dp[c-1]);
        dp[c]=checked(prior+a[r,c]);
    }
    return dp[^1];
}`,`Check(MinPath(new int[,]{{1,3,1},{1,5,1},{4,2,1}})==7); Check(MinPath(new int[0,0])==0);`],
['partition','Partition Equal Subset Sum','Dynamic Programming','Core','O(n × sum)','O(sum)','Reduce equal partitioning to finding a subset with half the total sum.','Nonnegative integers only; pseudo-polynomial memory makes large sums impractical. Iterate backwards to use each input once.',`public static bool CanPartition(int[] a)
{
    if(a.Any(x=>x<0)) throw new ArgumentException("Nonnegative values required");
    long total=a.Sum(x=>(long)x); if(total%2!=0) return false;
    int target=checked((int)(total/2)); bool[] dp=new bool[checked(target+1)]; dp[0]=true;
    foreach(int x in a) for(int s=target;s>=x;s--) dp[s]|=dp[s-x];
    return dp[target];
}`,`Check(CanPartition([1,5,11,5])); Check(!CanPartition([1,2,5])); Check(CanPartition([]));`],
['word-break','Word Break','Dynamic Programming','Core','O(n³) worst-case with substring allocation/hashing','O(n) auxiliary, excluding dictionary','Mark prefixes that can be segmented into dictionary words.','Empty text is segmentable. This straightforward C# version allocates substrings; do not claim O(n²) character work.',`public static bool CanBreak(string text,HashSet<string> words)
{
    bool[] dp=new bool[text.Length+1]; dp[0]=true;
    for(int end=1;end<=text.Length;end++) for(int start=0;start<end;start++)
        if(dp[start] && words.Contains(text[start..end])) { dp[end]=true; break; }
    return dp[^1];
}`,`Check(CanBreak("leetcode",new(){"leet","code"})); Check(!CanBreak("catsandog",new(){"cats","dog","sand","and","cat"}));`],
['decode-ways','Decode Ways','Dynamic Programming','Core','O(n)','O(1)','Count decodings when 1 through 26 represent letters.','ASCII digits only. Leading zeroes are invalid; empty input returns 0. Checked arithmetic detects long overflow.',`public static long Decode(string s)
{
    if(s.Any(c=>c<'0'||c>'9')) throw new ArgumentException("Digits required");
    if(s.Length==0 || s[0]=='0') return 0;
    long previous=1,current=1;
    for(int i=1;i<s.Length;i++) { long next=s[i]=='0'?0:current; int pair=(s[i-1]-'0')*10+s[i]-'0'; if(pair>=10 && pair<=26) next=checked(next+previous); previous=current; current=next; }
    return current;
}`,`Check(Decode("226")==3); Check(Decode("06")==0); Check(Decode("10")==1); Check(Decode("")==0);`],
['palindrome-expand','Longest Palindromic Substring','Strings','Core','O(n²)','O(1) auxiliary, O(n) returned text','Expand around every odd and even center to find the longest palindrome.','Compares UTF-16 code units, not full Unicode grapheme clusters. On ties keeps the first discovered longest substring.',`public static string LongestPalindrome(string s)
{
    int start=0,length=0;
    void Expand(int l,int r) { while(l>=0 && r<s.Length && s[l]==s[r]) { if(r-l+1>length) { start=l; length=r-l+1; } l--;r++; } }
    for(int i=0;i<s.Length;i++) { Expand(i,i); Expand(i,i+1); }
    return s.Substring(start,length);
}`,`Check(LongestPalindrome("babad")=="bab"); Check(LongestPalindrome("cbbd")=="bb"); Check(LongestPalindrome("")=="");`],
['z-array','Z Algorithm','Strings','Advanced','O(n)','O(n)','For each position, measure how much of the prefix matches there.','Maintains a rightmost matching interval to reuse previous work. z[0] is defined as 0 here.',`public static int[] Z(string s)
{
    int[] z=new int[s.Length]; int l=0,r=0;
    for(int i=1;i<s.Length;i++) {
        if(i<=r) z[i]=Math.Min(r-i+1,z[i-l]);
        while(i+z[i]<s.Length && s[z[i]]==s[i+z[i]]) z[i]++;
        if(i+z[i]-1>r) { l=i;r=i+z[i]-1; }
    }
    return z;
}`,`Check(Z("aaaaa").SequenceEqual([0,4,3,2,1])); Check(Z("").Length==0); Check(Z("abcd").All(x=>x==0));`],
['anagram-windows','Find All Anagram Windows','Strings','Core','O(n + m) for fixed alphabet','O(1) auxiliary, excluding output','Compare character counts for each window the length of the pattern.','Lowercase ASCII a–z only. Empty pattern returns no windows. The 26-entry count comparison is a constant factor.',`public static int[] Anagrams(string text,string pattern)
{
    if(text.Any(c=>c<'a'||c>'z') || pattern.Any(c=>c<'a'||c>'z')) throw new ArgumentException("Lowercase ASCII required");
    int m=pattern.Length; if(m==0 || m>text.Length) return [];
    int[] want=new int[26],have=new int[26]; foreach(char c in pattern) want[c-'a']++;
    var answer=new List<int>();
    for(int i=0;i<text.Length;i++) { have[text[i]-'a']++; if(i>=m) have[text[i-m]-'a']--; if(i>=m-1 && have.SequenceEqual(want)) answer.Add(i-m+1); }
    return answer.ToArray();
}`,`Check(Anagrams("cbaebabacd","abc").SequenceEqual([0,6])); Check(Anagrams("aaaa","aa").SequenceEqual([0,1,2]));`],
['run-length','Run-Length Encoding','Strings','Essential','O(n)','O(n) output','Compress consecutive equal characters into character/count pairs.','Returns structured pairs rather than ambiguous concatenated text. Operates on UTF-16 chars, not user-perceived characters.',`public static (char Value,int Count)[] Encode(string s)
{
    var result=new List<(char,int)>();
    for(int i=0;i<s.Length;) { int end=i+1; while(end<s.Length && s[end]==s[i]) end++; result.Add((s[i],end-i)); i=end; }
    return result.ToArray();
}`,`Check(Encode("aaabb").SequenceEqual(new[]{('a',3),('b',2)})); Check(Encode("").Length==0);`],
['k-way-merge','Merge K Sorted Arrays','Heaps','Core','O(N log(k + 1))','O(k) auxiliary, O(N) output','Use a min-priority queue to take the next smallest value among sorted arrays.','Every input array must be ascending. Empty arrays are allowed; N is the total number of values.',`public static int[] Merge(int[][] arrays)
{
    var q=new PriorityQueue<(int A,int I),int>(); var result=new List<int>();
    for(int a=0;a<arrays.Length;a++) if(arrays[a].Length>0) q.Enqueue((a,0),arrays[a][0]);
    while(q.Count>0) { var (a,i)=q.Dequeue(); result.Add(arrays[a][i]); if(i+1<arrays[a].Length) q.Enqueue((a,i+1),arrays[a][i+1]); }
    return result.ToArray();
}`,`Check(Merge([[1,4],[],[2,3]]).SequenceEqual([1,2,3,4])); Check(Merge([]).Length==0);`],
['kth-largest','Kth Largest with a Bounded Heap','Heaps','Core','O(n log(k + 1))','O(k)','Keep only the largest k values in a min-heap.','k is one-based and must lie between 1 and n. Duplicates count separately; input is not modified.',`public static int KthLargest(int[] a,int k)
{
    if(k<1 || k>a.Length) throw new ArgumentOutOfRangeException(nameof(k));
    var q=new PriorityQueue<int,int>();
    foreach(int x in a) { q.Enqueue(x,x); if(q.Count>k) q.Dequeue(); }
    return q.Peek();
}`,`Check(KthLargest([3,2,1,5,6,4],2)==5); Check(KthLargest([2,2,1],2)==2);`],
['interval-scheduling','Maximum Nonoverlapping Intervals','Greedy','Essential','O(n log n)','O(n)','Choose the earliest-finishing compatible interval repeatedly.','Intervals are half-open [start,end); touching endpoints are compatible. Requires start < end. Sorts a copy.',`public static int SelectIntervals((int Start,int End)[] intervals)
{
    if(intervals.Any(x=>x.Start>=x.End)) throw new ArgumentException("Start must precede end");
    int count=0; long end=long.MinValue;
    foreach(var x in intervals.OrderBy(x=>x.End)) if(x.Start>=end) { count++;end=x.End; }
    return count;
}`,`Check(SelectIntervals([(1,3),(2,4),(3,5)])==2); Check(SelectIntervals([])==0);`],
['meeting-rooms','Minimum Meeting Rooms','Greedy','Core','O(n log n)','O(n)','Sweep sorted start and end times to find the maximum simultaneous meetings.','Half-open intervals: a meeting ending at t frees its room before a meeting starting at t. Requires start < end.',`public static int Rooms((int Start,int End)[] meetings)
{
    if(meetings.Any(x=>x.Start>=x.End)) throw new ArgumentException("Invalid interval");
    var starts=meetings.Select(x=>x.Start).Order().ToArray(); var ends=meetings.Select(x=>x.End).Order().ToArray();
    int used=0,best=0,j=0;
    foreach(int start in starts) { while(j<ends.Length && ends[j]<=start) { used--;j++; } used++;best=Math.Max(best,used); }
    return best;
}`,`Check(Rooms([(0,30),(5,10),(15,20)])==2); Check(Rooms([(1,2),(2,3)])==1); Check(Rooms([])==0);`],
['jump-game','Jump Game Reachability','Greedy','Core','O(n)','O(1)','Maintain the farthest index reachable from the prefix processed so far.','Nonnegative maximum jump lengths. Empty input returns false; a single element is already at the destination.',`public static bool CanReach(int[] a)
{
    if(a.Any(x=>x<0)) throw new ArgumentException("Nonnegative jumps required");
    long far=0;
    for(int i=0;i<a.Length && i<=far;i++) { far=Math.Max(far,(long)i+a[i]); if(far>=a.Length-1) return true; }
    return false;
}`,`Check(CanReach([2,3,1,1,4])); Check(!CanReach([3,2,1,0,4])); Check(!CanReach([]));`],
['minimum-jumps','Minimum Jumps to Reach End','Greedy','Core','O(n)','O(1)','Treat each greedy reachable interval as one BFS layer.','Nonnegative maximum jumps. Returns -1 for unreachable or empty input; singleton returns 0.',`public static int MinJumps(int[] a)
{
    if(a.Any(x=>x<0)) throw new ArgumentException("Nonnegative jumps required");
    if(a.Length==0) return -1;
    long end=0,far=0;int jumps=0;
    for(int i=0;i<a.Length-1;i++) { if(i>far) return -1; far=Math.Max(far,(long)i+a[i]); if(i==end) { if(far==end) return -1; jumps++;end=far; if(end>=a.Length-1) return jumps; } }
    return jumps;
}`,`Check(MinJumps([2,3,1,1,4])==2); Check(MinJumps([0,1])==-1); Check(MinJumps([0])==0);`],
['balanced-parentheses','Generate Balanced Parentheses','Backtracking','Core','O(n × Catalan(n))','O(n) auxiliary, excluding output','Build prefixes while never placing more closing than opening parentheses.','n must be nonnegative. n=0 returns one empty combination. Output grows rapidly; use small inputs.',`public static string[] Parentheses(int n)
{
    if(n<0) throw new ArgumentOutOfRangeException(nameof(n));
    var result=new List<string>(); char[] path=new char[checked(2*n)];
    void Build(int open,int close) { int pos=open+close; if(pos==path.Length) { result.Add(new string(path)); return; } if(open<n) { path[pos]='(';Build(open+1,close); } if(close<open) { path[pos]=')';Build(open,close+1); } }
    Build(0,0);return result.ToArray();
}`,`Check(Parentheses(3).Length==5); Check(Parentheses(0).SequenceEqual([""]));`],
['combination-sum','Combination Sum (Reusable Candidates)','Backtracking','Core','O(n^d × d) conservative bound, d = target/minimum','O(d) auxiliary plus sorted candidates, excluding output','Choose candidates in nondecreasing order to avoid permutation duplicates.','Positive candidates and nonnegative target. Duplicated input candidates are deduplicated. Results grow rapidly; target 0 has one empty combination.',`public static int[][] Combinations(int[] values,int target)
{
    if(target<0 || values.Any(x=>x<=0)) throw new ArgumentException("Positive candidates required");
    int[] a=values.Distinct().Order().ToArray();var path=new List<int>();var result=new List<int[]>();
    void Search(int start,int left) { if(left==0) { result.Add(path.ToArray());return; } for(int i=start;i<a.Length && a[i]<=left;i++) { path.Add(a[i]);Search(i,left-a[i]);path.RemoveAt(path.Count-1); } }
    Search(0,target);return result.ToArray();
}`,`var result=Combinations([2,3,6,7],7); Check(result.Length==2); Check(result.Any(x=>x.SequenceEqual([2,2,3]))); Check(Combinations([],0).Length==1);`],
['combinations-nk','Generate K-Combinations','Backtracking','Core','O(k × C(n,k)) output-sensitive','O(k) auxiliary, excluding output','Choose k distinct numbers from 1 through n using increasing choices.','Requires 0 <= k <= n. Prunes branches when too few choices remain. k=0 returns one empty result.',`public static int[][] Choose(int n,int k)
{
    if(n<0 || k<0 || k>n) throw new ArgumentOutOfRangeException();
    var path=new List<int>();var result=new List<int[]>();
    void Build(int start) { if(path.Count==k) { result.Add(path.ToArray());return; } for(int x=start;x<=n-(k-path.Count)+1;x++) { path.Add(x);Build(x+1);path.RemoveAt(path.Count-1); } }
    Build(1);return result.ToArray();
}`,`Check(Choose(4,2).Length==6); Check(Choose(0,0).Length==1);`],
['daily-temperatures','Daily Temperatures','Stacks & Queues','Core','O(n)','O(n)','Maintain unresolved indices in a decreasing-temperature stack.','Returns the number of days until a strictly warmer reading, or 0 if none. Equal temperatures do not resolve a previous day.',`public static int[] WarmerDays(int[] temperatures)
{
    int[] answer=new int[temperatures.Length];var stack=new Stack<int>();
    for(int i=0;i<temperatures.Length;i++) { while(stack.Count>0 && temperatures[stack.Peek()]<temperatures[i]) { int j=stack.Pop();answer[j]=i-j; } stack.Push(i); }
    return answer;
}`,`Check(WarmerDays([73,74,75,71,69,72,76,73]).SequenceEqual([1,1,4,2,1,1,0,0])); Check(WarmerDays([2,2]).SequenceEqual([0,0]));`],
['histogram','Largest Rectangle in Histogram','Stacks & Queues','Advanced','O(n)','O(n)','Use a monotonic stack to find where each bar stops being the limiting height.','Nonnegative heights. A virtual zero-height sentinel flushes remaining bars. Uses long areas to avoid int multiplication overflow.',`public static long LargestRectangle(int[] heights)
{
    if(heights.Any(h=>h<0)) throw new ArgumentException("Nonnegative heights required");
    var stack=new Stack<int>();long best=0;
    for(int i=0;i<=heights.Length;i++) { int h=i==heights.Length?0:heights[i]; while(stack.Count>0 && heights[stack.Peek()]>h) { int top=stack.Pop();int width=stack.Count==0?i:i-stack.Peek()-1;best=Math.Max(best,(long)heights[top]*width); } if(i<heights.Length) stack.Push(i); }
    return best;
}`,`Check(LargestRectangle([2,1,5,6,2,3])==10); Check(LargestRectangle([])==0); Check(LargestRectangle([2,2])==4);`]
];
