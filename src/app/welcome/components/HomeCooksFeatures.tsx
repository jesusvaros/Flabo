export const HomeCooksFeatures = () => (
  <section className="min-h-[80vh] flex items-center justify-center bg-accent py-24 px-8">
    <div className="max-w-6xl w-full text-center">
      <h2 className="text-4xl font-bold mb-12 text-gray-900">For Home Cooks</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-gray-50 rounded-lg shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Recipe Organization</h3>
          <p className="text-gray-600 leading-relaxed">Keep all your recipes in one place</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-lg shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Meal Planning</h3>
          <p className="text-gray-600 leading-relaxed">Plan your weekly meals with ease</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-lg shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Shopping Lists</h3>
          <p className="text-gray-600 leading-relaxed">Automatically generate shopping lists</p>
        </div>
      </div>
    </div>
  </section>
);
