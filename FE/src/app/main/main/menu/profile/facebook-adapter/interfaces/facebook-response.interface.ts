export interface IFacebookResponse {
  authResponse: null | {
    accessToken: string;
    expiresIn: number;
    graphDomain: string;
    signedRequest: string;
    userID: string;
  };
  status: 'unknown' | 'connected';
}
