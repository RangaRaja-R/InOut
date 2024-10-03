package com.example.androidfront

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.zxing.integration.android.IntentIntegrator
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class QRActivity : AppCompatActivity() {

    companion object {
        const val APP_PREFS = "app_prefs"
        const val JWT_TOKEN = "jwt_token"
        const val BACKEND_URL_KEY = "backend_url"
        const val LOCATION_PREFS = "location"
        const val OFFICE_LAT = "office_lat"
        const val OFFICE_LON = "office_lon"
        const val MEDIA_TYPE_JSON = "application/json; charset=utf-8"
    }

    private lateinit var scanBtn: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_qr)

        val sharedPreferences = getSharedPreferences("app_prefs", MODE_PRIVATE);
        val token = sharedPreferences.getString("jwt_token", null)
        if(!token.isNullOrEmpty()){
            val intent = Intent(this, TempActivity::class.java)
            startActivity(intent)
            return
        }

        scanBtn = findViewById(R.id.scanBtn)
        scanBtn.setOnClickListener { scanQR() }
    }

    private fun scanQR() {
        val integrator = IntentIntegrator(this)
        integrator.setPrompt("Scan QR")
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        integrator.setBeepEnabled(false)
        integrator.initiateScan()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_SHORT).show()
            } else {
                val sharedPreferences = getSharedPreferences(APP_PREFS, Context.MODE_PRIVATE)
                sharedPreferences.edit().putString(JWT_TOKEN, result.contents).apply()
                performLogin(result.contents)
            }
        }
    }

    private fun performLogin(token: String) {
        val mediaType = MEDIA_TYPE_JSON.toMediaTypeOrNull()
        val requestData = JSONObject().apply {
            put("token", token)
        }
        val requestBody = requestData.toString().toRequestBody(mediaType)

        val sharedPreferences = getSharedPreferences(APP_PREFS, Context.MODE_PRIVATE)
        val backendUrl = sharedPreferences.getString(BACKEND_URL_KEY, "")

        // Ensure backend URL is not null or empty
        if (backendUrl.isNullOrEmpty()) {
            runOnUiThread {
                showAlert("Error", "Backend URL is not configured.")
            }
            return
        }

        val request = Request.Builder()
            .url("$backendUrl/code") // Adjust endpoint based on your backend
            .post(requestBody)
            .build()

        val client = OkHttpClient()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(applicationContext, "Failed to communicate with server.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (response.isSuccessful) {
                        val responseBody = response.body?.string()
                        if (responseBody != null) {
                            val jsonResponse = JSONObject(responseBody)
                            val locationPrefs = getSharedPreferences(LOCATION_PREFS, Context.MODE_PRIVATE)
                            locationPrefs.edit().apply {
                                putFloat(OFFICE_LAT, jsonResponse.optString(OFFICE_LAT).toFloat())
                                putFloat(OFFICE_LON, jsonResponse.optString(OFFICE_LON).toFloat())
                                apply()
                            }
                            // Redirect to next activity
                            startActivity(Intent(this@QRActivity, TempActivity::class.java))
                        }
                    } else {
                        runOnUiThread {
                            showAlert("Login Failed", "Invalid response from server.")
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
}
