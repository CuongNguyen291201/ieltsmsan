export const serverEndpoint = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:3001';

export const getEndpoint = (router: string, serverSide = false) => serverSide ? `${serverEndpoint}/${router}` : router;