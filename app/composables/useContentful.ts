import { createClient } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

// Custom rendering options for rich text with Tailwind styling
const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, next: any) =>
      `<p class="mb-4">${next(node.content)}</p>`,
    [BLOCKS.HEADING_1]: (node: any, next: any) =>
      `<h1 class="text-3xl font-bold mb-4">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: any, next: any) =>
      `<h2 class="text-2xl font-semibold mb-3">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: any, next: any) =>
      `<h3 class="text-xl font-semibold mb-2">${next(node.content)}</h3>`,
    [BLOCKS.HEADING_4]: (node: any, next: any) =>
      `<h4 class="text-lg font-semibold mb-2">${next(node.content)}</h4>`,
    [BLOCKS.HEADING_5]: (node: any, next: any) =>
      `<h5 class="text-base font-semibold mb-2">${next(node.content)}</h5>`,
    [BLOCKS.HEADING_6]: (node: any, next: any) =>
      `<h6 class="text-sm font-semibold mb-2">${next(node.content)}</h6>`,
    [BLOCKS.UL_LIST]: (node: any, next: any) =>
      `<ul class="list-disc pl-6 mb-4">${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: any, next: any) =>
      `<ol class="list-decimal pl-6 mb-4">${next(node.content)}</ol>`,
    [BLOCKS.LIST_ITEM]: (node: any, next: any) =>
      `<li class="mb-1">${next(node.content)}</li>`,
    [BLOCKS.QUOTE]: (node: any, next: any) =>
      `<blockquote class="border-l-4 border-blue-600 pl-4 italic my-4">${next(node.content)}</blockquote>`,
    [BLOCKS.HR]: () =>
      `<hr class="my-6 border-slate-300" />`,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { title, file } = node.data.target.fields
      const url = file.url.startsWith('//') ? `https:${file.url}` : file.url
      return `<img src="${url}" alt="${title || ''}" class="max-w-full h-auto my-4 rounded" />`
    },
    [INLINES.HYPERLINK]: (node: any, next: any) =>
      `<a href="${node.data.uri}" class="text-blue-600 hover:underline">${next(node.content)}</a>`
  }
}

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

  const getOurStoryPage = async () => {
    const entries = await client.getEntries({
      content_type: 'ourStory',
      limit: 1
    })
    return entries.items[0]?.fields
  }

  const getAboutPage = async () => {
    const entries = await client.getEntries({
      content_type: 'aboutPage',
      limit: 1
    })
    return entries.items[0]?.fields
  }

  const getBlogPosts = async () => {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      order: ['-fields.date']
    })
    return entries.items.map(item => ({
      ...item.fields,
      id: item.sys.id
    }))
  }

  const getBlogPost = async (slug: string) => {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1
    })
    return entries.items[0]?.fields
  }

  const getAIPortals = async () => {
    const entries = await client.getEntries({
      content_type: 'aiPortal'
    })
    return entries.items.map(item => ({
      ...item.fields,
      id: item.sys.id
    }))
  }

  const getUseCases = async () => {
    const entries = await client.getEntries({
      content_type: 'useCase'
    })
    return entries.items.map(item => ({
      ...item.fields,
      id: item.sys.id
    }))
  }

  return {
    client,
    getHomePage,
    getOurStoryPage,
    getAboutPage,
    getBlogPosts,
    getBlogPost,
    getAIPortals,
    getUseCases
  }
}

export const renderRichText = (richText: any): string => {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  if (richText.nodeType === 'document') {
    return documentToHtmlString(richText, richTextOptions)
  }
  return String(richText)
}
