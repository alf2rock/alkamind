# Blog Images - Implementation Options & Future Enhancements

**Date**: January 2026
**Status**: Option 1 implemented (basic markdown images working)

---

## Original Options Discussed

When planning image support for blog posts, three approaches were considered:

### Option 1: Use Existing Markdown Images (SELECTED)
**Description**: Use the built-in image button in Decap CMS's markdown editor toolbar to insert images inline.

**How it works**:
- In `/admin`, edit a blog post
- In the Body field, use Rich Text mode (not Markdown toggle)
- Click the **+** button to reveal options: Image, Code Block
- Select Image to upload/select from media library
- Images are inserted as standard markdown: `![alt text](/uploads/filename.png)`
- `ContentRenderer` in Vue renders these within Tailwind's `prose` container

**Current limitations**:
- Images use default `prose` styling (max-width, centered)
- No built-in captions
- No lightbox/zoom functionality
- No size control from CMS

---

### Option 2: Structured Image Gallery Field
**Description**: Add a separate `images` list field in the CMS with captions, displayed as a gallery component.

**Would require**:
- Update `public/admin/config.yml` to add an `images` field to blog collection:
  ```yaml
  - name: images
    label: Image Gallery
    widget: list
    required: false
    fields:
      - { name: image, label: Image, widget: image }
      - { name: caption, label: Caption, widget: string }
      - { name: alt, label: Alt Text, widget: string }
  ```
- Create a Vue gallery component in `app/components/`
- Update `app/pages/blog/[...slug].vue` to render the gallery

**Benefits**:
- Structured data for each image
- Consistent gallery layout
- Easy to style as grid, carousel, or lightbox
- Captions stored as data, not embedded in markdown

---

### Option 3: Better Image Styling
**Description**: Images work but need enhanced CSS (sizing, captions, lightbox, etc.).

**Possible enhancements**:
- Custom prose overrides for image sizing
- CSS for image captions using `<figure>` and `<figcaption>`
- Lightbox library integration (e.g., medium-zoom, GLightbox)
- Responsive image sizing rules

---

## Future Avenues to Explore

### Image Sizing & Positioning
- **Tailwind prose customization**: Override default image styles in `tailwind.config.js`
- **Nuxt Content components**: Use MDC (Markdown Components) syntax for custom image rendering
- **CSS classes in markdown**: Some setups allow `![alt](url){.class}` syntax

### Captions
- **HTML in markdown**: `<figure><img src="..."><figcaption>Caption</figcaption></figure>`
- **Custom MDC component**: Create `::image-with-caption` component
- **Prose plugin**: Style `img + em` pattern (image followed by italic text)

### Lightbox / Zoom
- **medium-zoom**: Lightweight zoom on click
- **GLightbox**: Full-featured lightbox gallery
- **Nuxt Image module**: Built-in zoom and optimization

### Image Optimization
- **@nuxt/image module**: Automatic resizing, lazy loading, modern formats (WebP, AVIF)
- **Cloudinary/Imgix integration**: CDN-based image transformation
- **Local optimization**: Sharp-based build-time optimization

### Gallery Layouts
- **Masonry grid**: Pinterest-style layout
- **Carousel/Slider**: Swiper.js or similar
- **Before/After slider**: For comparison images

---

## Code Block Feature (from CMS toolbar)

The **Code Block** option in the + menu inserts fenced code blocks:

```
```javascript
const example = "code here";
```
```

Useful for:
- Showing terminal commands
- Displaying configuration examples
- Code snippets in technical blog posts

Rendered with syntax highlighting via Nuxt Content's built-in Shiki integration.

---

## Quick Reference

| Feature | Status | Notes |
|---------|--------|-------|
| Basic image embedding | Working | Use + button in Rich Text mode |
| Multiple images per post | Working | Insert between text as needed |
| Image upload to /uploads | Working | Media library configured |
| Custom image sizing | Not implemented | See "Future Avenues" |
| Captions | Not implemented | See "Future Avenues" |
| Lightbox/zoom | Not implemented | See "Future Avenues" |
| Gallery component | Not implemented | See Option 2 |
| Code blocks | Working | Via + button or ``` syntax |

---

## Files Involved

- `public/admin/config.yml` - CMS field configuration
- `app/pages/blog/[...slug].vue` - Blog post rendering
- `content/blog/*.md` - Blog post content files
- `public/uploads/` - Uploaded media storage
