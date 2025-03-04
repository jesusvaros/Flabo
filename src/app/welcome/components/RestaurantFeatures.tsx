export const RestaurantFeatures = () => (
  <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-24 px-8">
    <div className="max-w-6xl w-full text-center">
      <h2 className="text-4xl font-bold mb-12 text-gray-900">For Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-lg shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Efficient Ticket Management</h3>
          <p className="text-gray-600 leading-relaxed">Handle orders smoothly and efficiently</p>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Real-time Updates</h3>
          <p className="text-gray-600 leading-relaxed">Track order status in real-time</p>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Staff Instructions</h3>
          <p className="text-gray-600 leading-relaxed">Easy-to-follow instructions for your staff</p>
        </div>
      </div>
    </div>
  </section>
);
