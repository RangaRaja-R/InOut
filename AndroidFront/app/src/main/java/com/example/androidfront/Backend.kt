package com.example.androidfront;

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import android.widget.Toast
import android.content.Context

class BackendUrlActivity : AppCompatActivity() {

    private lateinit var urlInput: EditText
    private lateinit var saveButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_api)

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
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        } else {
            // Token exists, navigate to the Dashboard
            val intent = Intent(this, DashboardActivity::class.java)
            startActivity(intent)
        }
        finish() // Close the current activity
    }
}
