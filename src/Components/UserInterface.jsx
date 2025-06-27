import { useState } from "react";
import { FileText, Play, RotateCcw } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { ReconciliationSummary } from "./ReconciliationSummary";
import { ReconciliationResults } from "./ReconciliationResults";
import { parseCSV, readFileContent } from "../utils/csvParser";
import { reconcileTransactions } from "../utils/reconciliation";

const UserInterface = () => {
  const [files, setFiles] = useState({ internal: null, provider: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [internalTransactions, setInternalTransactions] = useState([]);
  const [providerTransactions, setProviderTransactions] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (type, file) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
    setError(null);
    setResult(null);
  };

  const processReconciliation = async () => {
    if (!files.internal || !files.provider) {
      setError("Please upload both CSV files");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const [internalContent, providerContent] = await Promise.all([
        readFileContent(files.internal),
        readFileContent(files.provider),
      ]);

      const internal = parseCSV(internalContent);
      const provider = parseCSV(providerContent);

      setInternalTransactions(internal);
      setProviderTransactions(provider);

      const reconciliationResult = reconcileTransactions(internal, provider);
      setResult(reconciliationResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the files"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetReconciliation = () => {
    setFiles({ internal: null, provider: null });
    setResult(null);
    setInternalTransactions([]);
    setProviderTransactions([]);
    setError(null);
  };

  const canProcess = files.internal && files.provider && !isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Transaction Reconciliation Tool
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your internal system export and provider statement to
            automatically reconcile transactions and identify discrepancies with
            advanced matching algorithms.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Upload CSV Files
            </h2>
            <FileUpload
              files={files}
              onFileChange={handleFileChange}
              disabled={isProcessing}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={processReconciliation}
                disabled={!canProcess}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Reconciliation
                  </>
                )}
              </button>

              {result && (
                <button
                  onClick={resetReconciliation}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">Error: {error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-8">
              <ReconciliationSummary
                result={result}
                totalInternal={internalTransactions.length}
                totalProvider={providerTransactions.length}
              />
              <ReconciliationResults result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
  s;
};

export { UserInterface };
