package com.versa.bible

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class VersaWidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "VersaWidgetBridge"

    @ReactMethod
    fun setDailyVerse(text: String, reference: String, promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences("versa_widget_prefs", Context.MODE_PRIVATE)
            prefs.edit().apply {
                putString("daily_verse_text", text)
                putString("daily_verse_reference", reference)
                apply()
            }

            // Força atualização dos widgets
            val manager = AppWidgetManager.getInstance(reactContext)

            val smallIds = manager.getAppWidgetIds(
                ComponentName(reactContext, VersaWidgetSmallProvider::class.java)
            )
            for (id in smallIds) {
                VersaWidgetSmallProvider.updateWidget(reactContext, manager, id)
            }

            val mediumIds = manager.getAppWidgetIds(
                ComponentName(reactContext, VersaWidgetMediumProvider::class.java)
            )
            for (id in mediumIds) {
                VersaWidgetMediumProvider.updateWidget(reactContext, manager, id)
            }

            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERR_WIDGET", e.message, e)
        }
    }
}
