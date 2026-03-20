package com.versa.bible

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class VersaWidgetSmallProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (id in appWidgetIds) {
            updateWidget(context, appWidgetManager, id)
        }
    }

    companion object {
        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences("versa_widget_prefs", Context.MODE_PRIVATE)
            val text = prefs.getString("daily_verse_text", "O Senhor é o meu pastor; nada me faltará.") ?: ""
            val ref  = prefs.getString("daily_verse_reference", "Salmos 23:1") ?: ""

            val views = RemoteViews(context.packageName, R.layout.versa_widget_small)
            views.setTextViewText(R.id.widget_verse, "\u201c$text\u201d")
            views.setTextViewText(R.id.widget_reference, "\u2014 $ref")

            // Abre o app ao tocar
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            val pendingIntent = PendingIntent.getActivity(
                context, 0, launchIntent, PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_verse, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
