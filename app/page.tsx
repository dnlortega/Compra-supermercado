import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-8">Controle de Compras 🛒</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          href="/list"
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 gap-4"
        >
          <div className="text-4xl">📝</div>
          <h2 className="text-xl font-semibold">Criar Lista</h2>
          <p className="text-center text-gray-500">Adicione produtos e quantidades</p>
        </Link>

        <Link
          href="/prices"
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 gap-4"
        >
          <div className="text-4xl">💰</div>
          <h2 className="text-xl font-semibold">Preencher Valores</h2>
          <p className="text-center text-gray-500">Insira os preços no mercado</p>
        </Link>

        <Link
          href="/summary"
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 gap-4"
        >
          <div className="text-4xl">📊</div>
          <h2 className="text-xl font-semibold">Resumo</h2>
          <p className="text-center text-gray-500">Veja o total gasto</p>
        </Link>
      </div>
    </main>
  );
}
