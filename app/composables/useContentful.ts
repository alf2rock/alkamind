import { createClient } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export const useContentful = () => {
  const config = useRuntimeConfig()

  const client = createClient({
    space: config.public.contentfulSpaceId,
    accessToken: config.public.contentfulAccessToken
  })

  const getHomePage = async () => {
    const entries = await client.getEntries({
      content_type: 'homePage',
      limit: 1
    })
    return entries.items[0]?.fields
  }

  return {
    client,
    getHomePage
  }
}

export const renderRichText = (richText: any): string => {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  if (richText.nodeType === 'document') {
    return documentToHtmlString(richText)
  }
  return String(richText)
}
