package com.example.androidfront;

import android.Manifest
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import android.widget.Toast
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat
import com.example.androidfront.LoginActivity
import com.example.androidfront.DashboardActivity

class BackendUrlActivity : AppCompatActivity() {

    private lateinit var urlInput: EditText
    private lateinit var saveButton: Button

    companion object{
        const val LOCATION_REQUEST_CODE = 1001;
        const val NOTIFICATION_REQUEST_CODE = 1002;
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_api)
        val sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        val url = sharedPreferences.getString("backend_url", null)

        requestLocationPermissions()

        if(!url.isNullOrEmpty()){
            val intent = Intent(this, QRActivity::class.java)
            startActivity(intent)
            return
        }

        urlInput = findViewById(R.id.api_url)
        saveButton = findViewById(R.id.btn_connect)

        saveButton.setOnClickListener {
            val backendUrl = urlInput.text.toString()
            if (backendUrl.isNotEmpty()) {
                // Save the backend URL in SharedPreferences or another storage
                val sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
                sharedPreferences.edit().putString("backend_url", backendUrl).apply()

                // Proceed to check if the user is already logged in
                checkLoginStatus()
            } else {
                Toast.makeText(this, "Please enter a valid URL", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun checkLoginStatus() {
        val sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("jwt_token", null)
        if (token == null) {
            // No token, navigate to the Login screen
            val intent = Intent(this, QRActivity::class.java)
            startActivity(intent)
        } else {
            // Token exists, navigate to the Dashboard
            val intent = Intent(this, TempActivity::class.java)
            startActivity(intent)
        }
        finish() // Close the current activity
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

    private fun requestLocationPermissions() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED
        ) {
            // If fine location is not granted, request it
            Log.e("Permissions", "Requesting ACCESS_FINE_LOCATION")
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                LOCATION_REQUEST_CODE
            )
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
            ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_BACKGROUND_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // If fine location is granted, but background location is not, request background permission
            Log.e("Permissions", "Requesting ACCESS_BACKGROUND_LOCATION")
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                LOCATION_REQUEST_CODE
            )
        } else {
            // Both permissions granted, proceed
            Log.e("Permissions", "Location Permissions are granted")
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
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == LOCATION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Fine location granted
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                    ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                    != PackageManager.PERMISSION_GRANTED
                ) {
                    // Request background location permission if it hasn't been granted yet
                    ActivityCompat.requestPermissions(
                        this,
                        arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                        LOCATION_REQUEST_CODE
                    )
                } else {
                    // All location permissions are granted
                    requestNotificationPermissionIfNeeded()
                }
            } else {
                // Permissions not granted
                showAlert("Permissions not granted", "Location access is required for the proper functioning of app")
            }
        } else if (requestCode == NOTIFICATION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Notification permission granted
                Log.e("Permissions", "Notification permission granted")
            }
        }
    }

}
