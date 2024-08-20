package com.inout

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.widget.Button
import android.app.AlertDialog
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.dasboard)  // Ensure the layout file name is correct

        val checkInButton = findViewById<Button>(R.id.btn_check_in)
        checkInButton.setOnClickListener {
            Log.d("MainActivity", "Check In Button Clicked")
            showVerifyDialog()
        }

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }

    private fun showVerifyDialog() {
        Log.d("MainActivity", "Showing Verify Dialog")
        val dialogView = LayoutInflater.from(this).inflate(R.layout.verify, null)

        // Build the dialog
        val builder = AlertDialog.Builder(this)
            .setView(dialogView)

        // Show the dialog
        val alertDialog = builder.create()  // Create the dialog instance
        alertDialog.show()  // Show the dialog

        // Handle the verify button click
        val verifyButton = dialogView.findViewById<Button>(R.id.btn_verify)
        verifyButton.setOnClickListener {
            Log.d("MainActivity", "Verify Button Clicked")
            alertDialog.dismiss()
            // Add any action to be performed after verifying
        }
    }
}
