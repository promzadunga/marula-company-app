'use client';

interface CategoryOption {
  name: string;
  slug: string;
}

export function CategorySelect({ categories, basePath }: { categories: CategoryOption[]; basePath: string }) {
  return (
    <select
      className="w-full p-3 rounded-lg border border-brown-200 bg-white text-brown-900 font-medium"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) window.location.href = e.target.value;
      }}
    >
      <option value="" disabled>Select a category...</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={`${basePath}/${cat.slug}`}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
