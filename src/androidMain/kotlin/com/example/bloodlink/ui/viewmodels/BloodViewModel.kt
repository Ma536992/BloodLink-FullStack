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

    private val _globalInventory = MutableStateFlow<Map<String, Int>>(emptyMap())
    val globalInventory: StateFlow<Map<String, Int>> = _globalInventory

    private val _liveEmergencyFeed = MutableStateFlow<List<BloodRequest>>(emptyList())
    val liveEmergencyFeed: StateFlow<List<BloodRequest>> = _liveEmergencyFeed

    init {
        fetchRequests()
        fetchCurrentUser()
        // Default to Chennai to avoid blank screens
        refreshHospitals("Chennai")
        
        viewModelScope.launch {
            repository.getGlobalInventory().collect { inventory ->
                _globalInventory.value = inventory
            }
        }
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
            val user = repository.getUserDetails(uid)
            if (user != null && !user.isActive) {
                auth.signOut()
                _currentUser.value = null
            } else {
                _currentUser.value = user
            }
        }
        viewModelScope.launch {
            repository.getLiveEmergencyFeed(uid).collect { feed ->
                _liveEmergencyFeed.value = feed
            }
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
                val unitsInt = units.toIntOrNull() ?: 1
                var dbKey = ""
                if (bloodGroup.uppercase() == "A+") dbKey = "A_pos"
                else if (bloodGroup.uppercase() == "B+") dbKey = "B_pos"
                else if (bloodGroup.uppercase() == "O+") dbKey = "O_pos"
                else if (bloodGroup.uppercase() == "AB+") dbKey = "AB_pos"

                val request = BloodRequest(
                    requesterId = currentUser.uid,
                    requesterEmail = currentUser.email ?: "",
                    requesterName = currentUser.displayName ?: "Anonymous",
                    patientName = patientName,
                    name = patientName, // Web compatibility
                    bloodGroup = bloodGroup.uppercase(),
                    hospitalName = hospital,
                    location = location,
                    unitsRequired = units,
                    unitsRequested = unitsInt, // Web compatibility
                    dbKey = dbKey, // Web compatibility
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

    fun acceptEmergencyRequest(request: BloodRequest) {
        val currentUser = auth.currentUser ?: return
        viewModelScope.launch {
            try {
                repository.acceptRequestAsDonor(request.id, currentUser.uid, currentUser.displayName ?: "A Donor")
                repository.sendMessage(Message(senderId = currentUser.uid, receiverId = request.requesterId, text = "Hello! I am ${currentUser.displayName}. I have accepted your blood request for ${request.bloodGroup} at ${request.hospitalName}."))
            } catch (e: Exception) {
                _requestState.value = RequestState.Error(e.message ?: "Failed to accept request")
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
