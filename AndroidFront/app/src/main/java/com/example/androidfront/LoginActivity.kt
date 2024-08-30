package com.example.androidfront

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.icu.text.SimpleDateFormat
import android.icu.util.Calendar
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.util.Locale

class LoginActivity : AppCompatActivity() {

    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        loginButton = findViewById(R.id.loginButton)

        loginButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()
            if (email.isNotEmpty() && password.isNotEmpty()) {
                performLogin(email, password,
                    onSuccess = { token ->
                        // Save the JWT token and navigate to the dashboard
                        saveJwtToken(token)
                        navigateToDashboard()
                    },
                    onFailure = { error ->
                        // Show an alert with the error message
                        showAlert("Login Failed", error)
                    })
            } else {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun navigateToDashboard() {
        val intent = Intent(this, DashboardActivity::class.java)
        startActivity(intent)
    }

    fun showAlert(title: String, message: String) {
        AlertDialog.Builder(this).apply {
            setTitle(title)
            setMessage(message)
            setPositiveButton("OK", null)
            create()
            show()
        }
    }

    private fun performLogin(email: String, password: String, onSuccess: (String) -> Unit, onFailure: (String) -> Unit) {
        val client = OkHttpClient()

        val requestData = JSONObject().apply {
            put("email", email)
            put("password", password)
        }

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = requestData.toString().toRequestBody(mediaType)
        val sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val backendUrl = sharedPreferences.getString("backend_url", "")
        val request = Request.Builder()
            .url("$backendUrl/login") // Adjust the endpoint as per your backend
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                onFailure("Network Error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!it.isSuccessful) {
                        onFailure("Login failed: ${it.message}")
                    } else {
                        val jwtToken = it.header("Set-Cookie")?.split(";")?.find { cookie ->
                            cookie.startsWith("jwt=")
                        }?.substringAfter("jwt=")

                        if (jwtToken != null) {
                            saveJwtToken(jwtToken)
                            onSuccess(jwtToken)
                        } else {
                            onFailure("JWT token not found in the response")
                        }
                    }
                }
            }
        })
    }
    fun saveJwtToken(token: String) {
        val sharedPreferences = getSharedPreferences("app_prefs", MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("jwt_token", token)
            val calendar = Calendar.getInstance()
            calendar.add(Calendar.DAY_OF_YEAR, 7)
            val expiryDate = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(calendar.time)
            putString("expiry", expiryDate)
            apply()
        }
    }

}


