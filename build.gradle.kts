import org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsTargetDsl

plugins {
    kotlin("multiplatform") version "2.0.0"
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    id("org.jetbrains.compose") version "1.6.11"
    alias(libs.plugins.google.services)
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = "11"
            }
        }
    }
    
    @OptIn(org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl::class)
    wasmJs {
        browser {
        }
        binaries.executable()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(compose.runtime)
                implementation(compose.foundation)
                implementation(compose.material3)
                implementation(compose.components.resources)
                implementation(compose.components.uiToolingPreview)
                implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
                implementation("org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:2.8.0")
            }
        }
        val androidMain by getting {
            dependencies {
                implementation(libs.androidx.core.ktx)
                implementation(libs.androidx.lifecycle.runtime.ktx)
                implementation(libs.androidx.activity.compose)
                implementation(libs.google.material)

                // Firebase dependencies
                implementation(project.dependencies.platform(libs.firebase.bom))
                implementation(libs.firebase.auth.ktx)
                implementation(libs.firebase.firestore.ktx)
                implementation(libs.firebase.database.ktx)
                
                implementation(libs.play.services.auth)
                implementation(libs.play.services.location)
                implementation(libs.kotlinx.coroutines.play.services)
                implementation(libs.generative.ai)

                implementation(libs.google.maps.compose)
                implementation(libs.play.services.maps)
                implementation(libs.accompanist.permissions)
                implementation(libs.coil.compose)
                implementation(libs.androidx.compose.material.icons.extended)
            }
        }
    }
}

android {
    namespace = "com.example.bloodlink"
    compileSdk = 34

    sourceSets["main"].apply {
        manifest.srcFile("src/androidMain/AndroidManifest.xml")
        res.srcDirs("src/androidMain/res")
        java.srcDirs("src/androidMain/kotlin")
    }

    defaultConfig {
        applicationId = "com.example.bloodlink"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        compose = true
    }
}
