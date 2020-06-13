import React, { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map,  TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
// import './styles.css';
import { PageCreatePoint, Header, Form } from './styled';
import logo from '../../assets/logo.svg';

// Array ou Objeto : deve informar manualmente o tipo da variavel
interface Item  {
  id: number,
  title: string,
  image_url: string
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}
const CreatePoint =  () => {

  const [items,setItems] = useState<Item[]>([]);
  const [ufs,setUfs] = useState<string[]>([]);
  const [cities,setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

  const [formData,setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
  
  const history = useHistory();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude,longitude]);
    })
  },[]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data); 
    })
  }, []);

  useEffect(() => {
    axios
    .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const ufInitials = response.data.map( uf => uf.sigla );
      setUfs(ufInitials); 
    });
  },[]);

  useEffect(() =>{
    // Carregar as cidades quando uma uf for selecionada
    if(selectedUf === '0') {
      return;
    }

    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => { 
      const cityNames = response.data.map( city => city.nome );
      setCities(cityNames);  
    });

    
  },[selectedUf]);

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement> ) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement> ) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({... formData, [name]: value })
  }



  function handleSelectedItem(id: number) {
    // Retira a seleção do item
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if(alreadySelected>= 0) {
      const filteredItems = selectedItems.filter(item =>item !== id);
      setSelectedItems(filteredItems);
    } else {
      // Seleciona mais de um elemento nos items
      setSelectedItems([...selectedItems, id ]);  
    }
    
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name,email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [ latitude, longitude ] = selectedPosition;
    const items = selectedItems;
    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }
    await api.post('points', data);

    alert('Ponto de coleta Criado!');
    history.push('/');
  }
   
  return (
    <div>
        <PageCreatePoint>
          <Header>
            <img src={logo} alt="logo"/>
            <Link to ="/">
              <FiArrowLeft />
              Voltar para home
            </Link> 
          </Header>
          <Form onSubmit={handleSubmit}>
            <h1>Cadastro do <br/> ponto de coleta</h1>
            <fieldset>
              <legend>
                <h2>Dados</h2>
              </legend>
              <div className="field">
                  <label htmlFor="name">Nome da entidade</label>
                  <input 
                  type="text" 
                  name="name"
                  id="name"
                  onChange={handleInputChange}
                  />
              </div>
              <div className="field-group">
                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input 
                  type="email" 
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="whatsapp">Whatsapp</label>
                  <input 
                  type="text" 
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>Endereço</h2>
                <span>Selecione o endereço  no mapa</span>
              </legend>
              
              <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition}/>
              </Map>

              <div className="field-group">
                <div className="field">
                  <label htmlFor="uf">Estado (UF)</label>
                  <select 
                  name="uf" 
                  id="uf" 
                  value={selectedUf} 
                  onChange={handleSelectedUf}
                  >
                    <option value="0">Selecione uma UF</option>
                    {ufs.map(uf => (
                      <option  key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="city">Cidade</label>
                  <select 
                  name="city" 
                  id="city"
                  value={selectedCity}
                  onChange={handleSelectedCity}
                  >
                    <option value="0">Selecione uma Cidade</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>Itens de coleta</h2>
                <span>Selecione um ou mais items abaixo</span>
              </legend>
              <ul className="items-grid">
                {items.map(item =>(
                  <li 
                   key={item.id} 
                   onClick={()=> handleSelectedItem(item.id)}
                   className={selectedItems.includes(item.id) ? 'selected': ''}

                  >
                    <img src={item.image_url} alt={item.title}/>
                    <span>{item.title}</span>
                  </li>    
                ))}
                
              </ul>
            </fieldset>

            <button type="submit">
              Cadastrar ponto de coleta
            </button>
          </Form>
        </PageCreatePoint>
        
    </div>
  );
}

export default CreatePoint;
