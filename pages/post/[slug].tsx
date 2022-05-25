import { GetStaticProps } from 'next'
import { useState } from 'react'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { PostList } from '../../typings'

// Type Declarations for Typescript
interface FormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: PostList
}

// Main Function
export default function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)

  // React Hook Form Declarations
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  //Using React Hook Form
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
      })
      .catch((err) => {
        console.error(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      {/* Header Component */}
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="Post Image"
      />

      {/* Post Content */}
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl font-bold">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={urlFor(post.author.image).url()!}
            alt="Author"
          />
          <p className="font-extra-light text-sm">
            Posted by{' '}
            <span className="cursor-pointer text-green-600">
              {post.author.name}
            </span>{' '}
            on {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        {/* React Portable Text Component */}
        <div className="mt-10">
          <PortableText
            dataset="production"
            projectId="art8bvd1"
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold">{props.children}</h1>
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold">{props.children}</h2>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ children, href }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-xl border border-yellow-500" />

      {/* Comment Form */}
      {submitted ? (
        <div className="my-5 mx-5 flex max-w-xl flex-col items-center bg-yellow-500 py-5 text-white md:mx-auto">
          <h1>Your Comment Has Been Submitted</h1>
          <h2>Once Your Comment Approved, it will Appear Below</h2>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <div>
            <h2 className="my-5 mx-5 max-w-xl items-center md:mx-auto ">
              Did You Like it or Do You Have Any Suggestions? Leave a Comment
              Below!
            </h2>
          </div>
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="mb-5 block" htmlFor="">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="Your Name"
              type="text"
            />
          </label>
          <label className="mb-5 block" htmlFor="">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="Your Email"
              type="email"
            />
          </label>
          <label className="mb-5 block" htmlFor="">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="Your Comment"
              rows={8}
            />
          </label>

          {/* If there is validation error  */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">The Name is Required</span>
            )}
            {errors.email && (
              <span className="text-red-500">The Email is Required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">The Comment is Required</span>
            )}
          </div>
          <input
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
            type="submit"
          />
        </form>
      )}

      {/* Comments */}
      <div className='flex flex-col max-w-2xl px-5 gap-5 mx-5 md:mx-auto '>
        <h3>Comments</h3>
        <hr />
        {post.comments.map((comment) => (
          <div className='flex flex-col gap-2 p-3 border rounded' key={comment._id}>
            <span className='cursor-pointer text-green-600'>{comment.name}</span>
            {comment.comment}
          </div>
        ))}
      </div>
    </main>
  )
}

export const getStaticPaths = async () => {
  const query = `
    *[_type=="post"]{
        _id,
        slug{
        current,
      },
      }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: PostList) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type=="post" && slug.current == $slug][0]{
        _id,
        title,
        description,
        body,
        slug,
        author -> {
        name,
        image
        },
        'comments': *[
          _type == 'comment' &&
          post._ref == ^._id &&
          approved == true],
        mainImage,
        _createdAt
      }`
  const post = sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post: await post,
    },
    revalidate: 60,
  }
}
