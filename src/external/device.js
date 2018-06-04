import Device from 'device'

let isDesktopOrTv = true
if (navigator && navigator.userAgent) {
  const device = Device(navigator.userAgent)
  isDesktopOrTv = device.type === 'desktop' || device.type === 'tv'
}

export default {
  isDesktopOrTv
}
