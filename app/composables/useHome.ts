const fetchHome = () => queryCollection('home').first()

export const useHome = () => useAsyncData('home', fetchHome)
