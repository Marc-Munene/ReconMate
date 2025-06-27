import { useState } from "react";
import { Download, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { exportToCSV } from "../utils/csvExport";

export const ReconciliationResults = ({ result }) => {
  const [activeTab, setActiveTab] = useState("matched");

  const tabs = [
    {
      id: "matched",
      label: `Matched (${result.matched.length})`,
      icon: CheckCircle,
      color: "text-green-600",
      activeColor: "border-green-500 text-green-600",
    },
    {
      id: "internal",
      label: `Internal Only (${result.internalOnly.length})`,
      icon: AlertTriangle,
      color: "text-amber-600",
      activeColor: "border-amber-500 text-amber-600",
    },
    {
      id: "provider",
      label: `Provider Only (${result.providerOnly.length})`,
      icon: XCircle,
      color: "text-red-600",
      activeColor: "border-red-500 text-red-600",
    },
  ];

  const handleExport = (type) => {
    const data =
      type === "matched"
        ? result.matched
        : type === "internal"
        ? result.internalOnly
        : result.providerOnly;

    const filename = `reconciliation_${type}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    exportToCSV(data, filename);
  };

  const TransactionTable = () => {
    if (activeTab === "matched") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internal Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internal Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.matched.map((match, index) => (
                <tr
                  key={index}
                  className={
                    match.hasMismatch ? "bg-amber-50" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {match.transaction_reference}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      match.mismatches.amount
                        ? "text-red-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    ${match.internal.amount.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      match.mismatches.amount
                        ? "text-red-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    ${match.provider.amount.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      match.mismatches.status
                        ? "text-red-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    {match.internal.status}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      match.mismatches.status
                        ? "text-red-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    {match.provider.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {match.hasMismatch ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Mismatch
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Match
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    const data =
      activeTab === "internal" ? result.internalOnly : result.providerOnly;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.transaction_reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? `${tab.activeColor} border-current`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button
              onClick={() => handleExport(activeTab)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>

          {activeTab === "matched" && result.matched.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No matched transactions found
            </div>
          )}
          {activeTab === "internal" && result.internalOnly.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No internal-only transactions found
            </div>
          )}
          {activeTab === "provider" && result.providerOnly.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No provider-only transactions found
            </div>
          )}

          <TransactionTable />
        </div>
      </div>
    </div>
  );
};
