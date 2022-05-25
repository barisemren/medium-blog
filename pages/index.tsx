import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Posts from '../components/Posts'
import { sanityClient } from '../sanity'
import {Post} from '../typings';

interface Props {
  posts: Post[];
}

export default function Home({posts}:Props) {
  console.log(posts);
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
      <Posts posts={posts} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `
  *[_type=="post"]{
    _id,
    title,
    slug,
    author -> {
    name,
    image
    },
    mainImage,
    description,
  }`
  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    }
  }
}
