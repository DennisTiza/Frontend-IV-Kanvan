export namespace ConfiguracionRutasBackend {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  export const urlBackend:string = `http://${host}:3000/`;
}