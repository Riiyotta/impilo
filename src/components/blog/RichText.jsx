import { Fragment } from 'react'
import InlineSvg from '../shared/InlineSvg'
import BlogImage from './BlogImage'
import FileDownload from './FileDownload'
import listArrow from '../../assets/svg/blog/list-arrow.svg?raw'
import { useTransitionNavigate } from '../PageTransition'
import { isInternal } from '../shared/UniversalLink'

/*
 * Rich-text renderer (BLOG_SPEC B2.4). Output elements and quirks match the original:
 * h2 unstyled, sup/sub keep full size, code is an inline-block monospace span, blockquote is
 * div.rich-quote > p, list items are li > svg arrow + p, ordered lists fall back to decimal.
 */
const MARK_TAGS = { bold: 'strong', italic: 'em', underline: 'u', superscript: 'sup', subscript: 'sub' }

function Hyperlink({ uri, children }) {
  const go = useTransitionNavigate()
  // Internal URIs use the slide transition; anything else opens with window.open(uri, '_blank').
  const onClick = (e) => {
    e.preventDefault()
    if (isInternal(uri)) go && go(uri)
    else window.open(uri, '_blank')
  }
  return (
    <a href={uri} onClick={onClick}>
      {children}
    </a>
  )
}

function Inline({ node }) {
  if (typeof node === 'string') return node
  if (node.type === 'hyperlink') {
    return (
      <Hyperlink uri={node.uri}>
        {node.content.map((c, i) => (
          <Inline key={i} node={c} />
        ))}
      </Hyperlink>
    )
  }
  let el = node.text
  ;(node.marks || []).forEach((mark) => {
    if (mark === 'code') el = <span className="rich-code">{el}</span>
    else {
      const Tag = MARK_TAGS[mark]
      if (Tag) el = <Tag>{el}</Tag>
    }
  })
  return <>{el}</>
}

const inlines = (content = []) => content.map((c, i) => <Inline key={i} node={c} />)

function Block({ node }) {
  switch (node.type) {
    case 'paragraph':
      return <p>{inlines(node.content)}</p>
    case 'heading-1':
      return <h1>{inlines(node.content)}</h1>
    case 'heading-2':
      return <h2>{inlines(node.content)}</h2>
    case 'blockquote':
      return (
        <div className="rich-quote">
          <p>{inlines(node.content)}</p>
        </div>
      )
    case 'unordered-list':
    case 'ordered-list': {
      const List = node.type === 'ordered-list' ? 'ol' : 'ul'
      return (
        <List>
          {node.items.map((item, i) => (
            <li key={i}>
              <InlineSvg svg={listArrow} aria-hidden="true" />
              <p>{inlines(item)}</p>
            </li>
          ))}
        </List>
      )
    }
    case 'hr':
      return <hr />
    case 'embedded-asset':
      return (
        <BlogImage
          src={node.src}
          alt={node.alt}
          width={node.width}
          height={node.height}
          className="rich-image"
          imgClassName="!h-auto"
          style={{ maxWidth: Math.min(node.width, 1000) }}
        />
      )
    case 'embedded-entry':
      return node.entry === 'fileDownload' ? <FileDownload title={node.title} /> : null
    default:
      return null
  }
}

export default function RichText({ blocks }) {
  return (
    <div className="rich-text">
      {blocks.map((node, i) => (
        <Fragment key={i}>
          <Block node={node} />
        </Fragment>
      ))}
    </div>
  )
}
