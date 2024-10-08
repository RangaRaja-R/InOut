package com.example.androidfront

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class LocationForegroundService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private var checkedIn: Boolean = false

    companion object {
        const val CHANNEL_ID = "LocationChannel"
    }

    override fun onCreate() {
        super.onCreate()

        createNotificationChannel()
        Log.e("service", "onCreate")
        // Start foreground service with a persistent notification
        startForeground(1, createNotification())

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let { location ->
                    handleLocationUpdate(location.latitude, location.longitude)
                }
            }
        }
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(60000)
            .setPriority(Priority.PRIORITY_BALANCED_POWER_ACCURACY)
            .build()
        Log.e("location", "startLocationUpdates")
        if (ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED) {
            stopSelf() // Stop service if permission is not granted
            return
        }
        sendDebugNotification("Service Started");
        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null)
    }

    private fun handleLocationUpdate(latitude: Double, longitude: Double) {
        val isWithinOffice = isWithinOfficeRadius(latitude, longitude)
        Log.e("Location", "$isWithinOffice lat: $latitude, lon: $longitude")
        sendDebugNotification("$isWithinOffice lat: $latitude, lon: $longitude")
        if (isWithinOffice != checkedIn) {
            checkedIn = isWithinOffice
            sendCheckInOutBroadcast(checkedIn)
            sendLocation(latitude, longitude,
                onSuccess = {
                    Log.d("LocationService", "Check-in/Check-out successful.")
                    sendDebugNotification("$checkedIn in at $latitude, $longitude")
                },
                onFailure = { message ->
                    Log.e("LocationService", message)
                })
        }
    }

    private fun sendLocation(latitude: Double, longitude: Double, onSuccess: () -> Unit, onFailure: (String) -> Unit) {
        val jwtToken = getJwtToken()
        if (jwtToken == null) {
            onFailure("JWT token is missing. Please log in again.")
            return
        }

        val backendUrl = getBackendUrl()
        if (backendUrl == null) {
            onFailure("Backend URL is missing. Please log in again.")
            return
        }

        val client = OkHttpClient()

        val requestData = JSONObject().apply {
            put("latitude", latitude)
            put("longitude", longitude)
        }

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = requestData.toString().toRequestBody(mediaType)

        val request = if (checkedIn) {
            Request.Builder()
                .url("$backendUrl/check-in")
                .post(requestBody)
                .addHeader("Cookie", "jwt=$jwtToken")
                .build()
        } else {
            Request.Builder()
                .url("$backendUrl/check-out")
                .post(requestBody)
                .addHeader("Cookie", "jwt=$jwtToken")
                .build()
        }

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                onFailure("Network Error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!it.isSuccessful) {
                        val errorMessage = it.body?.string()?.let { responseBody ->
                            try {
                                val json = JSONObject(responseBody)
                                json.optString("message", "Check-in failed")
                            } catch (e: JSONException) {
                                "Check-in failed: Unable to parse error message"
                            }
                        } ?: "Check-in failed: Empty response"
                        onFailure("Check-in failed: $errorMessage")
                    } else {
                        onSuccess()
                    }
                }
            }
        })
    }

    private fun sendCheckInOutBroadcast(checkedIn: Boolean) {
        val intent = Intent("com.example.LOCATION_STATUS_UPDATE")
        intent.putExtra("checkedIn", checkedIn)
        sendBroadcast(intent)
    }

    private fun isWithinOfficeRadius(latitude: Double, longitude: Double): Boolean {
        val sharedPreferences = getSharedPreferences("Location", MODE_PRIVATE)
        val officeLat = sharedPreferences.getFloat("office_lat", 0.0F).toDouble();
        val officeLon = sharedPreferences.getFloat("office_lon", 0.0F).toDouble();
        val officeLocation = Location("office").apply {
            this.latitude = officeLat
            this.longitude = officeLon
        };
        val currentLocation = Location("current").apply {
            this.latitude = latitude
            this.longitude = longitude
        }

        val distance = currentLocation.distanceTo(officeLocation)
        if(checkedIn){
            return distance <= 100 // exit radius
        }
        return distance <= 50 // entry radius
    }

    private fun getJwtToken(): String? {
        val sharedPreferences = getSharedPreferences("app_prefs", MODE_PRIVATE)
        return sharedPreferences.getString("jwt_token", null)
    }

    private fun getBackendUrl(): String? {
        val sharedPreferences = getSharedPreferences("app_prefs", MODE_PRIVATE)
        return sharedPreferences.getString("backend_url", "")
    }

    // Notification to indicate that the service is running
    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Tracking location")
            .setContentText("App is tracking your location in the background.")
            .setSmallIcon(R.drawable.logo)
            .build()
    }

    // Create notification channel (required for Android O and above)
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Location Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    // Debug notification to track when location updates are sent
    private fun sendDebugNotification(message: String) {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Location Update")
            .setContentText(message)
            .setSmallIcon(R.drawable.logo)
            .build()

        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(2, notification)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }
}
