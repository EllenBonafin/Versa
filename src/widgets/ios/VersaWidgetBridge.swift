import Foundation
import WidgetKit

@objc(VersaWidgetBridge)
class VersaWidgetBridge: NSObject {

    private let appGroupID = "group.com.versa.bible"

    @objc static func requiresMainQueueSetup() -> Bool { false }

    @objc func setDailyVerse(
        _ text: String,
        reference: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else {
            reject("ERR_APP_GROUP", "App Group não configurado", nil)
            return
        }
        defaults.set(text, forKey: "daily_verse_text")
        defaults.set(reference, forKey: "daily_verse_reference")
        defaults.synchronize()

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        resolve(nil)
    }
}
