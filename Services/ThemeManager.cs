using System.Windows;
using System.Windows.Media;

namespace AlgorithmVault.Services;

internal static class ThemeManager
{
    public static readonly string[] ThemeNames = ["Current", "Dark", "Purple", "White"];

    public static void Apply(ResourceDictionary resources, string theme)
    {
        var palette = theme switch
        {
            "Dark" => Dark,
            "Purple" => Purple,
            "White" => White,
            _ => Current
        };

        foreach (var (key, hex) in palette)
            resources[key] = new SolidColorBrush((Color)ColorConverter.ConvertFromString(hex));
    }

    private static readonly Dictionary<string, string> Current = new()
    {
        ["AppBackground"] = "#080C18", ["TopBarBackground"] = "#0D1323", ["SidebarBackground"] = "#0D1424",
        ["LibraryBackground"] = "#101729", ["DetailBackground"] = "#090E1B", ["FieldBackground"] = "#0D1425",
        ["PopupBackground"] = "#182238", ["ButtonSurface"] = "#202A41", ["CardBackground"] = "#121B2E",
        ["HoverBackground"] = "#172137", ["SelectionBackground"] = "#211F3E", ["CodeBackground"] = "#080D18",
        ["CodeGutter"] = "#0D1422", ["SectionText"] = "#71809B", ["Surface"] = "#101729",
        ["SurfaceRaised"] = "#172039", ["Border"] = "#25314A", ["TextPrimary"] = "#F7F8FC",
        ["TextSecondary"] = "#9AA8BF", ["Accent"] = "#7164F4", ["AccentSoft"] = "#292650", ["Mint"] = "#35D0AA"
    };

    private static readonly Dictionary<string, string> Dark = new()
    {
        ["AppBackground"] = "#080808", ["TopBarBackground"] = "#101010", ["SidebarBackground"] = "#0D0D0D",
        ["LibraryBackground"] = "#141414", ["DetailBackground"] = "#0A0A0A", ["FieldBackground"] = "#171717",
        ["PopupBackground"] = "#202020", ["ButtonSurface"] = "#242424", ["CardBackground"] = "#171717",
        ["HoverBackground"] = "#222222", ["SelectionBackground"] = "#17243A", ["CodeBackground"] = "#080808",
        ["CodeGutter"] = "#111111", ["SectionText"] = "#7C8799", ["Surface"] = "#151515",
        ["SurfaceRaised"] = "#1C1C1C", ["Border"] = "#333333", ["TextPrimary"] = "#F5F5F5",
        ["TextSecondary"] = "#A3A3A3", ["Accent"] = "#3B82F6", ["AccentSoft"] = "#1D3B64", ["Mint"] = "#2DD4BF"
    };

    private static readonly Dictionary<string, string> Purple = new()
    {
        ["AppBackground"] = "#100818", ["TopBarBackground"] = "#190D27", ["SidebarBackground"] = "#150B21",
        ["LibraryBackground"] = "#1B1029", ["DetailBackground"] = "#0E0716", ["FieldBackground"] = "#241436",
        ["PopupBackground"] = "#2D1A42", ["ButtonSurface"] = "#332049", ["CardBackground"] = "#241536",
        ["HoverBackground"] = "#2C1942", ["SelectionBackground"] = "#3A205A", ["CodeBackground"] = "#0D0714",
        ["CodeGutter"] = "#170D22", ["SectionText"] = "#A288B7", ["Surface"] = "#1C112A",
        ["SurfaceRaised"] = "#29183B", ["Border"] = "#4A2C60", ["TextPrimary"] = "#FCF7FF",
        ["TextSecondary"] = "#BBA9C8", ["Accent"] = "#A855F7", ["AccentSoft"] = "#522477", ["Mint"] = "#F472B6"
    };

    private static readonly Dictionary<string, string> White = new()
    {
        ["AppBackground"] = "#F4F6FB", ["TopBarBackground"] = "#FFFFFF", ["SidebarBackground"] = "#F8F9FC",
        ["LibraryBackground"] = "#EEF1F7", ["DetailBackground"] = "#FFFFFF", ["FieldBackground"] = "#F7F8FC",
        ["PopupBackground"] = "#FFFFFF", ["ButtonSurface"] = "#EEF1F7", ["CardBackground"] = "#FFFFFF",
        ["HoverBackground"] = "#E8ECF4", ["SelectionBackground"] = "#E7E2FF", ["CodeBackground"] = "#FFFFFF",
        ["CodeGutter"] = "#F1F3F7", ["SectionText"] = "#687386", ["Surface"] = "#FFFFFF",
        ["SurfaceRaised"] = "#F4F6FA", ["Border"] = "#D6DCE8", ["TextPrimary"] = "#172033",
        ["TextSecondary"] = "#657187", ["Accent"] = "#6D5DFB", ["AccentSoft"] = "#DCD7FF", ["Mint"] = "#059669"
    };
}
