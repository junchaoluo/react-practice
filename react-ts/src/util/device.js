/**
 *
 * 使用指纹库获取设备的唯一id
 *
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs'
export const fingerpring = async () => {
	// We recommend to call `load` at application startup.
	const fp = await FingerprintJS.load()

	// The FingerprintJS agent is ready.
	// Get a visitor identifier when you'd like to.
	const result = await fp.get()

	// This is the visitor identifier:
	const visitorId = result.visitorId
	console.log(visitorId)
	return visitorId
}
