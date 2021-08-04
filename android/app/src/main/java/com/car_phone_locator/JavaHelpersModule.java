package com.car_phone_locator;

import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.provider.Settings;
import android.widget.Toast;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.android.gms.tasks.OnSuccessListener;

public class JavaHelpersModule extends ReactContextBaseJavaModule {

    JavaHelpersModule(ReactApplicationContext context) { super(context); }

    @NonNull
    @Override
    public String getName() {
        return "JavaHelpersModule";
    }

    @ReactMethod
    public void isKeyguardScreenEnabled(Promise promise) {
        KeyguardManager keyguardManager = (KeyguardManager) getReactApplicationContext().getSystemService(Context.KEYGUARD_SERVICE);
        promise.resolve(keyguardManager == null || keyguardManager.isKeyguardSecure());
    }

    @ReactMethod
    public void openPhonesSettingsApp() {
        Intent security_settings_intent = new Intent(Settings.ACTION_SETTINGS);
        security_settings_intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(security_settings_intent);
    }

    @ReactMethod
    public void getCurrentLocation(Promise promise) {
        MainApplication.fusedLocationClient.getLastLocation().addOnSuccessListener(new OnSuccessListener<Location>() {
            @Override
            public void onSuccess(Location location) {
                try {
                    WritableArray writableArray = new WritableNativeArray();
                    writableArray.pushDouble(location.getLatitude());
                    writableArray.pushDouble(location.getLongitude());
                    promise.resolve(writableArray);
                } catch (Exception e) {
                    promise.reject("GPS ERROR", "Latitude: 0, Longitude: 0");
                }
            }
        });
    }

    @ReactMethod
    public void showToastMessage(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();
    }

}
