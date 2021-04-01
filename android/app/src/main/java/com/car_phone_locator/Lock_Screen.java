package com.car_phone_locator;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import org.json.JSONObject;

public class Lock_Screen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Removes the Status bar. Must be above setContentView() method
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_lock_screen);

        Button call_button = (Button) findViewById(R.id.call_button);
        Button enter_button = (Button) findViewById(R.id.enter_button);
        TextView msg_container = (TextView) findViewById(R.id.msg_container);
        TextView warning_container = (TextView) findViewById(R.id.pin_error_container);
        EditText pin_container = (EditText) findViewById(R.id.pin_container);
        JSONObject settings_form = AndroidStorage.getReactData(this, MainApplication.REACT_HOOK_FORM);

        call_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Uri uri = Uri.parse("tel:" + AndroidStorage.getField(settings_form, "contact_number"));
                Intent phone_call_activity_intent = new Intent(Intent.ACTION_CALL, uri);
                try {
                    startActivity(phone_call_activity_intent);
                } catch (SecurityException s) {
                    Toast.makeText(Lock_Screen.this, "Cannot Make a Call Right Now", Toast.LENGTH_LONG).show();
                }
            }
        });
        msg_container.setText(AndroidStorage.getPreferenceData("owner_message"));
        enter_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (AndroidStorage.getField(settings_form, "lock_screen_password").equals(pin_container.getText().toString())) {
                    finish();
                } else {
                    warning_container.setText(R.string.wrong_pin_warning);
                }
            }
        });
    }

    @Override
    public void onBackPressed() {
        // Do nothing to disable the back button
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (!hasFocus) {
            Intent close_system_dialogs = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
            sendBroadcast(close_system_dialogs);
        }
    }

//    @Override
//    protected void onPause() {
//        super.onPause();
//
//    }

}
