import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

export const ReconciliationSummary = ({
  result,
  totalInternal,
  totalProvider,
}) => {
  const totalMatched = result.matched.length;
  const totalMismatched = result.matched.filter((m) => m.hasMismatch).length;
  const totalPerfectMatches = totalMatched - totalMismatched;

  const matchRate =
    totalInternal > 0 ? ((totalMatched / totalInternal) * 100).toFixed(1) : "0";

  const summaryCards = [
    {
      title: "Perfect Matches",
      value: totalPerfectMatches,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Mismatched Fields",
      value: totalMismatched,
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Internal Only",
      value: result.internalOnly.length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Provider Only",
      value: result.providerOnly.length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reconciliation Overview
            </h3>
            <p className="text-sm text-gray-600">
              Processed {totalInternal} internal and {totalProvider} provider
              transactions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Match Rate
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${matchRate}%` }}
                ></div>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {matchRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-white`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
