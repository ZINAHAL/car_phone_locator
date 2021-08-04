package com.car_phone_locator;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Build;
import android.os.Handler;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  public static final String LOST_PHONE_CHANNEL_ID = "lost_phone_777";
  public static FusedLocationProviderClient fusedLocationClient;
  public static Handler ui_handler;
  public static AudioManager audio_manager;

    private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
           packages.add(new AppReactPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    createNotificationChannels();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        // Disable 'AppBroadcastReceiver' broadcast receiver since it needs permissions of type dangerous which
        // need to be granted at runtime, this goes against what the app is trying to do.

        ComponentName appBroadcastReceiver = new ComponentName(this, AppBroadcastReceiver.class);
        PackageManager packageManager = getPackageManager();
        packageManager.setComponentEnabledSetting(
                appBroadcastReceiver,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
        );

    }
    fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
    ui_handler = new Handler(getMainLooper());
    audio_manager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.car_phone_locator.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  private void createNotificationChannels() {
      // Below condition is needed as the Notification Channel class is not available in lower API levels. Only on Oreo and higher.
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel lost_phone_channel = new NotificationChannel(
                  LOST_PHONE_CHANNEL_ID,
                  "Lost Phone Section",
                  NotificationManager.IMPORTANCE_DEFAULT
          );
          NotificationManager notificationManager = getSystemService(NotificationManager.class);
          notificationManager.createNotificationChannel(lost_phone_channel);
      }
  }

}
