import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { LangCode } from './i18n'
import { t as translate, type TranslationKey } from './i18n'

interface LangContextValue {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    return (localStorage.getItem('sasya_lang') as LangCode) ?? 'en'
  })

  function setLang(l: LangCode) {
    setLangState(l)
    localStorage.setItem('sasya_lang', l)
    document.documentElement.lang = l
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: TranslationKey) => translate(lang, key)

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
