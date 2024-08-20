package com.inout

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.widget.Button
import android.app.AlertDialog
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    private lateinit var urlInput: EditText
    private lateinit var saveButton: Button
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.api_url)  // Ensure the layout file name is correct

        urlInput = this.findViewById(R.id.api_url)
        saveButton = this.findViewById(R.id.btn_connect)

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

}
