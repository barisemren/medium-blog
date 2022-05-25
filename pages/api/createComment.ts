import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'

const config = {
  dataset: 'production',
  projectId: 'art8bvd1',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}
const client = sanityClient(config)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'comment',
      post: {
        _ref: _id,
        _type: 'reference',
      },
      name,
      email,
      comment,
    })
  } catch (err) {
    return res.status(500).json({ message: `Comment Couldn't Submit`, err })
  }
  console.log(`Comment Submitted`);
  res.status(200).json({ message: 'Comment Submitted' })
}
