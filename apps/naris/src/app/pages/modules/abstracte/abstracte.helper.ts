export function printHTML(prtContent: string) {
  const winPrint = window.open('', '', 'left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');

  if (winPrint) {
    winPrint.document.write('<div id="print" class="contentpane">');
    winPrint.document.write(prtContent);
    winPrint.document.write('</div>');
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  }
}
