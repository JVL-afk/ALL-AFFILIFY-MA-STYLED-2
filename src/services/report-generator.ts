import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import ExcelJS from 'exceljs';
import { stringify } from 'csv-stringify/sync';

export class ReportGenerator {
  public async generatePdfReport(data: any, outputPath: string): Promise<void> {
    const htmlContent = this.generateHtml(data);
    const tempHtmlPath = `${outputPath}.html`;
    fs.writeFileSync(tempHtmlPath, htmlContent);

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        path.join(process.cwd(), 'src/lib/generate_pdf.py'),
        tempHtmlPath,
        outputPath
      ]);

      pythonProcess.on('close', (code) => {
        fs.unlinkSync(tempHtmlPath);
        if (code === 0) resolve();
        else reject(new Error(`PDF generation failed with code ${code}`));
      });
    });
  }

  public async generateExcelReport(data: any, outputPath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    
    // Add headers
    const headers = Object.keys(data[0] || {});
    worksheet.addRow(headers);
    
    // Add data
    data.forEach((item: any) => {
      worksheet.addRow(Object.values(item));
    });

    await workbook.xlsx.writeFile(outputPath);
  }

  public async generateCsvReport(data: any, outputPath: string): Promise<void> {
    const csvContent = stringify(data, { header: true });
    fs.writeFileSync(outputPath, csvContent);
  }

  private generateHtml(data: any): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>AFFILIFY Advanced Report</h1>
          <table>
            <thead>
              <tr>${Object.keys(data[0] || {}).map(k => `<th>${k}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map((row: any) => `<tr>${Object.values(row).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  }
}
