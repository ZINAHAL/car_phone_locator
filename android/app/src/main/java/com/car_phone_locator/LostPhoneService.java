package com.car_phone_locator;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.BatteryManager;
import android.os.IBinder;
import android.provider.Settings;
import android.telephony.SmsManager;
import androidx.annotation.Nullable;
import com.google.android.gms.tasks.OnSuccessListener;

public class LostPhoneService extends Service {

    private int current_user_media_volume;
    private MediaPlayer alarm;
    private Runnable stop_service_runnable = new Runnable() {
        @Override
        public void run() {
            LostPhoneService.this.stopService(new Intent(LostPhoneService.this, LostPhoneService.class));
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if ("TEXT_GPS_BATTERY".equals(intent.getStringExtra("action"))) {
            // Get current battery percentage
            IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = registerReceiver(null, ifilter);
            int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            float batteryPct = level * 100 / (float)scale;

            // Get last best known location and text gps and battery percentage
            MainApplication.fusedLocationClient.getLastLocation().addOnSuccessListener(new OnSuccessListener<Location>() {
                @Override
                public void onSuccess(Location location) {
                    String lat_lon_gps = null;
                    if (location != null) {
                        lat_lon_gps = location.getLatitude() + ", " + location.getLongitude();
                    }
                    String sms = "CURRENT LOCATION: " + (lat_lon_gps == null ? "gps turned off" : lat_lon_gps) + "\n" + "CURRENT BATTERY PERCENTAGE: " + batteryPct;
                    SmsManager smsManager = SmsManager.getDefault();
                    smsManager.sendTextMessage(intent.getStringExtra("telephone"), null, sms, null, null);
                }
            });
            stopSelf();
        } else {    // In this case the action is "SOUND_ALARM"
            // Setting the media volume to its highest
            current_user_media_volume = MainApplication.audio_manager.getStreamVolume(AudioManager.STREAM_MUSIC);
            MainApplication.audio_manager.setStreamVolume(
                    AudioManager.STREAM_MUSIC,
                    MainApplication.audio_manager.getStreamMaxVolume(AudioManager.STREAM_MUSIC),
                    0
            );
            // Turning the alarm on and turning the current service into a Foreground Service
            alarm = MediaPlayer.create(this, Settings.System.DEFAULT_RINGTONE_URI);
            alarm.start();
            Notification notification = NotificationProvider.createNotification(this);
            startForeground(7, notification);
            // Stopping the service after some time, in case the user doesn't interact with the above notification
            MainApplication.ui_handler.postDelayed(stop_service_runnable, 180000); // delayMillis: 3 minutes
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (alarm != null) {
            alarm.stop();
            MainApplication.ui_handler.removeCallbacks(stop_service_runnable);
            MainApplication.audio_manager.setStreamVolume(
                    AudioManager.STREAM_MUSIC,
                    current_user_media_volume,
                    0
            );
        }
    }
}



// ***************** OBSERVATIONS *******************
/*
* 1- public static final AtomicReference<String> lat_lon_gps_holder = new AtomicReference<String>();
* The above technique is used if a variable needs to be UPDATED by an anonymous class [ https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html ]
* OR, ANOTHER WAY:
* Use arrays - see method 'getCurrentLocation(Promise promise)' in file JavaHelpersModule.java
* */
