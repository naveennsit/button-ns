
import axios from 'axios'
 class ClientRequestFactory {
    get(url) {
        return axios.get(url).then((res)=>{
            return res.data
        })
    }

}
const clientServerFactory = new ClientRequestFactory();

export default clientServerFactory;
