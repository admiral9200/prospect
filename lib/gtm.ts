type WindowWithDataLayer = Window & {
    dataLayer: Record<string, any>[]
  }
  
  declare const window: WindowWithDataLayer
  
  export const GTM_ID = "GTM-PM7GKNFB"
  
  export const pageview = (url: string) => {
    if (typeof window.dataLayer !== "undefined") {
      window.dataLayer.push({
        event: "pageview",
        page: url,
      })
    } else {
      console.log({
        event: "pageview",
        page: url,
      })
    }
  }