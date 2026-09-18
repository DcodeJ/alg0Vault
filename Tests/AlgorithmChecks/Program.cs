using System;
using System.Linq;
using System.Collections.Generic;
Case0.Test();
Case1.Test();
Case2.Test();
Case3.Test();
Case4.Test();
Case5.Test();
Case6.Test();
Case7.Test();
Case8.Test();
Case9.Test();
Case10.Test();
Case11.Test();
Case12.Test();
Case13.Test();
Case14.Test();
Case15.Test();
Case16.Test();
Case17.Test();
Case18.Test();
Case19.Test();
Case20.Test();
Case21.Test();
Case22.Test();
Case23.Test();
Case24.Test();
Case25.Test();
Case26.Test();
Case27.Test();
Case28.Test();
Case29.Test();
Case30.Test();
Case31.Test();
Case32.Test();
Case33.Test();
Case34.Test();
Case35.Test();
Case36.Test();
Case37.Test();
Case38.Test();
Case39.Test();
Console.WriteLine("All 40 new C# implementations passed their example and boundary checks.");
public static class Case0 {
public static int UpperBound(int[] a, int target)
{
    int lo = 0, hi = a.Length;
    while (lo < hi) { int mid = lo + (hi-lo)/2; if (a[mid] <= target) lo = mid+1; else hi = mid; }
    return lo;
}
static void Check(bool condition) { if(!condition) throw new Exception("Upper Bound"); }
public static void Test() { Check(UpperBound([1,2,2,4],2)==3); Check(UpperBound([],2)==0); Check(UpperBound([2],2)==1); }
}
public static class Case1 {
public static int Search(int[] a, int target)
{
    int lo=0, hi=a.Length-1;
    while(lo<=hi) {
        int mid=lo+(hi-lo)/2; if(a[mid]==target) return mid;
        if(a[lo]<=a[mid]) { if(a[lo]<=target && target<a[mid]) hi=mid-1; else lo=mid+1; }
        else { if(a[mid]<target && target<=a[hi]) lo=mid+1; else hi=mid-1; }
    }
    return -1;
}
static void Check(bool condition) { if(!condition) throw new Exception("Search Rotated Sorted Array"); }
public static void Test() { Check(Search([4,5,6,1,2,3],2)==4); Check(Search([],1)==-1); Check(Search([1],2)==-1); }
}
public static class Case2 {
public static int Sqrt(int n)
{
    if(n<0) throw new ArgumentOutOfRangeException(nameof(n));
    long lo=0, hi=n, answer=0;
    while(lo<=hi) { long mid=lo+(hi-lo)/2; if(mid*mid<=n) { answer=mid; lo=mid+1; } else hi=mid-1; }
    return (int)answer;
}
static void Check(bool condition) { if(!condition) throw new Exception("Integer Square Root"); }
public static void Test() { Check(Sqrt(8)==2); Check(Sqrt(0)==0); Check(Sqrt(int.MaxValue)==46340); }
}
public static class Case3 {
public static bool Contains(int[,] a, int target)
{
    int r=0,c=a.GetLength(1)-1;
    while(r<a.GetLength(0) && c>=0) { if(a[r,c]==target) return true; if(a[r,c]>target) c--; else r++; }
    return false;
}
static void Check(bool condition) { if(!condition) throw new Exception("Search Row and Column Sorted Matrix"); }
public static void Test() { Check(Contains(new int[,]{{1,4,7},{2,5,9}},5)); Check(!Contains(new int[,]{{1,4},{2,5}},3)); Check(!Contains(new int[0,0],1)); }
}
public static class Case4 {
public static void MoveZeroes(int[] a)
{
    int write=0;
    for(int read=0;read<a.Length;read++) if(a[read]!=0) a[write++]=a[read];
    while(write<a.Length) a[write++]=0;
}
static void Check(bool condition) { if(!condition) throw new Exception("Move Zeroes"); }
public static void Test() { int[] a=[0,1,0,3,12]; MoveZeroes(a); Check(a.SequenceEqual([1,3,12,0,0])); MoveZeroes([]); }
}
public static class Case5 {
public static int Unique(int[] a)
{
    if(a.Length==0) return 0;
    int write=1;
    for(int read=1;read<a.Length;read++) if(a[read]!=a[write-1]) a[write++]=a[read];
    return write;
}
static void Check(bool condition) { if(!condition) throw new Exception("Remove Duplicates from Sorted Array"); }
public static void Test() { int[] a=[1,1,2,2,3]; Check(Unique(a)==3); Check(a.Take(3).SequenceEqual([1,2,3])); Check(Unique([])==0); }
}
public static class Case6 {
public static void SortColors(int[] a)
{
    if(a.Any(x=>x<0 || x>2)) throw new ArgumentException("Only 0, 1 and 2 allowed");
    int low=0,mid=0,high=a.Length-1;
    while(mid<=high) {
        if(a[mid]==0) { (a[low],a[mid])=(a[mid],a[low]); low++; mid++; }
        else if(a[mid]==1) mid++;
        else { (a[mid],a[high])=(a[high],a[mid]); high--; }
    }
}
static void Check(bool condition) { if(!condition) throw new Exception("Dutch National Flag Partition"); }
public static void Test() { int[] a=[2,0,2,1,1,0]; SortColors(a); Check(a.SequenceEqual([0,0,1,1,2,2])); SortColors([]); }
}
public static class Case7 {
public static int? Majority(int[] a)
{
    int candidate=0,votes=0;
    foreach(int x in a) { if(votes==0) candidate=x; votes += x==candidate ? 1 : -1; }
    return a.Count(x=>x==candidate)>a.Length/2 ? candidate : null;
}
static void Check(bool condition) { if(!condition) throw new Exception("Boyer–Moore Majority Vote"); }
public static void Test() { Check(Majority([2,2,1,2])==2); Check(Majority([1,2]) is null); Check(Majority([]) is null); }
}
public static class Case8 {
public static long MaxProduct(int[] a)
{
    if(a.Length==0) throw new ArgumentException("Nonempty input required");
    long max=a[0],min=a[0],best=a[0];
    for(int i=1;i<a.Length;i++) { long x=a[i],p=checked(max*x),q=checked(min*x); max=Math.Max(x,Math.Max(p,q)); min=Math.Min(x,Math.Min(p,q)); best=Math.Max(best,max); }
    return best;
}
static void Check(bool condition) { if(!condition) throw new Exception("Maximum Product Subarray"); }
public static void Test() { Check(MaxProduct([2,3,-2,4])==6); Check(MaxProduct([-2,3,-4])==24); Check(MaxProduct([0,-2,0])==0); }
}
public static class Case9 {
public static int MinLength(int[] a, long target)
{
    if(target<=0 || a.Any(x=>x<0)) throw new ArgumentException("Positive target and nonnegative values required");
    int left=0,best=int.MaxValue; long sum=0;
    for(int right=0;right<a.Length;right++) { sum+=a[right]; while(sum>=target) { best=Math.Min(best,right-left+1); sum-=a[left++]; } }
    return best==int.MaxValue ? 0 : best;
}
static void Check(bool condition) { if(!condition) throw new Exception("Minimum Length Positive-Sum Window"); }
public static void Test() { Check(MinLength([2,3,1,2,4,3],7)==2); Check(MinLength([0,0,5],5)==1); Check(MinLength([],4)==0); }
}
public static class Case10 {
public static long?[,] Distances(long?[,] edges)
{
    int n=edges.GetLength(0); if(n!=edges.GetLength(1)) throw new ArgumentException("Square matrix required");
    var d=(long?[,])edges.Clone();
    for(int i=0;i<n;i++) d[i,i]=Math.Min(d[i,i]??0,0);
    for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)
        if(d[i,k] is long x && d[k,j] is long y) { long z=checked(x+y); if(d[i,j] is null || z<d[i,j]) d[i,j]=z; }
    for(int i=0;i<n;i++) if(d[i,i]<0) throw new ArgumentException("Negative cycle");
    return d;
}
static void Check(bool condition) { if(!condition) throw new Exception("Floyd–Warshall All-Pairs Shortest Paths"); }
public static void Test() { var d=Distances(new long?[,]{{0,3,null},{null,0,2},{null,null,0}}); Check(d[0,2]==5); Check(d[2,0] is null); }
}
public static class Case11 {
public static bool IsBipartite(int[][] graph)
{
    int[] color=Enumerable.Repeat(-1,graph.Length).ToArray(); var q=new Queue<int>();
    for(int start=0;start<graph.Length;start++) if(color[start]<0) {
        color[start]=0; q.Enqueue(start);
        while(q.Count>0) { int v=q.Dequeue(); foreach(int u in graph[v]) { if(color[u]<0) { color[u]=1-color[v]; q.Enqueue(u); } else if(color[u]==color[v]) return false; } }
    }
    return true;
}
static void Check(bool condition) { if(!condition) throw new Exception("Bipartite Graph Check"); }
public static void Test() { Check(IsBipartite([[1],[0],[]])); Check(!IsBipartite([[1,2],[0,2],[0,1]])); Check(IsBipartite([])); }
}
public static class Case12 {
public static int Components(int[][] graph)
{
    bool[] seen=new bool[graph.Length]; var q=new Queue<int>(); int count=0;
    for(int s=0;s<graph.Length;s++) if(!seen[s]) {
        count++; seen[s]=true; q.Enqueue(s);
        while(q.Count>0) foreach(int u in graph[q.Dequeue()]) if(!seen[u]) { seen[u]=true; q.Enqueue(u); }
    }
    return count;
}
static void Check(bool condition) { if(!condition) throw new Exception("Count Undirected Connected Components"); }
public static void Test() { Check(Components([[1],[0],[]])==2); Check(Components([])==0); }
}
public static class Case13 {
public static long? Mst(long?[,] weights)
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
}
static void Check(bool condition) { if(!condition) throw new Exception("Prim Minimum Spanning Tree (Dense)"); }
public static void Test() { Check(Mst(new long?[,]{{0,1,4},{1,0,2},{4,2,0}})==3); Check(Mst(new long?[,]{{0,null},{null,0}}) is null); }
}
public static class Case14 {
public static int[] Nearest(int[][] graph, int[] sources)
{
    int[] d=Enumerable.Repeat(-1,graph.Length).ToArray(); var q=new Queue<int>();
    foreach(int s in sources) if(d[s]<0) { d[s]=0; q.Enqueue(s); }
    while(q.Count>0) { int v=q.Dequeue(); foreach(int u in graph[v]) if(d[u]<0) { d[u]=d[v]+1; q.Enqueue(u); } }
    return d;
}
static void Check(bool condition) { if(!condition) throw new Exception("Multi-Source BFS Distances"); }
public static void Test() { Check(Nearest([[1],[0,2],[1,3],[2]],[0,3]).SequenceEqual([0,1,1,0])); Check(Nearest([[]],[])[0]==-1); }
}
public static class Case15 {
public static long Gcd(int a,int b)
{
    long x=Math.Abs((long)a),y=Math.Abs((long)b);
    while(y!=0) { (x,y)=(y,x%y); }
    return x;
}
static void Check(bool condition) { if(!condition) throw new Exception("Euclidean Greatest Common Divisor"); }
public static void Test() { Check(Gcd(48,18)==6); Check(Gcd(0,0)==0); Check(Gcd(int.MinValue,0)==2147483648L); }
}
public static class Case16 {
public static int[] Primes(int n)
{
    if(n<2) return [];
    bool[] composite=new bool[checked(n+1)];
    for(int p=2;p<=n/p;p++) if(!composite[p]) for(long k=(long)p*p;k<=n;k+=p) composite[(int)k]=true;
    return Enumerable.Range(2,n-1).Where(x=>!composite[x]).ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Sieve of Eratosthenes"); }
public static void Test() { Check(Primes(10).SequenceEqual([2,3,5,7])); Check(Primes(1).Length==0); }
}
public static class Case17 {
public static int Power(int value,long exponent,int modulus)
{
    if(exponent<0 || modulus<=0) throw new ArgumentException("Invalid exponent or modulus");
    long b=((long)value%modulus+modulus)%modulus,answer=1%modulus;
    while(exponent>0) { if((exponent&1)!=0) answer=answer*b%modulus; b=b*b%modulus; exponent>>=1; }
    return (int)answer;
}
static void Check(bool condition) { if(!condition) throw new Exception("Modular Exponentiation by Squaring"); }
public static void Test() { Check(Power(2,10,1000)==24); Check(Power(-2,3,5)==2); Check(Power(9,0,1)==0); }
}
public static class Case18 {
public static int BitCount(uint value)
{
    int count=0; while(value!=0) { value &= value-1; count++; } return count;
}
static void Check(bool condition) { if(!condition) throw new Exception("Count Set Bits (Kernighan)"); }
public static void Test() { Check(BitCount(0)==0); Check(BitCount(15)==4); Check(BitCount(uint.MaxValue)==32); }
}
public static class Case19 {
public static int Single(int[] a)
{
    int result=0; foreach(int x in a) result^=x; return result;
}
static void Check(bool condition) { if(!condition) throw new Exception("Single Number with XOR"); }
public static void Test() { Check(Single([4,1,2,1,2])==4); Check(Single([-3,7,7])==-3); }
}
public static class Case20 {
public static long Paths(int rows,int columns)
{
    if(rows<0 || columns<0) throw new ArgumentOutOfRangeException();
    if(rows==0 || columns==0) return 0;
    long[] dp=Enumerable.Repeat(1L,columns).ToArray();
    for(int r=1;r<rows;r++) for(int c=1;c<columns;c++) dp[c]=checked(dp[c]+dp[c-1]);
    return dp[^1];
}
static void Check(bool condition) { if(!condition) throw new Exception("Unique Grid Paths"); }
public static void Test() { Check(Paths(3,7)==28); Check(Paths(0,4)==0); Check(Paths(1,1)==1); }
}
public static class Case21 {
public static long MinPath(int[,] a)
{
    int rows=a.GetLength(0),cols=a.GetLength(1); if(rows==0 || cols==0) return 0;
    long[] dp=new long[cols];
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) {
        long prior=r==0 ? (c==0?0:dp[c-1]) : c==0 ? dp[c] : Math.Min(dp[c],dp[c-1]);
        dp[c]=checked(prior+a[r,c]);
    }
    return dp[^1];
}
static void Check(bool condition) { if(!condition) throw new Exception("Minimum Grid Path Sum"); }
public static void Test() { Check(MinPath(new int[,]{{1,3,1},{1,5,1},{4,2,1}})==7); Check(MinPath(new int[0,0])==0); }
}
public static class Case22 {
public static bool CanPartition(int[] a)
{
    if(a.Any(x=>x<0)) throw new ArgumentException("Nonnegative values required");
    long total=a.Sum(x=>(long)x); if(total%2!=0) return false;
    int target=checked((int)(total/2)); bool[] dp=new bool[checked(target+1)]; dp[0]=true;
    foreach(int x in a) for(int s=target;s>=x;s--) dp[s]|=dp[s-x];
    return dp[target];
}
static void Check(bool condition) { if(!condition) throw new Exception("Partition Equal Subset Sum"); }
public static void Test() { Check(CanPartition([1,5,11,5])); Check(!CanPartition([1,2,5])); Check(CanPartition([])); }
}
public static class Case23 {
public static bool CanBreak(string text,HashSet<string> words)
{
    bool[] dp=new bool[text.Length+1]; dp[0]=true;
    for(int end=1;end<=text.Length;end++) for(int start=0;start<end;start++)
        if(dp[start] && words.Contains(text[start..end])) { dp[end]=true; break; }
    return dp[^1];
}
static void Check(bool condition) { if(!condition) throw new Exception("Word Break"); }
public static void Test() { Check(CanBreak("leetcode",new(){"leet","code"})); Check(!CanBreak("catsandog",new(){"cats","dog","sand","and","cat"})); }
}
public static class Case24 {
public static long Decode(string s)
{
    if(s.Any(c=>c<'0'||c>'9')) throw new ArgumentException("Digits required");
    if(s.Length==0 || s[0]=='0') return 0;
    long previous=1,current=1;
    for(int i=1;i<s.Length;i++) { long next=s[i]=='0'?0:current; int pair=(s[i-1]-'0')*10+s[i]-'0'; if(pair>=10 && pair<=26) next=checked(next+previous); previous=current; current=next; }
    return current;
}
static void Check(bool condition) { if(!condition) throw new Exception("Decode Ways"); }
public static void Test() { Check(Decode("226")==3); Check(Decode("06")==0); Check(Decode("10")==1); Check(Decode("")==0); }
}
public static class Case25 {
public static string LongestPalindrome(string s)
{
    int start=0,length=0;
    void Expand(int l,int r) { while(l>=0 && r<s.Length && s[l]==s[r]) { if(r-l+1>length) { start=l; length=r-l+1; } l--;r++; } }
    for(int i=0;i<s.Length;i++) { Expand(i,i); Expand(i,i+1); }
    return s.Substring(start,length);
}
static void Check(bool condition) { if(!condition) throw new Exception("Longest Palindromic Substring"); }
public static void Test() { Check(LongestPalindrome("babad")=="bab"); Check(LongestPalindrome("cbbd")=="bb"); Check(LongestPalindrome("")==""); }
}
public static class Case26 {
public static int[] Z(string s)
{
    int[] z=new int[s.Length]; int l=0,r=0;
    for(int i=1;i<s.Length;i++) {
        if(i<=r) z[i]=Math.Min(r-i+1,z[i-l]);
        while(i+z[i]<s.Length && s[z[i]]==s[i+z[i]]) z[i]++;
        if(i+z[i]-1>r) { l=i;r=i+z[i]-1; }
    }
    return z;
}
static void Check(bool condition) { if(!condition) throw new Exception("Z Algorithm"); }
public static void Test() { Check(Z("aaaaa").SequenceEqual([0,4,3,2,1])); Check(Z("").Length==0); Check(Z("abcd").All(x=>x==0)); }
}
public static class Case27 {
public static int[] Anagrams(string text,string pattern)
{
    if(text.Any(c=>c<'a'||c>'z') || pattern.Any(c=>c<'a'||c>'z')) throw new ArgumentException("Lowercase ASCII required");
    int m=pattern.Length; if(m==0 || m>text.Length) return [];
    int[] want=new int[26],have=new int[26]; foreach(char c in pattern) want[c-'a']++;
    var answer=new List<int>();
    for(int i=0;i<text.Length;i++) { have[text[i]-'a']++; if(i>=m) have[text[i-m]-'a']--; if(i>=m-1 && have.SequenceEqual(want)) answer.Add(i-m+1); }
    return answer.ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Find All Anagram Windows"); }
public static void Test() { Check(Anagrams("cbaebabacd","abc").SequenceEqual([0,6])); Check(Anagrams("aaaa","aa").SequenceEqual([0,1,2])); }
}
public static class Case28 {
public static (char Value,int Count)[] Encode(string s)
{
    var result=new List<(char,int)>();
    for(int i=0;i<s.Length;) { int end=i+1; while(end<s.Length && s[end]==s[i]) end++; result.Add((s[i],end-i)); i=end; }
    return result.ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Run-Length Encoding"); }
public static void Test() { Check(Encode("aaabb").SequenceEqual(new[]{('a',3),('b',2)})); Check(Encode("").Length==0); }
}
public static class Case29 {
public static int[] Merge(int[][] arrays)
{
    var q=new PriorityQueue<(int A,int I),int>(); var result=new List<int>();
    for(int a=0;a<arrays.Length;a++) if(arrays[a].Length>0) q.Enqueue((a,0),arrays[a][0]);
    while(q.Count>0) { var (a,i)=q.Dequeue(); result.Add(arrays[a][i]); if(i+1<arrays[a].Length) q.Enqueue((a,i+1),arrays[a][i+1]); }
    return result.ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Merge K Sorted Arrays"); }
public static void Test() { Check(Merge([[1,4],[],[2,3]]).SequenceEqual([1,2,3,4])); Check(Merge([]).Length==0); }
}
public static class Case30 {
public static int KthLargest(int[] a,int k)
{
    if(k<1 || k>a.Length) throw new ArgumentOutOfRangeException(nameof(k));
    var q=new PriorityQueue<int,int>();
    foreach(int x in a) { q.Enqueue(x,x); if(q.Count>k) q.Dequeue(); }
    return q.Peek();
}
static void Check(bool condition) { if(!condition) throw new Exception("Kth Largest with a Bounded Heap"); }
public static void Test() { Check(KthLargest([3,2,1,5,6,4],2)==5); Check(KthLargest([2,2,1],2)==2); }
}
public static class Case31 {
public static int SelectIntervals((int Start,int End)[] intervals)
{
    if(intervals.Any(x=>x.Start>=x.End)) throw new ArgumentException("Start must precede end");
    int count=0; long end=long.MinValue;
    foreach(var x in intervals.OrderBy(x=>x.End)) if(x.Start>=end) { count++;end=x.End; }
    return count;
}
static void Check(bool condition) { if(!condition) throw new Exception("Maximum Nonoverlapping Intervals"); }
public static void Test() { Check(SelectIntervals([(1,3),(2,4),(3,5)])==2); Check(SelectIntervals([])==0); }
}
public static class Case32 {
public static int Rooms((int Start,int End)[] meetings)
{
    if(meetings.Any(x=>x.Start>=x.End)) throw new ArgumentException("Invalid interval");
    var starts=meetings.Select(x=>x.Start).Order().ToArray(); var ends=meetings.Select(x=>x.End).Order().ToArray();
    int used=0,best=0,j=0;
    foreach(int start in starts) { while(j<ends.Length && ends[j]<=start) { used--;j++; } used++;best=Math.Max(best,used); }
    return best;
}
static void Check(bool condition) { if(!condition) throw new Exception("Minimum Meeting Rooms"); }
public static void Test() { Check(Rooms([(0,30),(5,10),(15,20)])==2); Check(Rooms([(1,2),(2,3)])==1); Check(Rooms([])==0); }
}
public static class Case33 {
public static bool CanReach(int[] a)
{
    if(a.Any(x=>x<0)) throw new ArgumentException("Nonnegative jumps required");
    long far=0;
    for(int i=0;i<a.Length && i<=far;i++) { far=Math.Max(far,(long)i+a[i]); if(far>=a.Length-1) return true; }
    return false;
}
static void Check(bool condition) { if(!condition) throw new Exception("Jump Game Reachability"); }
public static void Test() { Check(CanReach([2,3,1,1,4])); Check(!CanReach([3,2,1,0,4])); Check(!CanReach([])); }
}
public static class Case34 {
public static int MinJumps(int[] a)
{
    if(a.Any(x=>x<0)) throw new ArgumentException("Nonnegative jumps required");
    if(a.Length==0) return -1;
    long end=0,far=0;int jumps=0;
    for(int i=0;i<a.Length-1;i++) { if(i>far) return -1; far=Math.Max(far,(long)i+a[i]); if(i==end) { if(far==end) return -1; jumps++;end=far; if(end>=a.Length-1) return jumps; } }
    return jumps;
}
static void Check(bool condition) { if(!condition) throw new Exception("Minimum Jumps to Reach End"); }
public static void Test() { Check(MinJumps([2,3,1,1,4])==2); Check(MinJumps([0,1])==-1); Check(MinJumps([0])==0); }
}
public static class Case35 {
public static string[] Parentheses(int n)
{
    if(n<0) throw new ArgumentOutOfRangeException(nameof(n));
    var result=new List<string>(); char[] path=new char[checked(2*n)];
    void Build(int open,int close) { int pos=open+close; if(pos==path.Length) { result.Add(new string(path)); return; } if(open<n) { path[pos]='(';Build(open+1,close); } if(close<open) { path[pos]=')';Build(open,close+1); } }
    Build(0,0);return result.ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Generate Balanced Parentheses"); }
public static void Test() { Check(Parentheses(3).Length==5); Check(Parentheses(0).SequenceEqual([""])); }
}
public static class Case36 {
public static int[][] Combinations(int[] values,int target)
{
    if(target<0 || values.Any(x=>x<=0)) throw new ArgumentException("Positive candidates required");
    int[] a=values.Distinct().Order().ToArray();var path=new List<int>();var result=new List<int[]>();
    void Search(int start,int left) { if(left==0) { result.Add(path.ToArray());return; } for(int i=start;i<a.Length && a[i]<=left;i++) { path.Add(a[i]);Search(i,left-a[i]);path.RemoveAt(path.Count-1); } }
    Search(0,target);return result.ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Combination Sum (Reusable Candidates)"); }
public static void Test() { var result=Combinations([2,3,6,7],7); Check(result.Length==2); Check(result.Any(x=>x.SequenceEqual([2,2,3]))); Check(Combinations([],0).Length==1); }
}
public static class Case37 {
public static int[][] Choose(int n,int k)
{
    if(n<0 || k<0 || k>n) throw new ArgumentOutOfRangeException();
    var path=new List<int>();var result=new List<int[]>();
    void Build(int start) { if(path.Count==k) { result.Add(path.ToArray());return; } for(int x=start;x<=n-(k-path.Count)+1;x++) { path.Add(x);Build(x+1);path.RemoveAt(path.Count-1); } }
    Build(1);return result.ToArray();
}
static void Check(bool condition) { if(!condition) throw new Exception("Generate K-Combinations"); }
public static void Test() { Check(Choose(4,2).Length==6); Check(Choose(0,0).Length==1); }
}
public static class Case38 {
public static int[] WarmerDays(int[] temperatures)
{
    int[] answer=new int[temperatures.Length];var stack=new Stack<int>();
    for(int i=0;i<temperatures.Length;i++) { while(stack.Count>0 && temperatures[stack.Peek()]<temperatures[i]) { int j=stack.Pop();answer[j]=i-j; } stack.Push(i); }
    return answer;
}
static void Check(bool condition) { if(!condition) throw new Exception("Daily Temperatures"); }
public static void Test() { Check(WarmerDays([73,74,75,71,69,72,76,73]).SequenceEqual([1,1,4,2,1,1,0,0])); Check(WarmerDays([2,2]).SequenceEqual([0,0])); }
}
public static class Case39 {
public static long LargestRectangle(int[] heights)
{
    if(heights.Any(h=>h<0)) throw new ArgumentException("Nonnegative heights required");
    var stack=new Stack<int>();long best=0;
    for(int i=0;i<=heights.Length;i++) { int h=i==heights.Length?0:heights[i]; while(stack.Count>0 && heights[stack.Peek()]>h) { int top=stack.Pop();int width=stack.Count==0?i:i-stack.Peek()-1;best=Math.Max(best,(long)heights[top]*width); } if(i<heights.Length) stack.Push(i); }
    return best;
}
static void Check(bool condition) { if(!condition) throw new Exception("Largest Rectangle in Histogram"); }
public static void Test() { Check(LargestRectangle([2,1,5,6,2,3])==10); Check(LargestRectangle([])==0); Check(LargestRectangle([2,2])==4); }
}