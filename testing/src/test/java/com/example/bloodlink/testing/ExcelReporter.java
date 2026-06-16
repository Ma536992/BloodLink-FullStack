package com.example.bloodlink.testing;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ExcelReporter {
    private static List<TestResult> results = new ArrayList<>();

    public static void logResult(String testName, String status, String comments) {
        results.add(new TestResult(testName, status, comments));
    }

    public static void generateReport() {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("E2E Test Analysis");

        // Header Row
        Row header = sheet.createRow(0);
        String[] columns = {"Test Case", "Status", "Analysis/Comments"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            cell.setCellStyle(style);
        }

        // Data Rows
        int rowNum = 1;
        for (TestResult res : results) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(res.testName);
            row.createCell(1).setCellValue(res.status);
            row.createCell(2).setCellValue(res.comments);
        }

        try (FileOutputStream fileOut = new FileOutputStream("testing/TestReport_Analysis.xlsx")) {
            workbook.write(fileOut);
            workbook.close();
            System.out.println("Excel Report Generated: TestReport_Analysis.xlsx");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static class TestResult {
        String testName, status, comments;
        TestResult(String t, String s, String c) { this.testName = t; this.status = s; this.comments = c; }
    }
}
