import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
  h2: (props) => <h2 className="font-alt mt-8 text-3xl font-black" {...props} />,
  h3: (props) => <h3 className="font-alt mt-6 text-2xl font-black" {...props} />,
  p: (props) => <p className="text-chaos-black/75 leading-7" {...props} />,
  ul: (props) => <ul className="grid gap-2 pl-5 text-sm font-medium text-black/70" {...props} />,
  li: (props) => <li className="list-disc" {...props} />,
  code: (props) => <code className="bg-chaos-black rounded px-1.5 py-0.5 text-white" {...props} />,
}

export function useMDXComponents(): MDXComponents {
  return components
}
