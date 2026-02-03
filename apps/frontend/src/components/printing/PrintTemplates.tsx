// Helper to open print window
export const printReceipt = (order: any, items: any[], total: number, cash: number, change: number) => {
  const printWindow = window.open('', '_blank', 'width=300,height=600');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <title>Receipt</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Cairo', sans-serif; font-size: 12px; margin: 0; padding: 10px; width: 80mm; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .large { font-size: 16px; }
        .huge { font-size: 24px; font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        @media print {
          @page { size: 80mm auto; margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="center large bold">صاج العرب</div>
      <div class="center">عمان - الأردن</div>
      <div class="divider"></div>
      <div class="row">
        <span>رقم الطلب:</span>
        <span class="bold">${order.orderNumber || '---'}</span>
      </div>
      <div class="row">
         <span>التاريخ:</span>
         <span>${new Date().toLocaleString('ar-JO')}</span>
      </div>
      <div class="divider"></div>
      
      ${items.map(item => `
        <div class="row bold">
          <span>${item.product.nameAr} x${item.quantity}</span>
          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
        ${item.selectedModifiers.map((m: any) => `
          <div class="row" style="font-size: 10px; color: #555; padding-right: 10px;">
             <span>- ${m.nameAr}</span>
             <span>${m.price > 0 ? m.price.toFixed(2) : ''}</span>
          </div>
        `).join('')}
      `).join('')}
      
      <div class="divider"></div>
      <div class="row large bold">
        <span>الإجمالي:</span>
        <span>${total.toFixed(2)} د.أ</span>
      </div>
      ${cash > 0 ? `
        <div class="row">
          <span>المدفوع (كاش):</span>
          <span>${cash.toFixed(2)}</span>
        </div>
        <div class="row">
          <span>الباقي:</span>
          <span>${change.toFixed(2)}</span>
        </div>
      ` : ''}
      
      <div class="divider"></div>
      <div class="center">شكراً لزيارتكم</div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

export const printKitchenTicket = (orderNumber: string, type: string, items: any[], notes: string) => {
  const printWindow = window.open('', '_blank', 'width=300,height=600');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <title>Kitchen Ticket</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Cairo', sans-serif; font-size: 14px; margin: 0; padding: 10px; width: 80mm; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .huge { font-size: 48px; font-weight: 900; border: 3px solid #000; padding: 5px; margin: 10px 0; display: block; line-height: 1; }
        .large { font-size: 20px; }
        .divider { border-top: 2px dashed #000; margin: 15px 0; }
        .item { margin-bottom: 15px; }
        .mods { font-size: 14px; padding-right: 20px; font-style: italic; }
        @media print {
          @page { size: 80mm auto; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .huge { -webkit-text-stroke: 1px black; }
        }
      </style>
    </head>
    <body onload="window.print(); window.close();">
      <div class="center bold large">مطعم صاج العرب</div>
      <div class="center">تذكرة مطبخ</div>
      
      <div class="center huge">${orderNumber || '0000'}</div>
      
      <div class="center bold" style="border: 2px solid #000; padding: 5px; margin: 10px; font-size: 18px;">
        ${type === 'dinein' ? 'داخلي' : type === 'delivery' ? 'توصيل' : 'سفري'}
      </div>

      <div class="center">${new Date().toLocaleTimeString('ar-JO')}</div>
      
      <div class="divider"></div>

      ${items.map(item => `
        <div class="item">
          <div class="bold large">${item.quantity} × ${item.product.nameAr}</div>
          ${item.selectedModifiers.length > 0 ? `
            <div class="mods">
              ${item.selectedModifiers.map((m: any) => `• ${m.nameAr}`).join('<br>')}
            </div>
          ` : ''}
          ${item.notes ? `<div class="mods bold">ملاحظة: ${item.notes}</div>` : ''}
        </div>
      `).join('')}

      <div class="divider"></div>
      ${notes ? `<div style="border: 2px solid #000; padding: 10px; font-weight: bold; font-size: 16px;">ملاحظات الطلب:<br>${notes}</div>` : ''}
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
