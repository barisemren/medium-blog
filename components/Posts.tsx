import Link from 'next/link'
import { Post } from '../typings'
import { urlFor } from '../sanity'

interface Props {
  posts: Post[]
}
export default function Posts({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2 md:gap-6 md:py-6 px-2.5 lg:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/post/${post.slug.current}`} key={post._id}>
          <div className="cursor-pointer group border rounded-lg overflow-hidden">
            <img
              className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
              src={urlFor(post.mainImage).url()!}
              alt="Post Banner"
            />
            <div className="flex justify-between p-5">
              <div>
                <p className='text-lg font-bold'>{post.title}</p>
                <p className='text-xs'>{post.description}</p>
              </div>
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-lg object-cover"
                  src={urlFor(post.author.image).url()!}
                  alt="Author Image"
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
