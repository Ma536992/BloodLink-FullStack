plugins {
    java
}

group = "com.example.bloodlink.testing"
version = "1.0-SNAPSHOT"

dependencies {
    // Appium and Selenium
    testImplementation("io.appium:java-client:9.2.2")
    testImplementation("org.seleniumhq.selenium:selenium-java:4.20.0")
    
    // JUnit for Test Runner
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.10.2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.10.2")
    
    // Apache POI for Excel Reports
    implementation("org.apache.poi:poi:5.2.5")
    implementation("org.apache.poi:poi-ooxml:5.2.5")
}

tasks.test {
    useJUnitPlatform()
}
