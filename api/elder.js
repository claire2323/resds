import request from '@/utils/request'

// 长者签到类型字典
export const elderSignTypeDict = {
  0: '食堂签到'
  // 可以根据需要添加更多签到类型
}

// 获取二维码
export function getQrCode(params) {
  return request({
    url: '/communityCare/qr/code/generate/v2',
    method: 'get',
    params
  })
} 
export function elderSign(params) {
	return request({
	    url: '/communityCare/qr/code/parsingQRCodes', 
	    method: 'get',
	    params
  })
} 
