import { MockMethod } from 'vite-plugin-mock'
export default [
    {
        url: '/api/user/login',
        method: 'get',
        response: ({ query }) => {

            if (query.username === 'admin' && query.password === '21232f297a57a5a743894a0e4a801fc3') {
                return {
                    code: 0,
                    data: {
                        token: 'token-stringucbascio3h809hdwdnih298hdqa0w9hxmjqxw0q9u',
                    },
                }
            }

            return {
                code: 1,
                data: {},
            }
        },
    },
    {
        url: '/api/user/info',
        method: 'get',
        timeout: 100,
        response: {
            code: 0,
            data: {
                name: 'admin',
                permission: ['test']
            },
        },
    }
] as MockMethod[]