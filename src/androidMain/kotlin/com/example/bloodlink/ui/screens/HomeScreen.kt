package com.example.bloodlink.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Message
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.bloodlink.ui.theme.LifeFlowBg
import com.example.bloodlink.ui.theme.LifeFlowRed
import com.example.bloodlink.ui.viewmodels.BloodViewModel
import com.example.bloodlink.data.BloodRequest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HomeScreen(
    onNavigateToSearch: () -> Unit,
    onNavigateToEmergency: () -> Unit,
    onNavigateToLocator: () -> Unit,
    onNavigateToChat: (String, String) -> Unit,
    onNavigateToProfile: () -> Unit,
    viewModel: BloodViewModel = viewModel(),
) {
    val userProfile by viewModel.currentUser.collectAsState()
    val myRequests by viewModel.getMyRequests().collectAsState(initial = emptyList())
    val globalInventory by viewModel.globalInventory.collectAsState()
    val liveEmergencyFeed by viewModel.liveEmergencyFeed.collectAsState()
    val context = androidx.compose.ui.platform.LocalContext.current

    var showStatusModal by remember { mutableStateOf<BloodRequest?>(null) }
    var showDonorSuccessModal by remember { mutableStateOf<BloodRequest?>(null) }
    var previousLatestStatus by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(myRequests) {
        val latest = myRequests.maxByOrNull { it.timestamp }
        if (latest != null) {
            if (previousLatestStatus != null && previousLatestStatus != latest.status && 
                (latest.status == "Accepted" || latest.status == "Rejected")) {
                showStatusModal = latest
            }
            previousLatestStatus = latest.status
        }
    }

    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            val fusedLocationClient = com.google.android.gms.location.LocationServices.getFusedLocationProviderClient(context)
            try {
                fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                    if (location != null) {
                        viewModel.updateLocation(context, location.latitude, location.longitude)
                    } else {
                        viewModel.updateLocation(context, 13.0827, 80.2707) // Fallback to Chennai
                    }
                }
            } catch (e: SecurityException) { }
        }
    }

    LaunchedEffect(Unit) {
        viewModel.fetchCurrentUser() // Ensure profile data is loaded!
        
        when (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)) {
            PackageManager.PERMISSION_GRANTED -> {
                val fusedLocationClient = com.google.android.gms.location.LocationServices.getFusedLocationProviderClient(context)
                try {
                    fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                        if (location != null) {
                            viewModel.updateLocation(context, location.latitude, location.longitude)
                        } else {
                            viewModel.updateLocation(context, 13.0827, 80.2707) // Fallback to Chennai
                        }
                    }
                } catch (e: SecurityException) { }
            }
            else -> {
                locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }
    }

    Scaffold(
        bottomBar = {
            LifeFlowBottomNavigation(
                onHomeClick = {},
                onSearchClick = onNavigateToSearch,
                onEmergencyClick = onNavigateToEmergency,
                onDonorsClick = onNavigateToLocator,
                onProfileClick = onNavigateToProfile
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(LifeFlowBg)
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.WaterDrop,
                    contentDescription = null,
                    tint = LifeFlowRed,
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "BloodLink",
                        style = MaterialTheme.typography.titleLarge,
                        color = LifeFlowRed,
                        fontWeight = FontWeight.Bold,
                        lineHeight = 20.sp
                    )
                    Text(
                        text = "Give Blood, Save Life",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                }
                
                Spacer(modifier = Modifier.weight(1f))
                
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { }) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = LifeFlowRed, modifier = Modifier.size(16.dp))
                    Text(text = userProfile?.location ?: "Mumbai, Maharashtra", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    Icon(Icons.Default.KeyboardArrowDown, contentDescription = null, modifier = Modifier.size(16.dp))
                }
                
                Spacer(modifier = Modifier.width(8.dp))
                
                IconButton(onClick = {}) {
                    BadgedBox(badge = { Badge { Text("3") } }) {
                        Icon(Icons.Default.Notifications, contentDescription = null, tint = Color.DarkGray)
                    }
                }
                
                Surface(modifier = Modifier.size(32.dp), shape = CircleShape, color = Color.LightGray) {
                    if (userProfile?.profileImageUrl?.isNotEmpty() == true) {
                        AsyncImage(model = userProfile?.profileImageUrl, contentDescription = null, modifier = Modifier.fillMaxSize().clip(CircleShape))
                    } else {
                        Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.padding(4.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Hero Section
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                color = LifeFlowRed
            ) {
                Box(modifier = Modifier.background(Brush.linearGradient(listOf(LifeFlowRed, Color(0xFFE53935))))) {
                    Row(modifier = Modifier.padding(20.dp), verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "Need Blood Urgently?", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Find nearby donors and blood banks near you instantly.",
                                color = Color.White.copy(alpha = 0.8f),
                                fontSize = 13.sp
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Row {
                                Button(
                                    onClick = onNavigateToEmergency,
                                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                                    shape = RoundedCornerShape(12.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp)
                                ) {
                                    Icon(Icons.Default.WaterDrop, contentDescription = null, tint = LifeFlowRed, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Request Blood", color = LifeFlowRed, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                OutlinedButton(
                                    onClick = onNavigateToSearch,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White),
                                    shape = RoundedCornerShape(12.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp)
                                ) {
                                    Icon(Icons.Default.Search, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Search Blood", color = Color.White, fontSize = 12.sp)
                                }
                            }
                        }
                        // Blood Bag Icon Placeholder
                        Text("🩸", fontSize = 60.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Blood Availability Section
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text(text = "Blood Availability", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text(text = "View All", color = LifeFlowRed, fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onNavigateToSearch() })
            }

            Spacer(modifier = Modifier.height(12.dp))

            LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                val groups = listOf("A+", "B+", "O+", "AB+")
                val dbKeys = listOf("A_pos", "B_pos", "O_pos", "AB_pos")
                val colors = listOf(Color.Red, Color.Blue, Color.Green, Color.Magenta)
                items(groups.size) { index ->
                    val units = globalInventory[dbKeys[index]]?.toString() ?: "0"
                    AvailabilityCard(groups[index], units, colors[index])
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (liveEmergencyFeed.isNotEmpty()) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🚨 Live Emergency Feed", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                Spacer(modifier = Modifier.height(12.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(liveEmergencyFeed.size) { index ->
                        LiveRequestCard(request = liveEmergencyFeed[index], onAccept = { 
                            viewModel.acceptEmergencyRequest(liveEmergencyFeed[index])
                            showDonorSuccessModal = liveEmergencyFeed[index]
                        })
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
            }

            // Middle Section (Emergency Assistant + Nearby Donors)
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                // Emergency Assistance Card
                Surface(
                    modifier = Modifier.weight(1.2f),
                    shape = RoundedCornerShape(16.dp),
                    color = Color(0xFFFFF1F0),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFCCC7))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Emergency, contentDescription = null, tint = LifeFlowRed, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Emergency Assistance", color = LifeFlowRed, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Need blood immediately?", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Send an emergency request to nearby donors and blood banks.", fontSize = 11.sp, color = Color.Gray)
                        Spacer(modifier = Modifier.height(12.dp))
                        // Ambulance Placeholder
                        Text("🚑", fontSize = 32.sp, modifier = Modifier.align(Alignment.End))
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = onNavigateToEmergency,
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = LifeFlowRed),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(vertical = 4.dp)
                        ) {
                            Text("Submit Emergency Request →", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Nearby Donors List
                Column(modifier = Modifier.weight(1f)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "Nearby Donors", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text(text = "View All", color = LifeFlowRed, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { onNavigateToLocator() })
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    DonorSmallItem("Rahul Sharma", "O+", "1.2 km", onNavigateToChat)
                    DonorSmallItem("Priya Verma", "A+", "2.0 km", onNavigateToChat)
                    DonorSmallItem("Amit Patil", "B+", "2.5 km", onNavigateToChat)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Impact Section
            Text(text = "Our Impact", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ImpactCard("2,500+", "Lives Saved", Color.Red, Modifier.weight(1f))
                ImpactCard("10,000+", "Happy Donors", Color.Blue, Modifier.weight(1f))
                ImpactCard("5,000+", "Requests Fulfilled", Color.Green, Modifier.weight(1f))
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Safety Banner
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFE6F7FF),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF91D5FF))
            ) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFF1890FF))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Your safety is our priority", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFF003A8C))
                        Text("All donors are verified and all blood banks are authorized.", fontSize = 11.sp, color = Color(0xFF003A8C))
                    }
                    Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1890FF)), shape = RoundedCornerShape(8.dp), contentPadding = PaddingValues(horizontal = 8.dp)) {
                        Text("Learn More", fontSize = 11.sp)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(20.dp))
        }
        
        // Status Modal Overlay
        if (showStatusModal != null) {
            StatusModal(
                request = showStatusModal!!,
                onDismiss = { showStatusModal = null }
            )
        }
        if (showDonorSuccessModal != null) {
            DonorSuccessModal(
                request = showDonorSuccessModal!!,
                onDismiss = { showDonorSuccessModal = null }
            )
        }
    }
}

@Composable
fun AvailabilityCard(group: String, count: String, color: Color) {
    Surface(
        modifier = Modifier.width(100.dp),
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        shadowElevation = 1.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF0F0F0))
    ) {
        Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.WaterDrop, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
            Text(text = group, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Text(text = count, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(text = "Units Available", fontSize = 9.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(8.dp))
            Surface(color = color.copy(alpha = 0.1f), shape = RoundedCornerShape(8.dp)) {
                Text(text = "Available", color = color, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
            }
        }
    }
}

@Composable
fun DonorSmallItem(name: String, group: String, dist: String, onChat: (String, String) -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        shape = RoundedCornerShape(12.dp),
        color = Color.White,
        shadowElevation = 1.dp
    ) {
        Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(32.dp).clip(CircleShape).background(Color.LightGray)) {
                Text("👤", modifier = Modifier.align(Alignment.Center), fontSize = 16.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(name, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                Text("$group Blood Group • $dist", fontSize = 9.sp, color = Color.Gray)
            }
            IconButton(onClick = {}, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Call, contentDescription = null, tint = Color.Green, modifier = Modifier.size(16.dp))
            }
            IconButton(onClick = { onChat("donor_id", name) }, modifier = Modifier.size(24.dp)) {
                Icon(Icons.AutoMirrored.Filled.Message, contentDescription = null, tint = Color.Red, modifier = Modifier.size(16.dp))
            }
        }
    }
}

@Composable
fun ImpactCard(count: String, label: String, color: Color, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        color = color.copy(alpha = 0.05f),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.1f))
    ) {
        Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = count, color = color, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(text = label, color = color, fontSize = 10.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun LifeFlowBottomNavigation(
    onHomeClick: () -> Unit,
    onSearchClick: () -> Unit,
    onEmergencyClick: () -> Unit,
    onDonorsClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth().height(70.dp),
        color = Color.White,
        shadowElevation = 16.dp
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            BottomNavItem("Home", Icons.Default.Home, true, onHomeClick)
            BottomNavItem("Search", Icons.Default.Search, false, onSearchClick)
            
            // Central Emergency FAB-like item
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.offset(y = (-10).dp).clickable { onEmergencyClick() }
            ) {
                Surface(
                    modifier = Modifier.size(50.dp),
                    shape = CircleShape,
                    color = LifeFlowRed,
                    shadowElevation = 4.dp
                ) {
                    Icon(Icons.Default.Emergency, contentDescription = null, tint = Color.White, modifier = Modifier.padding(12.dp))
                }
                Text("Emergency", color = LifeFlowRed, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }

            BottomNavItem("Donors", Icons.Default.Group, false, onDonorsClick)
            BottomNavItem("Profile", Icons.Default.Person, false, onProfileClick)
        }
    }
}

@Composable
fun BottomNavItem(label: String, icon: ImageVector, isSelected: Boolean, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onClick() }
    ) {
        Icon(
            icon,
            contentDescription = null,
            tint = if (isSelected) LifeFlowRed else Color.Gray,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            color = if (isSelected) LifeFlowRed else Color.Gray,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
        )
    }
}

@Composable
fun StatusModal(request: BloodRequest, onDismiss: () -> Unit) {
    val isAccepted = request.status == "Accepted"
    val mainColor = if (isAccepted) Color(0xFF4CAF50) else Color(0xFFF44336)
    val bgColor = if (isAccepted) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)
    val title = if (isAccepted) {
        if (request.acceptedByUserName.isNotEmpty()) "Accepted by ${request.acceptedByUserName}!" 
        else "Your Order Has Successfully Accepted!"
    } else "Your Order Has Been Rejected!"
    val desc = if (isAccepted) "Thank you for using BloodLink.\nWe will notify you once your request is fulfilled." 
               else "Unfortunately, we cannot fulfill this order at this time.\nPlease try reaching out to nearby donors."
               
    val sdfDate = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
    val sdfTime = SimpleDateFormat("hh:mm a", Locale.getDefault())
    val dateStr = sdfDate.format(Date(request.timestamp))
    val timeStr = sdfTime.format(Date(request.timestamp))
    val shortId = if (request.id.length >= 6) "BLD" + request.id.takeLast(6).uppercase() else "BLD123456"

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.6f))
            .clickable(enabled = false) {}, // Intercept clicks
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier.width(340.dp).padding(16.dp),
            shape = RoundedCornerShape(24.dp),
            color = Color.White,
            shadowElevation = 24.dp
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Icon
                Surface(
                    modifier = Modifier.size(70.dp),
                    shape = CircleShape,
                    color = bgColor
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        if (isAccepted) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = mainColor, modifier = Modifier.size(36.dp))
                        } else {
                            Icon(Icons.Default.Close, contentDescription = null, tint = mainColor, modifier = Modifier.size(36.dp))
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = Color.Black,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    lineHeight = 26.sp
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = desc,
                    fontSize = 13.sp,
                    color = Color.Gray,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    lineHeight = 18.sp
                )
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // Receipt Box
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFFFF5F5),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFE0E0))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            modifier = Modifier.size(32.dp),
                            shape = CircleShape,
                            color = LifeFlowRed.copy(alpha = 0.1f)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("🩸", fontSize = 16.sp)
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(12.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Request ID", fontSize = 11.sp, color = Color.Gray)
                            Text(shortId, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = LifeFlowRed)
                        }
                        
                        Column(horizontalAlignment = Alignment.End) {
                            Text(dateStr, fontSize = 11.sp, color = Color.Gray)
                            Text(timeStr, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = LifeFlowRed)
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = LifeFlowRed)
                ) {
                    Text("🏠 Back to Home", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun LiveRequestCard(request: BloodRequest, onAccept: () -> Unit) {
    Surface(
        modifier = Modifier.width(260.dp),
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        shadowElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF0F0F0))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(color = LifeFlowRed.copy(alpha = 0.1f), shape = RoundedCornerShape(8.dp)) {
                    Text(request.bloodGroup, color = LifeFlowRed, fontWeight = FontWeight.Bold, modifier = Modifier.padding(8.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("${request.name} requires this blood", fontWeight = FontWeight.Bold, fontSize = 14.sp, maxLines = 1)
                    Text("${request.unitsRequested} Units • ${request.location}", color = Color.Gray, fontSize = 11.sp, maxLines = 1)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onAccept,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = LifeFlowRed),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                Text("Accept & Donate", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun DonorSuccessModal(request: BloodRequest, onDismiss: () -> Unit) {
    val sdfDate = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
    val sdfTime = SimpleDateFormat("hh:mm a", Locale.getDefault())
    val dateStr = sdfDate.format(Date())
    val timeStr = sdfTime.format(Date())
    val shortId = if (request.id.length >= 6) "BLD" + request.id.takeLast(6).uppercase() else "BLD123456"

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.6f))
            .clickable(enabled = false) {}, // Intercept clicks
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier.width(340.dp).padding(16.dp),
            shape = RoundedCornerShape(24.dp),
            color = Color.White,
            shadowElevation = 24.dp
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Icon
                Surface(
                    modifier = Modifier.size(70.dp),
                    shape = CircleShape,
                    color = Color(0xFFE8F5E9)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF4CAF50), modifier = Modifier.size(36.dp))
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "You have successfully accepted to donate!",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = Color.Black,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    lineHeight = 26.sp
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = "Thank you for being a hero and saving lives.\nThe requester has been notified.",
                    fontSize = 13.sp,
                    color = Color.Gray,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    lineHeight = 18.sp
                )
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // Receipt Box
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFFFF5F5),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFE0E0))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            modifier = Modifier.size(32.dp),
                            shape = CircleShape,
                            color = LifeFlowRed.copy(alpha = 0.1f)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("🩸", fontSize = 16.sp)
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(12.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Request ID", fontSize = 11.sp, color = Color.Gray)
                            Text(shortId, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = LifeFlowRed)
                        }
                        
                        Column(horizontalAlignment = Alignment.End) {
                            Text(dateStr, fontSize = 11.sp, color = Color.Gray)
                            Text(timeStr, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = LifeFlowRed)
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = LifeFlowRed)
                ) {
                    Text("🏠 Back to Home", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
