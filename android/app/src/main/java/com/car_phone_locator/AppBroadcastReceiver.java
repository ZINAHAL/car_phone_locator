package com.car_phone_locator;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;
import androidx.annotation.RequiresApi;
import org.json.JSONException;
import org.json.JSONObject;

public class AppBroadcastReceiver extends BroadcastReceiver {

    // the below API is for Telephony.Sms.Intents.getMessagesFromIntent()
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            JSONObject settings_data = AndroidStorage.getData(context, "@phone_hook_form");
            if (settings_data != null) {
                Intent service_intent = new Intent(context, LostPhoneService.class);
                SmsMessage[] received_sms = Telephony.Sms.Intents.getMessagesFromIntent(intent);
                String came_message = received_sms[0].getDisplayMessageBody();
                try {
                    if (settings_data.getString("text_message_alarm").equals(came_message)) {
                        // Stopping the service in case the service had already started from a previous run. This is to ensure that we don't get overlapping
                        // alarms if the user sends two consecutive messages that are near to each other [ up to 3 minutes apart ].
                        context.stopService(service_intent);
                        service_intent.putExtra("action", "SOUND_ALARM");
                        context.startService(service_intent);
                    }
                    if (settings_data.getString("text_message_gps").equals(came_message)) {
                        service_intent.putExtra("action", "TEXT_GPS_BATTERY");
                        service_intent.putExtra("telephone", received_sms[0].getOriginatingAddress());
                        context.startService(service_intent);
                    }
                } catch (JSONException e) {
                    Log.e("JSON_ERROR", e.toString());
                }
            }
        }
    }
}
