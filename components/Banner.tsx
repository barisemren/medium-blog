export default function Banner() {
  return (
    <div className="flex justify-between py-10 lg:py-0 items-center bg-yellow-400 border-y lg:border-0 border-black">
      <div className="space-y-5 px-10">
        <h1 className="max-w-xl font-serif text-6xl">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>{' '}
          is a place to write, read and connect.
        </h1>
        <h2>
          Discover stories, thinking, and expertise from writers on any topic.
        </h2>
      </div>
      <img
      className="hidden md:inline-flex h-32 lg:h-full"
        src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        alt="banner"
      />
    </div>
  )
}
