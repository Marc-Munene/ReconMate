export const parseCSV = (content) => {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const refIndex = headers.findIndex(
    (h) => h.includes("transaction_reference") || h.includes("reference")
  );
  const amountIndex = headers.findIndex((h) => h.includes("amount"));
  const statusIndex = headers.findIndex((h) => h.includes("status"));

  if (refIndex === -1 || amountIndex === -1 || statusIndex === -1) {
    throw new Error(
      "CSV must contain transaction_reference, amount, and status columns"
    );
  }

  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(",").map((v) => v.trim());
      return {
        transaction_reference: values[refIndex],
        amount: parseFloat(values[amountIndex]) || 0,
        status: values[statusIndex],
      };
    })
    .filter((t) => t.transaction_reference); // Filter out empty references
};

export const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
