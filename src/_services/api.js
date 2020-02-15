/*import axios from 'axios'

const api = axios.create({
    //baseURL: "http://10.0.2.2:3000/"
    baseURL: "http://192.168.43.226:3000/"
})

export default api*/

import axios from 'axios'
import {getToken} from './auth'


const onLine =  'https://www.agilizaon.com.br'
//const offLine = "http://192.168.43.226:3000/"
const api = axios.create({
    baseURL: onLine
  })

  api.interceptors.request.use(async config => {
      const token = await getToken()
      if(token){
          config.headers.Authorization = `Bearer ${token}`
      }

      return config
  })
  
  export default api