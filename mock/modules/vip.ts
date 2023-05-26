import { MockMethod } from 'vite-plugin-mock'

const generateData = (type) => {

    const data:object[] = []

    if (type === 'grade') {
        for (let i=0; i<35; i++) {
            data.push({
                id: (Math.random() * 10000 >> 0) + Date.now().toString(36).slice(-4),
                vip_grade: i+1,
                point_range: [100 * i, 100*(i+1)-1],
                benefits: ['福利礼包', '付费礼包', '专属客服，策划直通'][Math.floor(Math.random() * 3)],
            })
        }
    } else {
        for (let i=0; i<35; i++) {
            data.push({
                id: (Math.random() * 10000 >> 0) + Date.now().toString(36).slice(-4),
                game_name: '3D捕鱼',
                gift_name: '会员礼包' + Math.floor(Math.random() * 3),
                vip_grade: i+1,
                commodity_id: (Math.random() * 10000 >> 0) + Date.now().toString(36).slice(-4),
                daily_limit: ((Math.random() * 3 >> 0) + 1) * 1000,
                refresh_frequence: [((Math.random() * 3 >> 0) + 1), ['day', 'week', 'month'][Math.random() * 3 >> 0]],
            })
        }
    }

    return data
}

let gradeList: object[] | null = null
let benefitsList: object[] | null = null

export default [
    {
        url: '/api/vip/grade/list',
        method: 'get',
        response: ({ query }) => {

            const { limit, skip } = query

            if (gradeList == null) {
                gradeList = generateData('grade')
            }

            return {
                code: 0,
                data: {
                    list: gradeList.slice(Number(skip), Number(skip) + Number(limit)),
                    total: gradeList.length
                },
            }
        },
    },
    {
        url: '/api/vip/benefits/list',
        method: 'get',
        timeout: 100,
        response: ({ query }) => {

            const { limit, skip } = query

            if (benefitsList == null) {
                benefitsList = generateData('benefits')
            }

            return {
                code: 0,
                data: {
                    list: benefitsList.slice(Number(skip), Number(skip) + Number(limit)),
                    total: benefitsList.length
                },
            }
        },
    }
] as MockMethod[]