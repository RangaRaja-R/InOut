package com.example.androidfront

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.IOException

class LoginActivity : AppCompatActivity() {

    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        emailInput = findViewById(R.id.usernameEditText)
        passwordInput = findViewById(R.id.passwordEditText)
        loginButton = findViewById(R.id.loginButton)

        loginButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()
            if (email.isNotEmpty() && password.isNotEmpty()) {
                val backendUrl = "http://your-backend-url.com" // Replace with the backend URL from input

                performLogin(email, password, backendUrl,
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

    fun performLogin(email: String, password: String, backendUrl: String, onSuccess: (String) -> Unit, onFailure: (String) -> Unit) {
        val client = OkHttpClient()

        val json = JSONObject().apply {
            put("email", email)
            put("password", password)
        }.toString()

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, json.toString())
        // val requestBody = RequestBody.create(MediaType.get("application/json; charset=utf-8"), json)

        val request = Request.Builder()
            .url("$backendUrl/api/login/") // Adjust the endpoint as per your backend
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
        val sharedPreferences = getSharedPreferences("myPrefs", MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("jwt_token", token)
            apply()
        }
    }

    fun getJwtToken(): String? {
        val sharedPreferences = getSharedPreferences("myPrefs", MODE_PRIVATE)
        return sharedPreferences.getString("jwt_token", null)
    }

}


