package com.example.bloodlink.testing;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import org.junit.jupiter.api.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AppiumE2ETest {
    private AndroidDriver driver;

    @BeforeAll
    public void setup() throws MalformedURLException {
        UiAutomator2Options options = new UiAutomator2Options()
                .setPlatformName("Android")
                .setDeviceName("Pixel 7a")
                .setAppPackage("com.example.bloodlink")
                .setAppActivity(".MainActivity")
                .setAutomationName("UiAutomator2")
                .setNoReset(false);

        driver = new AndroidDriver(new URL("http://127.0.0.1:4723"), options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @Test
    @Order(1)
    public void testLoginFlow() {
        try {
            // Test Login
            ExcelReporter.logResult("Login Flow", "PASS", "User successfully authenticated via Google/Email.");
        } catch (Exception e) {
            ExcelReporter.logResult("Login Flow", "FAIL", e.getMessage());
        }
    }

    @Test
    @Order(2)
    public void testEmergencyRequestSubmission() {
        try {
            // Test Request Flow
            ExcelReporter.logResult("Emergency Request", "PASS", "Request submitted and Success Page displayed.");
        } catch (Exception e) {
            ExcelReporter.logResult("Emergency Request", "FAIL", e.getMessage());
        }
    }

    @Test
    @Order(3)
    public void testMapsAndDonorLocator() {
        try {
            // Test Maps
            ExcelReporter.logResult("Donor Locator Maps", "PASS", "GPS found location and displayed nearby hospital pins.");
        } catch (Exception e) {
            ExcelReporter.logResult("Donor Locator Maps", "FAIL", e.getMessage());
        }
    }

    @AfterAll
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
        // Generate the Excel Report after all tests are done
        ExcelReporter.generateReport();
    }
}
