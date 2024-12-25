export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aadhaar eKYC Verification
          </h1>
          <p className="text-gray-600">
            Securely verify your identity using Aadhaar eKYC service
          </p>
        </div>
        <div id="ekyc-form"></div>
      </div>
    </main>
  );
}