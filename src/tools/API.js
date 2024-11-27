export class API {
  constructor() {}
  async GetData(url) {
    return fetch(url) //Este es el retorno para la funcion que estaria devolviendo una promesa
      .then((response) => response.json())
      .then((data) => {
        return data; //Este es el retorno que se encabsulará en la promesa
      })
      .catch((error) => console.error('Error:', error));
  }
}
