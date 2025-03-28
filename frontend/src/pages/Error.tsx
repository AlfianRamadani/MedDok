export default function Error() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 px-4 py-12 text-white'>
      <div className='max-w-md text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20'>
        <div className='text-6xl'>🔍</div>
        <h1 className='mt-4 text-4xl font-bold'>Page Not Found</h1>
        <p className='mt-2 text-lg text-gray-300'>Sorry, we couldn’t find the page you’re looking for.</p>
        <a href='/' className='mt-6 inline-block px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white font-semibold'>
          Back to Home
        </a>
      </div>
    </div>
  );
}
