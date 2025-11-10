export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const header = this.buildHeader(reportType, user);
    const { body, total } = this.buildBody(reportType, user, items);
    const footer = this.buildFooter(reportType, total);
    return `${header}${body}${footer}`.trim();
  }

  buildHeader(reportType, user) {
    switch (reportType) {
      case "CSV":
        return "ID,NOME,VALOR,USUARIO\n";
      case "HTML":
        return (
          "<html><body>\n" +
          "<h1>Relatório</h1>\n" +
          `<h2>Usuário: ${user.name}</h2>\n` +
          "<table>\n" +
          "<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n"
        );
      default:
        return "";
    }
  }

  buildBody(reportType, user, items) {
    let body = "";
    let total = 0;

    const visibleItems = this.filterItemsByUser(user, items);

    for (const item of visibleItems) {
      if (user.role === "ADMIN" && item.value > 1000) {
        item.priority = true;
      }

      body += this.formatRow(item, user, reportType);
      total += item.value;
    }

    return { body, total };
  }

  filterItemsByUser(user, items) {
    if (user.role === "ADMIN") {
      return items;
    }
    return items.filter((i) => i.value <= 500);
  }

  // ---------- Linha ----------
  formatRow(item, user, reportType) {
    if (reportType === "CSV") {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }

    if (reportType === "HTML") {
      const style = item.priority ? ' style="font-weight:bold;"' : "";
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }

    return "";
  }

  buildFooter(reportType, total) {
    switch (reportType) {
      case "CSV":
        return `\nTotal,,\n${total},,\n`;
      case "HTML":
        return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
      default:
        return "";
    }
  }
}
