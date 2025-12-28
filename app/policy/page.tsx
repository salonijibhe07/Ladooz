export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Store Policy</h1>
        <div className="space-y-4 text-gray-800">
          <p><strong>Shipping:</strong> Free delivery for Pune.</p>
          <p><strong>Shipping (Outside Pune):</strong> Free delivery for orders above 2 kg.</p>
          <p><strong>Returns:</strong> No Return Policy.</p>
          <p><strong>Warranty:</strong> No Warranty.</p>
        </div>
      </div>
    </div>
  );
}
