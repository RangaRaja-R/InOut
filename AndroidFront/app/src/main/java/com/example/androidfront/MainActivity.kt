package com.example.androidfront

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.Request
import okhttp3.Response
import org.json.JSONObject
import java.io.IOException


class DashboardActivity : AppCompatActivity() {

    private lateinit var checkInButton: Button
    private lateinit var checkOutButton: Button
    private lateinit var fusedLocationClient: FusedLocationProviderClient


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        checkInButton = findViewById(R.id.btn_check_in)
        checkOutButton = findViewById(R.id.btn_check_out)

        checkInButton.setOnClickListener {
            performCheckIn()
        }

        checkOutButton.setOnClickListener {
            // Perform check-out operation
            performCheckOut()
        }
    }

    fun performCheckIn() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
            && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), 1)
            return
        }

        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                val latitude = location.latitude
                val longitude = location.longitude
                sendCheckInRequest(latitude, longitude,
                    onSuccess = { message ->
                        runOnUiThread {
                            showAlert("Check In", message)
                        }
                    },
                    onFailure = { message ->
                        runOnUiThread {
                            showAlert("Check In - error", message)
                        }
                    }
                )
            } else {
                runOnUiThread {
                    Toast.makeText(this, "Unable to get location", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    fun sendCheckInRequest(latitude: Double, longitude: Double, onSuccess: (String) -> Unit, onFailure: (String) -> Unit) {
        val jwtToken = getJwtToken()
        if (jwtToken == null) {
            runOnUiThread {
                onFailure("JWT token is missing. Please log in again.")
            }
            return
        }

        val client = OkHttpClient()

        val json = JSONObject().apply {
            put("latitude", latitude)
            put("longitude", longitude)
        }.toString()

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, json)
        val backendUrl = getBackendUrl()
        if (backendUrl != null) {
            Log.d("calling...", backendUrl)
        } else {
            Log.e("not found", "api")
        }
        val request = Request.Builder()
            .url("$backendUrl/check-in") // Adjust the endpoint as per your backend
            .post(requestBody)
            .addHeader("Cookie", "jwt=$jwtToken")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    onFailure("Network Error: ${e.message}")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!it.isSuccessful) {
                        runOnUiThread {
                            onFailure("Check-in failed: ${it.message}")
                        }
                    } else {
                        runOnUiThread {
                            onSuccess("Check-in successful")
                        }
                    }
                }
            }
        })
    }


    private fun performCheckOut() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
            && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), 1)
            return
        }

        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                val latitude = location.latitude
                val longitude = location.longitude
                sendCheckOutRequest(latitude, longitude,
                    onSuccess = { message ->
                        runOnUiThread {
                            showAlert("Check Out", message)
                        }
                    },
                    onFailure = { message ->
                        runOnUiThread {
                            showAlert("Check Out - error", message)
                        }
                    }
                )
            } else {
                runOnUiThread {
                    Toast.makeText(this, "Unable to get location", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun sendCheckOutRequest(latitude: Double, longitude: Double, onSuccess: (String)->Unit, onFailure: (String)->Unit) {
        val jwtToken = getJwtToken()
        if (jwtToken == null) {
            runOnUiThread {
                onFailure("JWT token is missing. Please log in again.")
            }
            return
        }

        val client = OkHttpClient()

        val json = JSONObject().apply {
            put("latitude", latitude)
            put("longitude", longitude)
        }.toString()

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, json)
        val backendUrl = getBackendUrl()
        if (backendUrl != null) {
            Log.d("calling...", backendUrl)
        } else {
            Log.e("not found", "api")
        }
        val request = Request.Builder()
            .url("$backendUrl/check-out") // Adjust the endpoint as per your backend
            .post(requestBody)
            .addHeader("Cookie", "jwt=$jwtToken")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    onFailure("Network Error: ${e.message}")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!it.isSuccessful) {
                        runOnUiThread {
                            onFailure("Check-out failed: ${it.message}")
                        }
                    } else {
                        runOnUiThread {
                            onSuccess("Check-out successful")
                        }
                    }
                }
            }
        })
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

    fun getJwtToken(): String?{
        val sharedPreferences = getSharedPreferences("myPrefs", MODE_PRIVATE)
        return sharedPreferences.getString("jwt_token", null)
    }

    fun getBackendUrl(): String? {
        val sharedPreferences = getSharedPreferences("myPrefs", MODE_PRIVATE)
        return sharedPreferences.getString("backend_url", "http://192.168.244.20:8000")
    }
}


//class MainActivity : AppCompatActivity() {
//
//    private lateinit var fusedLocationClient: FusedLocationProviderClient
//    private var base_url = "http://192.168.92.137:8000/"
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_main)
//
//        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
//
//        findViewById<Button>(R.id.button_check_in).setOnClickListener {
//            performCheckIn()
//        }
//
//        findViewById<Button>(R.id.button_check_out).setOnClickListener {
//            performCheckOut()
//        }
//    }
//
//    private fun performCheckIn() {
//        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
//            && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), 1)
//            return
//        }
//
//        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
//            if (location != null) {
//                val latitude = location.latitude
//                val longitude = location.longitude
//                sendCheckInRequest(latitude, longitude)
//            } else {
//                Toast.makeText(this, "Unable to get location", Toast.LENGTH_SHORT).show()
//            }
//        }
//    }
//
//    private fun sendCheckInRequest(latitude: Double, longitude: Double) {
//        val client = OkHttpClient()
//
//        val json = JSONObject().apply {
//            put("id", 1)
//            put("latitude", latitude)
//            put("longitude", longitude)
//        }
//        Log.d("CheckIn", "Getting location")
//        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
//        val body = RequestBody.create(mediaType, json.toString())
//
//        val request = Request.Builder()
//            .url(base_url+"check-in") // Replace with your API endpoint
//            .post(body)
//            .build()
//        Log.d("CheckIn", "Sending location")
//        client.newCall(request).enqueue(object : okhttp3.Callback {
//            override fun onFailure(call: okhttp3.Call, e: IOException) {
//                Log.e("CheckIn", "Failed to send check-in request"+e.message, e)
//            }
//
//            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
//
//                if (response.isSuccessful) {
//                    Log.d("CheckIn", "Check-in successful")
//                } else {
//                    Log.e("CheckIn", "Failed to check in: ${response.message}")
//                }
//            }
//        })
//    }
//
//    private fun performCheckOut(){
//        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
//            && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), 1)
//            return
//        }
//
//        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
//            if (location != null) {
//                val latitude = location.latitude
//                val longitude = location.longitude
//                sendCheckOutRequest(latitude, longitude)
//            } else {
//                Toast.makeText(this, "Unable to get location", Toast.LENGTH_SHORT).show()
//            }
//        }
//    }
//    private fun sendCheckOutRequest(latitude: Double, longitude: Double){
//        val client = OkHttpClient()
//
//        val json = JSONObject().apply {
//            put("id", 1)
//            put("latitude", latitude)
//            put("longitude", longitude)
//        }
//        Log.d("CheckOut", "Getting location")
//        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
//        val body = RequestBody.create(mediaType, json.toString())
//
//        val request = Request.Builder()
//            .url(base_url+"check-out")
//            .post(body)
//            .build()
//        Log.d("CheckOut", "Sending location")
//        client.newCall(request).enqueue(
//            object : okhttp3.Callback {
//                override fun onFailure(call: okhttp3.Call, e: IOException) {
//                    Log.e("CheckOut", "Failed to send check-out request", e)
//                }
//
//                override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
//
//                    if (response.isSuccessful) {
//                        Log.d("CheckOut", "Check-out successful")
//                    } else {
//                        Log.e("CheckOut", "Failed to check out: ${response.message}")
//                    }
//                }
//            },
//        )
//    }
//
//    fun showAlert(message: String){
//        val alertDialog = AlertDialog.Builder(this)
//            .setTitle("response")
//            .setMessage(message)
//            .setPositiveButton("Ok"){
//                dialog,_ -> dialog.dismiss()
//            }
//            .create()
//        alertDialog.show()
//    }
//}
