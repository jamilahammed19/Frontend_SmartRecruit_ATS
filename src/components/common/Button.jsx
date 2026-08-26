export default function Button({ children, type = "button", isLoading = false, className = "" }) {
    return (
        <button
            type={type}
            disabled={isLoading}
            className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:bg-blue-300 ${className}`}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    );
}