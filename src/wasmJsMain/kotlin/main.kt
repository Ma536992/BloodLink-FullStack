import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.CanvasBasedWindow
import com.example.bloodlink.BloodLinkApp

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    CanvasBasedWindow("BloodLink") {
        BloodLinkApp()
    }
}
