import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.HostnameVerifier
import java.security.SecureRandom

val trustAllCerts = arrayOf<TrustManager>(
    object : X509TrustManager {
        override fun getAcceptedIssuers(): Array<X509Certificate>? = null
        override fun checkClientTrusted(certs: Array<X509Certificate>, authType: String) {}
        override fun checkServerTrusted(certs: Array<X509Certificate>, authType: String) {}
    }
)

val sc = SSLContext.getInstance("SSL")
sc.init(null, trustAllCerts, SecureRandom())
HttpsURLConnection.setDefaultSSLSocketFactory(sc.socketFactory)
HttpsURLConnection.setDefaultHostnameVerifier(HostnameVerifier { _, _ -> true })
