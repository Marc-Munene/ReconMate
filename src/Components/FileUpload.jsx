import { useCallback } from "react";
import { Upload, FileText, CheckCircle, X } from "lucide-react";

export const FileUpload = ({ files, onFileChange, disabled }) => {
  const handleDrop = useCallback(
    (e, type) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      const csvFile = droppedFiles.find((file) => file.name.endsWith(".csv"));
      if (csvFile) {
        onFileChange(type, csvFile);
      }
    },
    [onFileChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback(
    (e, type) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileChange(type, file);
      }
    },
    [onFileChange]
  );

  const FileUploadArea = ({ type, title, description }) => {
    const file = files[type];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            disabled
              ? "border-gray-200 bg-gray-50"
              : file
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileInputChange(e, type)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
          />

          <div className="text-center">
            {file ? (
              <div className="space-y-2">
                <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {file.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileChange(type, null);
                    }}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload
                  className={`mx-auto h-8 w-8 ${
                    disabled ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div className="text-sm">
                  <span
                    className={
                      disabled ? "text-gray-400" : "text-blue-600 font-medium"
                    }
                  >
                    Click to upload
                  </span>
                  <span
                    className={disabled ? "text-gray-400" : "text-gray-500"}
                  >
                    {" "}
                    or drag and drop
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    disabled ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUploadArea
        type="internal"
        title="Internal System Export"
        description="Upload your internal system CSV file"
      />
      <FileUploadArea
        type="provider"
        title="Provider Statement"
        description="Upload your provider statement CSV file"
      />
    </div>
  );
};
