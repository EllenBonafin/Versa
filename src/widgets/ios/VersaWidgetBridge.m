#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VersaWidgetBridge, NSObject)
RCT_EXTERN_METHOD(setDailyVerse:(NSString *)text
                  reference:(NSString *)reference
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
