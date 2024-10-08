package com.example.androidfront

import android.Manifest
import android.content.*
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.CheckBox
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.localbroadcastmanager.content.LocalBroadcastManager

class TempActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var checkedInBox: CheckBox
    private lateinit var checkedOutBox: CheckBox

    companion object{
        const val LOCATION_REQUEST_CODE = 1001;
        const val NOTIFICATION_REQUEST_CODE = 1002;
    }

    // true if user inside office
    private var checkedIn: Boolean = false;
    @RequiresApi(Build.VERSION_CODES.Q)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        sharedPreferences = getSharedPreferences("location", MODE_PRIVATE)
        checkedIn = sharedPreferences.getBoolean("checked_in", false)
        checkedInBox = findViewById(R.id.checkInBox)
        checkedOutBox = findViewById(R.id.checkOutBox)

//        requestLocationPermissions()
        startLocationService()
    }

    private fun requestLocationPermissions() {
        if (ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED ||
            ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_BACKGROUND_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            Log.e("Permissions", "Location Permissions are not granted");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_BACKGROUND_LOCATION
                    ),
                    LOCATION_REQUEST_CODE
                )
            }
        }else {
            Log.e("Permissions", "Location Permissions are granted");
            requestNotificationPermissionIfNeeded()
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                Log.e("Permissions", "Permissions are not granted");
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    NOTIFICATION_REQUEST_CODE
                )
            } else {
                Log.e("Permissions", "Permissions are granted");
                // Start the service directly if both permissions are granted
                startLocationService()
            }
        } else {
            startLocationService()
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == LOCATION_REQUEST_CODE) {
            val fineLocationGranted = grantResults[0] == PackageManager.PERMISSION_GRANTED
            val backgroundLocationGranted =
                if (grantResults.size > 1) grantResults[1] == PackageManager.PERMISSION_GRANTED else true // Handle Android versions that don't need background location

            if (fineLocationGranted && backgroundLocationGranted) {
                // Request notification permissions if needed
                requestNotificationPermissionIfNeeded()
            } else {
                showAlert("Permissions not granted", "Location access is required for the proper functioning of app");
            }
        } else if (requestCode == NOTIFICATION_REQUEST_CODE) {
            // Handle the result of the notification permission request (if applicable)
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Start the service if permission is granted
                startLocationService()
            }
        }
    }

    private fun startLocationService() {
        val serviceIntent = Intent(this, LocationForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent) // Start as foreground service on Android O+
        } else {
            startService(serviceIntent)
        }
    }

    private fun stopLocationService() {
        val serviceIntent = Intent(this, LocationForegroundService::class.java)
        stopService(serviceIntent)
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

    override fun onDestroy() {
        super.onDestroy()
        stopLocationService();
    }
}