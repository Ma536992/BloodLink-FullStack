package com.example.bloodlink.data

data class BloodRequest(
    val id: String = "",
    val requesterId: String = "",
    val requesterEmail: String = "",
    val requesterName: String = "",
    val patientName: String = "",
    val name: String = "", // Matches Web App 'name'
    val bloodGroup: String = "",
    val hospitalName: String = "",
    val location: String = "",
    val unitsRequired: String = "1",
    val unitsRequested: Int = 1, // Matches Web App 'unitsRequested'
    val dbKey: String = "", // Matches Web App 'dbKey'
    val urgency: String = "", // e.g., "Normal", "Urgent", "Emergency"
    val status: String = "Pending", // "Pending", "Accepted", "Rejected"
    val acceptedByUserId: String = "",
    val acceptedByUserName: String = "",
    val acceptedBy: String = "",
    val timestamp: Long = System.currentTimeMillis()
)
