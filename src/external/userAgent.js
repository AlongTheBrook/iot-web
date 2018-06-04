import Device from 'device'

let isDesktopOrTv = true
let isIOS = false
if (navigator && navigator.userAgent) {
  const device = Device(navigator.userAgent, {
    parseUserAgent: true
  })
  isDesktopOrTv = device.type === 'desktop' || device.type === 'tv'
  const model = device.model.toLowerCase()
  isIOS = model.includes('iphone') || model.includes('ipad') || model.includes('mac')
}

export default {
  isDesktopOrTv,
  isIOS
}
