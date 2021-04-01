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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AppBroadcastReceiver extends BroadcastReceiver {

    // the below API is for Telephony.Sms.Intents.getMessagesFromIntent()
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            JSONObject settings_data = AndroidStorage.getReactData(context, MainApplication.REACT_HOOK_FORM);
            if (settings_data != null) {
                Intent service_intent = new Intent(context, LostPhoneService.class);
                SmsMessage[] received_sms = Telephony.Sms.Intents.getMessagesFromIntent(intent);
                String came_message = received_sms[0].getDisplayMessageBody().toLowerCase();
                String regx;
                try {
                    regx = ".*" + settings_data.getString("text_message_alarm") + ".*";
                    if (Pattern.matches(regx, came_message)) {
                        // Stopping the service in case the service had already started from a previous run. This is to ensure that we don't get overlapping
                        // alarms if the user sends two consecutive messages that are near to each other [ up to 3 minutes apart ].
                        context.stopService(service_intent);
                        service_intent.putExtra(MainApplication.EXTRA_INTENT_ACTION, "SOUND_ALARM");
                        context.startService(service_intent);
                    }
                    regx = ".*" + settings_data.getString("text_message_gps") + ".*";
                    if (Pattern.matches(regx, came_message)) {
                        service_intent.putExtra(MainApplication.EXTRA_INTENT_ACTION, "TEXT_GPS_BATTERY");
                        service_intent.putExtra(MainApplication.EXTRA_TELEPHONE, received_sms[0].getOriginatingAddress());
                        context.startService(service_intent);
                    }
                    regx = ".*" + settings_data.getString("text_messsage_lock") + ".*";
                    if (Pattern.matches(regx, came_message)) {
                        Pattern pattern = Pattern.compile("\\{.*\\}");
                        Matcher matcher = pattern.matcher(came_message);
                        if (matcher.find()) {
                            AndroidStorage.putPreferenceData(context, "owner_message", matcher.group().replaceAll("\\{|\\}", ""));
                        } else {
                            AndroidStorage.putPreferenceData(context, "owner_message", "please call me");
                        }
                        Intent lock_activity_intent = new Intent(context, Lock_Screen.class);
                        lock_activity_intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        // Below flag allows a single activity to open instead of the entire app opening with it as well
                        lock_activity_intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        context.startActivity(lock_activity_intent);
                    }
                } catch (JSONException e) {
                    Log.e("JSON_ERROR", e.toString());
                }
            }
        }
    }

}
