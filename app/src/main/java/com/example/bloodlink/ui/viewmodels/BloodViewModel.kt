package com.example.bloodlink.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.bloodlink.data.BloodRequest
import com.example.bloodlink.data.Message
import com.example.bloodlink.data.User
import com.example.bloodlink.repository.AiRepository
import com.example.bloodlink.repository.BloodRepository
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed class RequestState {
    object Idle : RequestState()
    object Loading : RequestState()
    object Success : RequestState()
    data class Error(val message: String) : RequestState()
}

class BloodViewModel : ViewModel() {
    private val repository = BloodRepository()
    private val aiRepository = AiRepository()
    private val auth = FirebaseAuth.getInstance()

    private val _requests = MutableStateFlow<List<BloodRequest>>(emptyList())
    val requests: StateFlow<List<BloodRequest>> = _requests

    private val _nearbyHospitals = MutableStateFlow<List<BloodRequest>>(emptyList())
    val nearbyHospitals: StateFlow<List<BloodRequest>> = _nearbyHospitals

    private val _requestState = MutableStateFlow<RequestState>(RequestState.Idle)
    val requestState: StateFlow<RequestState> = _requestState

    private val _aiSuggestions = MutableStateFlow<List<String>>(emptyList())
    val aiSuggestions: StateFlow<List<String>> = _aiSuggestions

    private val _compatibilityAdvice = MutableStateFlow("")
    val compatibilityAdvice: StateFlow<String> = _compatibilityAdvice

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser

    init {
        fetchRequests()
        fetchCurrentUser()
        // Default to Chennai to avoid blank screens
        refreshHospitals("Chennai")
    }

    private fun refreshHospitals(city: String) {
        viewModelScope.launch {
            _nearbyHospitals.value = repository.getNearbyHospitals(city)
        }
    }

    fun fetchCompatibilityAdvice(bloodGroup: String) {
        viewModelScope.launch {
            _compatibilityAdvice.value = aiRepository.getCompatibilityAdvice(bloodGroup)
        }
    }

    fun fetchCurrentUser() {
        val uid = auth.currentUser?.uid ?: return
        viewModelScope.launch {
            _currentUser.value = repository.getUserDetails(uid)
        }
    }

    fun fetchAiSuggestions(messages: List<Message>) {
        val chatHistory = messages.takeLast(5).joinToString("\n") { 
            "${if (it.senderId == auth.currentUser?.uid) "Me" else "Donor"}: ${it.text}" 
        }
        viewModelScope.launch {
            _aiSuggestions.value = aiRepository.getChatSuggestions(chatHistory)
        }
    }

    fun fetchRequests() {
        viewModelScope.launch {
            _requests.value = repository.getNearbyRequests()
        }
    }

    fun submitEmergencyRequest(
        patientName: String,
        bloodGroup: String, 
        hospital: String, 
        location: String,
        units: String,
        urgency: String,
        onSuccess: (String) -> Unit
    ) {
        val currentUser = auth.currentUser ?: return
        
        viewModelScope.launch {
            _requestState.value = RequestState.Loading
            try {
                val request = BloodRequest(
                    requesterId = currentUser.uid,
                    requesterName = currentUser.displayName ?: "Anonymous",
                    patientName = patientName,
                    bloodGroup = bloodGroup,
                    hospitalName = hospital,
                    location = location,
                    unitsRequired = units,
                    urgency = urgency
                )
                repository.createRequest(request)
                val latestRequests = repository.getNearbyRequests()
                val newId = latestRequests.filter { it.requesterId == currentUser.uid }.maxByOrNull { it.timestamp }?.id ?: "REQ-NEW"
                
                _requestState.value = RequestState.Success
                onSuccess(newId)
                fetchRequests()
            } catch (e: Exception) {
                _requestState.value = RequestState.Error(e.message ?: "Failed to submit request")
            }
        }
    }

    fun sendMessage(receiverId: String, text: String) {
        val currentUser = auth.currentUser ?: return
        viewModelScope.launch {
            repository.sendMessage(Message(senderId = currentUser.uid, receiverId = receiverId, text = text))
            kotlinx.coroutines.delay(2000)
            val replyText = aiRepository.getAiResponse(text)
            repository.sendMessage(Message(senderId = receiverId, receiverId = currentUser.uid, text = replyText))
        }
    }

    fun getMessages(otherUserId: String): Flow<List<Message>> {
        val currentUserId = auth.currentUser?.uid ?: ""
        return repository.getMessages(currentUserId, otherUserId)
    }

    fun getMyRequests(): Flow<List<BloodRequest>> {
        val currentUserId = auth.currentUser?.uid ?: ""
        return repository.getMyRequests(currentUserId)
    }

    fun updateLocation(context: android.content.Context, lat: Double, lng: Double) {
        val uid = auth.currentUser?.uid ?: return
        viewModelScope.launch {
            val geocoder = android.location.Geocoder(context, java.util.Locale.getDefault())
            val city = try {
                val addresses = geocoder.getFromLocation(lat, lng, 1)
                val address = addresses?.get(0)
                // Use subLocality for Chennai (like Poonamallee) or locality for the city
                address?.locality ?: address?.subLocality ?: address?.adminArea ?: "Chennai"
            } catch (e: Exception) {
                "Chennai"
            }
            
            val user = repository.getUserDetails(uid)
            if (user != null) {
                val updatedUser = user.copy(location = city)
                repository.registerUser(updatedUser)
                _currentUser.value = updatedUser
            }
            
            // Refresh the hospital list for the found city
            refreshHospitals(city)
        }
    }

    fun resetState() {
        _requestState.value = RequestState.Idle
    }
}
