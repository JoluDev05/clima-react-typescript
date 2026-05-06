import axios from 'axios'
import { z } from 'zod'
/* import { object, string, number, Output, parse } from 'valibot' */
import type { SearchType } from '../types'
import { useMemo, useState } from 'react'


/* //Type Guards o assertions de tipo
function isWeatherResponse(weather: unknown) {
    return (
        Boolean(weather) &&
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main === 'object' &&
        typeof (weather as Weather).main.temp === 'number' &&
        typeof (weather as Weather).main.temp_min === 'number' &&
        typeof (weather as Weather).main.temp_max === 'number'
    )
}
*/
//valibot
/* const weatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_min: number(),
        temp_max: number()
    })
})
type Weather = Output<typeof weatherSchema> */

//zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number()
    })
})
export type Weather = z.infer<typeof Weather>


const initialState =  {
            name: '',
            main: {
                temp: 0,
                temp_min: 0,
                temp_max: 0
            }
        }

export default function useWeather() {

    const [weather, setWeather] = useState<Weather> (initialState)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const { data } = await axios(geoUrl)

            //Comprobar si existe

            if (!data[0]) {
                console.log('No se encontraron resultados para la ciudad y país proporcionados')
                setNotFound(true)
                return
            }
            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            //Casteart el type
            //const {data: weatherResult} = await axios<Weather>(weatherUrl)
            //console.log(weatherResult.temp)
            //console.log(weatherResult.name)

            //Type Guards
            /*
            const {data: weatherResult} = await axios(weatherUrl)
            const result = isWeatherResponse(weatherResult)
                if (result) {
                    console.log(weatherResult.name)
                    console.log(weatherResult.main.temp)
                } else {
                    console.log('La respuesta no tiene el formato esperado')
                }
            */

            //Valibot
            /*  const { data: weatherResult } = await axios(weatherUrl)
            const result = parse(weatherResult, weatherSchema)
            if (result) {
                console.log(result.name)
                console.log(result.main.temp)
            } else {
                console.log('La respuesta no tiene el formato esperado')
            } */

            //Zod the best way si o no 
            const { data: weatherResult } = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResult)
            if (result.success) {
                setWeather(result.data)
            } 



        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const hasWeatherData = useMemo(() =>  weather.name !== '', [weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }
}