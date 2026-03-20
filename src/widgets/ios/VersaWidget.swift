import WidgetKit
import SwiftUI

// MARK: - App Group ID
private let kAppGroup = "group.com.versa.bible"
private let kVerseText = "daily_verse_text"
private let kVerseRef  = "daily_verse_reference"

// MARK: - Timeline Entry
struct VersaEntry: TimelineEntry {
    let date: Date
    let verseText: String
    let verseReference: String
}

// MARK: - Timeline Provider
struct VersaProvider: TimelineProvider {

    func placeholder(in context: Context) -> VersaEntry {
        VersaEntry(date: Date(),
                   verseText: "O Senhor é o meu pastor; nada me faltará.",
                   verseReference: "Salmos 23:1")
    }

    func getSnapshot(in context: Context, completion: @escaping (VersaEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<VersaEntry>) -> Void) {
        let entry = loadEntry()

        // Atualiza à meia-noite do próximo dia
        var cal = Calendar.current
        cal.timeZone = .current
        let midnight = cal.startOfDay(for: cal.date(byAdding: .day, value: 1, to: Date())!)

        completion(Timeline(entries: [entry], policy: .after(midnight)))
    }

    private func loadEntry() -> VersaEntry {
        let ud = UserDefaults(suiteName: kAppGroup)
        return VersaEntry(
            date: Date(),
            verseText: ud?.string(forKey: kVerseText) ?? "O Senhor é o meu pastor; nada me faltará.",
            verseReference: ud?.string(forKey: kVerseRef)  ?? "Salmos 23:1"
        )
    }
}

// MARK: - Colors
extension Color {
    static let versaBg    = Color(hex: "#FAFAF8")
    static let versaFg    = Color(hex: "#1A1A1A")
    static let versaGold  = Color(hex: "#C9A96E")
    static let versaMuted = Color(hex: "#9CA3AF")
    static let versaGoldLight = Color(hex: "#E8D5B0")
    static let versaGoldDark  = Color(hex: "#A07C42")

    init(hex: String) {
        var h = hex.trimmingCharacters(in: .alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: h).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch h.count {
        case 6: (a,r,g,b) = (255, int>>16, int>>8 & 0xFF, int & 0xFF)
        case 8: (a,r,g,b) = (int>>24, int>>16 & 0xFF, int>>8 & 0xFF, int & 0xFF)
        default:(a,r,g,b) = (255, 0, 0, 0)
        }
        self.init(.sRGB,
                  red:   Double(r)/255,
                  green: Double(g)/255,
                  blue:  Double(b)/255,
                  opacity: Double(a)/255)
    }
}

// MARK: - Small Widget View
struct SmallWidgetView: View {
    let entry: VersaEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("VERSA")
                .font(.system(size: 9, weight: .bold))
                .foregroundColor(.versaGold)
                .kerning(2)

            Spacer(minLength: 6)

            Text(""\(entry.verseText)"")
                .font(.system(size: 11, design: .serif).italic())
                .foregroundColor(.versaFg)
                .lineLimit(5)
                .fixedSize(horizontal: false, vertical: false)

            Spacer(minLength: 6)

            Text("— \(entry.verseReference)")
                .font(.system(size: 9, weight: .semibold, design: .serif))
                .foregroundColor(.versaGold)
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .background(Color.versaBg)
    }
}

// MARK: - Medium Widget View
struct MediumWidgetView: View {
    let entry: VersaEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("VERSA")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.versaGold)
                    .kerning(2)
                Spacer()
                Text("Palavra do Dia")
                    .font(.system(size: 9))
                    .foregroundColor(.versaMuted)
            }

            Text(""\(entry.verseText)"")
                .font(.system(size: 12, design: .serif).italic())
                .foregroundColor(.versaFg)
                .lineLimit(4)
                .frame(maxWidth: .infinity, alignment: .leading)

            Spacer()

            HStack {
                Text("— \(entry.verseReference)")
                    .font(.system(size: 10, weight: .semibold, design: .serif))
                    .foregroundColor(.versaGold)
                Spacer()
                Text("Abrir →")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundColor(.versaGoldDark)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.versaGoldLight)
                    .cornerRadius(8)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .background(Color.versaBg)
    }
}

// MARK: - Widget Definitions
struct VersaSmallWidget: Widget {
    let kind = "VersaSmallWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VersaProvider()) { entry in
            if #available(iOSApplicationExtension 17.0, *) {
                SmallWidgetView(entry: entry)
                    .containerBackground(.versaBg, for: .widget)
            } else {
                SmallWidgetView(entry: entry)
            }
        }
        .configurationDisplayName("Versa · Versículo")
        .description("Versículo diário na sua tela inicial.")
        .supportedFamilies([.systemSmall])
    }
}

struct VersaMediumWidget: Widget {
    let kind = "VersaMediumWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VersaProvider()) { entry in
            if #available(iOSApplicationExtension 17.0, *) {
                MediumWidgetView(entry: entry)
                    .containerBackground(.versaBg, for: .widget)
            } else {
                MediumWidgetView(entry: entry)
            }
        }
        .configurationDisplayName("Versa · Versículo")
        .description("Versículo com referência e botão de abertura.")
        .supportedFamilies([.systemMedium])
    }
}

// MARK: - Widget Bundle
@main
struct VersaWidgetBundle: WidgetBundle {
    var body: some Widget {
        VersaSmallWidget()
        VersaMediumWidget()
    }
}
