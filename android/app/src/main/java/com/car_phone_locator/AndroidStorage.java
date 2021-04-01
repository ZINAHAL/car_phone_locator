package com.car_phone_locator;

import com.facebook.react.modules.storage.AsyncLocalStorageUtil;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

public class AndroidStorage {

    static SharedPreferences preferences;

    public static JSONObject getReactData(Context context, String key) {
        SQLiteDatabase readableDatabase = ReactDatabaseSupplier.getInstance(context).getReadableDatabase();
        JSONObject json_data = null;
        if (readableDatabase != null) {
            String raw_data = AsyncLocalStorageUtil.getItemImpl(readableDatabase, key);
            if (raw_data != null) {
                try {
                    json_data = new JSONObject(raw_data);
                } catch (JSONException e) {
                    Log.e("JSON_ERROR", e.toString());
                }
            }
        }
        return json_data;
    }

    public static String getField(JSONObject form, String key) {
        try {
            return form.getString(key);
        } catch (JSONException e) {
            return "";
        }
    }

    public static void putPreferenceData(Context context, String key, String value) {
        preferences = context.getSharedPreferences(context.getPackageName(), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static String getPreferenceData(String key) {
        return (preferences == null ? "" : preferences.getString(key, ""));
    }
}
