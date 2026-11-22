import { Prism } from 'prism-react-renderer'

// prismjs language files register themselves on a global `Prism`; point it at the bundled instance.
;(globalThis as { Prism?: typeof Prism }).Prism = Prism
