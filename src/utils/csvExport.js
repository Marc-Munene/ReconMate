export const exportToCSV = (data, filename) => {
  let csvContent;

  if (data.length === 0) {
    csvContent = "No data to export";
  } else if ("internal" in data[0]) {
    // Matched transactions
    csvContent =
      "transaction_reference,internal_amount,provider_amount,internal_status,provider_status,has_mismatch\n" +
      data
        .map(
          (item) =>
            `${item.transaction_reference},${item.internal.amount},${item.provider.amount},${item.internal.status},${item.provider.status},${item.hasMismatch}`
        )
        .join("\n");
  } else {
    // Regular transactions
    csvContent =
      "transaction_reference,amount,status\n" +
      data
        .map(
          (item) =>
            `${item.transaction_reference},${item.amount},${item.status}`
        )
        .join("\n");
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
