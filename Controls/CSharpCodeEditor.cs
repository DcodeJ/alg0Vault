using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;

namespace AlgorithmVault.Controls;

public sealed class CSharpCodeEditor : RichTextBox
{
    private static readonly Brush DefaultBrush = Brush("#D4D4D4");
    private static readonly Brush KeywordBrush = Brush("#569CD6");
    private static readonly Brush TypeBrush = Brush("#4EC9B0");
    private static readonly Brush MethodBrush = Brush("#DCDCAA");
    private static readonly Brush StringBrush = Brush("#CE9178");
    private static readonly Brush CommentBrush = Brush("#6A9955");
    private static readonly Brush NumberBrush = Brush("#B5CEA8");
    private static readonly Brush PreprocessorBrush = Brush("#C586C0");
    private static readonly Brush LightDefaultBrush = Brush("#1F1F1F");
    private static readonly Brush LightKeywordBrush = Brush("#0000FF");
    private static readonly Brush LightTypeBrush = Brush("#267F99");
    private static readonly Brush LightMethodBrush = Brush("#795E26");
    private static readonly Brush LightStringBrush = Brush("#A31515");
    private static readonly Brush LightCommentBrush = Brush("#008000");
    private static readonly Brush LightNumberBrush = Brush("#098658");
    private static readonly Brush LightPreprocessorBrush = Brush("#AF00DB");

    private static readonly HashSet<string> Keywords = new(StringComparer.Ordinal)
    {
        "abstract", "as", "async", "await", "base", "bool", "break", "byte", "case", "catch", "char",
        "checked", "class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else",
        "enum", "event", "explicit", "extern", "false", "finally", "fixed", "float", "for", "foreach", "goto",
        "if", "implicit", "in", "int", "interface", "internal", "is", "lock", "long", "namespace", "new", "null",
        "object", "operator", "out", "override", "params", "partial", "private", "protected", "public", "readonly",
        "record", "ref", "required", "return", "sbyte", "sealed", "short", "sizeof", "stackalloc", "static", "string",
        "struct", "switch", "this", "throw", "true", "try", "typeof", "uint", "ulong", "unchecked", "unsafe",
        "ushort", "using", "var", "virtual", "void", "volatile", "when", "where", "while", "yield"
    };

    private static readonly HashSet<string> KnownTypes = new(StringComparer.Ordinal)
    {
        "Array", "ArraySegment", "ArgumentException", "ArgumentNullException", "BitArray", "Comparer", "Comparison",
        "DateTime", "Dictionary", "DisjointSet", "Enumerable", "EqualityComparer", "Exception", "FlowDocument",
        "HashSet", "IComparer", "IEnumerable", "IList", "InvalidOperationException", "LinkedList", "LinkedListNode",
        "List", "Math", "Node", "PriorityQueue", "Queue", "Random", "ReadOnlySpan", "SortedDictionary", "SortedSet",
        "Span", "Stack", "StringBuilder", "StringComparer", "TreeNode", "Trie", "Tuple", "ValueTuple"
    };

    private readonly DispatcherTimer _highlightTimer;
    private bool _internalUpdate;

    public static readonly DependencyProperty CodeProperty = DependencyProperty.Register(
        nameof(Code), typeof(string), typeof(CSharpCodeEditor),
        new FrameworkPropertyMetadata("", FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, OnCodeChanged));

    public static readonly DependencyProperty IsLightThemeProperty = DependencyProperty.Register(
        nameof(IsLightTheme), typeof(bool), typeof(CSharpCodeEditor),
        new PropertyMetadata(false, OnLightThemeChanged));

    public string Code
    {
        get => (string)GetValue(CodeProperty);
        set => SetValue(CodeProperty, value);
    }

    public bool IsLightTheme
    {
        get => (bool)GetValue(IsLightThemeProperty);
        set => SetValue(IsLightThemeProperty, value);
    }

    public CSharpCodeEditor()
    {
        _highlightTimer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(140) };
        _highlightTimer.Tick += (_, _) =>
        {
            _highlightTimer.Stop();
            HighlightPreservingCaret();
        };
        TextChanged += Editor_TextChanged;
        PreviewKeyDown += Editor_PreviewKeyDown;
        SpellCheck.SetIsEnabled(this, false);
        AcceptsTab = true;
        AcceptsReturn = true;
        VerticalScrollBarVisibility = ScrollBarVisibility.Auto;
        HorizontalScrollBarVisibility = ScrollBarVisibility.Auto;
        SelectionBrush = Brush("#264F78");
        CaretBrush = Brush("#AEAFAD");
    }

    private static void OnCodeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        var editor = (CSharpCodeEditor)d;
        if (editor._internalUpdate) return;
        var value = e.NewValue as string ?? "";
        if (editor.ReadText() == value) return;
        editor.RebuildDocument(value, 0);
    }

    private static void OnLightThemeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        var editor = (CSharpCodeEditor)d;
        editor.SelectionBrush = Brush((bool)e.NewValue ? "#ADD6FF" : "#264F78");
        editor.HighlightPreservingCaret();
    }

    private void Editor_TextChanged(object sender, TextChangedEventArgs e)
    {
        if (_internalUpdate) return;
        _internalUpdate = true;
        SetCurrentValue(CodeProperty, ReadText());
        _internalUpdate = false;
        _highlightTimer.Stop();
        _highlightTimer.Start();
    }

    private void Editor_PreviewKeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key != Key.Tab || Keyboard.Modifiers != ModifierKeys.None) return;
        CaretPosition.InsertTextInRun("    ");
        e.Handled = true;
    }

    private void HighlightPreservingCaret()
    {
        if (_internalUpdate) return;
        var text = ReadText();
        int caretOffset = new TextRange(Document.ContentStart, CaretPosition).Text.Length;
        RebuildDocument(text, Math.Min(caretOffset, text.Length));
    }

    private void RebuildDocument(string code, int caretOffset)
    {
        _internalUpdate = true;
        try
        {
            var paragraph = new Paragraph { Margin = new Thickness(0) };
            foreach (var token in Tokenize(code))
                paragraph.Inlines.Add(new Run(token.Text) { Foreground = token.Color });

            var document = new FlowDocument(paragraph)
            {
                PagePadding = new Thickness(0),
                Background = Brushes.Transparent,
                Foreground = Current(DefaultBrush, LightDefaultBrush),
                FontFamily = FontFamily,
                FontSize = FontSize,
                LineHeight = FontSize * 1.45
            };
            Document = document;
            CaretPosition = FindPositionAtOffset(Document.ContentStart, caretOffset);
        }
        finally
        {
            _internalUpdate = false;
        }
    }

    private string ReadText()
    {
        var text = new TextRange(Document.ContentStart, Document.ContentEnd).Text;
        return text.EndsWith("\r\n", StringComparison.Ordinal) ? text[..^2] : text;
    }

    private static TextPointer FindPositionAtOffset(TextPointer start, int offset)
    {
        var position = start;
        while (position is not null)
        {
            if (position.GetPointerContext(LogicalDirection.Forward) == TextPointerContext.Text)
            {
                int length = position.GetTextRunLength(LogicalDirection.Forward);
                if (offset <= length) return position.GetPositionAtOffset(offset, LogicalDirection.Forward) ?? position;
                offset -= length;
            }
            var next = position.GetNextContextPosition(LogicalDirection.Forward);
            if (next is null) break;
            position = next;
        }
        return start.DocumentEnd;
    }

    private IEnumerable<Token> Tokenize(string code)
    {
        int index = 0;
        while (index < code.Length)
        {
            int start = index;

            if (code[index] == '#' && (index == 0 || code[index - 1] == '\n'))
            {
                while (index < code.Length && code[index] != '\n') index++;
                yield return new Token(code[start..index], Current(PreprocessorBrush, LightPreprocessorBrush));
                continue;
            }

            if (index + 1 < code.Length && code[index] == '/' && code[index + 1] == '/')
            {
                index += 2;
                while (index < code.Length && code[index] != '\n') index++;
                yield return new Token(code[start..index], Current(CommentBrush, LightCommentBrush));
                continue;
            }

            if (index + 1 < code.Length && code[index] == '/' && code[index + 1] == '*')
            {
                index += 2;
                while (index + 1 < code.Length && !(code[index] == '*' && code[index + 1] == '/')) index++;
                index = Math.Min(code.Length, index + 2);
                yield return new Token(code[start..index], Current(CommentBrush, LightCommentBrush));
                continue;
            }

            bool verbatim = code[index] == '@' && index + 1 < code.Length && code[index + 1] == '"';
            if (code[index] is '"' or '\'' || verbatim)
            {
                char quote = verbatim ? '"' : code[index];
                index += verbatim ? 2 : 1;
                while (index < code.Length)
                {
                    if (!verbatim && code[index] == '\\') { index = Math.Min(code.Length, index + 2); continue; }
                    if (code[index] == quote)
                    {
                        index++;
                        if (verbatim && index < code.Length && code[index] == '"') { index++; continue; }
                        break;
                    }
                    index++;
                }
                yield return new Token(code[start..index], Current(StringBrush, LightStringBrush));
                continue;
            }

            if (char.IsDigit(code[index]))
            {
                index++;
                while (index < code.Length && (char.IsLetterOrDigit(code[index]) || code[index] is '.' or '_')) index++;
                yield return new Token(code[start..index], Current(NumberBrush, LightNumberBrush));
                continue;
            }

            if (char.IsLetter(code[index]) || code[index] == '_')
            {
                index++;
                while (index < code.Length && (char.IsLetterOrDigit(code[index]) || code[index] == '_')) index++;
                var word = code[start..index];
                int next = index;
                while (next < code.Length && char.IsWhiteSpace(code[next])) next++;
                var color = Keywords.Contains(word) ? Current(KeywordBrush, LightKeywordBrush)
                    : KnownTypes.Contains(word) || char.IsUpper(word[0]) && next < code.Length && code[next] is '<' or '[' ? Current(TypeBrush, LightTypeBrush)
                    : next < code.Length && code[next] == '(' ? Current(MethodBrush, LightMethodBrush)
                    : Current(DefaultBrush, LightDefaultBrush);
                yield return new Token(word, color);
                continue;
            }

            index++;
            while (index < code.Length && !char.IsLetterOrDigit(code[index]) && code[index] != '_' && code[index] is not '"' and not '\'' and not '#'
                   && !(code[index] == '/' && index + 1 < code.Length && code[index + 1] is '/' or '*')) index++;
            yield return new Token(code[start..index], Current(DefaultBrush, LightDefaultBrush));
        }
    }

    private Brush Current(Brush dark, Brush light) => IsLightTheme ? light : dark;

    private static SolidColorBrush Brush(string hex)
    {
        var brush = new SolidColorBrush((Color)ColorConverter.ConvertFromString(hex));
        brush.Freeze();
        return brush;
    }

    private readonly record struct Token(string Text, Brush Color);
}
