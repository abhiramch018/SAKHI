import { jsPDF } from 'jspdf';
import { Report } from '../types';

function getBeneficiaryName(report: Report): string {
  return typeof report.beneficiary === 'object' ? report.beneficiary?.name || 'Beneficiary' : 'Beneficiary';
}

function getAwwName(report: Report): string {
  return typeof report.aww === 'object' ? report.aww?.name || 'AWW Worker' : 'AWW Worker';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleDateString('en-IN');
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function downloadReportPdf(report: Report, filename?: string): void {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text('SAKHI — Counselling Visit Report', margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${formatDate(report.reportDate || report.createdAt)}`, margin, y);
  y += 12;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  const addField = (label: string, value: string) => {
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(label, margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    y = wrapText(doc, value, margin, y, contentWidth, 6) + 4;
  };

  addField('Beneficiary Mother', getBeneficiaryName(report));
  addField('Anganwadi Worker', getAwwName(report));
  addField('Risk Assessment', `${report.riskLevel} Risk`);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Prescribed Clinical Actions', margin, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  const actions = report.actions?.length ? report.actions : ['Standard nutritional guidance prescribed.'];
  actions.forEach((action, i) => {
    y = wrapText(doc, `${i + 1}. ${action}`, margin, y, contentWidth, 5.5) + 2;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });
  y += 4;

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('AI Counselling Guidance', margin, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  y = wrapText(doc, report.aiGuidance || 'No guidance recorded.', margin, y, contentWidth, 5.5) + 6;

  if (report.beneficiaryFeedback?.rating) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Beneficiary Feedback (AWW Review)', margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Rating: ${report.beneficiaryFeedback.rating} / 5`, margin, y);
    y += 7;
    if (report.beneficiaryFeedback.comment) {
      y = wrapText(doc, report.beneficiaryFeedback.comment, margin, y, contentWidth, 5.5);
    }
  }

  const safeName = getBeneficiaryName(report).replace(/[^a-z0-9]/gi, '_');
  const datePart = new Date(report.reportDate || report.createdAt || Date.now())
    .toISOString()
    .slice(0, 10);
  doc.save(filename || `SAKHI_Report_${safeName}_${datePart}.pdf`);
}
