import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled'
import useMoneda from '../hooks/useMoneda'
import useCriptomoneda from '../hooks/useCriptomoneda'
import axios from 'axios'
import Error from './Error'

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color .3s ease;
    text-align: center;
    cursor: pointer;
    
    &:hover {
        background-color: #326ac0;
    }`

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    // State del listado de criptomonedas
    const [listaCripto, guardarCriptomonedas] = useState([])
    const [error, guardarError] = useState(false)

    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'ARS', nombre: 'Peso Argentino'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'}
    ]

    // Utilizar useMoneda
    const [moneda, SelectMonedas] = useMoneda('Elige tu moneda', '', MONEDAS)

    // Utilizar useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu criptomoneda', '', listaCripto)

    // Ejecutar llamado a la API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

            const resultado = await axios.get(url)

            guardarCriptomonedas(resultado.data.Data)
        }
        consultarAPI()
    }, [])

    // Cuando el usuario envia el submit
    const cotizarMoneda = e => {

        console.log(moneda)
        console.log(criptomoneda)
        e.preventDefault()

        // Validar si ambos campos estan llenos
        if (moneda === '' || criptomoneda === '') {
            guardarError(true)
            return
        }
        guardarError(false)

        // Pasar los datos al componente principal
        guardarMoneda(moneda)
        guardarCriptomoneda(criptomoneda)
    }

    return (
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios"/> : null}

            <SelectMonedas/>

            <SelectCripto/>

            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
    );
}

export default Formulario;