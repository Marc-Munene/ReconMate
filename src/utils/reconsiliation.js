export const reconcileTransactions = (internal, provider) => {
  const internalMap = new Map(
    internal.map((t) => [t.transaction_reference, t])
  );
  const providerMap = new Map(
    provider.map((t) => [t.transaction_reference, t])
  );

  const matched = [];
  const internalOnly = [];
  const providerOnly = [];

  // Find matched and internal-only transactions
  for (const internalTx of internal) {
    const providerTx = providerMap.get(internalTx.transaction_reference);

    if (providerTx) {
      const amountMismatch =
        Math.abs(internalTx.amount - providerTx.amount) > 0.01;
      const statusMismatch =
        internalTx.status.toLowerCase() !== providerTx.status.toLowerCase();

      matched.push({
        transaction_reference: internalTx.transaction_reference,
        internal: internalTx,
        provider: providerTx,
        hasMismatch: amountMismatch || statusMismatch,
        mismatches: {
          amount: amountMismatch,
          status: statusMismatch,
        },
      });
    } else {
      internalOnly.push(internalTx);
    }
  }

  // Find provider-only transactions
  for (const providerTx of provider) {
    if (!internalMap.has(providerTx.transaction_reference)) {
      providerOnly.push(providerTx);
    }
  }

  return { matched, internalOnly, providerOnly };
};
