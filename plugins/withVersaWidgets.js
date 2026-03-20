/**
 * withVersaWidgets.js
 * Expo config plugin que adiciona suporte a widgets no iOS e Android.
 *
 * iOS : WidgetKit extension (SwiftUI) + App Groups + native bridge
 * Android : AppWidgetProvider (XML + Kotlin) + native module
 *
 * Executado automaticamente durante `expo prebuild` / `eas build`.
 */

const {
  withXcodeProject,
  withEntitlementsPlist,
  withAndroidManifest,
  withAppBuildGradle,
  withMainApplication,
  IOSConfig,
} = require('@expo/config-plugins');
const fs   = require('fs');
const path = require('path');

const APP_GROUP      = 'group.com.versa.bible';
const WIDGET_TARGET  = 'VersaWidgetExtension';
const BUNDLE_SUFFIX  = '.widget';
const SRC_IOS    = path.join(__dirname, '../src/widgets/ios');
const SRC_ANDROID = path.join(__dirname, '../src/widgets/android');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// iOS — App Groups entitlement (main app)
// ─────────────────────────────────────────────────────────────────────────────

function withAppGroupEntitlement(config) {
  return withEntitlementsPlist(config, (mod) => {
    const ents = mod.modResults;
    const groups = ents['com.apple.security.application-groups'] ?? [];
    if (!groups.includes(APP_GROUP)) {
      ents['com.apple.security.application-groups'] = [...groups, APP_GROUP];
    }
    return mod;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// iOS — Widget extension target + native bridge files
// ─────────────────────────────────────────────────────────────────────────────

function withIOSWidgetExtension(config) {
  return withXcodeProject(config, async (mod) => {
    const proj          = mod.modResults;
    const iosDir        = mod.modRequest.platformProjectRoot;
    const widgetDir     = path.join(iosDir, WIDGET_TARGET);
    const bundleId      = `${mod.ios?.bundleIdentifier ?? 'com.versa.bible'}${BUNDLE_SUFFIX}`;

    ensureDir(widgetDir);

    // 1. Copia os arquivos Swift para ios/VersaWidgetExtension/
    const swiftFiles = ['VersaWidget.swift', 'VersaWidgetBridge.swift', 'VersaWidgetBridge.m'];
    swiftFiles.forEach((f) => {
      const src = path.join(SRC_IOS, f);
      if (fs.existsSync(src)) copyFile(src, path.join(widgetDir, f));
    });

    // 2. Gera o Info.plist da extensão
    const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key><string>$(DEVELOPMENT_LANGUAGE)</string>
  <key>CFBundleDisplayName</key><string>VersaWidget</string>
  <key>CFBundleExecutable</key><string>$(EXECUTABLE_NAME)</string>
  <key>CFBundleIdentifier</key><string>${bundleId}</string>
  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
  <key>CFBundleName</key><string>$(PRODUCT_NAME)</string>
  <key>CFBundlePackageType</key><string>XPC!</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>NSExtension</key>
  <dict>
    <key>NSExtensionPointIdentifier</key><string>com.apple.widgetkit-extension</string>
  </dict>
  <key>com.apple.security.application-groups</key>
  <array><string>${APP_GROUP}</string></array>
</dict>
</plist>`;
    fs.writeFileSync(path.join(widgetDir, 'Info.plist'), infoPlist);

    // 3. Entitlements da extensão
    const extEntitlements = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.application-groups</key>
  <array><string>${APP_GROUP}</string></array>
</dict>
</plist>`;
    fs.writeFileSync(path.join(widgetDir, `${WIDGET_TARGET}.entitlements`), extEntitlements);

    // 4. Adiciona o target ao projeto Xcode (se ainda não existir)
    const targets = proj.pbxNativeTargetSection();
    const already = Object.values(targets).some(
      (t) => typeof t === 'object' && t.name === WIDGET_TARGET,
    );

    if (!already) {
      proj.addTarget(WIDGET_TARGET, 'app_extension', WIDGET_TARGET, bundleId);

      // Adiciona os arquivos Swift ao grupo do target
      const files = proj.pbxGroupByName(WIDGET_TARGET);
      const groupKey = files ? proj.findPBXGroupKey({ name: WIDGET_TARGET }) : null;

      swiftFiles.forEach((f) => {
        proj.addSourceFile(`${WIDGET_TARGET}/${f}`, {}, groupKey ?? undefined);
      });
    }

    return mod;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Android — copia arquivos e registra no Manifest
// ─────────────────────────────────────────────────────────────────────────────

function withAndroidWidgetFiles(config) {
  // Fase custom: copia os arquivos antes das demais modificações
  return withAndroidManifest(config, async (mod) => {
    const projectRoot  = mod.modRequest.projectRoot;
    const androidRoot  = path.join(projectRoot, 'android', 'app', 'src', 'main');
    const packageName  = mod.android?.package ?? 'com.versa.bible';
    const packagePath  = packageName.replace(/\./g, '/');
    const kotlinDir    = path.join(androidRoot, 'java', packagePath);
    const resDir       = path.join(androidRoot, 'res');

    ensureDir(kotlinDir);

    // Copia Kotlin
    ['VersaWidgetSmallProvider.kt', 'VersaWidgetMediumProvider.kt',
     'VersaWidgetModule.kt', 'VersaWidgetPackage.kt'].forEach((f) => {
      const src = path.join(SRC_ANDROID, f);
      if (fs.existsSync(src)) {
        // Substitui o packageName no conteúdo
        let content = fs.readFileSync(src, 'utf8');
        content = content.replace(/^package com\.versa\.bible/m, `package ${packageName}`);
        fs.mkdirSync(kotlinDir, { recursive: true });
        fs.writeFileSync(path.join(kotlinDir, f), content);
      }
    });

    // Copia recursos
    const resDirs = [
      ['res/layout', 'layout'],
      ['res/xml', 'xml'],
      ['res/drawable', 'drawable'],
    ];
    resDirs.forEach(([srcSub, destSub]) => {
      const srcDir  = path.join(SRC_ANDROID, srcSub);
      const destDir = path.join(resDir, destSub);
      if (fs.existsSync(srcDir)) {
        ensureDir(destDir);
        fs.readdirSync(srcDir).forEach((f) =>
          copyFile(path.join(srcDir, f), path.join(destDir, f))
        );
      }
    });

    // Adiciona string resources para descrição dos widgets
    const stringsPath = path.join(resDir, 'values', 'strings.xml');
    if (fs.existsSync(stringsPath)) {
      let strings = fs.readFileSync(stringsPath, 'utf8');
      if (!strings.includes('widget_small_description')) {
        strings = strings.replace(
          '</resources>',
          `    <string name="widget_small_description">Versículo do dia</string>\n` +
          `    <string name="widget_medium_description">Versículo do dia com referência</string>\n` +
          `</resources>`,
        );
        fs.writeFileSync(stringsPath, strings);
      }
    }

    // Registra os receivers no AndroidManifest.xml
    const manifest = mod.modResults.manifest;
    const application = manifest.application?.[0];
    if (!application) return mod;

    const receivers = /** @type {any[]} */ (application.receiver ?? []);
    const hasSmall  = receivers.some((r) => r.$?.['android:name']?.includes('VersaWidgetSmall'));
    const hasMedium = receivers.some((r) => r.$?.['android:name']?.includes('VersaWidgetMedium'));

    if (!hasSmall) {
      receivers.push({
        $: {
          'android:name': `.VersaWidgetSmallProvider`,
          'android:label': 'Versa – Versículo',
          'android:exported': 'true',
        },
        'intent-filter': [{
          action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }],
        }],
        'meta-data': [{
          $: {
            'android:name': 'android.appwidget.provider',
            'android:resource': '@xml/versa_widget_small_info',
          },
        }],
      });
    }

    if (!hasMedium) {
      receivers.push({
        $: {
          'android:name': `.VersaWidgetMediumProvider`,
          'android:label': 'Versa – Versículo Médio',
          'android:exported': 'true',
        },
        'intent-filter': [{
          action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }],
        }],
        'meta-data': [{
          $: {
            'android:name': 'android.appwidget.provider',
            'android:resource': '@xml/versa_widget_medium_info',
          },
        }],
      });
    }

    application.receiver = receivers;
    return mod;
  });
}

// Registra o VersaWidgetPackage no MainApplication
function withAndroidWidgetPackage(config) {
  return withMainApplication(config, (mod) => {
    let content = mod.modResults.contents;
    if (!content.includes('VersaWidgetPackage')) {
      content = content.replace(
        /packages\.add\(new ReactNativeHostWrapper\(this, new DefaultReactNativeHost\(this\)\)\)/,
        (match) => `${match}\n      packages.add(new VersaWidgetPackage());`,
      );
      // Fallback para outros templates
      if (!content.includes('VersaWidgetPackage')) {
        content = content.replace(
          /return packages;/,
          `packages.add(new VersaWidgetPackage());\n      return packages;`,
        );
      }
    }
    mod.modResults.contents = content;
    return mod;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin principal — compõe todos os mods
// ─────────────────────────────────────────────────────────────────────────────

module.exports = function withVersaWidgets(config) {
  config = withAppGroupEntitlement(config);
  config = withIOSWidgetExtension(config);
  config = withAndroidWidgetFiles(config);
  config = withAndroidWidgetPackage(config);
  return config;
};
