package com.car_phone_locator;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;

public class NotificationProvider extends BroadcastReceiver {

    public static Notification createNotification(Context context) {
        Intent broadcast_intent = new Intent(context, NotificationProvider.class);
        PendingIntent action_intent = PendingIntent.getBroadcast(context, 0, broadcast_intent, 0);
        return new NotificationCompat.Builder(context, MainApplication.LOST_PHONE_CHANNEL_ID)
                .setContentTitle("Carphone Locator")
                .setContentText("Sounding The Alarm! Hope you Found me!...")
                .setSmallIcon(R.drawable.ic_android)
                .addAction(R.mipmap.ic_launcher, "YES!", action_intent)
                .build();
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        context.stopService(new Intent(context, LostPhoneService.class));
    }
}
