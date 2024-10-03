package com.example.androidfront

import android.Manifest
import android.content.*
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.CheckBox
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat

class TempActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var checkedInBox: CheckBox
    private lateinit var checkedOutBox: CheckBox
    private lateinit var checkInOutReceiver: BroadcastReceiver

    // true if user inside office
    private var checkedIn: Boolean = false;
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        sharedPreferences = getSharedPreferences("location", MODE_PRIVATE)
        checkedIn = sharedPreferences.getBoolean("checked_in", false)
        checkedInBox = findViewById(R.id.checkInBox)
        checkedOutBox = findViewById(R.id.checkOutBox)


        // get location permission if not given
        if(!permissionsEnabled()){
            Log.e("Permissions", "Requesting Permissions")
            getPermissions()
        }else{
            Log.e("Permissions", "Permissions are granted")
        }

        checkInOutReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val checkedIn = intent?.getBooleanExtra("checkedIn", false) ?: false
                runOnUiThread {
                    if (checkedIn) {
                        checkedInBox.isChecked = true
                        checkedOutBox.isChecked = false
                    } else {
                        checkedInBox.isChecked = false
                        checkedOutBox.isChecked = true
                    }
                }
            }
        }

        val filter = IntentFilter("com.example.LOCATION_STATUS_UPDATE")
        registerReceiver(checkInOutReceiver, filter)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 1) {
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                // Start service after permissions are granted
                val intent = Intent(this, LocationForegroundService::class.java)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    startForegroundService(intent)
                } else {
                    startService(intent)
                }
            } else {
                Log.e("Permissions", "Required permissions denied.")
                showAlert("Permission needed", "Permissions are needed to for the app to run properly")
            }
        }
    }

    private fun showAlert(title: String, message: String) {
        android.app.AlertDialog.Builder(this).apply {
            setTitle(title)
            setMessage(message)
            setPositiveButton("OK", null)
            create()
            show()
        }
    }


    private fun permissionsEnabled(): Boolean {
        val locationPermission = ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        val backgroundPermission = ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
        val notificationPermission = ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

        return locationPermission && backgroundPermission && notificationPermission
    }


    private fun getPermissions() {
        Log.e("Permission", "Permission requested");
        ActivityCompat.requestPermissions(
            this,
            arrayOf(
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_BACKGROUND_LOCATION,
                Manifest.permission.POST_NOTIFICATIONS
            ),
            1
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        if(::checkInOutReceiver.isInitialized){
            unregisterReceiver(checkInOutReceiver)
        }
    }
}