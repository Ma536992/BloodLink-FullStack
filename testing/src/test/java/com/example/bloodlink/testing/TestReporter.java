package com.example.bloodlink.testing;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TestReporter {
    private static ExtentReports extent;
    private static List<TestResult> results = new ArrayList<>();
    private static String resultsDir = "Test-Results";
    private static String screenshotsDir = resultsDir + "/Screenshots";
    private static String logsDir = resultsDir + "/Logs";

    static {
        try {
            Files.createDirectories(Paths.get(resultsDir));
            Files.createDirectories(Paths.get(screenshotsDir));
            Files.createDirectories(Paths.get(logsDir));
            
            ExtentSparkReporter spark = new ExtentSparkReporter(resultsDir + "/HTML/execution-report.html");
            Files.createDirectories(Paths.get(resultsDir + "/HTML"));
            extent = new ExtentReports();
            extent.attachReporter(spark);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void logResult(String testName, String status, String comments, String screenshotPath) {
        results.add(new TestResult(testName, status, comments));
        ExtentTest test = extent.createTest(testName);
        if (status.equalsIgnoreCase("PASS")) {
            test.log(Status.PASS, comments);
        } else {
            test.log(Status.FAIL, comments);
            if (screenshotPath != null) {
                test.addScreenCaptureFromPath("../Screenshots/" + new File(screenshotPath).getName());
            }
        }
    }

    public static void generateReports(String buildNumber) {
        generateExcelReport();
        generateSummaryMarkdown(buildNumber);
        extent.flush();
    }

    private static void generateExcelReport() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Appium Test Report");
            Row header = sheet.createRow(0);
            String[] cols = {"Test Case", "Status", "Comments"};
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            int rowNum = 1;
            for (TestResult res : results) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(res.testName);
                row.createCell(1).setCellValue(res.status);
                row.createCell(2).setCellValue(res.comments);
            }

            Files.createDirectories(Paths.get(resultsDir + "/Excel"));
            try (FileOutputStream out = new FileOutputStream(resultsDir + "/Excel/Automation_Test_Report.xlsx")) {
                workbook.write(out);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void generateSummaryMarkdown(String buildNumber) {
        long passed = results.stream().filter(r -> r.status.equalsIgnoreCase("PASS")).count();
        long total = results.size();
        double rate = total == 0 ? 0 : (double) passed / total * 100;

        String content = String.format(
            "# Android Appium Test Summary\n\n" +
            "**Build Number:** %s\n" +
            "**Execution Date:** %s\n\n" +
            "**Total Tests:** %d\n" +
            "**Passed:** %d\n" +
            "**Failed:** %d\n" +
            "**Pass Rate:** %.2f%%\n\n" +
            "### [View Full HTML Report](reports/latest/execution-report.html)",
            buildNumber, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()),
            total, passed, total - passed, rate
        );

        try {
            Files.createDirectories(Paths.get(resultsDir + "/Summary"));
            try (FileWriter writer = new FileWriter(resultsDir + "/Summary/summary.md")) {
                writer.write(content);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static class TestResult {
        String testName, status, comments;
        TestResult(String t, String s, String c) { this.testName = t; this.status = s; this.comments = c; }
    }
    
    public static String getScreenshotsDir() { return screenshotsDir; }
}
