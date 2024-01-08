import axios from "axios";



const API = axios.create({ baseURL: "http://localhost:5001/" });

export function carVana_Data(data: any) {
  return API.post(`/carData/allCarvanaData?page=${data.page}`);
}

// Filter Functions
export function filter_Data(data:any) {
  return API.post(`/carData/filter`, data);
}

// related cars
export function related_Cars(){
    return API.get('/carData/related')
}


// Search Cars
export function search_Cars(data:any){
    return API.post('/carData/search',data)
}

// Get One Car
export function get_One_Car(data:any){
    return API.post('/carData/getOneCar',data)
}

// Get Similar Cars
export function similar_Cars(data:any){
  return API.post("/carData/similar",data)
}