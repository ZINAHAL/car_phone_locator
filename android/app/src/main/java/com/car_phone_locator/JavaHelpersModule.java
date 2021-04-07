package com.car_phone_locator;

import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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

}
