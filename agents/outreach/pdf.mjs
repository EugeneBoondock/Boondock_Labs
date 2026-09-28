import { Buffer } from 'node:buffer';

function pdfText(value) {
  return String(value).normalize('NFKD').replace(/[^\x20-\x7E]/g, '?').replace(/[\\()]/g, '\\$&');
}

const money = (amount) => `ZAR ${(amount / 100).toFixed(2)}`;

export function renderQuotePdf({ quoteNumber, companyName, currency, amountMinor, items, issuedAt, expiresAt, context }) {
  if (currency !== 'ZAR' || !Array.isArray(items) || items.length < 1 || items.length > 30 || !context?.complete) throw new Error('Approved ZAR quote with complete scope required');
  const scope = context.scope;
  const lines = [
    'BOONDOCK LABS', `Quotation ${quoteNumber}`, `For: ${companyName}`,
    `Issued: ${issuedAt.slice(0, 10)}    Expires: ${expiresAt.slice(0, 10)}`, '',
    `Service: ${scope.serviceCode}`,
    ...Object.entries(scope).filter(([field]) => field !== 'serviceCode').map(([field, value]) => `${field.replace(/([A-Z])/g, ' $1')}: ${value}`),
    `Assumptions: ${context.assumptions}`,
    '', 'PRICE ITEMS',
    ...items.map((item) => `${item.quantity} x ${item.description.slice(0, 48)} | ${money(item.lineTotalMinor)}`),
    '', `TOTAL: ${money(amountMinor)}`, '', 'SOUTH AFRICAN MARKET CHECKS',
    ...context.benchmarks.map((item) => `${item.observedAt.slice(0, 10)} ${money(item.minAmountMinor)} to ${money(item.maxAmountMinor)} | ${item.sourceUrl.slice(0, 70)}`),
    '', 'Reply to eugene@boondocklabs.co.za to accept or discuss this quotation.',
  ];
  const pages = [];
  for (let offset = 0; offset < lines.length; offset += 34) pages.push(lines.slice(offset, offset + 34));
  const pageIds = pages.map((_, index) => 4 + index * 2);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  for (let index = 0; index < pages.length; index++) {
    const contentId = 5 + index * 2;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    const content = pages[index].map((line, lineNumber) => `BT /F1 10 Tf 40 ${755 - lineNumber * 20} Td (${pdfText(line.slice(0, 100))}) Tj ET\n`).join('');
    objects.push(`<< /Length ${Buffer.byteLength(content, 'ascii')} >>\nstream\n${content}endstream`);
  }
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(Buffer.byteLength(pdf, 'ascii'));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const startXref = Buffer.byteLength(pdf, 'ascii');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  return Buffer.from(pdf, 'ascii');
}
